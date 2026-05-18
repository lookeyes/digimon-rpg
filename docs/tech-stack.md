# 技术方案

## 技术选型

| 层面 | 方案 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API) | 轻量、灵活、单页应用 |
| 构建工具 | Vite 5 | 快速开发服务器和构建 |
| 路由 | Vue Router 4 | 页面路由和守卫 |
| 后端服务 | Bmob (BaaS) | 国内BaaS平台，提供账号/数据库/文件存储 |
| HTTP通信 | Fetch API | 通过REST API与Bmob交互 |
| 移动打包 | Capacitor 6 | 将Web应用打包为安卓APK |
| 样式 | 原生CSS | CSS变量 + 暗黑主题 |

## 项目结构

```
f:/digimonrpg/
├── index.html                    # 入口HTML
├── package.json                  # 依赖配置
├── vite.config.js                # Vite构建配置
├── capacitor.config.json         # Android打包配置
├── CLAUDE.md                     # AI开发指引
├── devlog/                       # 开发日志
│   └── YYYY-MM-DD.md
├── docs/                         # 项目文档
│   ├── requirements.md           # 需求文档
│   ├── tech-stack.md             # 技术方案（本文件）
│   ├── design-spec.md            # 设计规范
│   ├── execution-plan.md         # 执行计划
│   ├── bmob-schema.md            # 数据库结构
│   └── digimon-data.md           # 数码宝贝数据规范
└── src/
    ├── main.js                   # Vue入口
    ├── App.vue                   # 根组件
    ├── api/
    │   ├── bmob.js              # Bmob REST API封装
    │   ├── auth.js              # 认证模块
    │   └── game.js              # 游戏业务API
    ├── router/
    │   └── index.js             # 路由配置
    ├── data/
    │   └── digimonData.js       # 数码宝贝静态数据
    ├── components/               # 可复用组件
    ├── views/                    # 页面
    └── styles/
        └── main.css             # 全局样式
```

## Bmob 集成方式

- 通过 REST API 调用 Bmob（非SDK方式）
- 认证头：X-Bmob-Application-Id + X-Bmob-REST-API-Key
- 会话管理：X-Bmob-Session-Token（存localStorage）
- 数据库操作：GET/POST/PUT/DELETE `/1/classes/{TableName}`

## 路由设计

| 路由 | 页面 | 认证要求 |
|------|------|----------|
| `/login` | 登录 | 无需 |
| `/register` | 注册 | 无需 |
| `/home` | 主页 | 需要 |
| `/digimon` | 数码宝贝列表 | 需要 |
| `/digimon/:id` | 数码宝贝详情 | 需要 |
| `/battle` | 战斗 | 需要 |
| `/gacha` | 扭蛋 | 需要 |
| `/trade` | 交易场 | 需要 |

## 构建和部署

```bash
npm run dev      # 开发服务器 (localhost:3000)
npm run build    # 生产构建 (dist/)
npx cap add android    # 添加Android平台
npx cap copy           # 复制Web文件到Android
npx cap open android   # Android Studio打开并构建APK
```
