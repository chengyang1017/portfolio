from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing patch target: {label}')
    return text.replace(old, new, 1)


# Hydrate the bundled data with the latest admin-published Cloudflare copy before React renders.
Path('src/data/remotePortfolioData.ts').write_text("""import { projectTranslationCatalog, type ProjectTranslationCatalog } from './projectTranslationCatalog';
import { projects, type Project } from './projects';
import { technologyCatalog, type TechnologyCatalog } from './technologyCatalog';

type RemotePortfolioData = {
  projects?: Project[];
  technologyCatalog?: TechnologyCatalog;
  projectTranslationCatalog?: ProjectTranslationCatalog;
};

export async function hydratePortfolioData() {
  try {
    const response = await fetch('/api/portfolio-data', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return;

    const data = (await response.json()) as RemotePortfolioData;

    if (Array.isArray(data.projects)) {
      projects.splice(0, projects.length, ...data.projects);
    }

    if (data.technologyCatalog) {
      technologyCatalog.client = [...data.technologyCatalog.client];
      technologyCatalog.backend = [...data.technologyCatalog.backend];
      technologyCatalog.platform = [...data.technologyCatalog.platform];
    }

    if (data.projectTranslationCatalog) {
      for (const key of Object.keys(projectTranslationCatalog)) {
        delete projectTranslationCatalog[key];
      }
      Object.assign(projectTranslationCatalog, data.projectTranslationCatalog);
    }
  } catch {
    // Bundled data remains the offline/deployment fallback.
  }
}
""", encoding='utf-8')

main = Path('src/main.tsx')
text = main.read_text(encoding='utf-8')
text = replace_once(text, "import { I18nProvider } from './i18n/I18nProvider';\n", "import { I18nProvider } from './i18n/I18nProvider';\nimport { hydratePortfolioData } from './data/remotePortfolioData';\n", 'main hydrate import')
old_render = "createRoot(document.getElementById('root')!).render(<StrictMode><I18nProvider><BrowserRouter><App /></BrowserRouter></I18nProvider></StrictMode>);"
new_render = "async function bootstrap() {\n  await hydratePortfolioData();\n  createRoot(document.getElementById('root')!).render(\n    <StrictMode><I18nProvider><BrowserRouter><App /></BrowserRouter></I18nProvider></StrictMode>,\n  );\n}\n\nvoid bootstrap();"
text = replace_once(text, old_render, new_render, 'main render')
main.write_text(text, encoding='utf-8')


# The admin remains password-protected, but it no longer needs a GitHub credential.
admin = Path('src/pages/AdminPage.tsx')
text = admin.read_text(encoding='utf-8')
publish_branch_label = '''          <label>\n            <span>{ui.branch}</span>\n            <input value={branch} onChange={(event) => setBranch(event.target.value)} />\n          </label>\n\n'''
text = text.replace(publish_branch_label, '')
admin.write_text(text, encoding='utf-8')


