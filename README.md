# 假名记忆 - Kana Syllabary Memory

<div align="center">

一个优雅的日语假名（平假名、片假名）记忆练习 Web 应用

[在线体验](https://kidynecat.github.io/KanaSyllabaryMemory/) | [功能介绍](#功能特性) | [快速开始](#快速开始)

</div>

## ✨ 功能特性

### 🎯 核心功能

- **全面的假名支持**

  - 清音（46 个基础假名）
  - 浊音（25 个浊化假名）
  - 拗音（33 个拗音假名）
  - 共计 104 个假名

- **多种学习模式**

  - 🔀 **混合模式** - 随机显示平假名或片假名
  - 🅰️ **平假名模式** - 专注学习平假名
  - 🅱️ **片假名模式** - 专注学习片假名
  - 🔤 **罗马音模式** - 通过罗马音反向学习
  - ⇄ **互换模式** - 平假名与片假名互相转换

- **智能学习系统**
  - 随机抽取避免连续重复
  - 自动循环练习
  - 实时显示提示
  - 标准日语发音播放

### 🎨 用户体验

- **主题切换**

  - 亮色模式（适合白天）
  - 暗色模式（护眼模式）
  - 支持系统主题自动切换

- **响应式设计**

  - 完美适配手机、平板、桌面
  - 移动端优化的交互体验
  - 触摸友好的界面设计

- **数据持久化**
  - 自动保存学习进度
  - 记住用户选择的假名
  - 保存显示模式偏好

### ⚙️ 灵活配置

- **自定义选择**

  - 按类型批量选择（清音/浊音/拗音）
  - 单个假名精确控制
  - 分组显示，清晰易用

- **统计信息**
  - 实时显示已选假名数量
  - 分类统计清音/浊音/拗音
  - 学习进度一目了然

## 🚀 快速开始

### 在线使用

直接访问：[https://kidynecat.github.io/KanaSyllabaryMemory/](https://kidynecat.github.io/KanaSyllabaryMemory/)

### 本地运行

```bash
# 克隆项目
git clone https://github.com/kidynecat/KanaSyllabaryMemory.git
cd KanaSyllabaryMemory

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 浏览器访问 http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 静态导出（用于 GitHub Pages）
pnpm export
```

## 📖 使用指南

### 基本使用

1. **开始练习**

   - 点击"开始练习"按钮开始学习
   - 点击大字假名可播放发音
   - 点击"显示提示"查看答案
   - 点击"下一个"继续练习

2. **配置学习内容**

   - 点击"设置"按钮打开配置面板
   - 选择显示模式（混合/平假名/片假名等）
   - 选择要学习的假名类型
   - 点击"保存设置"应用更改

3. **主题切换**
   - 点击右上角月亮/太阳图标
   - 切换亮色/暗色主题
   - 设置自动保存

## 🛠️ 技术栈

- **框架**: React 18 + Next.js 14
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **包管理**: pnpm
- **主题**: next-themes
- **图标**: Lucide React

## 📁 项目结构

```
KanaSyllabaryMemory/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── theme-provider.tsx
├── lib/                  # 工具库
│   ├── types.ts         # 类型定义
│   ├── kana-data.ts     # 假名数据
│   ├── local-storage.ts # 本地存储
│   └── utils.ts         # 工具函数
└── public/              # 静态资源
    └── assets/          # 音频文件
```

## 🎓 学习资源

### 假名表

本应用包含完整的日语假名：

- **清音（46 个）**: あいうえお、かきくけこ...
- **浊音（25 个）**: がぎぐげご、ざじずぜぞ...
- **拗音（33 个）**: きゃきゅきょ、しゃしゅしょ...

### 学习建议

1. **初学者**: 建议从清音开始，熟练后再学习浊音和拗音
2. **进阶学习**: 使用"互换模式"加强平假名和片假名的对应关系
3. **反复练习**: 利用"罗马音模式"进行反向学习，加深记忆

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 👨‍💻 作者

- GitHub: [@kidynecat](https://github.com/kidynecat)
- 网站: [phpz.xyz](https://phpz.xyz)

## 🔗 相关链接

- [项目迁移说明](MIGRATION.md) - Angular 到 React 的迁移文档
- [更新日志](CHANGELOG.md) - 版本更新记录
- [在线演示](https://kidynecat.github.io/KanaSyllabaryMemory/)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by [phpz.xyz](https://phpz.xyz)

</div>
