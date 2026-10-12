# Labor-education-admin

南昌大学劳动教育管理平台 · 教师端（Web 前端）

面向教师角色的劳动教育管理与学生评价后台，覆盖从活动发布、报名审核、签到签退到学生评价考核的完整闭环。

> 本项目为前端单页应用（SPA），无后端代码；接口由独立的劳动教育后端服务提供。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | React 18、TypeScript、Vite |
| 构建 | Vite + SWC（`@vitejs/plugin-react-swc`） |
| UI 组件库 | Ant Design 5、MUI（Material + Joy UI） |
| 路由 | React Router v6（`createBrowserRouter`） |
| 状态管理 | Zustand |
| 数据请求 | Axios（拦截器 + token 注入）、SWR（数据缓存与轮询） |
| 样式 | CSS Modules、Emotion（@emotion/react）、postcss-preset-env |
| 工具 | dayjs、moment、browser-image-compression、immer、js-file-download |

## 功能特性

**活动管理**
- 创建 / 编辑 / 详情 / 再编辑 / 续期劳动教育活动（`Create`、`Details`、`ReEdit`、`ContinueSet`）
- 活动报名时间与活动时间规则校验
- 打回 / 审核活动，支持批量操作

**学生管理**
- 活动报名学生列表、学生卡片 / 表格视图
- 报名审核（通过 / 拒绝，可通过单人原因打回）
- 签到码获取、签到 / 签退审核（Checkout）
- 学生名单按需导出 Excel（`.xlsx`）

**学生评价**
- 单条 / 批量评价学生，填写评语并上传图片
- 评价结果查询（含图片）

**基础设施**
- 统一登录认证（NCU 单点登录），Axios 请求拦截器自动注入 `passport` token
- 401 自动登出、token 定时刷新、失效自动清理
- 图片压缩后签名直传阿里云 OSS
- 权限路由守卫（教师 / 管理员角色区分，`/check`、`/permission` 等）

## 目录结构

```text
.
├── .github/workflows/     # GitHub Actions 部署配置
├── public/                # 公共静态资源
├── src/
│   ├── pages/             # 页面级组件
│   │   ├── activities/    # 活动管理相关页面
│   │   ├── Check/         # 审核 / 签退检查
│   │   └── ...            # Login、Dashboard、Permission 等
│   ├── components/        # 通用业务组件
│   │   ├── ActivityEditor/    # 活动编辑器
│   │   ├── ActivityStudents/  # 学生报名管理
│   │   ├── EvalutateStudent/  # 学生评价
│   │   ├── students_table/    # 学生列表 / 表格
│   │   └── ...
│   ├── store/             # Zustand 状态
│   ├── utils/             # network.ts（API 层）、store.ts、types 等
│   ├── App.tsx            # 根组件（主题 / Provider 配置）
│   └── router.tsx         # 路由与守卫配置
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速开始

环境要求：

- Node.js（建议 ≥ 16）
- pnpm（本项目使用 pnpm 管理依赖）

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

生产构建：

```bash
pnpm build
```

本地预览构建产物：

```bash
pnpm preview
```

代码检查：

```bash
pnpm lint
```

> 开发 / 构建前请确认当前接入的后端接口地址（见 `src/utils/network.ts` 中的 `baseUrl`）。

## npm Scripts

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | TypeScript 类型检查 + Vite 生产构建 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm preview` | 本地预览生产构建 |

## 部署

本项目通过 GitHub Actions（`.github/workflows/deploy.yml`）在打 tag（`v**`）时自动构建，并将 `dist` 目录部署到阿里云 OSS 静态网站（bucket: `labor-fe`）。

部署所需密钥通过仓库 Secrets 配置：

- `OSS_KEY_ID`
- `OSS_KEY_SECRET`

## 免责声明

本项目代码均来自公开的课程 / 项目实践，仅用于学习和展示用途。