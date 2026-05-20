<template>
<div class="battle-page">
  <template v-if="phase==='mapSelect'">
    <div class="page">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title">⚔️ 冒险地图</div>
      <div style="font-size:12px;color:var(--text-dim);text-align:center;margin-bottom:14px;">编队最高 Lv.{{ playerMaxLv }} · 选择地图开始战斗</div>
      <div class="map-tabs">
        <button class="map-tab" :class="{ active: mapTab==='normal' }" @click="mapTab='normal'">
          <span class="map-tab-icon">🌍</span><span>普通地图</span><span class="map-tab-sub">10领域</span>
        </button>
        <button class="map-tab special-tab" :class="{ active: mapTab==='special' }" @click="mapTab='special'">
          <span class="map-tab-icon">☠️</span><span>特殊地图</span><span class="map-tab-sub">X病毒</span>
        </button>
      </div>
      <!-- 普通地图 -->
      <div class="map-list" v-if="mapTab==='normal'">
        <div v-for="f in fields" :key="f.id" class="map-card" :style="{ borderColor: f.color, borderLeftWidth: '4px' }" :class="{ expanded: expandedMap===f.id }" @click="expandedMap = expandedMap===f.id ? null : f.id">
          <div class="map-header">
            <span class="map-emoji">{{ f.emoji }}</span>
            <div style="flex:1;">
              <div class="map-name" :style="{ color: f.color }">{{ f.name }}</div>
              <div class="map-desc">{{ f.desc }}</div>
            </div>
            <span class="map-arrow">{{ expandedMap===f.id?'▲':'▼' }}</span>
          </div>
          <div v-if="expandedMap===f.id" class="map-levels">
            <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">敌方数码兽将匹配你的编队阶段</div>
            <div class="level-grid"><button v-for="lv in getLevelBrackets()" :key="lv" class="level-btn" :class="{ recommended: lv <= playerMaxLv && lv+9 >= playerMaxLv }" @click.stop="startBattle(f.id, lv)">Lv.{{ lv }}-{{ lv+9 }}</button></div>
          </div>
        </div>
      </div>
      <!-- 特殊地图 -->
      <div class="map-list" v-if="mapTab==='special'">
        <div class="map-card special-map" :class="{ expanded: expandedMap==='old_world' }" @click="expandedMap = expandedMap==='old_world' ? null : 'old_world'">
          <div class="map-header">
            <span class="map-emoji">☠️</span>
            <div style="flex:1;">
              <div class="map-name" style="color:#b44dff;">旧世界</div>
              <div class="map-desc">被遗忘的远古战场，潜伏着X病毒...</div>
            </div>
            <span class="map-arrow">{{ expandedMap==='old_world'?'▲':'▼' }}</span>
          </div>
          <div v-if="expandedMap==='old_world'" class="map-levels">
            <div style="font-size:12px;color:#b44dff;margin-bottom:8px;">⚠️ 战斗胜利后1%概率使数码兽感染X病毒</div>
            <div class="level-grid"><button v-for="lv in getLevelBrackets()" :key="lv" class="level-btn special-lv" :class="{ recommended: lv <= playerMaxLv && lv+9 >= playerMaxLv }" @click.stop="startBattle('old_world', lv)">Lv.{{ lv }}-{{ lv+9 }}</button></div>
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  </template>

  <div v-if="phase==='noTeam'" class="page" style="text-align:center;"><button class="back-btn" @click="phase='mapSelect'">← 返回</button><div class="placeholder-page"><div class="icon">⚔️</div><h3>没有可出战的数码宝贝</h3><p>请先在数码宝贝页面编队</p><button class="btn btn-primary" style="width:auto;margin-top:12px;" @click="$router.push('/digimon')">去编队</button></div></div>

  <template v-if="phase==='battle'">
    <div class="battle-top"><button class="back-btn" @click="fleeBattle">逃跑</button><span style="font-size:16px;font-weight:700;">第 {{ engine.turn }} 回合</span><div style="display:flex;gap:4px;"><button class="auto-btn" :class="{ on: engine.autoBattle }" @click="toggleAuto">{{ engine.autoBattle ? '⚡自动' : '手动' }}</button><button class="auto-btn" :class="{ on: autoContinue }" @click="autoContinue=!autoContinue;battlesFought=0" style="font-size:10px;">{{ autoContinue ? '🔄'+battlesFought+'/'+battleLimit : '连战' }}</button></div><span v-if="winStreak>1" style="font-size:12px;color:var(--gold);font-weight:700;">🔥{{ winStreak }}连胜</span></div>
    <div class="battle-field">
      <div class="enemy-row"><div v-for="e in engine.enemyTeam" :key="e.objectId" class="battle-unit" :class="{ dead:!e.alive, target:targeting&&e.alive }" @click="selectTarget(e)"><div class="battle-sprite" v-html="getSprite(e.templateId,e)"></div><div class="battle-name">{{ e.name }}</div><div class="battle-lv">Lv.{{ e.level }}</div><div class="battle-hp-bar"><div class="battle-hp-fill" :style="{ width:hpPct(e)+'%' }"></div></div><div class="battle-hp-text">{{ e.hp }}/{{ e.maxHp }}</div><div v-if="e.status" class="battle-status">{{ statusIcon(e.status) }}</div></div></div>
      <div class="battle-log-area"><div v-for="(msg,i) in logLines" :key="i" class="battle-log-line">{{ msg }}</div></div>
      <div class="player-row"><div v-for="e in engine.playerTeam" :key="e.objectId" class="battle-unit" :class="{ dead:!e.alive, active:engine.currentActor===e&&engine.phase==='playerTurn' }"><div class="battle-sprite" v-html="getSprite(e.templateId,e)"></div><div class="battle-name">{{ e.name }}</div><div class="battle-lv">Lv.{{ e.level }}</div><div class="battle-hp-bar"><div class="battle-hp-fill" :style="{ width:hpPct(e)+'%', background:hpPct(e)>25?'#4ecca3':hpPct(e)>10?'#ffaa00':'#e94560' }"></div></div><div class="battle-hp-text">{{ e.hp }}/{{ e.maxHp }}</div><div class="battle-mp-text">MP {{ e.mp }}/{{ e.maxMp }}</div><div v-if="e.status" class="battle-status">{{ statusIcon(e.status) }}</div><div v-if="hasStages(e)" class="battle-stages">{{ stageText(e) }}</div></div></div>
    </div>
    <div class="battle-actions" v-if="engine.phase==='playerTurn' && engine.currentActor">
      <div v-if="showItems"><div style="font-size:14px;font-weight:700;margin-bottom:8px;">🎒 使用道具</div><div class="item-grid"><button v-for="it in usableItems" :key="it.id" class="item-btn" @click="selectItem(it)"><span>{{ it.icon }}</span><span>{{ it.name }}</span><span style="font-size:10px;color:var(--text-dim);">×{{ it.count }}</span></button></div><button class="btn btn-secondary" style="width:auto;margin-top:8px;padding:6px 14px;font-size:12px;" @click="showItems=false">返回</button></div>
      <div v-else-if="!targeting" class="skill-grid"><button v-for="s in engine.currentActor.skills" :key="s.id" class="skill-btn" :class="{ disabled: s.mpCost > engine.currentActor.mp }" :style="{ borderColor: s.type==='physical'?'#ff6b35':s.type==='special'?'#4e9fff':'#4ecca3' }" @click="selectSkill(s)"><div class="skill-btn-name">{{ s.name }}</div><div class="skill-btn-info"><span v-if="s.power">威力{{ s.power }}</span><span v-else>变化</span><span style="color:#4e9fff;">MP{{ s.mpCost }}</span></div><div class="skill-btn-desc">{{ s.description }}</div></button><button v-if="allSkillsDisabled" class="skill-btn" style="border-color:#e94560;" @click="useStruggle"><div class="skill-btn-name">💢 挣扎</div><div class="skill-btn-info"><span>威力20</span><span style="color:#e94560;">无消耗</span></div></button><div style="display:flex;gap:6px;margin-top:6px;"><button class="btn btn-secondary" style="flex:1;padding:8px;font-size:13px;" @click="showItems=true">🎒 道具</button></div></div>
      <div v-else class="target-select"><div style="text-align:center;margin-bottom:8px;color:var(--accent);">{{ selectedItem ? `使用 ${selectedItem.name} → 选择目标` : `选择目标：${selectedSkill?.name}` }}</div><div style="display:flex;gap:10px;justify-content:center;"><button v-for="e in (selectedItem ? engine.playerTeam : engine.enemyAlive)" :key="e.objectId" class="btn btn-primary" style="width:auto;padding:10px 20px;" @click="selectedItem ? useItemOn(selectedItem, e) : selectTarget(e)">{{ e.name }}</button></div><button class="btn btn-secondary" style="width:auto;margin-top:8px;padding:8px 16px;" @click="targeting=false;selectedSkill=null;selectedItem=null">取消</button></div>
    </div>
  </template>

  <div v-if="phase==='result'" class="page" style="text-align:center;"><div style="font-size:64px;margin:40px 0 20px;">{{ won ? '🎉' : '💀' }}</div><div class="page-title">{{ won ? '战斗胜利！' : '战斗失败...' }}</div><div v-if="winStreak>1" style="color:var(--gold);font-size:14px;margin-bottom:10px;">🔥 连胜 ×{{ winStreak }}</div><div v-if="won" class="card" style="margin-bottom:16px;"><div style="font-size:16px;font-weight:700;margin-bottom:10px;">奖励</div><div>💰 Bits +{{ rewards.gold }}</div><div>⭐ EXP +{{ rewards.expPer }} /只</div><div v-if="levelUps.length>0" style="color:var(--green);margin-top:8px;">🎊 升级！{{ levelUps.join('、') }}</div><div v-if="cardDrops.length>0" style="margin-top:10px;"><div style="font-size:13px;font-weight:700;margin-bottom:6px;">🃏 获得卡牌</div><div v-for="d in cardDrops" :key="d.id" style="font-size:13px;display:flex;align-items:center;gap:6px;justify-content:center;"><span>🃏</span><span>{{ d.name }}</span><span style="color:var(--accent);">×{{ d.count }}</span></div></div>