# Update admin copy so the UI no longer promises GitHub-backed publishing.
ui = Path('src/admin/adminUiCopy.ts')
text = ui.read_text(encoding='utf-8')
changes = [
    ("adminAccessDescription: 'Sign in with your portfolio admin password. GitHub write credentials stay on the Cloudflare Worker and are never sent to or stored by this browser. A secure session cookie keeps you signed in until you choose Lock admin or the session expires.',", "adminAccessDescription: 'Sign in with your portfolio admin password. Portfolio content is stored by Cloudflare, so the admin no longer needs a GitHub Personal Access Token.',"),
    ("adminDescription: 'Manage projects, programming languages, frameworks, and tools. Publishing writes the edited source data back to GitHub.',", "adminDescription: 'Manage projects, translations, programming languages, frameworks, and tools. Publishing updates the live portfolio data stored by Cloudflare.',"),
    ("githubConnected: 'GITHUB CONNECTED',", "githubConnected: 'CLOUDFLARE DATA STORE',"),
    ("writeChanges: 'Write changes to GitHub',", "writeChanges: 'Publish portfolio changes',"),
    ("publishDescription: 'Publishing updates the portfolio project and technology data on the selected branch through the authenticated Cloudflare Worker.',", "publishDescription: 'Publishing saves the reviewed project, technology, and multilingual content to the persistent Cloudflare portfolio data store.',"),
    ("verifiedRepository: 'Verified repository',", "verifiedRepository: 'Content store',"),
    ("publishToGitHub: 'Publish to GitHub',", "publishToGitHub: 'Publish changes',"),
    ("publishingPortfolio: 'Publishing project and technology data to GitHub…',", "publishingPortfolio: 'Publishing portfolio data…',"),
    ("adminAccessDescription: '使用作品集管理员密码登录。GitHub 写入凭证只保存在 Cloudflare Worker，不会发送到浏览器或存储在浏览器中。安全会话会保持登录状态，直到你点击“锁定后台”或会话过期。',", "adminAccessDescription: '使用作品集管理员密码登录。作品集内容改为保存在 Cloudflare，不再需要 GitHub Personal Access Token。',"),
    ("adminDescription: '管理项目、编程语言、框架和工具。发布后会把编辑后的数据写回 GitHub。',", "adminDescription: '管理项目、多语言内容、编程语言、框架和工具。发布后会更新 Cloudflare 中的线上作品集数据。',"),
    ("githubConnected: 'GitHub 已连接',", "githubConnected: 'Cloudflare 数据库',"),
    ("writeChanges: '写入 GitHub',", "writeChanges: '发布作品集修改',"),
    ("publishDescription: '通过已登录的 Cloudflare Worker，把项目与技术数据写入所选 GitHub 分支。',", "publishDescription: '把审核后的项目、技术栈和多语言内容保存到 Cloudflare 的持久化作品集数据中。',"),
    ("verifiedRepository: '已验证仓库',", "verifiedRepository: '内容存储',"),
    ("publishToGitHub: '发布到 GitHub',", "publishToGitHub: '发布修改',"),
    ("publishingPortfolio: '正在把项目和技术数据发布到 GitHub…',", "publishingPortfolio: '正在发布作品集数据…',"),
    ("adminAccessDescription: '使用作品集管理員密碼登入。GitHub 寫入憑證只保存在 Cloudflare Worker，不會傳送到瀏覽器或儲存在瀏覽器中。安全工作階段會保持登入狀態，直到你按下「鎖定後台」或工作階段過期。',", "adminAccessDescription: '使用作品集管理員密碼登入。作品集內容改為保存在 Cloudflare，不再需要 GitHub Personal Access Token。',"),
    ("adminDescription: '管理專案、程式語言、框架與工具。發佈後會把編輯後的資料寫回 GitHub。',", "adminDescription: '管理專案、多語言內容、程式語言、框架與工具。發佈後會更新 Cloudflare 中的線上作品集資料。',"),
    ("githubConnected: 'GitHub 已連線',", "githubConnected: 'Cloudflare 資料庫',"),
    ("writeChanges: '寫入 GitHub',", "writeChanges: '發佈作品集修改',"),
    ("publishDescription: '透過已登入的 Cloudflare Worker，把專案與技術資料寫入所選 GitHub 分支。',", "publishDescription: '把審核後的專案、技術棧與多語言內容保存到 Cloudflare 的持久化作品集資料中。',"),
    ("verifiedRepository: '已驗證儲存庫',", "verifiedRepository: '內容儲存',"),
    ("publishToGitHub: '發佈到 GitHub',", "publishToGitHub: '發佈修改',"),
    ("publishingPortfolio: '正在把專案與技術資料發佈到 GitHub…',", "publishingPortfolio: '正在發佈作品集資料…',"),
    ("adminAccessDescription: 'Đăng nhập bằng mật khẩu quản trị portfolio. Thông tin ghi GitHub chỉ nằm trên Cloudflare Worker, không được gửi hoặc lưu trong trình duyệt. Phiên đăng nhập an toàn được giữ cho đến khi bạn khóa trang quản trị hoặc phiên hết hạn.',", "adminAccessDescription: 'Đăng nhập bằng mật khẩu quản trị portfolio. Nội dung portfolio được lưu trên Cloudflare nên trang quản trị không còn cần GitHub Personal Access Token.',"),
    ("adminDescription: 'Quản lý dự án, ngôn ngữ lập trình, framework và công cụ. Khi xuất bản, dữ liệu đã chỉnh sửa sẽ được ghi lại lên GitHub.',", "adminDescription: 'Quản lý dự án, nội dung đa ngôn ngữ, ngôn ngữ lập trình, framework và công cụ. Khi xuất bản, dữ liệu trực tiếp trên Cloudflare sẽ được cập nhật.',"),
    ("githubConnected: 'GITHUB ĐÃ KẾT NỐI',", "githubConnected: 'KHO DỮ LIỆU CLOUDFLARE',"),
    ("writeChanges: 'Ghi thay đổi lên GitHub',", "writeChanges: 'Xuất bản thay đổi portfolio',"),
    ("publishDescription: 'Thông qua Cloudflare Worker đã xác thực để ghi dữ liệu dự án và công nghệ lên nhánh GitHub đã chọn.',", "publishDescription: 'Lưu dự án, công nghệ và nội dung đa ngôn ngữ đã duyệt vào kho dữ liệu portfolio bền vững trên Cloudflare.',"),
    ("verifiedRepository: 'Kho mã đã xác minh',", "verifiedRepository: 'Kho nội dung',"),
    ("publishToGitHub: 'Xuất bản lên GitHub',", "publishToGitHub: 'Xuất bản thay đổi',"),
    ("publishingPortfolio: 'Đang xuất bản dữ liệu dự án và công nghệ lên GitHub…',", "publishingPortfolio: 'Đang xuất bản dữ liệu portfolio…',"),
]
for old, new in changes:
    if old not in text:
        raise SystemExit('Missing admin copy patch target: ' + old[:70])
    text = text.replace(old, new, 1)
