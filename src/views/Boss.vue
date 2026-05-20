<template>
  <div class="page" style="padding-bottom:80px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>👑</span> BOSS挑战</div>
    </div>

    <template v-if="phase==='select'">
      <div class="boss-list">
        <div v-for="boss in bosses" :key="boss.id" class="boss-card" :style="{borderColor:boss.color}" @click="startBoss(boss)">
          <div class="boss-icon">{{ boss.icon }}</div>
          <div class="boss-name">{{ boss.name }}</div>
          <div class="boss-desc">{{ boss.desc }}</div>
          <div class="boss-info">
            <span class="tag" :style="{background:boss.color+'22',color:boss.color}">{{ boss.stage }}</span>
            <span class="tag" style="background:#e9456022;color:#e94560;">Lv.{{ boss.level }}</span>
          </div>
          <div class="boss-rewards">🎁 {{ boss.rewardBits }} Bits · 材料×3~5 · EXP×2</div>
        </div>
      </div>
    </template>

    <div v-if="phase==='noTeam'" class="page" style="text-align:center;">
      <button class="back-btn" @click="phase='select'">← 返回</button>
      <div class="placeholder-page"><div class="icon">⚔️</div><h3>没有可出战的数码宝贝</h3><p>请先在数码宝贝页面编队</p><button class="btn btn-primary btn-inline" style="margin-top:12px;" @click="$router.push('/digimon')">去编队</button></div>
    </div>

    <template v-if="phase==='battle'">
      <div class="battle-top"><button class="back-btn" @click="fleeBoss">逃跑</button><span style="font-size:16px;font-weight:700;">BOSS战 · 第 {{ engine.turn }} 回合</span><span style="font-size:12px;color:var(--gold);">👑 {{ currentBoss?.name }}</span></div>
      <div class="battle-field">
        <div class="enemy-row" style="justify-content:center;"><div v-for="e in engine.enemyTeam" :key="e.objectId" class="battle-unit" :class="{ dead:!e.alive }" style="transform:scale(1.15);"><div class="battle-sprite" v-html="getSprite(e.templateId,e)"></div><div class="battle-name">{{ e.name }}</div><div class="battle-lv">Lv.{{ e.level }} 👑</div><div class="battle-hp-bar"><div class="battle-hp-fill" :style="{ width:hpPct(e)+'%' }"></div></div><div class="battle-hp-text">{{ e.hp }}/{{ e.maxHp }}</div></div></div>
        <div class="battle-log-area"><div v-for="(msg,i) in logLines" :key="i" class="battle-log-line">{{ msg }}</div></div>
        <div class="player-row"><div v-for="e in engine.playerTeam" :key="e.objectId" class="battle-unit" :class="{ dead:!e.alive, active:engine.currentActor===e&&engine.phase==='playerTurn' }"><div class="battle-sprite" v-html="getSprite(e.templateId,e)"></div><div class="battle-name">{{ e.name }}</div><div class="battle-lv">Lv.{{ e.level }}</div><div class="battle-hp-bar"><div class="battle-hp-fill" :style="{ width:hpPct(e)+'%', background:hpPct(e)>25?'#4ecca3':hpPct(e)>10?'#ffaa00':'#e94560' }"></div></div><div class="battle-hp-text">{{ e.hp }}/{{ e.maxHp }}</div><div class="battle-mp-text">MP {{ e.mp }}/{{ e.maxMp }}</div></div></div>
      </div>
      <div class="battle-actions" v-if="engine.phase==='playerTurn' && engine.currentActor">
        <div v-if="showItems"><div style="font-size:14px;font-weight:700;margin-bottom:8px;">🎒 使用道具</div><div class="item-grid"><button v-for="it in usableItems" :key="it.id" class="item-btn" @click="selectItem(it)"><span>{{ it.icon }}</span><span>{{ it.name }}</span><span style="font-size:10px;color:var(--text-dim);">×{{ it.count }}</span></button></div><button class="btn btn-secondary btn-sm btn-inline" style="margin-top:8px;" @click="showItems=false">返回</button></div>
        <div v-else-if="!targeting" class="skill-grid"><button v-for="s in engine.currentActor.skills" :key="s.id" class="skill-btn" :class="{ disabled: s.mpCost > engine.currentActor.mp }" :style="{ borderColor: s.type==='physical'?'#ff6b35':s.type==='special'?'#4e9fff':'#4ecca3' }" @click="selectSkill(s)"><div class="skill-btn-name">{{ s.name }}</div><div class="skill-btn-info"><span v-if="s.power">威力{{ s.power }}</span><span v-else>变化</span><span style="color:#4e9fff;">MP{{ s.mpCost }}</span></div><div class="skill-btn-desc">{{ s.description }}</div></button><button v-if="allSkillsDisabled" class="skill-btn" style="border-color:#e94560;" @click="useStruggle"><div class="skill-btn-name">💢 挣扎</div><div class="skill-btn-info"><span>威力20</span><span style="color:#e94560;">无消耗</span></div></button><div style="display:flex;gap:6px;margin-top:6px;"><button class="btn btn-secondary btn-sm" style="flex:1;" @click="showItems=true">🎒 道具</button></div></div>
        <div v-else class="target-select"><div style="text-align:center;margin-bottom:8px;color:var(--accent);">{{ selectedItem ? `使用 ${selectedItem.name}` : `选择目标：${selectedSkill?.name}` }}</div><div style="display:flex;gap:10px;justify-content:center;"><button v-for="e in (selectedItem ? engine.playerTeam : engine.enemyAlive)" :key="e.objectId" class="btn btn-primary btn-inline" @click="selectedItem ? useItemOn(selectedItem, e) : doAction(e)">{{ e.name }}</button></div><button class="btn btn-secondary btn-sm btn-inline" style="margin-top:8px;" @click="targeting=false;selectedSkill=null;selectedItem=null">取消</button></div>
      </div>
    </template>

    <div v-if="phase==='result'" class="page" style="text-align:center;">
      <div style="font-size:64px;margin:40px 0 20px;">{{ won ? '🎉' : '💀' }}</div>
      <div class="page-title">{{ won ? 'BOSS讨伐成功！' : '挑战失败...' }}</div>
      <div v-if="won" class="card" style="margin-bottom:16px;">
        <div style="font-size:16px;font-weight:700;margin-bottom:10px;">奖励</div>
        <div>💰 Bits +{{ rewards.gold }}</div>
        <div>⭐ EXP +{{ rewards.expPer }} /只</div>
        <div v-if="levelUps.length>0" style="color:var(--green);margin-top:8px;">🎊 升级！{{ levelUps.join('、') }}</div>
        <div v-if="drops.length>0" style="margin-top:10px;"><div style="font-size:13px;font-weight:700;margin-bottom:6px;">🎁 掉落物品</div><div v-for="d in drops" :key="d.id" style="font-size:13px;display:flex;align-items:center;gap:6px;justify-content:center;"><span>{{ d.icon }}</span><span>{{ d.name }}</span><span style="color:var(--accent);">×{{ d.count }}</span></div></div>
      </div>
      <button class="btn btn-secondary btn-inline" style="margin-right:10px;" @click="backToSelect">返回选择</button>
      <button class="btn btn-secondary btn-inline" style="margin-top:10px;" @click="$router.push('/home')">返回主页</button>
    </div>

    <BottomNav/>
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
import { digimonTemplates, getTemplate, getCardBonus } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const phase = ref('select')
const engine = ref(null)
const currentBoss = ref(null)
const targeting = ref(false), selectedSkill = ref(null), selectedItem = ref(null), showItems = ref(false)
const playerItems = ref({}), logLines = ref([])
const won = ref(false), rewards = ref({gold:0,expPer:0}), levelUps = ref([]), drops = ref([]), finishing = ref(false)

