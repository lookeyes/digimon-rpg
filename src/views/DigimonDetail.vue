<template>
<div class="page">
  <button class="back-btn" @click="$router.back()">← 返回</button>
  <div v-if="loading" class="placeholder-page"><div class="icon">⏳</div><h3>加载中...</h3></div>

  <template v-else-if="digimon&&template">
    <div class="detail-icon-area" :style="{ background: `linear-gradient(135deg, ${bgColor}22, transparent)` }">
      <div class="big-icon" v-html="getEvolvedSprite()"></div>
      <div class="detail-name">{{ displayName }}</div>
      <div class="detail-sub">{{ displayStage }} · <span v-for="(f,i) in allFields" :key="f.id">{{ i>0?' + ':'' }}{{ f.emoji }}{{ f.name }}</span> · {{ typeIcon }} {{ displayType }}种</div>
    </div>

    <div class="detail-level-row">
      <div class="level-exp"><span>Lv.{{ digimon.level }}</span><span v-if="digimon.level>=100" style="color:var(--gold);">MAX</span><span v-else>EXP {{ digimon.exp||0 }}/{{ (digimon.level||1)*10 }}</span></div>
      <div class="exp-bar" v-if="digimon.level<100"><div class="exp-fill" :style="{ width:expPercent+'%' }"></div></div>
      <div v-if="digimon.level<100" style="font-size:10px;color:var(--text-dim);text-align:right;margin-top:2px;">升级还需 {{ Math.max(0,(digimon.level||1)*10-(digimon.exp||0)) }} EXP</div>
    </div>

    <div class="detail-stats-grid">
      <div v-for="s in statBars" :key="s.key" class="detail-stat-row"><span class="stat-icon">{{ s.icon }}</span><span class="stat-name">{{ s.label }}</span><div class="stat-bar-wrap"><div class="stat-bar" :style="{ width:s.percent+'%', background:s.color }"></div></div><span class="stat-num">{{ s.display }}</span></div>
    </div>

    <div class="detail-section"><h4>🎒 装备</h4><div class="equip-slots"><div class="equip-slot" :class="{empty:!badgeData}"><div style="font-size:11px;font-weight:700;color:var(--text-dim);margin-bottom:4px;">🏅 徽章</div><template v-if="badgeData"><div style="font-size:13px;font-weight:700;">{{ badgeData.icon }} {{ badgeData.name }}</div><div style="font-size:11px;color:var(--accent);">{{ statLabel(badgeData.stat) }}+{{ badgeData.value }}</div><button class="btn btn-danger btn-sm" @click="unequipBadge">卸下</button></template><div v-else style="font-size:12px;color:var(--text-dim);">空</div></div><div class="equip-slot" :class="{empty:!digiviceData}"><div style="font-size:11px;font-weight:700;color:var(--text-dim);margin-bottom:4px;">📟 暴龙机</div><template v-if="digiviceData"><div style="font-size:13px;font-weight:700;">{{ digiviceData.icon }} {{ digiviceData.name }}</div><div style="font-size:11px;color:var(--accent);"><span v-for="(v,k) in digiviceData.stats" :key="k">{{ statLabel(k) }}+{{ v }} </span></div><button class="btn btn-primary btn-sm" @click="reforgeDigivice">🔁 洗练</button><button class="btn btn-danger btn-sm" @click="unequipDigivice">卸下</button></template><div v-else style="font-size:12px;color:var(--text-dim);">空</div></div></div></div>