<div v-if="drops.length>0" style="margin-top:10px;"><div style="font-size:13px;font-weight:700;margin-bottom:6px;">🎁 掉落物品</div><div v-for="d in drops" :key="d.id" style="font-size:13px;display:flex;align-items:center;gap:6px;justify-content:center;"><span>{{ d.icon }}</span><span>{{ d.name }}</span><span style="color:var(--accent);">×{{ d.count }}</span></div></div></div><div v-if="won && autoContinue" class="auto-continue-bar card" style="margin-bottom:12px;text-align:center;"><div style="font-size:13px;color:var(--accent);margin-bottom:4px;">🔄 自动连战中（{{ battlesFought }}/{{ battleLimit }}）</div></div><div v-if="won" class="card" style="margin-bottom:12px;text-align:center;"><div style="font-size:13px;font-weight:700;margin-bottom:8px;">继续连战</div><div style="display:flex;align-items:center;gap:8px;justify-content:center;font-size:12px;color:var(--text-dim);margin-bottom:8px;">次数<button class="alloc-btn" @click="battleLimit=Math.max(2,battleLimit-1)">−</button><input class="alloc-input" type="number" v-model.number="battleLimit" min="2" max="100" style="width:50px;"/><button class="alloc-btn" @click="battleLimit=Math.min(100,battleLimit+1)">+</button></div><button class="btn btn-primary" @click="startContinueBattles">🚀 自动连战 {{ battleLimit }} 次</button></div><button class="btn btn-secondary" style="margin-right:10px;" @click="continueAdventure">返回地图</button><button class="btn btn-secondary" style="margin-top:10px;" @click="stopAdventure">返回主页</button></div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BattleEngine } from '../battle/battleEngine.js'
import { saveBattleResults } from '../battle/battleApi.js'
import { getMyDigimons, getPlayerInfo } from '../api/game.js'
import { getCurrentUser } from '../api/auth.js'
import api from '../api/bmob.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import { fields, xVirusTargets, getTemplate, getCardBonus } from '../data/digimonData.js'
import { STATUS_ICONS } from '../battle/battleEntity.js'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const phase=ref('mapSelect'),expandedMap=ref(null),mapTab=ref('normal'),autoContinue=ref(false),winStreak=ref(0),battleLimit=ref(5),battlesFought=ref(0),finishing=ref(false)
const engine=ref(null),targeting=ref(false),selectedSkill=ref(null),selectedItem=ref(null),showItems=ref(false),playerItems=ref({}),logLines=ref([])
const won=ref(false),rewards=ref({gold:0,expPer:0,fieldExp:{}}),levelUps=ref([]),drops=ref([]),cardDrops=ref([]),playerMaxLv=ref(1),lastMapField=ref(null),lastLevelMin=ref(1)