const bosses = [
  { id:'boss_dragon', name:'黑暗战斗暴龙兽', icon:'🐉', stage:'究极体', level:55, color:'#e94560', desc:'被黑暗力量侵蚀的最强龙战士，漆黑的盖亚之力能毁灭一切。', rewardBits:3000, templateId:'black_war_greymon', hpMult:3.0, statMult:1.5 },
  { id:'boss_angel', name:'究极天使兽', icon:'👼', stage:'究极体', level:55, color:'#ffd700', desc:'最高位的炽天使，七重天堂之光审判世间一切罪恶。', rewardBits:3000, templateId:'seraphimon', hpMult:2.8, statMult:1.4 },
  { id:'boss_knight', name:'红莲骑士兽', icon:'⚔️', stage:'究极体', level:55, color:'#ff4444', desc:'传说中的圣骑士，手中圣枪贯穿一切邪恶。', rewardBits:3000, templateId:'dukemon', hpMult:3.0, statMult:1.5 },
  { id:'boss_virus', name:'怨毒吸血魔兽', icon:'🦇', stage:'究极体', level:55, color:'#b44dff', desc:'吸收无数数据进化而成的恐怖魔王，噩梦收割者。', rewardBits:3000, templateId:'venom_vamdemon', hpMult:2.8, statMult:1.4 },
  { id:'boss_phoenix', name:'凤凰兽', icon:'🔥', stage:'究极体', level:55, color:'#ff6b35', desc:'拥有不死之身的神圣凤凰，涅槃之火生生不息。', rewardBits:3000, templateId:'phoenixmon', hpMult:2.5, statMult:1.3 },
  { id:'boss_rose', name:'蔷薇兽', icon:'🌹', stage:'究极体', level:55, color:'#4ecca3', desc:'美丽而危险的蔷薇女王，荆棘之鞭与禁忌诱惑。', rewardBits:3000, templateId:'rosemon', hpMult:2.5, statMult:1.3 }
]