<div class="detail-section" v-if="digimon.xVirus" style="border:1px solid #b44dff;background:rgba(180,77,255,0.08);border-radius:8px;padding:10px;"><h4 style="color:#b44dff;">⚠️ X病毒感染</h4><span style="font-size:12px;color:var(--text-dim);">这只数码兽已感染X病毒。下次进化时有50%几率获得X抗体大幅增强，也有50%几率死亡。</span></div>
<div class="detail-section" v-if="natureInfo"><h4>性格</h4><span class="tag" style="background:#ffd70033;border:1px solid #ffd700;color:#ffd700;">🌟 {{ natureInfo.name }}</span><span style="font-size:13px;color:var(--text-dim);">{{ natureInfo.desc }}</span></div>
    <div class="detail-section" v-if="abilityList.length>0"><h4>特性</h4><div v-for="a in abilityList" :key="a.id"><span class="tag" style="background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);">⚡{{ a.name }}</span><span style="font-size:12px;color:var(--text-dim);">{{ a.desc }}</span></div></div>
    <div class="detail-section" v-if="talentList.length>0"><h4>天赋</h4><div v-for="(t,i) in talentList" :key="t.id"><span class="tag" :style="{ background:t.color+'22',border:'1px solid '+t.color,color:t.color }">{{ t.rarityLabel }} {{ t.name }}</span><span v-if="showTalent(t,i)" style="font-size:12px;color:var(--text-dim);">{{ t.desc }}</span><span v-else style="font-size:12px;color:var(--text-dim);">🔒 Lv.10解锁</span></div></div>

    <div class="detail-section">
      <h4>技能（已装备 {{ equippedSkills.length }}/4 · 已学 {{ allLearnedSkills.length }}/10）</h4>
      <div class="skill-slots">
        <div v-for="s in equippedSkills" :key="s.id" class="skill-slot equipped" @click="unequip(s.id)"><div class="skill-name">{{ s.name }}</div><div class="skill-stats"><span v-if="s.power" class="skill-stat">威力{{ s.power }}</span><span v-else class="skill-stat">变化</span><span class="skill-stat" style="color:#4e9fff;">MP{{ s.mpCost }}</span><span v-if="s.accuracy<100" class="skill-stat" style="color:#ff6b35;">命中{{ s.accuracy }}</span></div><div class="skill-desc">{{ s.description }}</div><div class="skill-tags"><span class="tag" :style="skillTagStyle(s)">{{ skillTypeLabel(s.type) }}</span><span class="tag field-tag" :style="skillFieldStyle(s)">{{ getField(s.field)?.emoji }}</span><span class="tag" :style="{ background:isUniqueSkill(s.id)?'#ffd70022':'#8892b022',borderColor:isUniqueSkill(s.id)?'#ffd700':'#8892b0',color:isUniqueSkill(s.id)?'#ffd700':'#8892b0',fontSize:'10px'}">{{ isUniqueSkill(s.id)?'专属':'通用' }}</span></div></div>
        <div v-for="i in (4-equippedSkills.length)" :key="'e'+i" class="skill-slot empty">空</div>
      </div>
      <div v-if="unequippedSkills.length>0" style="margin-top:12px;">
        <h4 style="font-size:13px;color:var(--text-dim);margin-bottom:6px;">未装备技能</h4>
        <div v-for="s in unequippedSkills" :key="s.id" class="skill-slot unequipped" style="position:relative;margin-bottom:6px;" @click="equip(s.id)">
          <div class="skill-name">{{ s.name }}</div>
          <div class="skill-stats"><span v-if="s.power" class="skill-stat">威力{{ s.power }}</span><span v-else class="skill-stat">变化</span><span class="skill-stat" style="color:#4e9fff;">MP{{ s.mpCost }}</span><span v-if="s.accuracy<100" class="skill-stat" style="color:#ff6b35;">命中{{ s.accuracy }}</span></div>
          <div class="skill-desc">{{ s.description }}</div>
          <div class="skill-tags"><span class="tag" :style="skillTagStyle(s)">{{ skillTypeLabel(s.type) }}</span><span class="tag field-tag" :style="skillFieldStyle(s)">{{ getField(s.field)?.emoji }}</span><span class="tag" :style="{ background:isUniqueSkill(s.id)?'#ffd70022':'#8892b022',borderColor:isUniqueSkill(s.id)?'#ffd700':'#8892b0',color:isUniqueSkill(s.id)?'#ffd700':'#8892b0',fontSize:'10px'}">{{ isUniqueSkill(s.id)?'专属':'通用' }}</span></div>
          <button class="btn btn-danger" style="position:absolute;right:4px;top:4px;padding:2px 6px;font-size:10px;width:auto;" @click.stop="doForget(s.id)">遗忘</button>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="digimon.freePoints>0">
      <h4>自由能力点分配（剩余 {{ digimon.freePoints }} 点）</h4>
      <div v-for="s in allocStats" :key="s.key" style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><span style="font-size:14px;">{{ s.icon }}</span><span style="font-size:12px;color:var(--text-dim);width:32px;">{{ s.label }}</span><button class="alloc-btn" @click="adjustPoint(s.key,-1)" :disabled="(tempAlloc[s.key]||0)<=0">−</button><input class="alloc-input" type="number" v-model.number="tempAlloc[s.key]" style="width:56px;"/><button class="alloc-btn" @click="adjustPoint(s.key,1)" :disabled="remaining<=0">+</button></div>
      <button class="btn btn-primary" style="margin-top:10px;" @click="confirmAlloc" :disabled="totalAlloc<=0">确认分配</button>
    </div>
    <div class="detail-section" v-if="totalAllocated>0"><button class="btn btn-danger" style="width:auto;padding:8px 16px;font-size:12px;" @click="resetAlloc">🔄 洗点（返还 {{ totalAllocated }} 点）</button></div>

    <div class="detail-section" v-if="evoOptions.length>0">
      <h4>进化路线</h4>
      <div class="evolution-chain">
        <div class="evolution-step current">{{ displayName }}</div>
        <span v-for="(evo,idx) in evoOptions" :key="evo.name"><span class="evolution-arrow">→</span>
          <div class="evolution-step" :class="{ locked:!canEvolveTo(evo), ready:canEvolveTo(evo) }" @click="!canEvolveTo(evo)&&showEvoRequirement(evo)">
            {{ evo.name }}<div style="font-size:10px;color:var(--text-dim)">{{ evo.method==='level'?'Lv.'+evo.condition+' 进化':'道具进化' }}</div>
            <div v-if="evo.fieldExpRequired" style="font-size:10px;color:var(--orange);"><span v-for="(req,fid) in evo.fieldExpRequired" :key="fid">{{ getField(fid)?.emoji }}{{ getField(fid)?.name }}≥{{ req }}</span></div>
            <button v-if="canEvolveTo(evo)" class="btn btn-primary" style="margin-top:6px;padding:4px 12px;font-size:12px;" @click.stop="doEvolve(idx)">进化</button>
          </div>
        </span>
      </div>
    </div>

    <div class="detail-section"><h4>领域经验</h4><div v-for="f in allFieldExpBars" :key="f.id" style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="font-size:14px;">{{ f.emoji }}</span><span style="font-size:11px;width:60px;" :class="{ 'field-exp-name-owned':f.owned }">{{ f.name }}</span><div style="flex:1;height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden;"><div :style="{ width:f.percent+'%',height:'100%',background:f.color,borderRadius:'3px' }"></div></div><span style="font-size:12px;color:var(--text-dim);width:32px;text-align:right;">{{ f.value }}</span></div></div>

    <div class="detail-section"><h4>描述</h4><p style="font-size:14px;color:var(--text-dim);line-height:1.6;">{{ template.description }}</p></div>
  </template>

  <div v-else class="placeholder-page"><div class="icon">❓</div><h3>数码宝贝不存在</h3></div>
