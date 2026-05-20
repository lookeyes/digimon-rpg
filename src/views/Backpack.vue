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
      <div v-for="item in filteredItems" :key="item.id" class="bp-item" :class="{ usable: item.battleUse||item.usable }" @click="item.usable ? useItem(item) : null">
        <div class="bp-item-icon">{{ item.icon }}</div>
        <div class="bp-item-info">
          <div class="bp-item-name">
            {{ item.name }}
            <span v-if="item.bind" class="bp-bind-tag">绑定</span>
            <span v-if="item.battleUse" class="bp-battle-tag">战斗</span>
            <span v-if="item.usable" class="bp-use-tag">可使用</span>
          </div>
          <div class="bp-item-desc">{{ item.desc }}</div>
          <div v-if="item.price" class="bp-item-price">💰 商城 {{ item.price }}G</div>
        </div>
        <div class="bp-item-count">×{{ item.count }}</div>
      </div>
    </div>

    <!-- 使用道具弹窗 -->
    <div v-if="showUseModal" class="modal-overlay" @click.self="showUseModal=false">
      <div class="dex-modal" style="max-height:70vh;">
        <h3 style="margin-bottom:4px;">{{ usingItem?.icon }} 使用 {{ usingItem?.name }}</h3>
        <p style="font-size:12px;color:var(--text-dim);margin-bottom:12px;">{{ usingItem?.desc }}</p>
        <div v-if="digimonList.length===0" style="text-align:center;padding:20px;color:var(--text-dim);">没有可使用的数码兽</div>
        <div v-else style="max-height:40vh;overflow-y:auto;">
          <div v-for="d in digimonList" :key="d.objectId" class="bp-digi-select" @click="applyItem(d)">
            <div class="bp-digi-sprite" v-html="digiSprite(d)"></div>
            <div>
              <div style="font-size:13px;font-weight:700;">{{ d.nickname||getTplName(d.templateId) }}</div>
              <div style="font-size:11px;color:var(--text-dim);">Lv.{{ d.level }} · 技能{{ countLearned(d) }}/10</div>
            </div>
            <div style="margin-left:auto;font-size:11px;color:var(--accent);">选择 →</div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;" @click="showUseModal=false">取消</button>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPlayerInfo, getMyDigimons } from '../api/game.js'
import { getTemplate, getRandomCommonSkills, randomNature, calcStats } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import { getCurrentUser } from '../api/auth.js'
import api from '../api/bmob.js'
import BottomNav from '../components/BottomNav.vue'

const activeTab = ref('battle')
const playerItems = ref({})
const showUseModal = ref(false)
const usingItem = ref(null)
const digimonList = ref([])

const categories = [
  { key: 'battle', label: '战斗道具', icon: '⚔️' },
  { key: 'bind', label: '绑定物品', icon: '🔒' },
  { key: 'trade', label: '可交易', icon: '💱' }
]