function getSprite(t,e){return getDigimonSprite(t,60,e?.evolvedName)||'❓'}
function hpPct(e){return Math.round(e.hp/Math.max(1,e.maxHp)*100)}

const allSkillsDisabled = computed(() => engine.value?.currentActor?.skills?.every(s=>s.mpCost>engine.value.currentActor.mp))

function onLog(m){logLines.value.push(m);if(logLines.value.length>20)logLines.value.shift()}
function onState(){if(!engine.value)return;if(engine.value.phase==='ended')finishBattle();targeting.value=false;selectedSkill.value=null;selectedItem.value=null;showItems.value=false}

async function startBoss(boss) {
  const info = await getPlayerInfo(); let ids = []
  if (info.presets) { const p = typeof info.presets === 'string' ? JSON.parse(info.presets) : info.presets; if (Array.isArray(p) && p[info.activePreset]) ids = p[info.activePreset].ids || [] }
  if (ids.length === 0) { const all = await getMyDigimons(); if (all.length === 0) { phase.value = 'noTeam'; return }; ids = all.slice(0, 3).map(d => d.objectId) }
  const all = await getMyDigimons(); const team = ids.map(id => all.find(d => d.objectId === id)).filter(Boolean)
  if (team.length === 0) { phase.value = 'noTeam'; return }
  currentBoss.value = boss; finishing.value = false; logLines.value = []
  let cardBonus=null;try{const info2=await getPlayerInfo();let cards={};if(info2.cards)cards=typeof info2.cards==='string'?JSON.parse(info2.cards):info2.cards;cardBonus=getCardBonus(cards)}catch(e){}
  engine.value = new BattleEngine(team, onLog, onState, null, boss.level - 2, boss.level, cardBonus)
  // Override enemy with single boss
  const tpl = getTemplate(boss.templateId) || digimonTemplates.find(t => t.stage === '究极体')
  if (tpl && engine.value.enemyTeam.length > 0) {
    const bossEntity = engine.value.enemyTeam[0]
    bossEntity.name = tpl.name; bossEntity.templateId = tpl.id; bossEntity.evolvedName = tpl.name; bossEntity.fields = tpl.fields||[]; bossEntity.type = tpl.type||'自由'
    const hp = Math.floor((tpl.baseHp + 3.0 * (boss.level-1)) * boss.hpMult)
    bossEntity.maxHp = hp; bossEntity.hp = hp
    bossEntity.atk = Math.floor(bossEntity.atk * boss.statMult)
    bossEntity.def = Math.floor(bossEntity.def * boss.statMult)
    bossEntity.spAtk = Math.floor(bossEntity.spAtk * boss.statMult)
    bossEntity.spDef = Math.floor(bossEntity.spDef * boss.statMult)
    bossEntity.spd = Math.floor(bossEntity.spd * boss.statMult)
    bossEntity.maxMp = Math.floor(bossEntity.maxMp * 1.5)
    bossEntity.mp = bossEntity.maxMp
    engine.value.enemyTeam = [bossEntity]
    engine.value.allEntities = [...engine.value.playerTeam, bossEntity]
    engine.value._sortTurnOrder()
  }
  phase.value = 'battle'; showItems.value = false; selectedItem.value = null; await loadPlayerItems()
  engine.value.start()
}

