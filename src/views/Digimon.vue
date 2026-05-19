<template>
<div class="page"><button class="back-btn" style="margin-bottom:10px;" @click="$router.back()">← 返回</button><div class="page-title"><span>数码宝贝</span> 管理</div>
<div class="tabs"><div class="tab" :class="{ active:tab==='digimon' }" @click="tab='digimon'">我的宝贝</div><div class="tab" :class="{ active:tab==='team' }" @click="tab='team'">编队</div><div class="tab" :class="{ active:tab==='eggs' }" @click="tab='eggs'">数码蛋</div></div>

<template v-if="tab==='digimon'"><div v-if="digimons.length>0" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font-size:13px;color:var(--text-dim);">{{ digimons.length }}只</span><button v-if="!releaseMode" class="btn btn-secondary" style="width:auto;padding:6px 14px;font-size:12px;" @click="releaseMode=true;releaseIds=[]">放生</button><div v-else style="display:flex;gap:6px;"><button class="btn btn-secondary" style="width:auto;padding:6px 12px;font-size:12px;" @click="releaseMode=false;releaseIds=[]">取消</button><button class="btn btn-danger" style="width:auto;padding:6px 12px;font-size:12px;" @click="confirmRelease" :disabled="releaseIds.length===0">放生({{releaseIds.length}})</button></div></div><EmptyState v-if="digimons.length===0" icon="🐉" title="还没有数码宝贝" actionLabel="前往商城" @action="$router.push('/shop')"/><div v-else class="digimon-grid"><DigimonCard v-for="d in digimons" :key="d.objectId" :digimon="d" @click="releaseMode?toggleRelease(d.objectId):$router.push(`/digimon/${d.objectId}`)"/></div></template>

<template v-if="tab==='team'"><div class="preset-selector"><button v-for="(p,i) in presets" :key="i" class="preset-tab" :class="{ active:activePreset===i }" @click="switchPreset(i)"><span class="preset-num">编{{i+1}}</span><span class="preset-count">{{ (p.ids||[]).length }}/3</span></button></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><input v-model="presets[activePreset].name" class="preset-name-input" @blur="savePresets" placeholder="编队名称"/><span class="tag" style="background:var(--accent-glow);color:var(--accent);font-size:11px;">出战</span></div><div class="team-slots"><div v-for="(slotId,idx) in 3" :key="idx" class="team-slot" :class="{ empty:!currentIds[idx], selected:selectedSlot===idx }" @click="selectedSlot=selectedSlot===idx?null:idx"><template v-if="currentIds[idx]"><div class="digi-sprite" v-html="getSprite(getSlotDigimon(currentIds[idx])?.templateId,getSlotDigimon(currentIds[idx]))"></div><div class="team-slot-name">{{ getEvoName(getSlotDigimon(currentIds[idx]))||getSlotName(currentIds[idx]) }}</div><div class="team-slot-lv">Lv.{{ getSlotDigimon(currentIds[idx])?.level }}</div><button class="team-slot-remove" @click.stop="removeFromSlot(idx)">✕</button></template><template v-else><div class="team-slot-empty-text">空位 {{ idx+1 }}</div></template></div></div><template v-if="selectedSlot!==null"><div style="font-size:13px;color:var(--accent);margin:12px 0 6px;">选择放入空位{{ selectedSlot+1 }}的数码兽：</div><div v-if="availableDigimons.length===0" style="font-size:12px;color:var(--text-dim);">没有可用的</div><div v-else class="digimon-grid"><div v-for="d in availableDigimons" :key="d.objectId" class="team-select-card" @click="assignToSlot(d)"><div class="digi-sprite" v-html="getSprite(d.templateId,d)"></div><div style="font-size:13px;font-weight:700;">{{ getEvoName(d)||getTplName(d.templateId,d) }}</div><div style="font-size:12px;color:var(--accent);">Lv.{{ d.level }}</div></div></div></template></template>

<template v-if="tab==='eggs'"><EmptyState v-if="eggs.length===0" icon="🥚" title="还没有数码蛋" actionLabel="前往商城" @action="$router.push('/shop')"/><div v-else class="egg-list"><div v-for="egg in eggs" :key="egg.objectId"><EggCard :egg="egg"/><button v-if="egg.status==='ready'||isEggReady(egg)" class="btn btn-primary" style="margin-top:4px;" @click="startHatch(egg)">✨ 孵化</button></div></div></template>
</div>
<HatchModal :visible="modal.visible" :phase="modal.phase" :digimonData="modal.digimon" :resultTemplateId="modal.templateId" :rarity="modal.rarity" @confirm="modal.visible=false;loadData()" @close="modal.visible=false"/>
<BottomNav/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMyDigimons, getMyEggs, hatchEgg, getPlayerInfo } from '../api/game.js'
import { getTemplate, digimonTemplates } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import api from '../api/bmob.js'
import { getCurrentUser } from '../api/auth.js'
import DigimonCard from '../components/DigimonCard.vue'
import EggCard from '../components/EggCard.vue'
import EmptyState from '../components/EmptyState.vue'
import HatchModal from '../components/HatchModal.vue'
import BottomNav from '../components/BottomNav.vue'

