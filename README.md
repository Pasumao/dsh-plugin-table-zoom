# dsh-plugin-table-zoom

![npm version](https://img.shields.io/npm/v/dsh-plugin-table-zoom)
![License](https://img.shields.io/github/license/Pasumao/dsh-plugin-table-zoom)
![AI Assisted](https://img.shields.io/badge/AI-Assisted-8A2BE2)

DeepSeek Harness (dsh) Web GUI 聊天表格浮窗插件。

聊天里模型输出的 markdown 表格经常**很长（行数多）或很宽（横向溢出）**，
在对话流里一次看不完：要上下滚动聊天、左右拖动才能看完。本插件在长表上方
自动注入一个小按钮「⛶ 浮窗查看」，点击后弹出**独立可滚动的小浮窗**完整显示
表格，并支持**一键复制为 Markdown**。

纯前端 DOM 增强：不改核心包、不注册工具、无服务端逻辑、零运行时依赖。

## 功能

- 长表（≥ 9 行含表头，或横向溢出超过 2px）表格下方出现右对齐的「⛶ 浮窗查看」按钮；
- 短表不打扰；
- 点击按钮弹出浮窗：标题显示「表格 · N 行 × M 列」，正文可独立滚动（横竖都行），
  关闭按钮 / Esc / 点击遮罩均可关闭，打开期间锁定聊天页滚动；
- 浮窗头部「复制为 Markdown」按钮一键复制整表（单元格内联换行折叠、管道符转义）；
- 浮窗里展示的是**原表格的克隆**，聊天里的表格保持不变，也不会被重复增强；
- **拖拽改尺寸**：浮窗右下角手柄可自由调整大小（最小 320×200，最大到视口留白），
  只影响当次打开；
- **每次打开自适应**：浮窗不记忆任何布局——宽度按表格内容自适应（窄表不撑满、
  超级大表直接铺满视口可用宽度，下限 320）、位置居中、缩放 100%；关掉再开即回到自适应；
- **拖拽移动**：按住标题栏可把浮窗拖到任意位置（自动限制在页面内，不会拖出屏幕），
  位置只影响当次打开；
- **Ctrl+滚轮缩放**：浮窗内按住 Ctrl 滚动滚轮，表格字体 60%–250% 缩放
  （步进 10%），标题栏实时显示百分比；**缩放不记忆，每次打开回到 100%**；
- **框选文字**：普通左键在表格（含放大后）里拖动即可框选文字，
  不会被平移劫持；
- **按住空格拖拽平移**：表格超宽/超高时，按住空格再按住正文拖动即可
  左右/上下滚动（grab 光标仅在按住空格时出现；触屏走原生滚动）；
- **滚动条清晰**：正文滚动条加深加粗，浅色主题下也能看清；
- **列宽适配**：列宽上限与聊天内一致（`min(30vw, 320px)`），超宽列自动换行收缩，
  表格整体不再撑破浮窗。

## 配置

无需任何配置，安装即用：

- 不读取环境变量，不需要 API Key / token，不写配置文件；
- 长表判定阈值（≥ 9 行 / 横向溢出 2px）为内置默认值，无需调整；
- 样式跟随 DSH 主题 CSS 变量自适应，不引入独立主题配置。

## 安装

```powershell
# npm（推荐）
dsh plugin --profile web add dsh-plugin-table-zoom
# 或 GitHub
dsh plugin --profile web add github:Pasumao/dsh-plugin-table-zoom
```

装完重启 `dsh web`（launcher 重新拉起）并刷新浏览器。包自带 `cordis.patch.yml`
挂载行，`dsh plugin add` 会自动应用，无需手动改配置。

手动挂载（备选，无法使用 `dsh plugin add` 时）——本插件是纯客户端插件，
需作为 bundle 挂载进 dsh 的 Web profile（与 dsh-notify / dsh-plugin-image-tools
同款机制）：

1. 安装依赖（在 profile 目录，例如 `~/.dsh/profiles/web`）：

   ```bash
   npm install dsh-plugin-table-zoom
   # 或从 GitHub 直装
   npm install github:Pasumao/dsh-plugin-table-zoom
   ```

2. 在 profile 的 `package.json` 的 `dsh.profile.bundles` 里加入该插件：

   ```jsonc
   "dsh": {
     "profile": {
       "bundles": [
         /* ...已有的 bundle... */,
         "dsh-plugin-table-zoom"
       ]
     }
   }
   ```

3. 在 profile 目录执行 `pnpm install`（或 `npm install`）；
4. **重启 `dsh web`**（launcher 重新拉起），新插件才会进入浏览器 bundle。

源码安装（本地开发 / 调试）：

```bash
git clone https://github.com/Pasumao/dsh-plugin-table-zoom.git
cd dsh-plugin-table-zoom
npm install
# 以 link: 依赖挂载进 profile，见下方说明
```

> 若以本地目录开发调试，可用 `link:` 依赖替换第 1 步：
> `"dsh-plugin-table-zoom": "link:D:/path/to/dsh-plugin-table-zoom"`。

## 工作原理

- 服务端半边（`lib/index.js`）：空实现。插件以「自带 bundle patch」方式挂载进
  profile，客户端半边由 `dsh.client` 声明经 `/plugins/dsh-plugin-table-zoom/client.js`
  送达浏览器（与 dsh-notify / dsh-plugin-image-tools 同款机制）。
- 客户端半边（`lib/client.js`）：MutationObserver 观察 `document.body`，
  rAF 合帧扫描 markdown 表格（核心渲染器把表格包在类名含 `tableScroll` 的
  容器里），对长表在容器后注入按钮行；按钮点击后命令式创建浮窗（复用
  image-tools 的 lightbox 模式：纯 DOM 单节点变更，不插入/移除 React 管理的
  结构，重渲染时安全）。

## 开发

```sh
npm run selfcheck    # 纯函数离线测试（识别/长表判定/Markdown 序列化）
npm run smoke        # selfcheck + 假 DOM 端到端冒烟（按钮注入/浮窗开合/复制）
npm run pack         # 打包
```

## 兼容性

- 目标：DeepSeek Harness Web GUI（dsh web），皮肤与主题 CSS 变量自适应；
- 依赖浏览器 `MutationObserver` / `requestAnimationFrame`，无 DOM 环境自动禁用；
- 不影响其他插件：只认 `tableScroll` 容器内的表格，跳过浮窗与 image-tools
  lightbox 内的表格；
- **dsh `0.1.1-rc.2` 起核心渲染器为 4+ 列宽表新增 `md-table-wide` 分支**
  （宽度扩展到聊天内容列两侧留白，默认 `overflow-x:hidden`、仅 hover 才出
  滚动条）。插件注入一条覆盖规则把宽表拉回内容列宽度并常驻横向滚动条，
  恢复旧版「超宽在会话列内滚动查看」体验；旧版 dsh 无 `md-table-wide`
  类，规则不命中，行为不变。

## 相关插件

本插件属于 **Pasumao 的 dsh 插件生态**，同系列已发布插件可搭配使用：

| 插件（npm） | GitHub | 说明 |
|---|---|---|
| [dsh-notify](https://www.npmjs.com/package/dsh-notify) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-notify) | Windows 原生通知 + 系统托盘 |
| [dsh-plugin-choice-refresh](https://www.npmjs.com/package/dsh-plugin-choice-refresh) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-choice-refresh) | 选择增强：重新生成选项 / 更多选项 |
| [dsh-plugin-dev-kb](https://www.npmjs.com/package/dsh-plugin-dev-kb) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-dev-kb) | 插件开发知识库（官方文档完整镜像 + 技能） |
| [dsh-plugin-image-tools](https://www.npmjs.com/package/dsh-plugin-image-tools) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-image-tools) | 图片选择卡 + 回复内嵌图片 + 盲模型收图 |
| [dsh-plugin-workbench](https://www.npmjs.com/package/dsh-plugin-workbench) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-workbench) | VS Code 风格文件浏览器 + 可编辑预览 |
| [dsh-plugin-windows-guard](https://www.npmjs.com/package/dsh-plugin-windows-guard) | [GitHub 仓库](https://github.com/Pasumao/dsh-plugin-windows-guard) | Windows 环境防坑：守则技能 + 乱码检测 / 危险写拦截 / 编码诊断修复 |

> 本系列其余插件见 [Pasumao · dsh 插件](https://github.com/Pasumao)；觉得好用欢迎到 GitHub 点 ⭐。

## AI 生成声明

代码与文档由 AI 辅助生成（DeepSeek Harness），均经人工审查与实机验证
（`npm run smoke`：selfcheck + 假 DOM 端到端冒烟）。

## License

MIT
