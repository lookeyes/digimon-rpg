# 数码宝贝RPG — AI开发指引

## 项目简介

数码宝贝题材的安卓RPG回合制手游。Vue3前端 + Bmob后端 + Capacitor打包。

## 用户背景

用户是不懂代码的小白。所有技术实现由AI完成，但每次只推进一个可控的步骤，确保项目稳定安全。每完成一个功能点后主动向用户汇报进度，等待确认后再继续。

## 文档体系

### 标准文档（开发前必读）

| 文档 | 路径 | 何时读取 |
|------|------|----------|
| 项目需求 | [docs/requirements.md](docs/requirements.md) | 每次开始新功能前，确认需求对齐 |
| 技术方案 | [docs/tech-stack.md](docs/tech-stack.md) | 涉及技术选型或架构时 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 涉及UI/样式时，确保配色组件一致 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 每次会话开始，了解当前阶段和进度 |
| 数据库结构 | [docs/bmob-schema.md](docs/bmob-schema.md) | 涉及数据操作时，确认表结构 |
| 数码宝贝数据 | [docs/digimon-data.md](docs/digimon-data.md) | 涉及数码宝贝/蛋相关功能时 |

### 开发日志

- 位置：[devlog/](devlog/)
- 格式：`YYYY-MM-DD.md`
- 每次开发会话结束后，写入当日日志：
  - 完成事项（勾选）
  - 遇到的问题
  - 待办事项
  - 下一步计划
- 新建会话时，先读取最近的日志了解进度

## 工作规范

### 开发前
1. 读取 [docs/execution-plan.md](docs/execution-plan.md) 了解当前阶段
2. 读取最近的 devlog 了解上次进度
3. 读取当前阶段相关的需求文档
4. 向用户确认本次要做的内容

### 开发中
1. 一次只做一个功能模块，不要一口气写太多
2. 每个模块完成后构建验证（`npm run build`），确保无编译错误
3. 代码风格遵循项目现有模式（Vue3 Composition API + CSS变量）
4. 不引入新的依赖，除非必须
5. Bmob密钥已配置在 `src/api/bmob.js`，不要提交到公开仓库

### 开发后
1. 更新 `docs/execution-plan.md` 进度
2. 写入 `devlog/YYYY-MM-DD.md` 开发日志
3. 向用户汇报完成情况，列出下一步可选方向
4. 等待用户确认后再进入下一步

### 沟通规范
1. 用中文沟通
2. 每完成一个小步骤就汇报，不等用户催
3. 功能描述用游戏玩家能听懂的话，不用技术术语
4. 给出下一步选项时，用简洁的编号列表

## 技术速查

### 启动开发服务器
```bash
npm run dev      # http://localhost:3000
```

### 构建验证
```bash
npm run build    # 确保无报错
```

### Android打包
```bash
npx cap add android    # 仅首次
npx cap copy           # 复制构建结果
npx cap open android   # 用Android Studio打开
```

### 关键文件位置
- Bmob配置：`src/api/bmob.js`
- 认证逻辑：`src/api/auth.js`
- 前端路由：`src/router/index.js`
- 全局样式：`src/styles/main.css`
- 登录/注册页：`src/views/Login.vue`, `src/views/Register.vue`
- 主界面：`src/views/Home.vue`
- 底部导航：`src/components/BottomNav.vue`

## 当前状态

- Phase 1 ✅ 完成（账号系统 + 主界面框架）
- Phase 2 ⏳ 待开发（扭蛋 + 孵化 + 数码宝贝管理）
- Bmob密钥已配置
- Bmob表结构：_User表需扩展字段，PlayerEgg和PlayerDigimon表需在Bmob后台手动创建