const allItems = [
  // 战斗道具 (battle)
  { id: 'heal_hp', name: '回复药剂', icon: '💚', desc: '战斗中回复一只数码兽40%最大HP', price: 200, battleUse: true, bind: false, category: 'battle' },
  { id: 'heal_mp', name: 'MP回复剂', icon: '💎', desc: '战斗中回复一只数码兽35%最大MP', price: 200, battleUse: true, bind: false, category: 'battle' },
  { id: 'antidote', name: '解毒草', icon: '🌿', desc: '治愈中毒状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'awakening', name: '苏醒药', icon: '💤', desc: '治愈睡眠状态', price: 150, battleUse: true, bind: false, category: 'battle' },
  { id: 'burn_heal', name: '灼烧膏', icon: '🔥', desc: '治愈灼烧状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'ice_heal', name: '解冻剂', icon: '❄️', desc: '治愈冰冻状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'para_heal', name: '解麻药', icon: '⚡', desc: '治愈麻痹状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'confuse_heal', name: '解乱果', icon: '🌀', desc: '治愈混乱状态', price: 100, battleUse: true, bind: false, category: 'battle' },
  { id: 'full_heal', name: '万能药', icon: '🏥', desc: '治愈全部异常状态', price: 500, battleUse: true, bind: false, category: 'battle' },
  { id: 'revive', name: '复活药', icon: '✨', desc: '战斗中复活一只数码兽并回复30%HP和20%MP', price: 800, battleUse: true, bind: false, category: 'battle' },
  { id: 'elixir', name: '圣灵药', icon: '🍀', desc: '战斗中回复一只数码兽25%HP和25%MP', price: 500, battleUse: true, bind: false, category: 'battle' },

  // 绑定物品 (bind)
  { id: 'free_reset', name: '洗点券', icon: '🔁', desc: '重置一只数码兽已分配的自由点', price: 0, battleUse: false, bind: true, category: 'bind', usable: true },
  { id: 'nature_mint', name: '性格薄荷', icon: '🌿', desc: '随机改变一只数码兽的性格', price: 0, battleUse: false, bind: true, category: 'bind', usable: true },
  { id: 'evo_stone', name: '进化石', icon: '💠', desc: '帮助符合条件的数码兽突破进化', price: 0, battleUse: false, bind: true, category: 'bind' },
  { id: 'name_tag', name: '改名卡', icon: '🏷️', desc: '为一只数码兽重新起名', price: 0, battleUse: false, bind: true, category: 'bind', usable: true },

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
  { id: 'skill_scroll', name: '技能卷轴', icon: '📜', desc: '给一只数码兽学会随机通用技能', price: 0, category: 'trade', usable: true },
  // 交易材料（后续开放交易场使用）
  { id: 'dragon_scale', name: '龙之鳞片', icon: '🐉', desc: '龙之咆哮领域数码兽掉落的稀有鳞片，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'holy_feather', name: '神圣羽毛', icon: '🪶', desc: '病毒克星领域数码兽的发光羽毛，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'dark_crystal', name: '暗之结晶', icon: '💎', desc: '黑暗区域浓缩能量形成的结晶，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'nature_orb', name: '自然宝珠', icon: '🔮', desc: '自然精灵领域孕育的翠绿宝珠，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'metal_fragment', name: '金属碎片', icon: '⚙️', desc: '金属帝国机械数码兽的碎片，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'ocean_pearl', name: '深海珍珠', icon: '🦪', desc: '深海救星领域的发光珍珠，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'wind_essence', name: '风之精华', icon: '💨', desc: '风之守卫领域凝结的风之精华，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'jungle_seed', name: '丛林种子', icon: '🌱', desc: '丛林奇兵领域的奇特种子，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'nightmare_core', name: '噩梦核心', icon: '👁️', desc: '噩梦士兵领域的黑暗核心，可兑换稀有道具', price: 0, category: 'trade' },
  { id: 'virus_antibody', name: '病毒抗体', icon: '💉', desc: '病毒克星领域产生的抗体精华，可兑换稀有道具', price: 0, category: 'trade' }
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

async function useItem(item) {
  const all = await getMyDigimons()
  if (all.length === 0) { alert('没有数码兽'); return }
  if (item.id === 'skill_scroll') {
    digimonList.value = all.filter(d => (parseArray(d.learnedSkills)).length < 10)
    if (digimonList.value.length === 0) { alert('所有数码兽技能已满'); return }
  } else {
    digimonList.value = all
  }
  usingItem.value = item; showUseModal.value = true
}

function parseArray(v) { if (!v) return []; if (typeof v === 'string') { try { return JSON.parse(v) } catch(e) { return [] } } return v }

function countLearned(d) { return parseArray(d.learnedSkills).length }

function getTplName(tid) { const t = getTemplate(tid); return t?.name||'???' }

function digiSprite(d) { const t = getTemplate(d.templateId); return getDigimonSprite(d.templateId, 40, t?.name)||'❓' }

async function applyItem(digimon) {
  if (usingItem.value?.id === 'skill_scroll') {
    const learned = parseArray(digimon.learnedSkills)
    if (learned.length >= 10) { alert('技能已满 (10个)'); return }
    const candidates = getRandomCommonSkills(8)
    const available = candidates.filter(s => !learned.includes(s.id))
    if (available.length === 0) { alert('没有可以学习的新技能'); return }
    const skill = available[0]
    learned.push(skill.id)
    await api.update('PlayerDigimon', digimon.objectId, { learnedSkills: JSON.stringify(learned) })
    playerItems.value['skill_scroll'] = Math.max(0, (playerItems.value['skill_scroll']||0)-1)
    await saveItems()
    showUseModal.value = false
    alert(`${digimon.nickname||getTplName(digimon.templateId)} 学会了 ${skill.name}！`)
  } else if (usingItem.value?.id === 'name_tag') {
    const name = prompt('请输入新名字：', digimon.nickname || getTplName(digimon.templateId))
    if (!name || name.trim() === '') return
    await api.update('PlayerDigimon', digimon.objectId, { nickname: name.trim() })
    playerItems.value['name_tag'] = Math.max(0, (playerItems.value['name_tag']||0)-1)
    await saveItems()
    showUseModal.value = false
    alert('改名成功！')
  } else if (usingItem.value?.id === 'free_reset') {
    let allocated = {}
    try { allocated = typeof digimon.allocatedPoints === 'string' ? JSON.parse(digimon.allocatedPoints) : (digimon.allocatedPoints || {}) } catch(e) {}
    const total = (allocated.hp||0)+(allocated.mp||0)+(allocated.atk||0)+(allocated.def||0)+(allocated.spAtk||0)+(allocated.spDef||0)+(allocated.spd||0)
    if (total === 0) { alert('没有已分配的自由点'); return }
    const newFree = (digimon.freePoints||0) + total
    await api.update('PlayerDigimon', digimon.objectId, { freePoints: newFree, allocatedPoints: JSON.stringify({hp:0,mp:0,atk:0,def:0,spAtk:0,spDef:0,spd:0}) })
    playerItems.value['free_reset'] = Math.max(0, (playerItems.value['free_reset']||0)-1)
    await saveItems()
    showUseModal.value = false
    alert(`已重置，返还 ${total} 点！`)
  } else if (usingItem.value?.id === 'nature_mint') {
    let newNature = randomNature()
    while (newNature.id === digimon.nature) { newNature = randomNature() }
    const tpl = getTemplate(digimon.templateId)
    if (tpl) {
      let allocated = {}
      try { allocated = typeof digimon.allocatedPoints === 'string' ? JSON.parse(digimon.allocatedPoints) : (digimon.allocatedPoints || {}) } catch(e) {}
      const stats = calcStats(tpl, digimon.level||1, allocated, newNature.id)
      await api.update('PlayerDigimon', digimon.objectId, { nature: newNature.id, stats: JSON.stringify({hp:stats.maxHp,maxHp:stats.maxHp,mp:stats.maxMp,maxMp:stats.maxMp,atk:stats.atk,def:stats.def,spAtk:stats.spAtk,spDef:stats.spDef,spd:stats.spd}) })
    } else {
      await api.update('PlayerDigimon', digimon.objectId, { nature: newNature.id })
    }
    playerItems.value['nature_mint'] = Math.max(0, (playerItems.value['nature_mint']||0)-1)
    await saveItems()
    showUseModal.value = false
    alert(`性格变为 ${newNature.name}！`)
  }
}

async function saveItems() {
  const user = getCurrentUser(); if (user) await api.updateUser(user.objectId, { items: JSON.stringify(playerItems.value) })
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
.bp-use-tag { font-size:9px; background:var(--gold)22; color:var(--gold); border:1px solid var(--gold); border-radius:3px; padding:0 4px; }
.bp-item.usable { cursor:pointer; }
.bp-item.usable:active { transform:scale(0.97); }
.bp-digi-select { display:flex; align-items:center; gap:10px; padding:8px; background:var(--bg-primary); border:1px solid var(--border); border-radius:8px; margin-bottom:4px; cursor:pointer; transition:all 0.15s; }
.bp-digi-select:hover { border-color:var(--accent); }
.bp-digi-select:active { transform:scale(0.97); }
.bp-digi-sprite { width:40px; height:40px; overflow:hidden; }
</style>