</div>
<BottomNav/>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDigimonDetail, allocatePoints, equipSkill, unequipSkill, forgetSkill, evolveDigimon } from '../api/game.js'
import { getTemplate, getField, getNature, getAbility, getSkill, isUniqueSkill, getEvolutionOptions, calcStats, applyTalents, fields, rerollDigivice } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import api from '../api/bmob.js'
import BottomNav from '../components/BottomNav.vue'

const route=useRoute();const digimon=ref(null);const loading=ref(true)
const template=computed(()=>digimon.value?getTemplate(digimon.value.templateId):null)
const evoData=computed(()=>{try{if(!digimon.value?.evolvedTo)return null;return typeof digimon.value.evolvedTo==='string'?JSON.parse(digimon.value.evolvedTo):digimon.value.evolvedTo}catch(e){return null}})
const displayStage=computed(()=>evoData.value?.stage||template.value?.stage||'?')
const displayType=computed(()=>evoData.value?.type||template.value?.type||'?')
const allFields=computed(()=>{try{const fids=evoData.value?.fields||template.value?.fields||[];return fids.map(fid=>getField(fid)).filter(Boolean)}catch(e){return[]}})
const displayName=computed(()=>evoData.value?.name||digimon.value?.nickname||template.value?.name||'???')
const mainIcon=computed(()=>allFields.value[0]?.emoji||'❓')
const bgColor=computed(()=>allFields.value[0]?.color||'#333')
const typeIcon=computed(()=>({疫苗:'💉',数据:'💾',病毒:'🦠',自由:'🕊️',未知:'❓'}[displayType.value]||''))

