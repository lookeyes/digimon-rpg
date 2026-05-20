<template>
  <div class="page" style="padding-bottom:80px;">
    <div v-if="!authed" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;">
      <div style="font-size:48px;margin-bottom:16px;">🔐</div>
      <h2>后台管理</h2>
      <input v-model="adminPwd" type="password" placeholder="请输入管理密码" class="alloc-input" style="width:200px;margin-top:16px;" @keyup.enter="doAuth">
      <button class="btn btn-primary" style="width:200px;margin-top:10px;" @click="doAuth">验证</button>
      <p v-if="authError" style="color:var(--red);font-size:12px;margin-top:8px;">{{ authError }}</p>
    </div>

    <template v-if="authed">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>🔧</span> 后台管理</div>
    </div>

    <!-- 总览 -->
    <div class="about-section">
      <div class="about-section-title">📊 数据总览</div>
      <div class="admin-overview">
        <div class="admin-stat" @click="tab='players';loadPlayers()"><div class="admin-stat-num">{{ stats.players }}</div><div class="admin-stat-label">玩家数</div></div>
        <div class="admin-stat" @click="tab='digimon';loadDigimons()"><div class="admin-stat-num">{{ stats.digimons }}</div><div class="admin-stat-label">数码兽</div></div>
        <div class="admin-stat"><div class="admin-stat-num">{{ stats.totalBits }}</div><div class="admin-stat-label">总Bits</div></div>
      </div>
    </div>

    <div class="bp-tabs">
      <button v-for="t in tabs" :key="t.key" class="bp-tab" :class="{ active: tab===t.key }" @click="tab=t.key;onTabChange()">{{ t.label }}</button>
    </div>

    <!-- 玩家 -->
    <template v-if="tab==='players'">
      <div style="margin-bottom:10px;display:flex;gap:8px;">
        <input v-model="playerSearch" placeholder="搜索玩家名/ID" class="alloc-input" style="flex:1;width:auto;" @keyup.enter="loadPlayers">
        <button class="btn btn-primary btn-sm" @click="loadPlayers">搜索</button>
      </div>
      <div v-if="players.length===0" style="text-align:center;padding:20px;color:var(--text-dim);">点击搜索加载</div>
      <div v-for="p in filteredPlayers" :key="p.objectId" class="admin-card" @click="openPlayer(p)">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <b>{{ p.username }}</b>
            <span style="font-size:11px;color:var(--text-dim);margin-left:6px;">{{ p.playerName||'' }}</span>
          </div>
          <span style="font-size:12px;color:var(--gold);">💰 {{ (p.gold||0).toLocaleString() }}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">
          ID: {{ p.objectId?.substring(0,12) }}... · {{ formatDate(p.createdAt) }}
          <span v-if="p.digimonCount!==undefined"> · 🐉 ×{{ p.digimonCount }}</span>
        </div>
      </div>
    </template>

    <!-- 数码兽 -->
    <template v-if="tab==='digimon'">
      <div style="margin-bottom:10px;display:flex;gap:8px;">
        <input v-model="digiSearch" placeholder="搜索名字/模板/ID" class="alloc-input" style="flex:1;width:auto;" @keyup.enter="loadDigimons">
        <button class="btn btn-primary btn-sm" @click="loadDigimons">搜索</button>
      </div>
      <div v-if="digimons.length===0" style="text-align:center;padding:20px;color:var(--text-dim);">点击搜索加载</div>
      <div v-for="d in filteredDigimons" :key="d.objectId" class="admin-card" @click="openDigi(d)">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <b>{{ d.nickname||'???' }}</b>
            <span class="tag" style="font-size:9px;margin-left:6px;" :style="{background:d.stage==='成长期'?'#4ecca322':d.stage==='完全体'?'#b44dff22':'#ff6b3522',color:d.stage==='成长期'?'#4ecca3':d.stage==='完全体'?'#b44dff':'#ff6b35'}">{{ getStage(d) }}</span>
          </div>
          <span style="font-size:13px;font-weight:700;">Lv.{{ d.level||1 }}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">
          模板: {{ d.templateId }} · 性格: {{ d.nature||'?' }} · 自由点: {{ d.freePoints||0 }}
        </div>
      </div>
    </template>

    <!-- 玩家详情弹窗 -->
    <div v-if="showPlayerModal&&playerDetail" class="modal-overlay" @click.self="showPlayerModal=false">
      <div class="dex-modal" style="text-align:left;max-width:400px;">
        <h3>{{ playerDetail.username }}</h3>
        <div class="dex-modal-stats">
          <div class="dex-stat-row"><span>昵称</span><span>{{ playerDetail.playerName||'未设置' }}</span></div>
          <div class="dex-stat-row"><span>Bits</span><span>💰 {{ (playerDetail.gold||0).toLocaleString() }}</span></div>
          <div class="dex-stat-row"><span>道具</span><span>{{ itemCount }} 件</span></div>
          <div class="dex-stat-row"><span>注册时间</span><span>{{ formatDate(playerDetail.createdAt) }}</span></div>
        </div>
        <div v-if="playerItemsList.length>0" style="margin:8px 0;">
          <div style="font-size:12px;font-weight:700;margin-bottom:4px;">道具清单</div>
          <div v-for="(v,k) in playerItemsList" :key="k" style="font-size:11px;color:var(--text-dim);display:flex;justify-content:space-between;"><span>{{ itemName(k) }}</span><span>×{{ v }}</span></div>
        </div>
        <div style="margin-top:8px;">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;">修改Bits</div>
          <div style="display:flex;gap:6px;">
            <input v-model.number="editGold" type="number" class="alloc-input" style="flex:1;width:auto;">
            <button class="btn btn-primary btn-sm" @click="updatePlayerGold">保存</button>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:10px;" @click="showPlayerModal=false">关闭</button>
      </div>
    </div>

    <!-- 数码兽详情弹窗 -->
    <div v-if="showDigiModal&&digiDetail" class="modal-overlay" @click.self="showDigiModal=false">
      <div class="dex-modal" style="text-align:left;max-width:400px;">
        <h3>{{ digiDetail.nickname||'???' }}</h3>
        <div class="dex-modal-stats">
          <div class="dex-stat-row"><span>模板ID</span><span>{{ digiDetail.templateId }}</span></div>
          <div class="dex-stat-row"><span>等级</span><span>Lv.{{ digiDetail.level||1 }}</span></div>
          <div class="dex-stat-row"><span>EXP</span><span>{{ digiDetail.exp||0 }}</span></div>
          <div class="dex-stat-row"><span>性格</span><span>{{ natureLabel(digiDetail.nature) }}</span></div>
          <div class="dex-stat-row"><span>自由点</span><span>{{ digiDetail.freePoints||0 }}</span></div>
          <div class="dex-stat-row"><span>已学技能</span><span>{{ countSkills(digiDetail) }}/10</span></div>
          <div class="dex-stat-row"><span>isTeam</span><span>{{ digiDetail.isTeam?'是':'否' }}</span></div>
        </div>
        <div v-if="digiStats" class="dex-modal-stats" style="margin-top:8px;">
          <div style="font-size:12px;font-weight:700;margin-bottom:4px;">能力值</div>
          <div class="dex-stat-row" v-for="(v,k) in digiStats" :key="k"><span>{{ statName(k) }}</span><span>{{ v }}</span></div>
        </div>
        <div style="margin-top:8px;">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;">修改等级</div>
          <div style="display:flex;gap:6px;">
            <input v-model.number="editLevel" type="number" class="alloc-input" style="flex:1;width:auto;" :placeholder="String(digiDetail.level)">
            <button class="btn btn-primary btn-sm" @click="updateDigiLevel">保存</button>
          </div>
        </div>
        <div style="margin-top:8px;">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;">修改模板</div>
          <div style="display:flex;gap:6px;">
            <input v-model="editTemplateId" placeholder="模板ID" class="alloc-input" style="flex:1;width:auto;">
            <button class="btn btn-primary btn-sm" @click="updateDigiTemplate">保存</button>
          </div>
        </div>
        <button class="btn btn-danger btn-sm" style="margin-top:10px;" @click="deleteDigi(digiDetail.objectId)">删除此数码兽</button>
        <button class="btn btn-secondary btn-sm" style="margin-top:6px;margin-left:6px;" @click="showDigiModal=false">关闭</button>
      </div>
    </div>

    <BottomNav/>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTemplate, getNature } from '../data/digimonData.js'
