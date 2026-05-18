# Bmob 数据库表结构

## 连接配置

- Application ID: `8eff05b11c17b546b31d8712a896a3f5`
- REST API Key: `b5a726fa9e336bb97ed13055d3fae348`
- Base URL: `https://api.bmob.cn/1`

## 表结构

### _User 表（Bmob自带，扩展字段）

| 字段名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `username` | String | 用户名（Bmob内置） | - |
| `password` | String | 密码（Bmob内置） | - |
| `playerName` | String | 显示名称 | 同username |
| `gold` | Number | 金币数量 | 500 |

### PlayerEgg 表（数码蛋）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `owner` | Pointer<_User> | 拥有者 |
| `eggTemplateId` | String | 固定 "shop_egg" |
| `rarity` | String | 固定 "normal" |
| `resultTemplateId` | String | 孵化出什么数码宝贝 |
| `hatchReadyAt` | String | 孵化完成时间（ISO 8601） |
| `status` | String | incubating / ready / hatched |

### PlayerDigimon 表（玩家数码宝贝）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `owner` | Pointer<_User> | 拥有者 |
| `templateId` | String | 模板ID |
| `nickname` | String | 昵称 |
| `level` | Number | 等级 |
| `exp` | Number | 经验值 |
| `hp` | Number | 当前HP |
| `maxHp` | Number | 最大HP |
| `mp` | Number | 当前MP |
| `maxMp` | Number | 最大MP |
| `atk` | Number | 攻击 |
| `def` | Number | 防御 |
| `spAtk` | Number | 特攻 |
| `spDef` | Number | 特防 |
| `spd` | Number | 速度 |
| `nature` | String | 性格ID，如 "adamant" |
| `abilities` | String | 特性JSON数组 |
| `freePoints` | Number | 剩余未分配自由点 |
| `allocatedPoints` | String | 已分配点数JSON |
| `isTeam` | Boolean | 是否在出战队伍 |
| `obtainedAt` | String | 获得时间（ISO 8601） |
| `fieldExp` | String | 领域经验JSON |

## ACL 权限建议

- `_User` 表：默认ACL
- `PlayerEgg` 表：仅创建者可读写
- `PlayerDigimon` 表：仅创建者可读写