function getEvolvedSprite(){if(!digimon.value)return'❓';const en=evoData.value?.name||(digimon.value?.nickname!==template.value?.name?digimon.value.nickname:null);return getDigimonSprite(digimon.value.templateId,180,en)||mainIcon.value}

function parseStats(d){if(!d?.stats)return{};let s=typeof d.stats==='string'?JSON.parse(d.stats):d.stats;let t=d.talents;if(typeof t==='string'){try{t=JSON.parse(t)}catch(e){t=[]}};s=applyTalents(s,t||[],d.level||1);return s}
const s=computed(()=>parseStats(digimon.value))
const maxStatVal=computed(()=>Math.max(s.value.maxHp||1,s.value.atk||1,s.value.def||1,s.value.spAtk||1,s.value.spDef||1,s.value.spd||1))
const statIcons={hp:'❤️',mp:'💎',atk:'⚔️',def:'🛡️',spAtk:'🔥',spDef:'💧',spd:'💨'}
const statColors={hp:'#e94560',mp:'#4e9fff',atk:'#ff6b35',def:'#4ecca3',spAtk:'#e94560',spDef:'#4e9fff',spd:'#ffd700'}
const statBars=computed(()=>!digimon.value?[]:[{key:'hp',icon:statIcons.hp,label:'HP',color:statColors.hp,percent:Math.round((s.value.hp||0)/(s.value.maxHp||1)*100),display:`${s.value.hp||0}/${s.value.maxHp||0}`},{key:'mp',icon:statIcons.mp,label:'MP',color:statColors.mp,percent:Math.round((s.value.mp||0)/(s.value.maxMp||1)*100),display:`${s.value.mp||0}/${s.value.maxMp||0}`},{key:'atk',icon:statIcons.atk,label:'攻击',color:statColors.atk,percent:Math.round((s.value.atk||0)/maxStatVal.value*100),display:s.value.atk||0},{key:'def',icon:statIcons.def,label:'防御',color:statColors.def,percent:Math.round((s.value.def||0)/maxStatVal.value*100),display:s.value.def||0},{key:'spAtk',icon:statIcons.spAtk,label:'特攻',color:statColors.spAtk,percent:Math.round((s.value.spAtk||0)/maxStatVal.value*100),display:s.value.spAtk||0},{key:'spDef',icon:statIcons.spDef,label:'特防',color:statColors.spDef,percent:Math.round((s.value.spDef||0)/maxStatVal.value*100),display:s.value.spDef||0},{key:'spd',icon:statIcons.spd,label:'速度',color:statColors.spd,percent:Math.round((s.value.spd||0)/maxStatVal.value*100),display:s.value.spd||0}])

const natureInfo=computed(()=>{if(!digimon.value?.nature)return null;const n=getNature(digimon.value.nature);if(!n)return null;const sl={hp:'HP',mp:'MP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'};const b=n.boost?`${sl[n.boost]||n.boost}+`:'';const r=n.reduce?`${sl[n.reduce]||n.reduce}−`:'';return{name:n.name,desc:b||r?(b+' / '+r):'均衡'}})
const abilityList=computed(()=>{if(!digimon.value?.abilities)return[];let arr=digimon.value.abilities;if(typeof arr==='string'){try{arr=JSON.parse(arr)}catch(e){return[]}};return arr.map(id=>getAbility(id)).filter(Boolean)})
const talentColors={white:'#aab',blue:'#4e9fff',purple:'#b44dff',red:'#e94560'}

