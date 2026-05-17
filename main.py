"""
网页自动化 —— 12306 下单助手
- auth.json 登录持久化（一次扫码，长期免登）
- 死守模式：高频检测提交订单按钮，出现即执行下单管道
- 下单管道：循环等待乘车人加载 → 勾选 → force 提交 → 确认对话框
- 反爬：随机延迟 + 贝塞尔鼠标轨迹
- 验证码：日志 + 系统声音 + 阻塞等待手动处理
"""

import asyncio
import random
import time
import json
import logging
import platform
import sys
from pathlib import Path

from playwright.async_api import async_playwright, Page, BrowserContext, Browser
import config

# ── 日志 ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ╔══════════════════════════════════════════════════════╗
# ║        登录状态持久化（auth.json）                 ║
# ╚══════════════════════════════════════════════════════╝

AUTH_PATH = Path(config.AUTH_FILE).resolve()


def auth_exists() -> bool:
    """检查 auth.json 是否存在且非空"""
    return AUTH_PATH.exists() and AUTH_PATH.stat().st_size > 100


async def save_auth(context: BrowserContext):
    """保存浏览器上下文中的登录态到 auth.json"""
    try:
        state = await context.storage_state()
        AUTH_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2))
        log.info("💾 登录状态已保存到 %s", AUTH_PATH)
    except Exception as e:
        log.warning("⚠️ 保存登录状态失败: %s", e)


# ╔══════════════════════════════════════════════════════╗
# ║           反爬工具：随机延迟 + 鼠标轨迹             ║
# ╚══════════════════════════════════════════════════════╝

def human_delay(min_s: float = None, max_s: float = None) -> float:
    lo = min_s if min_s is not None else config.CLICK_DELAY_MIN
    hi = max_s if max_s is not None else config.CLICK_DELAY_MAX
    return round(random.uniform(lo, hi), 3)


async def human_mouse_move(page: Page, target_x: float, target_y: float):
    """模拟人类鼠标移动轨迹（贝塞尔曲线 + 微小抖动）"""
    try:
        viewport = page.viewport_size or {"width": 1280, "height": 720}
    except Exception:
        viewport = {"width": 1280, "height": 720}

    start_x = random.uniform(100, viewport["width"] - 200)
    start_y = random.uniform(100, viewport["height"] - 300)

    steps = random.randint(config.MOUSE_STEPS_MIN, config.MOUSE_STEPS_MAX)

    cp1_x = start_x + random.uniform(-200, 200)
    cp1_y = start_y + random.uniform(-100, 100)
    cp2_x = target_x + random.uniform(-150, 150)
    cp2_y = target_y + random.uniform(-150, 150)

    for i in range(steps + 1):
        t = i / steps
        x = (1 - t) ** 3 * start_x + 3 * (1 - t) ** 2 * t * cp1_x \
            + 3 * (1 - t) * t ** 2 * cp2_x + t ** 3 * target_x
        y = (1 - t) ** 3 * start_y + 3 * (1 - t) ** 2 * t * cp1_y \
            + 3 * (1 - t) * t ** 2 * cp2_y + t ** 3 * target_y

        jitter_x = random.gauss(0, 0.8)
        jitter_y = random.gauss(0, 0.8)

        await page.mouse.move(x + jitter_x, y + jitter_y)
        await asyncio.sleep(random.uniform(0.005, 0.015))

    log.info("🖱️ 鼠标已移动到 (%.0f, %.0f)，%d 步", target_x, target_y, steps)


async def human_click(page: Page, selector: str, force: bool = False):
    """人类式点击。force=True 绕过可见性/遮挡检查。"""
    try:
        element = page.locator(selector).first
        box = await element.bounding_box()
        if box is None:
            log.warning("⚠️ 无法获取元素位置，使用默认点击")
            await element.click(force=force)
            return

        click_x = box["x"] + random.uniform(0.15, 0.85) * box["width"]
        click_y = box["y"] + random.uniform(0.15, 0.85) * box["height"]

        await human_mouse_move(page, click_x, click_y)
        delay = human_delay()
        log.info("⏳ 点击前等待 %.2f 秒", delay)
        await asyncio.sleep(delay)
        await page.mouse.click(click_x, click_y)
        log.info("✅ 已点击 '%s'%s", selector, " (force)" if force else "")
    except Exception as e:
        log.error("❌ 点击失败: %s", e)
        raise


