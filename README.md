# Online Polaroid Canvas

一个注重信息密度与操作效率的在线拍立得应用。

[在线演示](https://sumy7.github.io/ai-apps-supreme-octo-funicular/)

## 功能特点

- **虚拟拍立得相机**：调用浏览器摄像头实时拍摄。
- **拍立得风格**：自动生成带有白边和时间戳的拍立得风格照片。
- **自由画布**：照片像便利贴一样可以在画布上自由拖动、堆叠。
- **数据持久化**：照片数据保存在本地浏览器中，刷新不丢失。
- **响应式设计**：适配 PC 端宽屏布局，提供沉浸式体验。
- **固定照片**：点击图钉按钮固定照片位置，防止误拖动。
- **下载照片**：支持单张照片下载保存到本地。
- **删除功能**：将照片拖动到垃圾桶区域即可删除。

## 技术栈

- React 19
- TypeScript
- Vite 7
- Tailwind CSS
- Lucide React (图标库)
- React Draggable (拖拽交互)
- pnpm (包管理工具)

## 开发环境要求

- Node.js >= 18
- pnpm >= 8

## 快速开始

1. 克隆仓库：
   ```bash
   git clone https://github.com/sumy7/ai-apps-supreme-octo-funicular.git
   cd ai-apps-supreme-octo-funicular
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm dev
   ```

4. 构建生产版本：
   ```bash
   pnpm build
   ```

5. 预览生产构建：
   ```bash
   pnpm preview
   ```

6. 代码检查：
   ```bash
   pnpm lint
   ```

## 使用说明

1. 点击右上角的相机图标打开拍摄界面。
2. 允许浏览器访问摄像头权限。
3. 点击红色拍摄按钮拍照。
4. 照片会自动添加到画布上。
5. 拖动照片调整位置，鼠标悬停可显示删除按钮。
6. 点击图钉图标可以固定/取消固定照片。
7. 点击下载图标可以保存照片到本地。
8. 将照片拖动到垃圾桶区域可以删除照片。

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── Photo.tsx              # 照片组件
│   │   ├── SkeuomorphicCamera.tsx # 拟物化相机组件
│   │   └── SkeuomorphicTrash.tsx  # 拟物化垃圾桶组件
│   ├── App.tsx                     # 主应用组件
│   ├── App.css                     # 应用样式
│   ├── index.css                   # 全局样式
│   └── main.tsx                    # 应用入口
├── public/                          # 静态资源
├── package.json                     # 项目配置
└── vite.config.ts                  # Vite 配置
```

## 部署

本项目通过 GitHub Actions 自动部署到 GitHub Pages。当代码推送到 `main` 分支时，会自动触发构建和部署流程。

## 浏览器兼容性

- Chrome/Edge (推荐)
- Firefox
- Safari
- 需要支持 WebRTC API (用于摄像头访问)

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