const equipData = computed(() => { const d = digimon.value; if (!d?.equipment) return {}; try { return typeof d.equipment === 'string' ? JSON.parse(d.equipment) : d.equipment } catch(e) { return {} } })
const badgeData = computed(() => equipData.value?.badge||null)
const digiviceData = computed(() => equipData.value?.digivice||null)
function statLabel(s) { return {hp:'HP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度',healBonus:'治疗加成',resist:'抗性',crit:'暴击率',all:'全属性',mp:'MP'}[s]||s }
async function unequipBadge() { if(!digimon.value)return; const eq = {...equipData.value}; delete eq.badge; await api.update('PlayerDigimon',digimon.value.objectId,{equipment:JSON.stringify(eq)}); digimon.value.equipment = JSON.stringify(eq) }
async function unequipDigivice() { if(!digimon.value)return; const eq = {...equipData.value}; delete eq.digivice; await api.update('PlayerDigimon',digimon.value.objectId,{equipment:JSON.stringify(eq)}); digimon.value.equipment = JSON.stringify(eq) }
async function reforgeDigivice() { if(!digimon.value||!digiviceData.value)return; if(!confirm('洗练将重新随机属性值，确定吗？'))return; const newDv = rerollDigivice(digiviceData.value); const eq = {...equipData.value, digivice:newDv}; await api.update('PlayerDigimon',digimon.value.objectId,{equipment:JSON.stringify(eq)}); digimon.value.equipment = JSON.stringify(eq) }
const talentLabels={white:'普通',blue:'稀有',purple:'史诗',red:'传说'}
const talentList=computed(()=>{if(!digimon.value?.talents)return[];let arr=digimon.value.talents;if(typeof arr==='string'){try{arr=JSON.parse(arr)}catch(e){return[]}};return arr.map(t=>({...t,color:talentColors[t.rarity]||'#888',rarityLabel:talentLabels[t.rarity]||t.rarity}))})
function showTalent(t,i){return i===0||(digimon.value?.level||1)>=10}

const expPercent=computed(()=>{if(!digimon.value)return 0;const need=(digimon.value.level||1)*10;return Math.min(100,Math.round(((digimon.value.exp||0)%need)/need*100))})
const fieldExpData=computed(()=>{if(!digimon.value?.fieldExp)return{};if(typeof digimon.value.fieldExp==='string'){try{return JSON.parse(digimon.value.fieldExp)}catch(e){return{}}}return digimon.value.fieldExp})
const allFieldExpBars=computed(()=>{const ownedIds=evoData.value?.fields||template.value?.fields||[];return fields.map(f=>{const value=fieldExpData.value[f.id]||0;return{...f,owned:ownedIds.includes(f.id),value,percent:Math.min(100,value)}})})

const evoOptions=computed(()=>getEvolutionOptions(digimon.value||{}))
function canEvolveTo(evo){if(!digimon.value)return false;if(evo.method==='level'&&digimon.value.level<evo.condition)return false;if(evo.fieldExpRequired){let fexp=digimon.value.fieldExp;if(typeof fexp==='string')try{fexp=JSON.parse(fexp)}catch(e){fexp={}};for(const[fid,req]of Object.entries(evo.fieldExpRequired)){if((fexp[fid]||0)<req)return false}};return true}
function showEvoRequirement(evo){const r=[];if(evo.method==='level'&&digimon.value.level<evo.condition)r.push(`等级不足（需Lv.${evo.condition}，当前Lv.${digimon.value.level}）`);if(evo.fieldExpRequired){let f=digimon.value?.fieldExp;if(typeof f==='string')try{f=JSON.parse(f)}catch(e){f={}};for(const[fid,req]of Object.entries(evo.fieldExpRequired)){if(((f&&f[fid])||0)<req){const fd=getField(fid);r.push(`${fd?.emoji||''}${fd?.name||fid}经验不足（需${req}，当前${(f&&f[fid])||0}）`)}}};alert('无法进化：\n'+r.join('\n'))}
async function doEvolve(idx){if(!confirm('确定进化吗？'))return;try{await evolveDigimon(digimon.value.objectId,idx);const target=evoOptions.value[idx];if(target){digimon.value.nickname=target.name;digimon.value.evolvedTo=JSON.stringify({name:target.name,stage:target.stage,fields:target.fields,type:target.type})};digimon.value=await getDigimonDetail(digimon.value.objectId)}catch(e){alert(e.message);if(e.message.includes('死亡')||e.message.includes('X抗体')){digimon.value=await getDigimonDetail(digimon.value.objectId);if(!digimon.value){router.back();return}}}}