# ╔══════════════════════════════════════════════════════╗
# ║              验证码检测与阻塞提醒                   ║
# ╚══════════════════════════════════════════════════════╝

async def check_captcha(page: Page) -> bool:
    try:
        page_text = await page.inner_text("body")
        page_text_lower = page_text.lower()
        for kw in config.CAPTCHA_KEYWORDS:
            if kw.lower() in page_text_lower:
                return True
    except Exception:
        pass
    return False


async def handle_captcha():
    log.warning("=" * 50)
    log.warning("⚠️  检测到验证码！请手动处理后按 Enter 继续...")
    log.warning("=" * 50)

    try:
        if config.CAPTCHA_SOUND:
            if platform.system() == "Darwin":
                import subprocess
                subprocess.run(["afplay", "/System/Library/Sounds/Ping.aiff"],
                               capture_output=True)
            elif platform.system() == "Windows":
                import winsound
                winsound.MessageBeep(winsound.MB_ICONWARNING)
            else:
                print("\a", flush=True)
    except Exception:
        print("\a", flush=True)

    if config.CAPTCHA_PAUSE_ON_CAPTCHA:
        input("👉 验证码处理完毕后，按 Enter 键继续...")

    await asyncio.sleep(1)


# ╔══════════════════════════════════════════════════════╗
# ║              浏览器初始化（auth.json 驱动）        ║
# ╚══════════════════════════════════════════════════════╝