const tab=ref('digimon'),digimons=ref([]),eggs=ref([]),modal=ref({visible:false,phase:'cracking',digimon:null,templateId:'',rarity:'normal'})
const presets=ref([{name:'编队1',ids:[]},{name:'编队2',ids:[]},{name:'编队3',ids:[]},{name:'编队4',ids:[]},{name:'编队5',ids:[]}]),activePreset=ref(0),selectedSlot=ref(null)
const releaseMode=ref(false),releaseIds=ref([])
const currentIds=computed(()=>presets.value[activePreset.value]?.ids||[])
const availableDigimons=computed(()=>digimons.value.filter(d=>!currentIds.value.includes(d.objectId)))

function getEvoName(d){if(!d)return null;if(d.evolvedTo){try{const evo=typeof d.evolvedTo==='string'?JSON.parse(d.evolvedTo):d.evolvedTo;if(evo.name)return evo.name}catch(e){}}if(d.nickname&&digimonTemplates.some(t=>t.name===d.nickname))return d.nickname;const t=getTemplate(d.templateId);return t?t.name:null}
function getSprite(tid,d){const en=getEvoName(d);return getDigimonSprite(tid,50,en)||'❓'}
function getTplName(tid,d){const en=getEvoName(d);if(en)return en;const t=getTemplate(tid);return t?t.name:'???'}
function getSlotDigimon(oid){return digimons.value.find(d=>d.objectId===oid)}
function getSlotName(oid){const d=getSlotDigimon(oid);return d?(d.nickname||getTplName(d.templateId,d)):'???'}
function isEggReady(e){return e.status!=='incubating'?false:new Date(e.hatchReadyAt).getTime()<=Date.now()}

async function loadData(){try{digimons.value=await getMyDigimons();digimons.value.sort((a,b)=>b.level-a.level);const ae=await getMyEggs();eggs.value=ae.filter(e=>e.status!=='hatched').sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());await loadPresets()}catch(e){console.error(e)}}
async function loadPresets(){try{const info=await getPlayerInfo();if(info.presets){const p=typeof info.presets==='string'?JSON.parse(info.presets):info.presets;if(Array.isArray(p)&&p.length===5)presets.value=p};if(info.activePreset!==undefined)activePreset.value=info.activePreset}catch(e){}}
async function savePresets(){const u=getCurrentUser();await api.updateUser(u.objectId,{presets:JSON.stringify(presets.value),activePreset:activePreset.value})}
function switchPreset(i){activePreset.value=i;savePresets()}
function assignToSlot(d){if(selectedSlot.value===null)return;const ids=[...presets.value[activePreset.value].ids];ids[selectedSlot.value]=d.objectId;presets.value[activePreset.value].ids=ids;selectedSlot.value=null;savePresets()}
function removeFromSlot(idx){const ids=[...presets.value[activePreset.value].ids];ids.splice(idx,1);presets.value[activePreset.value].ids=ids;savePresets()}
function toggleRelease(oid){if(releaseIds.value.includes(oid))releaseIds.value=releaseIds.value.filter(id=>id!==oid);else releaseIds.value.push(oid)}
async function confirmRelease(){if(releaseIds.value.length===0)return;if(!confirm(`确定放生 ${releaseIds.value.length} 只？不可撤销！`))return;let d=0;for(const oid of releaseIds.value){try{await api.delete('PlayerDigimon',oid);d++}catch(e){console.error(e)}};releaseMode.value=false;releaseIds.value=[];await loadData();if(d>0)alert(`已放生 ${d} 只`)}
async function startHatch(egg){modal.value={visible:true,phase:'cracking',digimon:null,templateId:egg.resultTemplateId,rarity:egg.rarity};try{const d=await hatchEgg(egg.objectId);await new Promise(r=>setTimeout(r,1500));modal.value.phase='reveal';modal.value.digimon=d;await loadPresets();if(presets.value[activePreset.value].ids.length<3){presets.value[activePreset.value].ids.push(d.objectId);await savePresets()}}catch(e){alert('孵化失败: '+e.message);modal.value.visible=false}}
onMounted(()=>{loadData()})
</script>