ui.write_text(text, encoding='utf-8')


# Replace GitHub-backed writes with a Durable Object data store in the generated Worker.
worker = Path('scripts/prepare-site-build.mjs')
text = worker.read_text(encoding='utf-8')
insert_after = '''function json(data, status = 200) {\n  return new Response(JSON.stringify(data), {\n    status,\n    headers: {\n      'content-type': 'application/json; charset=utf-8',\n      'cache-control': 'no-store',\n    },\n  });\n}\n\n'''
store_class = r'''export class PortfolioStore {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    if (request.method === 'GET') {
      return json((await this.ctx.storage.get('portfolio')) || {});
    }

    if (request.method === 'PATCH') {
      const patch = await request.json().catch(() => null);
      if (!patch || typeof patch !== 'object') return json({ error: 'Invalid portfolio data.' }, 400);
      const current = (await this.ctx.storage.get('portfolio')) || {};
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      await this.ctx.storage.put('portfolio', next);
      return json(next);
    }

    return json({ error: 'Method not allowed' }, 405);
  }
}

function portfolioStore(env) {
  const id = env.PORTFOLIO_STORE.idFromName('primary');
  return env.PORTFOLIO_STORE.get(id);
}

async function readPortfolioStore(env) {
  const response = await portfolioStore(env).fetch('https://portfolio-store.internal/data');
  if (!response.ok) throw new Error('Unable to read the Cloudflare portfolio data store.');
  return response.json();
}

async function patchPortfolioStore(env, patch) {
  const response = await portfolioStore(env).fetch('https://portfolio-store.internal/data', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw new Error('Unable to update the Cloudflare portfolio data store.');
  return response.json();
}

'''
text = replace_once(text, insert_after, insert_after + store_class, 'worker durable store')