async def create_browser_context() -> tuple:
    """
    启动 Chromium。
    - 如果 auth.json 存在，加载它 → 免登录
    - 否则启动空白上下文，由用户手动扫码登录
    返回 (playwright, browser, context, page)
    """
    playwright = await async_playwright().start()

    browser: Browser = await playwright.chromium.launch(
        headless=config.BROWSER_HEADLESS,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
        ],
    )

    if auth_exists():
        log.info("🔑 检测到 auth.json，加载登录状态（免扫码）")
        context: BrowserContext = await browser.new_context(
            storage_state=str(AUTH_PATH),
            viewport={"width": 1280, "height": 800},
            locale="zh-CN",
            timezone_id="Asia/Shanghai",
        )
    else:
        log.info("🆕 未检测到 auth.json，启动全新上下文（请手动扫码登录）")
        context: BrowserContext = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            locale="zh-CN",
            timezone_id="Asia/Shanghai",
        )

    # 反检测脚本
    await context.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        window.chrome = { runtime: {} };
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
    """)

    page = await context.new_page()
    log.info("✅ 浏览器已启动")
    return playwright, browser, context, page


# ╔══════════════════════════════════════════════════════╗
# ║              按钮定位器                              ║
# ╚══════════════════════════════════════════════════════╝

def get_button_selector() -> str:
    if config.BUTTON_CSS:
        return config.BUTTON_CSS
    if config.BUTTON_XPATH:
        return config.BUTTON_XPATH
    return f"text={config.BUTTON_TEXT}"


# ╔══════════════════════════════════════════════════════╗
# ║      乘车人：循环等待加载 → 勾选 → 确认选中       ║
# ╚══════════════════════════════════════════════════════╝

async def wait_and_check_passengers(page: Page) -> bool:
    """
    循环等待乘车人姓名在 DOM 中出现，找到 checkbox 并勾选，确认选中后返回 True。
    超时返回 False。

    优化点：
    - 兼容 "王晓航(学生)" 格式：提取括号前的核心名做匹配
    - 三种策略级联：label 关联 → 行内查找 → JS 全 DOM 扫描
    """
    if not config.PASSENGER_NAMES:
        return True

    deadline = time.time() + config.PASSENGER_WAIT_TIMEOUT

    for name in config.PASSENGER_NAMES:
        # 提取核心姓名用于文本匹配（"王晓航(学生)" → "王晓航"）
        core_name = name.split("(")[0].split("（")[0].strip()
        log.info("🔍 等待乘车人 '%s' (匹配关键词: '%s') ...", name, core_name)
        passenger_ok = False

        while time.time() < deadline:
            try:
                # ── 策略A: 找包含核心姓名的 label → 同级/父级 checkbox ──
                label = page.locator(f"label:has-text('{core_name}')").first
                if await label.count() > 0:
                    # 先在 label 的同级（兄弟）找 checkbox
                    parent = label.locator("..")
                    for depth in range(4):  # 向上最多找 4 层
                        chk = parent.locator("input[type='checkbox']").first
                        if await chk.count() > 0:
                            if not await chk.is_checked():
                                await chk.check(force=True)
                                await asyncio.sleep(0.15)
                            if await chk.is_checked():
                                log.info("✅ 已勾选乘车人: %s (策略A)", name)
                                passenger_ok = True
                                break
                        parent = parent.locator("..")

                if passenger_ok:
                    break

                # ── 策略B: 包含姓名的行级元素中找 checkbox ──
                row = page.locator(
                    f"tr:has-text('{core_name}'), "
                    f"li:has-text('{core_name}'), "
                    f"div:has-text('{core_name}')"
                ).first
                chk = row.locator("input[type='checkbox']").first
                if await chk.count() > 0:
                    if not await chk.is_checked():
                        await chk.check(force=True)
                        await asyncio.sleep(0.15)
                    if await chk.is_checked():
                        log.info("✅ 已勾选乘车人: %s (策略B)", name)
                        passenger_ok = True
                        break

                # ── 策略C: JS 全 DOM 扫描 — 最兜底 ──
                result = await page.evaluate("""
                    (keyword) => {
                        const walker = document.createTreeWalker(
                            document.body, NodeFilter.SHOW_TEXT, null, false
                        );
                        let textNode = null;
                        while ((textNode = walker.nextNode())) {
                            if (textNode.textContent.includes(keyword)) {
                                // 从这个文本节点向上找最近的 checkbox
                                let el = textNode.parentElement;
                                for (let i = 0; i < 6; i++) {
                                    if (!el) break;
                                    let chk = el.querySelector('input[type="checkbox"]');
                                    if (chk && !chk.checked) {
                                        chk.checked = true;
                                        chk.dispatchEvent(new Event('change', {bubbles: true}));
                                        chk.dispatchEvent(new Event('click', {bubbles: true}));
                                        return {found: true, checked: true};
                                    }
                                    if (chk && chk.checked) {
                                        return {found: true, checked: true};
                                    }
                                    el = el.parentElement;
                                }
                            }
                        }
                        return {found: false, checked: false};
                    }
                """, core_name)

                if result and result.get("checked"):
                    log.info("✅ 已勾选乘车人: %s (策略C·JS)", name)
                    passenger_ok = True
                    break

            except Exception:
                pass

            await asyncio.sleep(0.2)

        if not passenger_ok:
            log.error("❌ 超时: 乘车人 '%s' 未找到或无法勾选", name)
            return False

    log.info("🎫 全部乘车人已确认勾选")
    return True


# ╔══════════════════════════════════════════════════════╗
# ║           确认对话框点击                            ║
# ╚══════════════════════════════════════════════════════╝

async def click_confirm_dialog(page: Page) -> bool:
    """
    循环等待确认对话框出现并 force 点击，最多等 10 秒。
    覆盖 12306 常见的弹窗模式：.modal、.dialog、.popup、#dialog 等。
    """
    deadline = time.time() + 10.0

    while time.time() < deadline:
        try:
            if config.CONFIRM_BUTTON_CSS:
                confirm_sel = config.CONFIRM_BUTTON_CSS
            else:
                confirm_sel = (
                    f"button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f"a:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f"[role='dialog'] button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f".modal button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f".dialog button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f".popup button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f"#dialog button:has-text('{config.CONFIRM_BUTTON_TEXT}'), "
                    f".upopup button:has-text('{config.CONFIRM_BUTTON_TEXT}')"
                )

            confirm = page.locator(confirm_sel).first
            if await confirm.count() > 0 and await confirm.is_visible():
                await asyncio.sleep(human_delay(0.08, 0.2))
                await confirm.click(force=True)
                log.info("✅ 已点击确认对话框按钮")
                return True

            # 备选：直接用 JS 找弹窗中的确认按钮
            clicked = await page.evaluate("""
                (keyword) => {
                    const btns = document.querySelectorAll('button, a, .btn, [role="button"]');
                    for (const btn of btns) {
                        if (btn.textContent.includes(keyword) &&
                            btn.offsetParent !== null) {
                            btn.click();
                            return true;
                        }
                    }
                    return false;
                }
            """, config.CONFIRM_BUTTON_TEXT)

            if clicked:
                log.info("✅ 已点击确认对话框按钮 (JS)")
                return True

        except Exception:
            pass

        await asyncio.sleep(0.2)

    log.warning("⚠️ 确认对话框未在 10 秒内出现")
    return False


# ╔══════════════════════════════════════════════════════╗
# ║      下单管道：勾选乘车人 → 提交 → 确认           ║
# ╚══════════════════════════════════════════════════════╝

async def execute_order_pipeline(page: Page):
    """
    检测到提交订单按钮后执行：
    ① 循环等待乘车人加载 → 勾选 → 确认选中
    ② force 强制点击提交订单
    ③ 循环等待确认对话框 → 点击
    """
    submit_sel = get_button_selector()

    # ── 第1步: 等待乘车人加载并勾选 ──
    ok = await wait_and_check_passengers(page)
    if not ok:
        log.error("❌ 乘车人勾选失败，终止管道")
        return

    # ── 第2步: force 点击提交订单 ──
    log.info("💥 强制点击提交订单 (force=True)...")
    await human_click(page, submit_sel, force=True)

    # ── 第3步: 等待并点击确认对话框 ──
    log.info("👀 等待确认对话框...")
    await click_confirm_dialog(page)

    log.info("🏁 下单管道执行完毕！")


# ╔══════════════════════════════════════════════════════╗
# ║              主循环：死守模式                        ║
# ╚══════════════════════════════════════════════════════╝

async def main_loop():
    """
    死守模式：
    1. 加载 auth.json（有则免登）→ 打开起始页
    2. 用户在浏览器中手动操作（选车次、进入提交订单页）
    3. 高频检测提交订单按钮 → 出现即触发下单管道

    优化：每次 URL 变化时自动保存 auth，防止中途崩溃丢失登录态。
    """
    playwright, browser, context, page = await create_browser_context()

    try:
        log.info("🌐 打开页面: %s", config.TARGET_URL)
        await page.goto(config.TARGET_URL, wait_until="domcontentloaded")
        log.info("📄 页面已加载")

        if not auth_exists():
            log.info("💡 请扫码登录。登录成功后按 Enter 保存登录状态...")
            input("👉 按 Enter 保存 auth.json ...")
            await save_auth(context)

        log.info("💡 请在浏览器中手动操作（选车次、进入提交订单页）")
        log.info("   ═══ 检测到 '提交订单' 按钮后自动执行管道 ═══")

        submit_sel = get_button_selector()
        check_count = 0
        captcha_interval = 8
        last_url = page.url

        while True:
            # ── URL 变化时自动保存 auth（被动续命） ──
            current_url = page.url
            if current_url != last_url:
                log.info("🔗 页面跳转: %s", current_url)
                await save_auth(context)
                last_url = current_url

            # ── 检测提交按钮 ──
            try:
                btn = page.locator(submit_sel).first
                if await btn.is_visible():
                    log.info("🎯 检测到提交订单按钮！触发下单管道...")
                    await execute_order_pipeline(page)
                    break
            except Exception:
                pass

            check_count += 1

            # ── 定期验证码扫描 ──
            if check_count % captcha_interval == 0:
                if await check_captcha(page):
                    await handle_captcha()

            await asyncio.sleep(config.CHECK_INTERVAL)

    except KeyboardInterrupt:
        log.info("🛑 用户手动中断")
    except Exception as e:
        log.exception("💥 发生异常: %s", e)
    finally:
        # 退出前保存登录状态
        await save_auth(context)
        log.info("⏳ 60 秒后关闭浏览器...")
        await asyncio.sleep(60)
        await context.close()
        await browser.close()
        await playwright.stop()
        log.info("👋 已退出")


# ╔══════════════════════════════════════════════════════╗
# ║              入口                                    ║
# ╚══════════════════════════════════════════════════════╝

if __name__ == "__main__":
    print(r"""
╔══════════════════════════════════════════════╗
║   12306 下单助手 v3.0                       ║
║   auth.json 免登 · 死守检测 · 自动下单     ║
╚══════════════════════════════════════════════╝
""")
    print("使用前请先编辑 config.py，确认 TARGET_URL 和按钮定位参数。")
    print()

    if not config.TARGET_URL or config.TARGET_URL == "https://example.com/event-page":
        log.warning("⚠️ 请先在 config.py 中设置 TARGET_URL 为目标页面地址！")
        sys.exit(1)

    asyncio.run(main_loop())
