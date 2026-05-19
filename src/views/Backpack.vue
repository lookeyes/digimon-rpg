<template>
  <div class="page" style="padding-bottom:80px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>🎒</span> 背包</div>
    </div>

    <!-- 分类标签 -->
    <div class="bp-tabs">
      <button v-for="cat in categories" :key="cat.key" class="bp-tab" :class="{ active: activeTab===cat.key }" @click="activeTab=cat.key">
        {{ cat.icon }} {{ cat.label }}
        <span class="bp-tab-count">{{ getCategoryCount(cat.key) }}</span>
      </button>
    </div>

    <!-- 物品列表 -->
    <div v-if="filteredItems.length===0" class="placeholder-page" style="padding:40px;">
      <div class="icon">🎒</div>
      <p style="color:var(--text-dim);margin-top:8px;">该分类暂无物品</p>
      <p style="font-size:12px;color:var(--text-dim);">可在商城购买道具或在战斗中获取掉落</p>
    </div>

    <div v-else class="bp-list">
      <div v-for="item in filteredItems" :key="item.id" class="bp-item" :class="{ empty: item.count===0, usable: item.battleUse }">
        <div class="bp-item-icon">{{ item.icon }}</div>
        <div class="bp-item-info">
          <div class="bp-item-name">
            {{ item.name }}
            <span v-if="item.bind" class="bp-bind-tag">绑定</span>
            <span v-if="item.battleUse" class="bp-battle-tag">战斗</span>
          </div>
          <div class="bp-item-desc">{{ item.desc }}</div>
          <div v-if="item.price" class="bp-item-price">💰 商城 {{ item.price }}G</div>
        </div>
        <div class="bp-item-count">×{{ item.count }}</div>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPlayerInfo } from '../api/game.js'
import BottomNav from '../components/BottomNav.vue'

const activeTab = ref('battle')
const playerItems = ref({})

const categories = [
  { key: 'battle', label: '战斗道具', icon: '⚔️' },
  { key: 'bind', label: '绑定物品', icon: '🔒' },
  { key: 'trade', label: '可交易', icon: '💱' }
]