# Login/session now verifies only the chosen admin password; no GitHub credential check.
old_login_access = '''  const access = await portfolioAccess(env);\n  if (!access.ok) return json({ error: access.error }, 503);\n\n  const session = await createAdminSession(env);\n  return jsonWithCookie(\n    {\n      authenticated: true,\n      repository: access.repository,\n      defaultBranch: access.defaultBranch,\n    },'''
new_login_access = '''  const session = await createAdminSession(env);\n  return jsonWithCookie(\n    {\n      authenticated: true,\n      repository: 'Cloudflare portfolio store',\n      defaultBranch: 'live',\n    },'''
text = replace_once(text, old_login_access, new_login_access, 'worker login access')
old_session_access = '''  const access = await portfolioAccess(env);\n  if (!access.ok) return json({ error: access.error }, 503);\n  return json({\n    authenticated: true,\n    repository: access.repository,\n    defaultBranch: access.defaultBranch,\n  });'''
new_session_access = '''  return json({\n    authenticated: true,\n    repository: 'Cloudflare portfolio store',\n    defaultBranch: 'live',\n  });'''
text = replace_once(text, old_session_access, new_session_access, 'worker session access')

# Replace publish handlers entirely.
start = text.index('async function handlePublishPortfolio(request, env) {')
end = text.index('function extractOutputText(response) {')
publish_handlers = r'''async function handlePublishPortfolio(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  const payload = await request.json().catch(() => null);
  if (!Array.isArray(payload?.projects) || !payload?.technologyCatalog) {
    return json({ error: 'Projects and technology catalog are required.' }, 400);
  }

  try {
    await patchPortfolioStore(env, {
      projects: payload.projects,
      technologyCatalog: payload.technologyCatalog,
    });
    return json({ stored: true });
  } catch (error) {
    return json({ error: error?.message || 'Portfolio publish failed.' }, 502);
  }
}

async function handlePublishTranslations(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  const payload = await request.json().catch(() => null);
  if (!payload?.catalog || typeof payload.catalog !== 'object') {
    return json({ error: 'Translation catalog is required.' }, 400);
  }

  try {
    await patchPortfolioStore(env, { projectTranslationCatalog: payload.catalog });
    return json({ stored: true });
  } catch (error) {
    return json({ error: error?.message || 'Translation publish failed.' }, 502);
  }
}

'''
text = text[:start] + publish_handlers + text[end:]

# Public data endpoint, used before React renders.
route_anchor = "    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);\n\n"
route = "    if (url.pathname === '/api/portfolio-data' && request.method === 'GET') {\n      try {\n        return json(await readPortfolioStore(env));\n      } catch (error) {\n        return json({ error: error?.message || 'Unable to load portfolio data.' }, 502);\n      }\n    }\n\n"
text = replace_once(text, route_anchor, route_anchor + route, 'portfolio data route')

# Use the real default OpenAI API model name.
text = text.replace("model: env.OPENAI_MODEL || 'gpt-5.6-luna'", "model: env.OPENAI_MODEL || 'gpt-5-mini'")

# Add the Durable Object binding and migration to generated wrangler.json.
assets_block = '''      assets: {\n        directory: '../',\n        binding: 'ASSETS',\n        not_found_handling: 'single-page-application',\n      },'''
assets_plus_store = '''      assets: {\n        directory: '../',\n        binding: 'ASSETS',\n        not_found_handling: 'single-page-application',\n      },\n      durable_objects: {\n        bindings: [{ name: 'PORTFOLIO_STORE', class_name: 'PortfolioStore' }],\n      },\n      migrations: [{ tag: 'v1', new_sqlite_classes: ['PortfolioStore'] }],'''
text = replace_once(text, assets_block, assets_plus_store, 'wrangler durable object binding')

worker.write_text(text, encoding='utf-8')
