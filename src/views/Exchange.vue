<template>
  <div class="page">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>🔄</span> 材料兑换</div>
    </div>

    <div class="about-section" style="margin-bottom:14px;">
      <div class="about-section-title">🎒 我的材料</div>
      <div class="ex-mat-grid">
        <div v-for="m in materialList" :key="m.id" class="ex-mat-item">
          <span>{{ m.icon }}</span>
          <span style="font-size:13px;font-weight:700;">{{ m.name }}</span>
          <span style="font-size:12px;color:var(--accent);">×{{ m.count }}</span>
        </div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🔁 可兑换道具</div>
      <div class="ex-grid">
        <div v-for="offer in offers" :key="offer.id" class="ex-card">
          <div class="ex-card-icon">{{ offer.icon }}</div>
          <div class="ex-card-name">{{ offer.name }}</div>
          <div class="ex-card-desc">{{ offer.desc }}</div>
          <div class="ex-card-cost">
            <span v-for="(need, idx) in offer.materials" :key="idx" style="display:flex;align-items:center;gap:2px;">
              <span>{{ matIcon(need.id) }}</span>
              <span>{{ matName(need.id) }}</span>
              <span style="color:var(--accent);">×{{ need.count }}</span>
              <span v-if="idx < offer.materials.length-1" style="color:var(--text-dim);">+</span>
            </span>
          </div>
          <button class="btn btn-primary btn-sm" :disabled="!canExchange(offer)" @click="doExchange(offer)">
            {{ canExchange(offer) ? '兑换' : '材料不足' }}
          </button>
        </div>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPlayerInfo } from '../api/game.js'
import { getCurrentUser } from '../api/auth.js'
import api from '../api/bmob.js'
import BottomNav from '../components/BottomNav.vue'

const playerItems = ref({})

const materials = [
  { id:'dragon_scale', name:'龙之鳞片', icon:'🐉' },
  { id:'holy_feather', name:'神圣羽毛', icon:'🪶' },
  { id:'dark_crystal', name:'暗之结晶', icon:'💎' },
  { id:'nature_orb', name:'自然宝珠', icon:'🔮' },
  { id:'metal_fragment', name:'金属碎片', icon:'⚙️' },
  { id:'ocean_pearl', name:'深海珍珠', icon:'🦪' },
  { id:'wind_essence', name:'风之精华', icon:'💨' },
  { id:'jungle_seed', name:'丛林种子', icon:'🌱' },
  { id:'nightmare_core', name:'噩梦核心', icon:'👁️' },
  { id:'virus_antibody', name:'病毒抗体', icon:'💉' }
]

const offers = [
  { id:'ex_skill', name:'技能卷轴', icon:'📜', desc:'随机学一个通用技能', materials:[{id:'dragon_scale',count:3},{id:'ocean_pearl',count:3},{id:'jungle_seed',count:3}], reward:{id:'skill_scroll',count:1} },
  { id:'ex_mint', name:'性格薄荷', icon:'🌿', desc:'随机改变性格', materials:[{id:'dark_crystal',count:5},{id:'nightmare_core',count:5}], reward:{id:'nature_mint',count:1} },
  { id:'ex_reset', name:'洗点券', icon:'🔁', desc:'重置已分配自由点', materials:[{id:'metal_fragment',count:5},{id:'wind_essence',count:5}], reward:{id:'free_reset',count:1} },
  { id:'ex_name', name:'改名卡', icon:'🏷️', desc:'给数码兽改名', materials:[{id:'holy_feather',count:3},{id:'nature_orb',count:3},{id:'virus_antibody',count:3}], reward:{id:'name_tag',count:1} },
  { id:'ex_bits', name:'Bits', icon:'💰', desc:'兑换5000Bits', materials:[{id:'dragon_scale',count:2},{id:'holy_feather',count:2},{id:'dark_crystal',count:2},{id:'nature_orb',count:2},{id:'metal_fragment',count:2}], reward:{id:'bits',count:5000} },
  { id:'ex_chest', name:'装备宝箱', icon:'🎁', desc:'50%徽章/50%暴龙机', materials:[{id:'dragon_scale',count:4},{id:'dark_crystal',count:4},{id:'metal_fragment',count:4},{id:'wind_essence',count:4}], reward:{id:'equip_chest',count:1}, chest:true }
]

const materialList = materials.map(m => ({...m, count: 0}))

function refreshCounts() {
  for (const m of materialList) {
    m.count = playerItems.value[m.id] || 0
  }
}

function matIcon(id) { return materials.find(m => m.id === id)?.icon || '?' }
function matName(id) { return materials.find(m => m.id === id)?.name || id }

function canExchange(offer) {
  for (const need of offer.materials) {
    if ((playerItems.value[need.id]||0) < need.count) return false
  }
  return true
}

async function doExchange(offer) {
  if (!canExchange(offer)) return
  for (const need of offer.materials) {
    playerItems.value[need.id] = (playerItems.value[need.id]||0) - need.count
  }
  if (offer.reward.id === 'bits') {
    try {
      const info = await getPlayerInfo()
      await api.updateUser(info.objectId, { gold: (info.gold||0) + offer.reward.count, items: JSON.stringify(playerItems.value) })
    } catch(e) { alert('兑换失败'); return }
  } else {
    playerItems.value[offer.reward.id] = (playerItems.value[offer.reward.id]||0) + offer.reward.count
    const user = getCurrentUser()
    if (user) await api.updateUser(user.objectId, { items: JSON.stringify(playerItems.value) })
  }
  refreshCounts()
  alert(`兑换成功！获得 ${offer.name} ×${offer.reward.count}`)
}

onMounted(async () => {
  try {
    const info = await getPlayerInfo()
    let items = {}
    if (info.items) try { items = typeof info.items === 'string' ? JSON.parse(info.items) : info.items } catch(e) {}
    playerItems.value = items
    refreshCounts()
  } catch(e) {}
})
</script>

<style scoped>
.ex-mat-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
.ex-mat-item { display:flex; align-items:center; gap:6px; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:6px 10px; }
.ex-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.ex-card { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:12px; text-align:center; display:flex; flex-direction:column; gap:6px; align-items:center; }
.ex-card-icon { font-size:32px; }
.ex-card-name { font-size:14px; font-weight:700; }
.ex-card-desc { font-size:11px; color:var(--text-dim); }
.ex-card-cost { font-size:10px; color:var(--text-dim); display:flex; flex-wrap:wrap; gap:4px; justify-content:center; }
</style>