function getSprite(t,e){return getDigimonSprite(t,60,e?.evolvedName)||'❓'}
function hpPct(e){return Math.round(e.hp/Math.max(1,e.maxHp)*100)}
function statusIcon(s){return STATUS_ICONS[s]||''}
function hasStages(e){return Object.values(e.stages).some(v=>v!==0)}
function stageText(e){const p=[],n={atk:'攻',def:'防',spAtk:'特攻',spDef:'特防',spd:'速'};for(const[k,v]of Object.entries(e.stages)){if(v!==0)p.push(`${n[k]||k}${v>0?'+':''}${v}`)}return p.join(' ')}
function getLevelBrackets(){const b=[],m=Math.max(1,playerMaxLv.value);for(let i=1;i<=m+9;i+=10)b.push(i);return b.slice(0,10)}

const allSkillsDisabled=computed(()=>engine.value?.currentActor?.skills?.every(s=>s.mpCost>engine.value.currentActor.mp)||false)

async function startBattle(mf,lm){
  const info=await getPlayerInfo();let ids=[]
  if(info.presets){const p=typeof info.presets==='string'?JSON.parse(info.presets):info.presets;if(Array.isArray(p)&&p[info.activePreset])ids=p[info.activePreset].ids||[]}
  if(ids.length===0){const all=await getMyDigimons();if(all.length===0){phase.value='noTeam';return};ids=all.slice(0,3).map(d=>d.objectId)}
  const all=await getMyDigimons();const team=ids.map(id=>all.find(d=>d.objectId===id)).filter(Boolean)
  if(team.length===0){phase.value='noTeam';return}
  const pa=engine.value?.autoBattle||false;lastMapField.value=mf;lastLevelMin.value=lm
  if(!autoContinue.value)battlesFought.value=0;finishing.value=false
  let cardBonus=null;try{const info=await getPlayerInfo();let cards={};if(info.cards)cards=typeof info.cards==='string'?JSON.parse(info.cards):info.cards;cardBonus=getCardBonus(cards)}catch(e){}
  engine.value=new BattleEngine(team,onLog,onState,mf,lm,lm+9,cardBonus);engine.value.autoBattle=pa
  phase.value='battle';logLines.value=[];showItems.value=false;selectedItem.value=null;await loadPlayerItems();engine.value.start()
}
function onLog(m){logLines.value.push(m);if(logLines.value.length>20)logLines.value.shift()}
function onState(){if(!engine.value)return;if(engine.value.phase==='ended')finishBattle();targeting.value=false;selectedSkill.value=null;selectedItem.value=null;showItems.value=false}
function selectSkill(s){if(s.mpCost>engine.value.currentActor.mp)return;selectedSkill.value=s;targeting.value=true}
function selectTarget(t){if(!targeting.value||!selectedSkill.value||!t?.alive)return;engine.value.playerAction(selectedSkill.value.id,engine.value.enemyAlive.indexOf(t));targeting.value=false;selectedSkill.value=null}
function useStruggle(){targeting.value=true;selectedSkill.value={id:'struggle',name:'挣扎',type:'physical',field:engine.value.currentActor.fields[0]||'nature_spirits',power:20,accuracy:100,mpCost:0,effects:[],statChanges:null}}
function toggleAuto(){engine.value.autoBattle=!engine.value.autoBattle;if(engine.value.autoBattle&&engine.value.phase==='playerTurn'){targeting.value=false;selectedSkill.value=null;engine.value.phase='animating';setTimeout(()=>engine.value._runAiTurn(),200)}}
function fleeBattle(){engine.value.fled=true;engine.value.phase='ended';engine.value.log('你逃跑了...');engine.value.onStateChange();finishBattle()}
async function finishBattle(){
  if(finishing.value)return;finishing.value=true
  const w=engine.value.playerAlive.length>0&&!engine.value.fled;won.value=w
  if(w){winStreak.value++;const r=engine.value.getRewards();rewards.value=r;drops.value=[];cardDrops.value=[];try{const rs=await saveBattleResults(engine.value.playerTeam,engine.value.enemyTeam,r);levelUps.value=rs.filter(r=>r.levelUps.length>0).map(r=>`${r.name}→Lv.${r.level}`);drops.value=rs._drops||[];cardDrops.value=rs._cards||[]}catch(e){console.error(e)};if(lastMapField.value==='old_world'){try{await checkXVirus()}catch(e){console.error(e)}}}
  else{winStreak.value=0}
  if(w&&autoContinue.value&&battlesFought.value<battleLimit.value){battlesFought.value++;phase.value='result';setTimeout(()=>{if(autoContinue.value&&battlesFought.value<battleLimit.value)startBattle(lastMapField.value,lastLevelMin.value)},1500);return}
  if(battlesFought.value>=battleLimit.value)autoContinue.value=false
  phase.value='result'
}
function continueAdventure(){autoContinue.value=false;battlesFought.value=0;phase.value='mapSelect';logLines.value=[]}
function startContinueBattles(){autoContinue.value=true;battlesFought.value=0;winStreak.value=0;if(engine.value)engine.value.autoBattle=true;startBattle(lastMapField.value,lastLevelMin.value)}
function stopAdventure(){autoContinue.value=false;winStreak.value=0;battlesFought.value=0;router.push('/home')}

