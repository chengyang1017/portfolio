from pathlib import Path
import re

admin = Path('src/pages/AdminPage.tsx')
text = admin.read_text(encoding='utf-8')
text = text.replace('  verifyPortfolioAccess,\n', '')
text = text.replace(
    "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';",
    "import { getAdminSession, logoutAdmin, startGitHubAdminLogin } from '../admin/adminSession';",
)
text = text.replace("  const [password, setPassword] = useState('');\n", '')
text, count = re.subn(
    r"\n  async function handleUnlock\(\) \{.*?\n  \}\n\n  useEffect",
    "\n  useEffect",
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('handleUnlock patch failed')
text = text.replace("    setPassword('');\n", '')
text, count = re.subn(
    r'''            <label className="admin-access-field">.*?            </button>\n\n            \{accessMessage''',
    '''            <button\n              type="button"\n              onClick={startGitHubAdminLogin}\n              disabled={accessState === 'checking'}\n            >\n              {accessState === 'checking' ? ui.checkingAccess : ui.unlockAdmin}\n            </button>\n\n            {accessMessage''',
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('password form patch failed')
admin.write_text(text, encoding='utf-8')

ui = Path('src/admin/adminUiCopy.ts')
text = ui.read_text(encoding='utf-8')
changes = [
    ("adminAccessDescription: 'Sign in with your portfolio admin password. GitHub write credentials stay on the Cloudflare Worker and are never sent to or stored by this browser. A secure session cookie keeps you signed in until you choose Lock admin or the session expires.',", "adminAccessDescription: 'Sign in with GitHub. Only the chengyang1017 account with write access to the portfolio repository is accepted. You no longer need to create, copy, or store a Personal Access Token.',"),
    ("unlockAdmin: 'Unlock admin',", "unlockAdmin: 'Continue with GitHub',"),
    ("adminAccessDescription: '使用作品集管理员密码登录。GitHub 写入凭证只保存在 Cloudflare Worker，不会发送到浏览器或存储在浏览器中。安全会话会保持登录状态，直到你点击“锁定后台”或会话过期。',", "adminAccessDescription: '使用 GitHub 登录。只有拥有 portfolio 仓库写入权限的 chengyang1017 账号可以进入；以后不需要再创建、复制或保存 Personal Access Token。',"),
    ("unlockAdmin: '进入后台',", "unlockAdmin: '使用 GitHub 登录',"),
    ("adminAccessDescription: '使用作品集管理員密碼登入。GitHub 寫入憑證只保存在 Cloudflare Worker，不會傳送到瀏覽器或儲存在瀏覽器中。安全工作階段會保持登入狀態，直到你按下「鎖定後台」或工作階段過期。',", "adminAccessDescription: '使用 GitHub 登入。只有擁有 portfolio 儲存庫寫入權限的 chengyang1017 帳號可以進入；之後不需要再建立、複製或保存 Personal Access Token。',"),
    ("unlockAdmin: '進入後台',", "unlockAdmin: '使用 GitHub 登入',"),
    ("adminAccessDescription: 'Đăng nhập bằng mật khẩu quản trị portfolio. Thông tin ghi GitHub chỉ nằm trên Cloudflare Worker, không được gửi hoặc lưu trong trình duyệt. Phiên đăng nhập an toàn được giữ cho đến khi bạn khóa trang quản trị hoặc phiên hết hạn.',", "adminAccessDescription: 'Đăng nhập bằng GitHub. Chỉ tài khoản chengyang1017 có quyền ghi vào kho portfolio mới được chấp nhận; bạn không còn phải tạo, sao chép hoặc lưu Personal Access Token.',"),
    ("unlockAdmin: 'Mở trang quản trị',", "unlockAdmin: 'Đăng nhập bằng GitHub',"),
]
for old, new in changes:
    if old not in text:
        raise SystemExit('UI copy patch target missing')
    text = text.replace(old, new, 1)
ui.write_text(text, encoding='utf-8')
