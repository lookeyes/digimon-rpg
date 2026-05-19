<template>
<div class="page"><button class="back-btn" style="margin-bottom:10px;" @click="$router.back()">← 返回</button><div class="page-title"><span>商城</span></div>
<div class="gacha-resource"><span>💰</span><span>金币 × {{ gold }}</span></div>
<div class="tabs"><div class="tab" :class="{ active:tab==='eggs' }" @click="tab='eggs'">🥚 数码蛋</div><div class="tab" :class="{ active:tab==='items' }" @click="tab='items'">🧪 道具</div><div class="tab" :class="{ active:tab==='mypouch' }" @click="tab='mypouch'">🎒 蛋列表</div></div>
<template v-if="tab==='eggs'"><div class="shop-grid"><div v-for="f in fields" :key="f.id" class="shop-item-card card" style="text-align:center;" :style="{ borderColor:f.color }"><div style="font-size:36px;">🥚</div><div style="font-size:13px;font-weight:700;">{{ f.emoji }} {{ f.name }}蛋</div><div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">随机孵化{{ f.name }}领域数码兽</div><div style="font-size:15px;font-weight:700;color:var(--gold);margin-bottom:8px;">💰 1,000</div><button class="btn btn-primary" @click="buyEgg(f.id)" :disabled="buying||gold<1000" style="padding:6px 14px;font-size:12px;">{{ buying?'...':gold<1000?'金币不足':'购买' }}</button></div></div></template>
<template v-if="tab==='items'"><div class="shop-grid"><div v-for="item in shopItems" :key="item.id" class="shop-item-card card" style="text-align:center;"><div style="font-size:36px;">{{ item.icon }}</div><div style="font-size:14px;font-weight:700;">{{ item.name }}</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">{{ item.desc }}</div><div style="font-size:16px;font-weight:700;color:var(--gold);margin-bottom:8px;">💰 {{ item.price }}</div><button class="btn btn-primary" @click="buyItem(item)" :disabled="buying||gold<item.price" style="padding:8px 16px;font-size:13px;">{{ gold<item.price?'金币不足':'购买' }}</button></div></div></template>
<template v-if="tab==='mypouch'"><EmptyState v-if="eggs.length===0" icon="🥚" title="还没有数码蛋"/><div v-else class="egg-list"><div v-for="egg in eggs" :key="egg.objectId"><EggCard :egg="egg"/><button v-if="egg.status==='ready'||isEggReady(egg)" class="btn btn-primary" style="margin-top:4px;" @click="startHatch(egg)">✨ 孵化</button></div></div></template>
</div>
<HatchModal :visible="modal.visible" :phase="modal.phase" :digimonData="modal.digimon" :resultTemplateId="modal.templateId" :rarity="modal.rarity" @confirm="modal.visible=false;loadData()" @close="modal.visible=false"/>
<BottomNav/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/bmob.js'
import { fields } from '../data/digimonData.js'
import { createShopEgg, spendGold, getMyEggs, getPlayerInfo, hatchEgg } from '../api/game.js'
import EggCard from '../components/EggCard.vue'
import EmptyState from '../components/EmptyState.vue'
import HatchModal from '../components/HatchModal.vue'
import BottomNav from '../components/BottomNav.vue'

const gold=ref(0),eggs=ref([]),buying=ref(false),tab=ref('eggs'),modal=ref({visible:false,phase:'cracking',digimon:null,templateId:'',rarity:'normal'})
const shopItems=[{id:'heal_hp',icon:'💚',name:'回复药剂',desc:'恢复全部HP',price:200},{id:'heal_mp',icon:'💎',name:'MP回复剂',desc:'恢复全部MP',price:200},{id:'antidote',icon:'🌿',name:'解毒草',desc:'治愈中毒',price:100},{id:'awakening',icon:'💤',name:'苏醒药',desc:'治愈睡眠',price:150},{id:'burn_heal',icon:'🔥',name:'灼烧膏',desc:'治愈灼烧',price:100},{id:'ice_heal',icon:'❄️',name:'解冻剂',desc:'治愈冰冻',price:100},{id:'para_heal',icon:'⚡',name:'解麻药',desc:'治愈麻痹',price:100},{id:'confuse_heal',icon:'🌀',name:'解乱果',desc:'治愈混乱',price:100},{id:'full_heal',icon:'🏥',name:'万能药',desc:'治愈全部异常',price:500}]

function isEggReady(e){return e.status!=='incubating'?false:new Date(e.hatchReadyAt).getTime()<=Date.now()}
async function loadData(){try{const info=await getPlayerInfo();gold.value=info.gold;const ae=await getMyEggs();eggs.value=ae.filter(e=>e.status!=='hatched').sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())}catch(e){console.error(e)}}
async function buyEgg(fid){if(buying.value||gold.value<1000)return;buying.value=true;try{await spendGold(1000);await createShopEgg(fid);await loadData();tab.value='mypouch'}catch(e){alert('购买失败: '+e.message)}finally{buying.value=false}}
async function buyItem(item){if(buying.value||gold.value<item.price)return;buying.value=true;try{await spendGold(item.price);const info=await getPlayerInfo();let i={};try{i=typeof info.items==='string'?JSON.parse(info.items):(info.items||{})}catch(e){};i[item.id]=(i[item.id]||0)+1;await api.updateUser(info.objectId,{items:JSON.stringify(i)});await loadData()}catch(e){alert('购买失败: '+e.message)}finally{buying.value=false}}
async function startHatch(egg){modal.value={visible:true,phase:'cracking',digimon:null,templateId:egg.resultTemplateId,rarity:egg.rarity};try{const d=await hatchEgg(egg.objectId);await new Promise(r=>setTimeout(r,1500));modal.value.phase='reveal';modal.value.digimon=d}catch(e){alert('孵化失败: '+e.message);modal.value.visible=false}}
onMounted(()=>{loadData()})
</script>
