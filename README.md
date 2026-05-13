<p align="center">
  <img src="./docs/assets/hero.png" alt="我的任务 - 粉色桌面待办小组件" width="920" />
</p>

<h1 align="center">我的任务</h1>

<p align="center">
  一个可爱、轻量、常驻桌面的中文待办小组件。打开就能看到今天要做什么，点一下就完成。
</p>

<p align="center">
  <a href="https://github.com/Neroxsh/hello-kitty-todo/releases/latest">
    <img alt="Latest release" src="https://img.shields.io/github/v/release/Neroxsh/hello-kitty-todo?style=for-the-badge&label=Download" />
  </a>
  <img alt="macOS" src="https://img.shields.io/badge/macOS-supported-ff8db3?style=for-the-badge" />
  <img alt="Windows" src="https://img.shields.io/badge/Windows-supported-ff8db3?style=for-the-badge" />
</p>

## 下载

到 [Releases](https://github.com/Neroxsh/hello-kitty-todo/releases/latest) 下载最新版：

| 系统 | 下载哪个文件 |
| --- | --- |
| macOS | `.dmg` |
| Windows | `.exe` |

> macOS 版本暂未签名。第一次打开时，如果系统拦截，可以右键应用选择“打开”，或到系统设置里允许打开。

## 预览

<p align="center">
  <img src="./docs/assets/widget-preview.png" alt="桌面 Widget 预览" width="360" />
</p>

## 亮点

- 漂亮的粉色桌面小组件，不是复杂任务管理器
- 今日任务、完成勾选、收藏爱心、筛选菜单
- 点击右上角加号才显示添加输入框，平时界面更干净
- 本地保存任务，重启后还在
- 无边框透明窗口，支持拖动和置顶
- 托盘菜单：显示、隐藏、固定/取消固定、重置位置、退出
- macOS 和 Windows 安装包由 GitHub Actions 自动构建

## 使用

1. 下载适合你系统的安装包。
2. 打开应用。
3. 点击右上角 `+` 添加任务。
4. 点击圆圈完成任务，点击爱心收藏任务。
5. 不想看到窗口时可以隐藏到托盘。

## 开发

```bash
npm install
npm run tauri dev
```

前端预览：

```bash
npm run dev
```

本地构建：

```bash
npm run build
npm run tauri build
```

## 发布

本项目已经配置自动发布。推送版本 tag 后，GitHub Actions 会在 macOS 和 Windows 上构建安装包，并上传到 GitHub Release：

```bash
git tag v0.1.0
git push origin v0.1.0
```

构建产物：

- macOS：`.dmg`
- Windows：`.exe`

## 技术栈

- Tauri 2
- React
- TypeScript
- Vite

## 国内开发镜像

```bash
npm config set registry https://registry.npmmirror.com
```

Rust/Cargo 可以使用清华 TUNA 镜像。

## License

MIT