import api from '../api/bmob.js'
import BottomNav from '../components/BottomNav.vue'

const authed = ref(false), adminPwd = ref(''), authError = ref('')
function doAuth() {
  if (adminPwd.value === 'admin123') { authed.value = true; authError.value = ''; loadStats() }
  else { authError.value = '密码错误'; adminPwd.value = '' }
}

const tab = ref('players')
const tabs = [{key:'players',label:'👤 玩家'},{key:'digimon',label:'🐉 数码兽'}]

const playerSearch = ref(''), players = ref([])
const digiSearch = ref(''), digimons = ref([])
const stats = ref({players:0,digimons:0,totalBits:0})

const showPlayerModal = ref(false), playerDetail = ref(null), editGold = ref(0)
const showDigiModal = ref(false), digiDetail = ref(null), editLevel = ref(0), editTemplateId = ref('')

const filteredPlayers = computed(() => {
  if (!playerSearch.value) return players.value
  const q = playerSearch.value.toLowerCase()
  return players.value.filter(p => (p.username||'').toLowerCase().includes(q) || (p.objectId||'').includes(q) || (p.playerName||'').toLowerCase().includes(q))
})

const filteredDigimons = computed(() => {
  if (!digiSearch.value) return digimons.value
  const q = digiSearch.value.toLowerCase()
  return digimons.value.filter(d => (d.nickname||'').toLowerCase().includes(q) || (d.objectId||'').includes(q) || (d.templateId||'').includes(q))
})