function selectSkill(s){if(s.mpCost>engine.value.currentActor.mp)return;selectedSkill.value=s;targeting.value=true}
function doAction(t){if(!targeting.value||!selectedSkill.value||!t?.alive)return;engine.value.playerAction(selectedSkill.value.id,engine.value.enemyAlive.indexOf(t));targeting.value=false;selectedSkill.value=null}
function useStruggle(){targeting.value=true;selectedSkill.value={id:'struggle',name:'挣扎',type:'physical',field:engine.value.currentActor.fields[0]||'nature_spirits',power:20,accuracy:100,mpCost:0,effects:[],statChanges:null}}
function fleeBoss(){engine.value.fled=true;engine.value.phase='ended';engine.value.log('你逃跑了...');engine.value.onStateChange();finishBattle()}

async function finishBattle() {
  if (finishing.value) return; finishing.value = true
  const w = engine.value.playerAlive.length > 0 && !engine.value.fled; won.value = w
  if (w) {
    const r = engine.value.getRewards()
    r.gold = currentBoss.value.rewardBits
    r.expPer = Math.floor(r.expPer * 2)
    rewards.value = r; drops.value = []
    try {
      const rs = await saveBattleResults(engine.value.playerTeam, engine.value.enemyTeam, r)
      levelUps.value = rs.filter(r => r.levelUps.length > 0).map(r => `${r.name}→Lv.${r.level}`)
      drops.value = rs._drops || []
      // Bonus boss drops
      const bonusCount = 3 + Math.floor(Math.random() * 3)
      const materialIds = ['dragon_scale','holy_feather','dark_crystal','nature_orb','metal_fragment','ocean_pearl','wind_essence','jungle_seed','nightmare_core','virus_antibody']
      const itemIcons = {'dragon_scale':'🐉','holy_feather':'🪶','dark_crystal':'💎','nature_orb':'🔮','metal_fragment':'⚙️','ocean_pearl':'🦪','wind_essence':'💨','jungle_seed':'🌱','nightmare_core':'👁️','virus_antibody':'💉'}
      const itemNames = {'dragon_scale':'龙之鳞片','holy_feather':'神圣羽毛','dark_crystal':'暗之结晶','nature_orb':'自然宝珠','metal_fragment':'金属碎片','ocean_pearl':'深海珍珠','wind_essence':'风之精华','jungle_seed':'丛林种子','nightmare_core':'噩梦核心','virus_antibody':'病毒抗体'}
      const bonusDrops = []
      for (let i = 0; i < bonusCount; i++) {
        const mid = materialIds[Math.floor(Math.random() * materialIds.length)]
        const ex = bonusDrops.find(d => d.id === mid)
        if (ex) ex.count++; else bonusDrops.push({ id: mid, name: itemNames[mid], icon: itemIcons[mid], count: 1 })
      }
      // Save bonus drops
      try {
        const user = getCurrentUser(); if (user) {
          const info = await getPlayerInfo(); let items = {}
          try { items = typeof info.items === 'string' ? JSON.parse(info.items) : (info.items || {}) } catch(e) {}
          for (const d of bonusDrops) { items[d.id] = (items[d.id] || 0) + d.count }
          await api.updateUser(user.objectId, { items: JSON.stringify(items) })
          drops.value = [...drops.value, ...bonusDrops]
          // Merge duplicate ids
          const merged = []
          for (const d of drops.value) {
            const ex = merged.find(m => m.id === d.id)
            if (ex) ex.count += d.count; else merged.push({...d})
          }
          drops.value = merged
        }
      } catch(e) {}
    } catch(e) { console.error(e) }
  }
  phase.value = 'result'
}