const itemDefs={heal_hp:{icon:'💚',name:'回复药剂',effect:'healHp',pct:40},heal_mp:{icon:'💎',name:'MP回复剂',effect:'healMp',pct:35},antidote:{icon:'🌿',name:'解毒草',effect:'cure',status:'poison'},awakening:{icon:'💤',name:'苏醒药',effect:'cure',status:'sleep'},burn_heal:{icon:'🔥',name:'灼烧膏',effect:'cure',status:'burn'},ice_heal:{icon:'❄️',name:'解冻剂',effect:'cure',status:'freeze'},para_heal:{icon:'⚡',name:'解麻药',effect:'cure',status:'paralysis'},confuse_heal:{icon:'🌀',name:'解乱果',effect:'cure',status:'confusion'},full_heal:{icon:'🏥',name:'万能药',effect:'cureAll'},revive:{icon:'✨',name:'复活药',effect:'revive',pct:30},elixir:{icon:'🍀',name:'圣灵药',effect:'elixir',pct:25}}
const usableItems=computed(()=>Object.entries(playerItems.value).filter(([id,c])=>c>0&&itemDefs[id]).map(([id,c])=>({id,...itemDefs[id],count:c})))
function selectItem(it){if(!it||it.count<=0)return;selectedItem.value=it;targeting.value=true;showItems.value=false}
async function useItemOn(it,target){if(!it||(!target.alive&&it.id!=='revive'))return;if(!target.alive&&it.id==='revive'){targeting.value=false;const d=itemDefs[it.id];if(!d)return;playerItems.value[it.id]=Math.max(0,(playerItems.value[it.id]||0)-1);target.alive=true;target.hp=Math.floor(target.maxHp*d.pct/100);target.mp=Math.floor(target.maxMp*0.2);engine.value.log(`${target.name} 复活了！回复${d.pct}%HP！`);engine.value.allEntities.push(target);engine.value._sortTurnOrder();try{const u=getCurrentUser();if(u)await api.updateUser(u.objectId,{items:JSON.stringify(playerItems.value)})}catch(e){};selectedItem.value=null;engine.value._nextTurn();engine.value.onStateChange();return};targeting.value=false;const d=itemDefs[it.id];if(!d)return;playerItems.value[it.id]=Math.max(0,(playerItems.value[it.id]||0)-1);if(d.effect==='healHp'){const amt=Math.floor(target.maxHp*d.pct/100);target.heal(amt);engine.value.log(`${target.name} 回复了 ${amt} HP！`)}else if(d.effect==='healMp'){const amt=Math.floor(target.maxMp*d.pct/100);target.restoreMp(amt);engine.value.log(`${target.name} 回复了 ${amt} MP！`)}else if(d.effect==='elixir'){const hpAmt=Math.floor(target.maxHp*d.pct/100);const mpAmt=Math.floor(target.maxMp*d.pct/100);target.heal(hpAmt);target.restoreMp(mpAmt);engine.value.log(`${target.name} 回复了 ${hpAmt} HP 和 ${mpAmt} MP！`)}else if(d.effect==='cure'&&target.status===d.status){target.status=null;engine.value.log(`${target.name} 的异常状态被治愈了！`)}else if(d.effect==='cureAll'){target.status=null;engine.value.log(`${target.name} 的全部异常状态被治愈了！`)};try{const u=getCurrentUser();if(u)await api.updateUser(u.objectId,{items:JSON.stringify(playerItems.value)})}catch(e){};selectedItem.value=null;engine.value._nextTurn();engine.value.onStateChange()}
async function checkXVirus(){
  for(const e of engine.value.playerTeam){
    const digi = await api.query('PlayerDigimon',{objectId:e.objectId}); const d = (digi.results||[])[0]; if(!d||d.xVirus) continue
    const tpl = getTemplate(d.templateId); const name = d.nickname||tpl?.name||''
    if(xVirusTargets.includes(name)&&Math.random()<0.01){await api.update('PlayerDigimon',d.objectId,{xVirus:true});engine.value.log(`⚠️ ${e.name} 感染了X病毒！`)}
  }
}
async function loadPlayerItems(){try{const info=await getPlayerInfo();let i={};if(info.items)i=typeof info.items==='string'?JSON.parse(info.items):info.items;playerItems.value=i}catch(e){}}
onMounted(async()=>{try{const all=await getMyDigimons();if(all.length>0)playerMaxLv.value=Math.max(...all.map(d=>d.level))}catch(e){}})
</script>