const playerItemsList = computed(() => {
  if (!playerDetail.value?.items) return []
  try { const items = typeof playerDetail.value.items === 'string' ? JSON.parse(playerDetail.value.items) : playerDetail.value.items; return Object.entries(items).filter(([,v])=>v>0) } catch(e) { return [] }
})

const itemCount = computed(() => playerItemsList.value.reduce((s,[,v])=>s+v,0))

const digiStats = computed(() => {
  if (!digiDetail.value?.stats) return null
  try { const s = typeof digiDetail.value.stats === 'string' ? JSON.parse(digiDetail.value.stats) : digiDetail.value.stats; const keys = {maxHp:'HP',maxMp:'MP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'}; const r={}; for(const[k,l] of Object.entries(keys)){if(s[k]!==undefined)r[l]=s[k]}; return r } catch(e) { return null }
})

function getStage(d) {
  const t = getTemplate(d.templateId); if (t) return t.stage
  if (d.evolvedTo) { try { const evo = typeof d.evolvedTo === 'string' ? JSON.parse(d.evolvedTo) : d.evolvedTo; if (evo?.stage) return evo.stage } catch(e) {} }
  return '成长期'
}

function statName(s) { return {maxHp:'HP',maxMp:'MP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'}[s]||s }
function natureLabel(n) { if(!n)return'?';const nt=getNature(n);return nt?nt.name+' ('+(nt.boost?nt.boost+'↑':'')+(nt.reduce?nt.reduce+'↓':'')+')':n }
function itemName(id) {
  const names = {heal_hp:'回复药剂',heal_mp:'MP回复剂',antidote:'解毒草',awakening:'苏醒药',burn_heal:'灼烧膏',ice_heal:'解冻剂',para_heal:'解麻药',confuse_heal:'解乱果',full_heal:'万能药',revive:'复活药',elixir:'圣灵药',name_tag:'改名卡',free_reset:'洗点券',nature_mint:'性格薄荷',skill_scroll:'技能卷轴',dragon_scale:'龙之鳞片',holy_feather:'神圣羽毛',dark_crystal:'暗之结晶',nature_orb:'自然宝珠',metal_fragment:'金属碎片',ocean_pearl:'深海珍珠',wind_essence:'风之精华',jungle_seed:'丛林种子',nightmare_core:'噩梦核心',virus_antibody:'病毒抗体'}
  return names[id]||id
}