const skillTypeLabel=(t)=>({physical:'物理',special:'特殊',status:'变化'}[t]||t)
const skillTypeColor=(t)=>({physical:'#ff6b35',special:'#4e9fff',status:'#4ecca3'}[t]||'#888')
const skillTagStyle=(s)=>({background:skillTypeColor(s.type)+'22',borderColor:skillTypeColor(s.type),color:skillTypeColor(s.type)})
const skillFieldStyle=(s)=>{const f=getField(s.field);return f?{background:f.color+'22',borderColor:f.color,color:f.color}:{}}
function parseArr(val){if(!val)return[];if(typeof val==='string'){try{return JSON.parse(val)}catch(e){return[]}}return val}
const allLearnedSkills=computed(()=>parseArr(digimon.value?.learnedSkills).map(id=>getSkill(id)).filter(Boolean))
const equippedSkillIds=computed(()=>parseArr(digimon.value?.equippedSkills))
const equippedSkills=computed(()=>equippedSkillIds.value.map(id=>getSkill(id)).filter(Boolean))
const unequippedSkills=computed(()=>allLearnedSkills.value.filter(s=>!equippedSkillIds.value.includes(s.id)))
async function equip(id){try{await equipSkill(digimon.value.objectId,id);digimon.value=await getDigimonDetail(digimon.value.objectId)}catch(e){alert('装备失败: '+e.message)}}
async function unequip(id){try{await unequipSkill(digimon.value.objectId,id);digimon.value=await getDigimonDetail(digimon.value.objectId)}catch(e){alert('卸下失败: '+e.message)}}
async function doForget(id){if(!confirm('确定遗忘此技能？'))return;try{await forgetSkill(digimon.value.objectId,id);digimon.value=await getDigimonDetail(digimon.value.objectId)}catch(e){alert('遗忘失败: '+e.message)}}

const allocStats=['hp','mp','atk','def','spAtk','spDef','spd'].map(k=>({key:k,icon:statIcons[k],label:({hp:'HP',mp:'MP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'}[k])}))
const tempAlloc=reactive({hp:0,mp:0,atk:0,def:0,spAtk:0,spDef:0,spd:0})
const totalAlloc=computed(()=>Object.values(tempAlloc).reduce((a,b)=>a+b,0))
const remaining=computed(()=>(digimon.value?.freePoints||0)-totalAlloc.value)
function adjustPoint(key,delta){const nv=(tempAlloc[key]||0)+delta;if(nv<0)return;const ot=Object.keys(tempAlloc).reduce((s,k)=>s+(k===key?0:(tempAlloc[k]||0)),0);if(ot+nv>(digimon.value?.freePoints||0))return;tempAlloc[key]=nv}
function clampAlloc(key){const val=tempAlloc[key]||0;if(val<0)tempAlloc[key]=0;const mf=(digimon.value?.freePoints||0)-Object.keys(tempAlloc).reduce((s,k)=>s+(k===key?0:(tempAlloc[k]||0)),0);if(val>mf)tempAlloc[key]=mf}
async function confirmAlloc(){if(totalAlloc.value<=0)return;try{await allocatePoints(digimon.value.objectId,{...tempAlloc});digimon.value=await getDigimonDetail(digimon.value.objectId);for(const k of Object.keys(tempAlloc))tempAlloc[k]=0}catch(e){alert('分配失败: '+e.message)}}
const totalAllocated=computed(()=>{if(!digimon.value?.allocatedPoints)return 0;let ap=digimon.value.allocatedPoints;if(typeof ap==='string'){try{ap=JSON.parse(ap)}catch(e){return 0}};return Object.values(ap||{}).reduce((s,v)=>s+(v||0),0)})
async function resetAlloc(){if(totalAllocated.value<=0)return;if(!confirm(`确定洗点？将返还 ${totalAllocated.value} 个自由点`))return;try{const tpl=getTemplate(digimon.value.templateId);const nf=(digimon.value.freePoints||0)+totalAllocated.value;const za={hp:0,mp:0,atk:0,def:0,spAtk:0,spDef:0,spd:0};const stats=calcStats(tpl,digimon.value.level,za,digimon.value.nature);await api.update('PlayerDigimon',digimon.value.objectId,{freePoints:nf,allocatedPoints:JSON.stringify(za),stats:JSON.stringify(stats),hp:stats.maxHp||stats.hp});digimon.value=await getDigimonDetail(digimon.value.objectId);for(const k of Object.keys(tempAlloc))tempAlloc[k]=0}catch(e){alert('洗点失败: '+e.message)}}
onMounted(async()=>{try{digimon.value=await getDigimonDetail(route.params.id)}catch(e){console.error(e)}finally{loading.value=false}})
</script>