function backToSelect() { phase.value = 'select'; logLines.value = [] }

const shopItemDefs = {heal_hp:{icon:'💚',name:'回复药剂',effect:'healHp',pct:40},heal_mp:{icon:'💎',name:'MP回复剂',effect:'healMp',pct:35},antidote:{icon:'🌿',name:'解毒草',effect:'cure',status:'poison'},awakening:{icon:'💤',name:'苏醒药',effect:'cure',status:'sleep'},burn_heal:{icon:'🔥',name:'灼烧膏',effect:'cure',status:'burn'},ice_heal:{icon:'❄️',name:'解冻剂',effect:'cure',status:'freeze'},para_heal:{icon:'⚡',name:'解麻药',effect:'cure',status:'paralysis'},confuse_heal:{icon:'🌀',name:'解乱果',effect:'cure',status:'confusion'},full_heal:{icon:'🏥',name:'万能药',effect:'cureAll'},revive:{icon:'✨',name:'复活药',effect:'revive',pct:30},elixir:{icon:'🍀',name:'圣灵药',effect:'elixir',pct:25}}
const usableItems = computed(() => Object.entries(playerItems.value).filter(([id,c]) => c > 0 && shopItemDefs[id]).map(([id,c]) => ({id,...shopItemDefs[id],count:c})))
function selectItem(it){if(!it||it.count<=0)return;selectedItem.value=it;targeting.value=true;showItems.value=false}
async function useItemOn(it,target){
  if(!it||(!target.alive&&it.id!=='revive'))return
  if(!target.alive&&it.id==='revive'){
    targeting.value=false;const d=shopItemDefs[it.id];if(!d)return;playerItems.value[it.id]=Math.max(0,(playerItems.value[it.id]||0)-1)
    target.alive=true;target.hp=Math.floor(target.maxHp*d.pct/100);target.mp=Math.floor(target.maxMp*0.2)
    engine.value.log(`${target.name} 复活了！`);engine.value.allEntities.push(target);engine.value._sortTurnOrder()
    try{const u=getCurrentUser();if(u)await api.updateUser(u.objectId,{items:JSON.stringify(playerItems.value)})}catch(e){}
    selectedItem.value=null;engine.value._nextTurn();engine.value.onStateChange();return
  }
  targeting.value=false;const d=shopItemDefs[it.id];if(!d)return;playerItems.value[it.id]=Math.max(0,(playerItems.value[it.id]||0)-1)
  if(d.effect==='healHp'){const amt=Math.floor(target.maxHp*d.pct/100);target.heal(amt);engine.value.log(`${target.name} 回复了 ${amt} HP！`)}
  else if(d.effect==='healMp'){const amt=Math.floor(target.maxMp*d.pct/100);target.restoreMp(amt);engine.value.log(`${target.name} 回复了 ${amt} MP！`)}
  else if(d.effect==='elixir'){const h=Math.floor(target.maxHp*d.pct/100);const m=Math.floor(target.maxMp*d.pct/100);target.heal(h);target.restoreMp(m);engine.value.log(`${target.name} 回复了 ${h} HP 和 ${m} MP！`)}
  else if(d.effect==='cure'&&target.status===d.status){target.status=null;engine.value.log(`${target.name} 的异常状态被治愈了！`)}
  else if(d.effect==='cureAll'){target.status=null;engine.value.log(`${target.name} 的全部异常状态被治愈了！`)}
  try{const u=getCurrentUser();if(u)await api.updateUser(u.objectId,{items:JSON.stringify(playerItems.value)})}catch(e){}
  selectedItem.value=null;engine.value._nextTurn();engine.value.onStateChange()
}
async function loadPlayerItems(){try{const info=await getPlayerInfo();let i={};if(info.items)i=typeof info.items==='string'?JSON.parse(info.items):info.items;playerItems.value=i}catch(e){}}
</script>