async function loadStats() {
  try {
    const [p,d] = await Promise.all([
      api.queryAll('_User', {}, true),
      api.queryAll('PlayerDigimon', {}, true)
    ])
    stats.value.players = (p.results||[]).length
    stats.value.digimons = (d.results||[]).length
    stats.value.totalBits = (p.results||[]).reduce((s,u)=>s+(u.gold||0),0)
  } catch(e) {}
}

async function loadPlayers() {
  try {
    const res = await api.queryAll('_User', {}, true)
    players.value = (res.results||[]).sort((a,b)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime())
    // Get digimon counts
    const dRes = await api.queryAll('PlayerDigimon', {}, true)
    const counts = {}
    for (const d of (dRes.results||[])) { if (d.owner?.objectId) counts[d.owner.objectId] = (counts[d.owner.objectId]||0)+1 }
    for (const p of players.value) { p.digimonCount = counts[p.objectId]||0 }
  } catch(e) { alert('加载失败: '+e.message) }
}

async function loadDigimons() {
  try {
    const res = await api.queryAll('PlayerDigimon', {}, true)
    digimons.value = (res.results||[]).sort((a,b)=>(b.level||0)-(a.level||0))
  } catch(e) { alert('加载失败: '+e.message) }
}

function onTabChange() {
  if (tab.value==='players') loadPlayers()
  else if (tab.value==='digimon') loadDigimons()
}

async function openPlayer(p) {
  try {
    const res = await api.getUser(p.objectId)
    playerDetail.value = res; editGold.value = res.gold||0; showPlayerModal.value = true
  } catch(e) { alert('无法加载玩家详情') }
}

async function openDigi(d) {
  digiDetail.value = d; editLevel.value = d.level||1; editTemplateId.value = d.templateId||''; showDigiModal.value = true
}

async function updatePlayerGold() {
  if (!playerDetail.value) return
  try { await api.updateUser(playerDetail.value.objectId, { gold: editGold.value }, true); playerDetail.value.gold = editGold.value; alert('已更新') } catch(e) { alert('更新失败: '+e.message) }
}

async function updateDigiLevel() {
  if (!digiDetail.value || !editLevel.value) return
  try { await api.update('PlayerDigimon', digiDetail.value.objectId, { level: editLevel.value }, null, true); digiDetail.value.level = editLevel.value; alert('已更新') } catch(e) { alert('更新失败: '+e.message) }
}

async function updateDigiTemplate() {
  if (!digiDetail.value || !editTemplateId.value) return
  try { await api.update('PlayerDigimon', digiDetail.value.objectId, { templateId: editTemplateId.value }, null, true); digiDetail.value.templateId = editTemplateId.value; alert('已更新') } catch(e) { alert('更新失败: '+e.message) }
}

async function deleteDigi(id) {
  if (!confirm('确定删除？不可恢复！')) return
  try { await api.delete('PlayerDigimon', id, true); showDigiModal.value = false; alert('已删除'); loadDigimons() } catch(e) { alert('删除失败: '+e.message) }
}

function countSkills(d) { try { const arr = typeof d.learnedSkills === 'string' ? JSON.parse(d.learnedSkills) : (d.learnedSkills||[]); return arr.length } catch(e) { return 0 } }
function formatDate(d) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN')+' '+new Date(d).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}) }

onMounted(() => { if (authed.value) loadStats() })
</script>

<style scoped>
.admin-card { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:6px; cursor:pointer; transition:all 0.15s; }
.admin-card:active { transform:scale(0.97); }
.admin-overview { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:6px; margin-bottom:14px; }
.admin-stat { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px 6px; text-align:center; cursor:pointer; transition:all 0.15s; }
.admin-stat:active { transform:scale(0.95); }
.admin-stat-num { font-size:20px; font-weight:900; color:var(--accent); }
.admin-stat-label { font-size:10px; color:var(--text-dim); margin-top:2px; }
</style>
