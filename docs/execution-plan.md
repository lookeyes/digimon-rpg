# 执行计划

## 总览

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 1 | 账号系统 + 主界面框架 | ✅ 完成 |
| Phase 2 | 能力值(7项)+性格(25种)+特性+商城买蛋+自由点分配 | ✅ 完成 |
| Phase 3 | 回合制3v3战斗系统（PVE） | ✅ 完成 |
| Phase 4 | 进化系统 | ✅ 完成 |
| Phase 5 | 道具系统 + 背包 + 交易场 | ✅ 完成（交易场简化版） |
| Phase 6 | 图鉴 + 介绍页 + 种族值体系 + 技能描述 | ✅ 完成 |
| Phase 7 | 云服务器部署 + 素材替换 + 性能优化 | ✅ 完成 |
| Phase 8 | PVP在线对战 | ⏳ 待开发 |
| Phase 9 | 交易场完善 + 道具掉落 | ⏳ 待开发 |

## Phase 1 — 已完成

- [x] Vue3 + Vite 项目初始化
- [x] Bmob API 封装
- [x] 登录/注册页面
- [x] 路由守卫
- [x] 主界面 + 底部导航
- [x] 占位页面
- [x] 暗黑数码主题UI
- [x] Capacitor配置
- [x] 项目文档体系

## Phase 2 — 扭蛋 + 孵化 + 数码宝贝管理

### 前提准备
- [ ] 在Bmob后台给 _User 表添加 gachaCoins、gold 字段（需手动操作）
- [ ] 在Bmob后台创建 PlayerEgg 表（需手动操作）
- [ ] 在Bmob后台创建 PlayerDigimon 表（需手动操作）

### 开发任务
- [x] 创建 src/data/digimonData.js（10只数码宝贝 + 蛋类型）
- [x] 创建 src/api/game.js（玩家资源、蛋、宝贝CRUD）
- [x] 创建组件: DigimonCard, EggCard, GachaAnimation, HatchModal, EmptyState
- [x] 重写 Gacha.vue（扭蛋机 + 抽蛋 + 蛋列表）
- [x] 重写 Digimon.vue（Tab切换列表）
- [x] 创建 DigimonDetail.vue（宝贝详情页）
- [x] 修改 Home.vue（真实统计数据）
- [x] 修改 router/index.js（添加详情路由）
- [x] 修改 auth.js（注册初始化玩家资源）
- [x] 补充 main.css 样式

## Phase 3 — 战斗系统 （规划中）

- PVE 冒险模式
- 3v3 回合制战斗
- 属性克制计算
- 技能系统
- 战斗UI（HP条、技能选择、战斗动画）

## Phase 4 — 进化系统 （规划中）

- 等级进化
- 道具进化
- 退化机制
- 分支进化路线选择

## Phase 5 — 道具 + 交易场 （规划中）

- 道具系统（获得、使用）
- 背包管理
- 交易场挂单

## Phase 6 — PVP （规划中）

- 玩家匹配
- 在线对战
- 排行榜
