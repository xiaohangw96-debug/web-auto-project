"""
=============================
定位器编写指南（CSS & XPath）
=============================

一、选择 CSS Selector 还是 XPath？
────────────────────────────────
• 优先 CSS Selector：可读性好，Playwright 原生支持，速度快。
• 用 XPath 的场景：需要按文本内容精确定位、层级关系复杂、或 CSS 无法表达的。

二、按文本匹配（最常用）⭐
────────────────────────────────
场景：按钮上的文字是 "立即购买"，但 class/id 是动态的。

CSS (Playwright 扩展)：
    "button:has-text('立即购买')"        # 模糊匹配，包含即命中
    "button:text-is('立即购买')"         # 精确匹配，完全相等
    ":has-text('立即购买')"              # 任意标签，包含文本即命中

XPath：
    "//button[contains(text(), '立即购买')]"           # 文本包含
    "//button[normalize-space()='立即购买']"           # 文本精确
    "//*[contains(text(), '立即购买')]"                # 任意标签

三、按属性匹配
────────────────────────────────
CSS：
    "button[data-testid='buy-btn']"      # 最推荐——推动前端加 data-testid
    "a[href*='/checkout']"              # href 包含 /checkout
    "button[class*='primary']"          # class 包含 primary
    "input[name='submit']"              # name 属性

XPath：
    "//button[@data-testid='buy-btn']"
    "//a[contains(@href, '/checkout')]"

四、按层级关系
────────────────────────────────
CSS：
    "#main-content button.cta"           # id=main-content 内的 button.cta
    ".ticket-panel > .buy-btn"           # 直接子元素
    "div.card:nth-child(3) button"       # 第3个 .card 里的按钮

XPath：
    "//div[@id='main-content']//button[contains(@class, 'cta')]"
    "//div[@class='ticket-panel']/button"    # 直接子元素

五、如何验证定位器（在浏览器 Console 中）⭐
────────────────────────────────
打开 F12 → Console，输入：

    // CSS 测试
    document.querySelector("button:has-text('立即购买')")
    document.querySelectorAll("button.cta")    // 看长度为几（应为 1 为佳）

    // XPath 测试
    $x("//button[contains(text(), '立即购买')]")

唯一性检查：上面命令返回的元素个数应为 1。如果是 0 → 没找到；大于 1 → 定位器不够精确。

六、实战示例
────────────────────────────────
假设页面按钮 HTML 为：
    <button class="btn btn-primary buy-btn" data-id="12345">
        <span>立即购买</span>
    </button>

推荐的定位器（按稳定性排序）：

    1. "button[data-id='12345']"                    # 最稳：ID 通常是唯一的
    2. "button.buy-btn"                             # 次稳：class 里有唯一标识
    3. "button:has-text('立即购买')"                 # 可靠：文本匹配
    4. "//button[.//span[text()='立即购买']]"       # XPath：层级文本匹配

动态 ID 怎么处理？
    # 即使 data-id 动态，通常有一部分是固定的
    "button[data-id*='buy']"             # data-id 包含 buy
    "button[class*='buy-btn']"           # class 包含 buy-btn
"""

if __name__ == "__main__":
    print(__doc__)
