<template>
  <div class="page">
    <div class="page-title"><span>商城</span></div>

    <div class="gacha-resource"><span>💰</span><span>金币 × {{ gold }}</span></div>

    <div class="tabs">
      <div class="tab" :class="{ active: tab==='eggs' }" @click="tab='eggs'">🥚 数码蛋</div>
      <div class="tab" :class="{ active: tab==='items' }" @click="tab='items'">🧪 道具</div>
      <div class="tab" :class="{ active: tab==='mypouch' }" @click="tab='mypouch'">🎒 蛋列表</div>
    </div>

    <template v-if="tab==='eggs'">
      <div class="shop-item-card card card-glow" style="text-align:center;margin-bottom:16px;">
        <div style="font-size:56px;">🥚</div>
        <div style="font-size:18px;font-weight:700;">数码蛋</div>
        <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">孵化后随机获得数码宝贝</div>
        <div style="font-size:20px;font-weight:900;color:var(--gold);margin-bottom:10px;">💰 1,000</div>
        <button class="btn btn-primary" @click="buyEgg" :disabled="buying || gold<1000">
          {{ buying?'购买中...':gold<1000?'金币不足':'购买' }}
        </button>
      </div>
    </template>

    <template v-if="tab==='items'">
      <div class="shop-grid">
        <div v-for="item in shopItems" :key="item.id" class="shop-item-card card" style="text-align:center;">
          <div style="font-size:36px;">{{ item.icon }}</div>
          <div style="font-size:14px;font-weight:700;">{{ item.name }}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">{{ item.desc }}</div>
          <div style="font-size:16px;font-weight:700;color:var(--gold);margin-bottom:8px;">💰 {{ item.price }}</div>
          <button class="btn btn-primary" @click="buyItem(item)" :disabled="buying || gold<item.price" style="padding:8px 16px;font-size:13px;">
            {{ gold<item.price?'金币不足':'购买' }}
          </button>
        </div>
      </div>
    </template>

    <template v-if="tab==='mypouch'">
      <EmptyState v-if="eggs.length===0" icon="🥚" title="还没有数码蛋" description="在商城购买数码蛋"/>
      <div v-else class="egg-list">
        <div v-for="egg in eggs" :key="egg.objectId">
          <EggCard :egg="egg"/>
          <button v-if="egg.status==='ready' || isEggReady(egg)" class="btn btn-primary" style="margin-top:4px;" @click="startHatch(egg)">
            ✨ 孵化
          </button>
        </div>
      </div>
    </template>
  </div>

  <HatchModal :visible="modal.visible" :phase="modal.phase" :digimonData="modal.digimon" :resultTemplateId="modal.templateId" :rarity="modal.rarity" @confirm="modal.visible=false;loadData()" @close="modal.visible=false"/>

  <BottomNav/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/bmob.js'
import { createShopEgg, spendGold, getMyEggs, getPlayerInfo, hatchEgg } from '../api/game.js'
import EggCard from '../components/EggCard.vue'
import EmptyState from '../components/EmptyState.vue'
import HatchModal from '../components/HatchModal.vue'
import BottomNav from '../components/BottomNav.vue'

const gold = ref(0)
const eggs = ref([])
const buying = ref(false)
const tab = ref('eggs')
const modal = ref({ visible:false, phase:'cracking', digimon:null, templateId:'', rarity:'normal' })

const shopItems = [
  { id:'heal_hp', icon:'💚', name:'回复药剂', desc:'恢复1只数码宝贝全部HP', price:200 },
  { id:'heal_mp', icon:'💎', name:'MP回复剂', desc:'恢复1只数码宝贝全部MP', price:200 },
  { id:'antidote', icon:'🌿', name:'解毒草', desc:'治愈中毒状态', price:100 },
  { id:'awakening', icon:'💤', name:'苏醒药', desc:'治愈睡眠状态', price:150 },
  { id:'burn_heal', icon:'🔥', name:'灼烧膏', desc:'治愈灼烧状态', price:100 },
  { id:'ice_heal', icon:'❄️', name:'解冻剂', desc:'治愈冰冻状态', price:100 },
  { id:'para_heal', icon:'⚡', name:'解麻药', desc:'治愈麻痹状态', price:100 },
  { id:'confuse_heal', icon:'🌀', name:'解乱果', desc:'治愈混乱状态', price:100 },
  { id:'full_heal', icon:'🏥', name:'万能药', desc:'治愈全部异常状态', price:500 }
]

function isEggReady(egg) { return egg.status!=='incubating'?false:new Date(egg.hatchReadyAt).getTime()<=Date.now() }

async function loadData() {
  try {
    const info = await getPlayerInfo()
    gold.value = info.gold
    const allEggs = await getMyEggs()
    eggs.value = allEggs.filter(e => e.status!=='hatched').sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
  } catch(e) { console.error(e) }
}

async function buyEgg() {
  if (buying.value || gold.value<1000) return
  buying.value=true
  try { await spendGold(1000); await createShopEgg(); await loadData(); tab.value='mypouch' }
  catch(e) { alert('购买失败: '+e.message) }
  finally { buying.value=false }
}

async function buyItem(item) {
  if (buying.value || gold.value<item.price) return
  buying.value=true
  try {
    await spendGold(item.price)
    const info = await getPlayerInfo()
    let items={}
    try { items = typeof info.items==='string'?JSON.parse(info.items):(info.items||{}) } catch(e) {}
    items[item.id] = (items[item.id]||0)+1
    await api.updateUser(info.objectId, { items: JSON.stringify(items) })
    await loadData()
  } catch(e) { alert('购买失败: '+e.message) }
  finally { buying.value=false }
}

async function startHatch(egg) {
  modal.value = { visible:true, phase:'cracking', digimon:null, templateId:egg.resultTemplateId, rarity:egg.rarity }
  try {
    const digimon = await hatchEgg(egg.objectId)
    await new Promise(r => setTimeout(r, 1500))
    modal.value.phase = 'reveal'
    modal.value.digimon = digimon
  } catch(e) {
    alert('孵化失败: '+e.message)
    modal.value.visible = false
  }
}

onMounted(() => { loadData() })
</script>
