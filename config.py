"""配置文件 —— 根据目标页面修改以下参数"""

# ---------- 目标页面 ----------
TARGET_URL = "https://kyfw.12306.cn/"  # 要监控的起始页面地址

# ---------- 按钮定位 ----------
# 优先级: CSS Selector > XPath > 文本匹配
BUTTON_CSS = "#submitOrder_id"                      # 提交订单按钮 — ID 选择器最稳定
BUTTON_XPATH = "//a[@id='submitOrder_id']"          # 备选 XPath
BUTTON_TEXT = "提交订单"                             # 按钮文本关键词（CSS/XPath 都留空时才用文本检索）

CHECK_INTERVAL = 0.3           # 按钮检测间隔（秒），建议 0.2~0.5

# ---------- 反爬策略 ----------
CLICK_DELAY_MIN = 0.3          # 点击前最小延迟（秒）
CLICK_DELAY_MAX = 1.2          # 点击前最大延迟（秒）
MOUSE_STEPS_MIN = 3            # 鼠标移动轨迹最少分段
MOUSE_STEPS_MAX = 8            # 鼠标移动轨迹最多分段

# ---------- 登录持久化 ----------
AUTH_FILE = "./auth.json"           # 登录状态保存文件（免扫码登录的核心）
BROWSER_HEADLESS = False            # 是否无头模式（首次登录必须 False）

# ---------- 乘车人自动勾选 ----------
PASSENGER_NAMES = ["王晓航(学生)"]        # 要自动勾选的乘车人姓名（支持多个）
PASSENGER_WAIT_TIMEOUT = 30.0       # 等待乘车人姓名加载的超时（秒），超时则放弃

# ---------- 确认对话框 ----------
CONFIRM_BUTTON_TEXT = "确认"        # 确认对话框按钮文本
CONFIRM_BUTTON_CSS = ""             # 确认按钮 CSS（留空则用文本匹配）

# ---------- 验证码处理 ----------
CAPTCHA_KEYWORDS = ["验证码", "captcha", "verification", "滑块", "slider"]
CAPTCHA_SOUND = True
CAPTCHA_PAUSE_ON_CAPTCHA = True