const allItems = [
  // 战斗道具 (battle)
  { id: 'heal_hp', name: '回复药剂', icon: '💚', desc: '战斗中恢复一只数码兽全部HP', price: 200, battleUse: true, bind: false, category: 'battle' },
  { id: 'heal_mp', name: 'MP回复剂', icon: '💎', desc: '战斗中恢复一只数码兽全部MP', price: 200, battleUse: true, bind: false, category: 'battle' },
  { id: 'antidote', name: '解毒草', icon: '🌿', desc: '治愈中毒状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'awakening', name: '苏醒药', icon: '💤', desc: '治愈睡眠状态', price: 150, battleUse: true, bind: false, category: 'battle' },
  { id: 'burn_heal', name: '灼烧膏', icon: '🔥', desc: '治愈灼烧状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'ice_heal', name: '解冻剂', icon: '❄️', desc: '治愈冰冻状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'para_heal', name: '解麻药', icon: '⚡', desc: '治愈麻痹状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'confuse_heal', name: '解乱果', icon: '🌀', desc: '治愈混乱状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'full_heal', name: '万能药', icon: '🏥', desc: '治愈全部异常状态', price: 500, battleUse: true, bind: false, category: 'battle' },
  { id: 'revive', name: '复活药', icon: '✨', desc: '战斗中复活一只数码兽并回复50%HP', price: 800, battleUse: true, bind: false, category: 'battle' },
  { id: 'elixir', name: '圣灵药', icon: '🍀', desc: '战斗中回复一只数码兽全部HP和MP', price: 500, battleUse: true, bind: false, category: 'battle' },

  // 绑定物品 (bind)
  { id: 'free_reset', name: '洗点券', icon: '🔁', desc: '重置一只数码兽已分配的自由点', price: 0, battleUse: false, bind: true, category: 'bind' },
  { id: 'nature_mint', name: '性格薄荷', icon: '🌿', desc: '随机改变一只数码兽的性格', price: 0, battleUse: false, bind: true, category: 'bind' },
  { id: 'evo_stone', name: '进化石', icon: '💠', desc: '帮助符合条件的数码兽突破进化', price: 0, battleUse: false, bind: true, category: 'bind' },
  { id: 'name_tag', name: '改名卡', icon: '🏷️', desc: '为一只数码兽重新起名', price: 0, battleUse: false, bind: true, category: 'bind' },

  // 可交易物品 (trade)
  { id: 'dragon_scale', name: '龙之鳞片', icon: '🐉', desc: '龙之咆哮领域数码兽掉落的稀有鳞片，可用于交易', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'holy_feather', name: '神圣羽毛', icon: '🪶', desc: '病毒克星领域数码兽的发光羽毛', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'dark_crystal', name: '暗之结晶', icon: '💎', desc: '黑暗区域浓缩能量形成的结晶', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'nature_orb', name: '自然宝珠', icon: '🔮', desc: '自然精灵领域孕育的翠绿宝珠', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'metal_fragment', name: '金属碎片', icon: '⚙️', desc: '金属帝国机械数码兽的碎片', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'ocean_pearl', name: '深海珍珠', icon: '🦪', desc: '深海救星领域的发光珍珠', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'wind_essence', name: '风之精华', icon: '💨', desc: '风之守卫领域凝结的风之精华', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'jungle_seed', name: '丛林种子', icon: '🌱', desc: '丛林奇兵领域的奇特种子', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'nightmare_core', name: '噩梦核心', icon: '👁️', desc: '噩梦士兵领域的黑暗核心', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'virus_antibody', name: '病毒抗体', icon: '💉', desc: '病毒克星领域产生的抗体精华', price: 0, battleUse: false, bind: false, category: 'trade' },
  { id: 'skill_scroll', name: '技能卷轴', icon: '📜', desc: '使用后随机获得一个通用技能', price: 0, battleUse: false, bind: false, category: 'trade' }
]

const filteredItems = computed(() => {
  const catItems = allItems.filter(i => i.category === activeTab.value)
  return catItems.map(i => ({
    ...i,
    count: (playerItems.value[i.id] || 0)
  })).filter(i => i.count > 0)
})

function getCategoryCount(cat) {
  const catItems = allItems.filter(i => i.category === cat)
  return catItems.reduce((sum, i) => sum + (playerItems.value[i.id] || 0), 0)
}

onMounted(async () => {
  try {
    const info = await getPlayerInfo()
    let items = {}
    if (info.items) {
      try { items = typeof info.items === 'string' ? JSON.parse(info.items) : info.items } catch (e) {}
    }
    playerItems.value = items
  } catch (e) { console.error('加载背包失败:', e) }
})
</script>

<style scoped>
.bp-tabs { display:flex; gap:4px; margin-bottom:14px; }
.bp-tab { flex:1; padding:8px; border-radius:20px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-dim); font-size:12px; font-family:inherit; cursor:pointer; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:4px; }
.bp-tab.active { background:var(--accent); color:#fff; border-color:var(--accent); }
.bp-tab-count { font-size:10px; background:rgba(255,255,255,0.2); padding:1px 6px; border-radius:10px; }
.bp-list { display:flex; flex-direction:column; gap:6px; }
.bp-item { display:flex; align-items:center; gap:10px; background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:10px 12px; }
.bp-item.empty { opacity:0.4; }
.bp-item-icon { font-size:28px; min-width:36px; text-align:center; }
.bp-item-info { flex:1; }
.bp-item-name { font-size:13px; font-weight:700; margin-bottom:2px; display:flex; align-items:center; gap:6px; }
.bp-item-desc { font-size:11px; color:var(--text-dim); margin-bottom:2px; }
.bp-item-price { font-size:10px; color:var(--gold); }
.bp-item-count { font-size:16px; font-weight:700; color:var(--accent); min-width:30px; text-align:center; }
.bp-bind-tag { font-size:9px; background:var(--orange)22; color:var(--orange); border:1px solid var(--orange); border-radius:3px; padding:0 4px; }
.bp-battle-tag { font-size:9px; background:var(--green)22; color:var(--green); border:1px solid var(--green); border-radius:3px; padding:0 4px; }
</style>
