# 参与贡献

欢迎提交功能改进、动作图纠错、移动端体验问题和文档补充。提交 Issue 时说明触发步骤、预期结果、实际结果，以及浏览器和设备；截图中的个人信息请自行遮盖。

## 开始开发

```bash
git clone https://github.com/dagongzhanshi1/lianji-fitness-pwa.git
cd lianji-fitness-pwa
npm start
```

浏览器打开终端输出的本地地址。生产页面位于 `docs/`，不需要构建或安装生产依赖。

## 修改训练与保存逻辑

- 保持已有 JSON 备份兼容，不随意更改 `lianji-fitness-v1` 存储键。
- 新增动作、取消选择、编辑历史、午夜归档和更新程序时，检查完整数据与未填完数据都能保留。
- 不把旧组数和旧重量自动填进新训练；历史最大重量保留为独立提示。
- 不上传个人训练备份、浏览器配置、密钥或认证信息。需要复现数据时请使用虚构记录。
- 修改核心页面或模块后更新 `docs/sw.js`、`docs/app.js` 和 `docs/version.json` 的版本，验证旧 Worker 升级及离线重开。`update.html` 是独立的联网更新入口。

## 修改动作图

请先阅读[动作配图说明](assets/illustrations/README.md)。一项动作或变式对应自己的图片；不要用其他握法、器械或姿势冒充。

- 保持灰色无面部模型、深灰短裤、白色背景和暗红色主要肌群的统一风格。
- 核对手掌朝向、握距、器械支撑、拉索连接、关节位置和单侧／双侧区别。
- 图片属于静态姿势示意；配套名称和文字不要把它描述成完整动作动画。
- 只提交可按本项目许可分发的图片。外部姿势参考链接不代表外部图片也由本项目授权。
- 更新 `docs/exercise-media.js` 的映射和总字节数，同时更新 `assets/illustrations/catalog.json`；新增或重做生成图时补充对应提示词。

## 验证

```bash
npm run check
npm install --no-save playwright
npx playwright install chromium
npm test
```

浏览器测试也可通过 `PLAYWRIGHT_MODULE_PATH`、`BROWSER_EXECUTABLE_PATH` 指向已有安装。旧版升级测试会读取本仓库的历史提交，请使用完整 Git 历史；如需指定 Git 路径，设置 `GIT_EXECUTABLE_PATH`。

PR 请说明用户可见的变化、验证结果，以及是否涉及存储格式或缓存升级。界面变更附上使用演示数据的手机截图。