<style scoped>
.boss-list { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.boss-card { background:var(--bg-card); border:2px solid var(--border); border-radius:12px; padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; }
.boss-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.4); }
.boss-card:active { transform:scale(0.96); }
.boss-icon { font-size:48px; margin-bottom:8px; }
.boss-name { font-size:15px; font-weight:700; margin-bottom:4px; }
.boss-desc { font-size:11px; color:var(--text-dim); margin-bottom:8px; line-height:1.4; }
.boss-info { display:flex; gap:6px; justify-content:center; margin-bottom:6px; }
.boss-rewards { font-size:10px; color:var(--gold); }
.battle-top { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-card); border-bottom:2px solid var(--border); gap:8px; }
.battle-field { padding:8px; }
.enemy-row, .player-row { display:flex; gap:6px; justify-content:center; margin:4px 0; }
.battle-unit { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:6px; text-align:center; min-width:90px; }
.battle-unit.dead { opacity:0.3; }
.battle-unit.active { border-color:var(--accent); box-shadow:0 0 10px var(--accent-glow); }
.battle-sprite { width:60px; height:60px; margin:0 auto; }
.battle-name { font-size:11px; font-weight:700; }
.battle-lv { font-size:10px; color:var(--text-dim); }
.battle-hp-bar { height:4px; background:var(--border); border-radius:2px; margin:4px 0; overflow:hidden; }
.battle-hp-fill { height:100%; background:#e94560; transition:width 0.3s; }
.battle-hp-text { font-size:9px; color:var(--text-dim); }
.battle-mp-text { font-size:9px; color:#4e9fff; }
.battle-log-area { flex:1; margin:8px 0; padding:8px 12px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border); overflow-y:auto; min-height:60px; max-height:120px; }
.battle-log-line { font-size:12px; color:var(--text); padding:2px 0; }
.battle-actions { padding:10px; background:var(--bg-card); border-top:2px solid var(--border); }
.skill-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; }
.skill-btn { padding:8px 6px; border:2px solid; border-radius:8px; background:var(--bg-primary); color:var(--text); cursor:pointer; font-family:inherit; transition:all 0.15s; font-size:11px; }
.skill-btn:active { transform:scale(0.94); }
.skill-btn.disabled { opacity:0.4; }
.skill-btn-name { font-size:12px; font-weight:700; margin-bottom:2px; }
.skill-btn-info { font-size:10px; color:var(--text-dim); display:flex; gap:6px; }
.skill-btn-desc { font-size:9px; color:var(--text-dim); margin-top:3px; line-height:1.3; }
.target-select { padding:8px; }
.item-grid { display:flex; flex-wrap:wrap; gap:6px; }
.item-btn { padding:8px 12px; border:1px solid var(--gold); border-radius:8px; background:var(--bg-primary); color:var(--text); cursor:pointer; font-family:inherit; font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; }
</style>
