# Label Studio 中文化进度清单

> 最后更新：2026-08-16
> 说明：✅ 已完成，🟡 部分完成，❌ 未开始 / 仍有英文

## 整体架构

- 使用 `i18next` + `react-i18next` 做 React 前端国际化。
- 翻译资源文件：`src/i18n/zh-CN.ts`、`src/i18n/en-US.ts`。
- 默认语言：`zh-CN`；fallback：`en-US`。
- 已加回归测试：`src/i18n/i18n-keys.spec.ts`（校验两套资源 key 完全一致）。
- 已移除 HumanSignal/Enterprise 推广徽章与大部分外部文档链接，替换为“平台文档”文案。

---

## 页面/模块清单

### 1. 登录页（Django 模板）✅

- `label_studio/users/templates/users/new-ui/user_login.html`
- `label_studio/users/templates/users/new-ui/user_signup.html`
- `label_studio/users/templates/users/new-ui/user_base.html`
- `label_studio/users/templates/users/user_login.html`
- `label_studio/users/templates/users/user_base.html`
- 已删除 `user_tips.html`（HumanSignal 推广 tip）。
- 状态：登录/注册/提示文案已改为中文。

### 2. 顶部导航 & 菜单 🟡

文件：`src/components/Menubar/Menubar.jsx`

- ✅ 已中文化：主导航（首页、项目、组织）、账号、登出、固定菜单、语言切换器、快捷键 tooltip。
- ❌ 仍有英文：
  - 底部外部链接：API、Docs、GitHub、Slack Community
  - 用户下拉："Please check new notification settings..."
  - Logo alt 文字 "Label Studio Logo"
  - `VersionNotifier` 相关版本提示

### 3. 首页（Home）🟡

文件：`src/pages/Home/HomePage.tsx`

- ✅ 已接入 `useTranslation`，部分 key 已抽离。
- ❌ 仍有英文：
  - "Welcome 👋"
  - "Let's get you started."
  - "Recent Projects"
  - "View All"
  - "Create your first project"
  - "Import your data and set up the labeling interface to start annotating"
  - "Create Project" 按钮
  - "Resources" 卡片标题/描述
  - "Release Notes"、"LabelStud.io Blog"
  - "Label Studio Version: Community"
  - 项目卡片任务统计：`{finished} of {total} Tasks`
  - HeidiTips 组件（可能含英文/推广内容）

### 4. 项目列表 🟡

文件：

- `src/pages/Projects/Projects.jsx`
- `src/pages/Projects/ProjectsList.jsx`

- ✅ 已接入 `useTranslation`（页面标题）。
- ❌ 仍有英文：
  - `ProjectsPage.title = "Projects"`
  - 顶部“Create”按钮及 aria-label
  - 空列表文案："Heidi doesn't see any projects here!"、"Create one and start labeling your data."
  - 空列表按钮 "Create Project"
  - 分页组件 `Pagination` 的 `label="Projects"`
  - 项目卡片 "New project" 默认名
  - 项目卡片下拉菜单："Settings"、"Label"
  - 项目卡片日期格式 `dd MMM yyyy, HH:mm`
  - `ProjectStateChip` 状态文案

### 5. 创建项目向导 ✅

文件：

- `src/pages/CreateProject/CreateProject.jsx`
- `src/pages/CreateProject/Import/Import.jsx`
- `src/pages/CreateProject/Import/ImportModal.jsx`
- `src/pages/CreateProject/Import/useImportPage.js`
- `src/pages/CreateProject/Import/samples.json`
- `src/pages/CreateProject/Config/Config.jsx`
- `src/pages/CreateProject/Config/TemplatesList.jsx`
- `src/pages/CreateProject/Config/UnsavedChanges.tsx`
- `src/pages/CreateProject/Config/Preview.jsx`
- `src/pages/CreateProject/Config/recipes.js`
- `src/pages/CreateProject/Config/tags.js`
- `src/pages/CreateProject/utils/useDraftProject.js`
- `libs/app-common/.../SampleDatasetSelect/SampleDatasetSelect.tsx`

状态：所有用户可见文案已替换为 `t()`，Enterprise 推广已移除，key 已同步。

### 6. 数据管理器 / 标注界面 / 设置 🟡

- `src/pages/DataManager/DataManager.tsx` 及子组件
  - 仅修复了 biome 未使用变量警告，未全面进行中文化。
- `src/pages/CreateProject/Config/*`
  - ✅ 标注配置（Labeling Setup）页面，包括 `Config`、`TemplatesList`、`EditorResizer`、工具提示与分类侧边栏。
- `src/pages/Settings/*`
  - ✅ `MachineLearningSettings`（含 `MachineLearningList`、`Forms`、`TestRequest`、`StartModelTraining`）
  - ✅ `PredictionsSettings`（含 `PredictionsList`）
  - ✅ `StorageSettings`（含 `StorageSet`、`StorageCard`、`StorageForm`、`StorageSummary`）
  - ✅ `WebhookPage`（含 `WebhookList`、`WebhookDetail`、`WebhookDeleteModal`）
- `src/pages/Organization/*`
- Editor / 标注器内部文案（`libs/editor`）

设置页面已全面中文化，对应 key 已同步到 `zh-CN.ts` 与 `en-US.ts`。

### 7. 全局通用组件 ❌

- `VersionNotifier`
- `HeidiTips`（含 HumanSignal/推广内容）
- `Pagination` 等基础组件的默认英文文案

---

## 待办

1. **继续完成首页、项目列表、顶部菜单的剩余英文**（高优先级，登录后第一眼看到的页面）。
2. **处理 `VersionNotifier` 与 `HeidiTips`** 的英文/推广内容。
3. **移除/本地化剩余外部链接**：API、Docs、GitHub、Slack。
4. **对数据管理器、设置、组织管理等页面做全面扫描**。
5. **把 `i18n-keys.spec.ts` 加入 CI**，防止后续 key 缺失。

---

## 常用命令

```bash
# 校验 key 对齐
cd web
yarn nx run labelstudio:unit --testPathPattern=i18n-keys

# 构建
cd web
yarn ls:build

# 启动前端开发服
cd web
yarn ls:dev

# 启动后端（Docker）
cd gxu-label-studio
docker compose up -d
```
