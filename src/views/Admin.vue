<template>
  <div class="page" style="padding-bottom:80px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>🔧</span> 后台管理</div>
    </div>

    <div class="bp-tabs">
      <button v-for="t in tabs" :key="t.key" class="bp-tab" :class="{ active: tab===t.key }" @click="tab=t.key">{{ t.label }}</button>
    </div>

    <!-- 玩家管理 -->
    <template v-if="tab==='players'">
      <div style="margin-bottom:10px;display:flex;gap:8px;">
        <input v-model="playerSearch" placeholder="搜索玩家名/ID" class="alloc-input" style="flex:1;width:auto;">
        <button class="btn btn-primary btn-sm" @click="loadPlayers">搜索</button>
      </div>
      <div v-if="players.length===0" style="text-align:center;padding:20px;color:var(--text-dim);">暂无数据，点击搜索加载</div>
      <div v-for="p in filteredPlayers" :key="p.objectId" class="admin-card" @click="selectedPlayer=p; showPlayerModal=true">
        <div><b>{{ p.username }}</b> <span style="font-size:11px;color:var(--text-dim);">({{ p.playerName||'未设置' }})</span></div>
        <div style="font-size:12px;color:var(--text-dim);">💰 {{ p.gold||0 }} Bits · 📅 {{ formatDate(p.createdAt) }}</div>
      </div>
    </template>

    <!-- 数码兽管理 -->
    <template v-if="tab==='digimon'">
      <div style="margin-bottom:10px;display:flex;gap:8px;">
        <input v-model="digiSearch" placeholder="搜索数码兽名/ID" class="alloc-input" style="flex:1;width:auto;">
        <button class="btn btn-primary btn-sm" @click="loadDigimons">搜索</button>
      </div>
      <div v-if="digimons.length===0" style="text-align:center;padding:20px;color:var(--text-dim);">点击搜索加载</div>
      <div v-for="d in filteredDigimons" :key="d.objectId" class="admin-card" @click="selectedDigi=d; showDigiModal=true">
        <div><b>{{ d.nickname||'???' }}</b> Lv.{{ d.level||1 }}</div>
        <div style="font-size:11px;color:var(--text-dim);">ID: {{ d.objectId?.substring(0,8) }}... · 模板: {{ d.templateId }}</div>
      </div>
    </template>

    <!-- 数码蛋管理 -->
    <template v-if="tab==='eggs'">
      <button class="btn btn-primary btn-sm" @click="loadEggs">加载全部蛋</button>
      <div v-for="e in eggs" :key="e.objectId" class="admin-card">
        <div><b>{{ e.eggTemplateId||'蛋' }}</b> → {{ e.resultTemplateId }}</div>
        <div style="font-size:11px;color:var(--text-dim);">{{ e.status }} · {{ formatDate(e.createdAt) }}</div>
        <button v-if="e.status==='incubating'" class="btn btn-danger btn-sm" style="margin-top:4px;" @click="deleteEgg(e.objectId)">删除</button>
      </div>
    </template>

    <!-- 玩家详情弹窗 -->
    <div v-if="showPlayerModal&&selectedPlayer" class="modal-overlay" @click.self="showPlayerModal=false">
      <div class="dex-modal" style="text-align:left;">
        <h3>{{ selectedPlayer.username }}</h3>
        <div class="dex-modal-stats">
          <div class="dex-stat-row"><span>ID</span><span style="font-size:10px;">{{ selectedPlayer.objectId }}</span></div>
          <div class="dex-stat-row"><span>Bits</span><span>💰 {{ selectedPlayer.gold||0 }}</span></div>
          <div class="dex-stat-row"><span>道具数</span><span>{{ itemCount }}</span></div>
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
    <div v-if="showDigiModal&&selectedDigi" class="modal-overlay" @click.self="showDigiModal=false">
      <div class="dex-modal" style="text-align:left;">
        <h3>{{ selectedDigi.nickname||'???' }}</h3>
        <div class="dex-modal-stats">
          <div class="dex-stat-row"><span>ID</span><span style="font-size:10px;">{{ selectedDigi.objectId }}</span></div>
          <div class="dex-stat-row"><span>模板</span><span>{{ selectedDigi.templateId }}</span></div>
          <div class="dex-stat-row"><span>等级</span><span>Lv.{{ selectedDigi.level||1 }}</span></div>
          <div class="dex-stat-row"><span>EXP</span><span>{{ selectedDigi.exp||0 }}</span></div>
          <div class="dex-stat-row"><span>性格</span><span>{{ selectedDigi.nature||'?' }}</span></div>
          <div class="dex-stat-row"><span>自由点</span><span>{{ selectedDigi.freePoints||0 }}</span></div>
          <div class="dex-stat-row"><span>技能数</span><span>{{ countSkills(selectedDigi) }}</span></div>
        </div>
        <div style="margin-top:8px;">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px;">修改等级</div>
          <div style="display:flex;gap:6px;">
            <input v-model.number="editLevel" type="number" class="alloc-input" style="flex:1;width:auto;" :placeholder="selectedDigi.level">
            <button class="btn btn-primary btn-sm" @click="updateDigiLevel">保存</button>
          </div>
        </div>
        <button class="btn btn-danger btn-sm" style="margin-top:10px;" @click="deleteDigi(selectedDigi.objectId)">删除此数码兽</button>
        <button class="btn btn-secondary btn-sm" style="margin-top:6px;margin-left:6px;" @click="showDigiModal=false">关闭</button>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../api/bmob.js'
import BottomNav from '../components/BottomNav.vue'

const tab = ref('players')
const tabs = [{key:'players',label:'👤 玩家'},{key:'digimon',label:'🐉 数码兽'},{key:'eggs',label:'🥚 数码蛋'}]

const playerSearch = ref(''), players = ref([])
const digiSearch = ref(''), digimons = ref([])
const eggs = ref([])

const showPlayerModal = ref(false), selectedPlayer = ref(null), editGold = ref(0)
const showDigiModal = ref(false), selectedDigi = ref(null), editLevel = ref(0)

const filteredPlayers = computed(() => {
  if (!playerSearch.value) return players.value
  const q = playerSearch.value.toLowerCase()
  return players.value.filter(p => (p.username||'').toLowerCase().includes(q) || (p.objectId||'').includes(q))
})

const filteredDigimons = computed(() => {
  if (!digiSearch.value) return digimons.value
  const q = digiSearch.value.toLowerCase()
  return digimons.value.filter(d => (d.nickname||'').toLowerCase().includes(q) || (d.objectId||'').includes(q) || (d.templateId||'').includes(q))
})

const itemCount = computed(() => {
  if (!selectedPlayer.value?.items) return 0
  try { const items = typeof selectedPlayer.value.items === 'string' ? JSON.parse(selectedPlayer.value.items) : selectedPlayer.value.items; return Object.values(items).reduce((s,v)=>s+v,0) } catch(e) { return 0 }
})

async function loadPlayers() {
  try {
    const res = await api.queryAll('_User', {}, true)
    players.value = (res.results||[]).sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime())
  } catch(e) { alert('加载失败: '+e.message) }
}

async function loadDigimons() {
  try {
    const res = await api.queryAll('PlayerDigimon', {}, true)
    digimons.value = (res.results||[]).sort((a,b) => (b.level||0) - (a.level||0))
  } catch(e) { alert('加载失败: '+e.message) }
}

async function loadEggs() {
  try {
    const res = await api.queryAll('PlayerEgg', {}, true)
    eggs.value = (res.results||[]).sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime())
  } catch(e) { alert('加载失败: '+e.message) }
}

async function updatePlayerGold() {
  if (!selectedPlayer.value) return
  try {
    await api.updateUser(selectedPlayer.value.objectId, { gold: editGold.value }, true)
    selectedPlayer.value.gold = editGold.value
    alert('已更新')
  } catch(e) { alert('更新失败: '+e.message) }
}

async function updateDigiLevel() {
  if (!selectedDigi.value || !editLevel.value) return
  try {
    await api.update('PlayerDigimon', selectedDigi.value.objectId, { level: editLevel.value }, null, true)
    selectedDigi.value.level = editLevel.value
    alert('已更新')
  } catch(e) { alert('更新失败: '+e.message) }
}

async function deleteDigi(id) {
  if (!confirm('确定删除？不可恢复！')) return
  try { await api.delete('PlayerDigimon', id, true); showDigiModal.value = false; alert('已删除'); loadDigimons() } catch(e) { alert('删除失败: '+e.message) }
}

async function deleteEgg(id) {
  if (!confirm('确定删除？')) return
  try { await api.delete('PlayerEgg', id, true); loadEggs() } catch(e) { alert('删除失败: '+e.message) }
}

function countSkills(d) {
  try { const arr = typeof d.learnedSkills === 'string' ? JSON.parse(d.learnedSkills) : (d.learnedSkills||[]); return arr.length } catch(e) { return 0 }
}

function formatDate(d) { if (!d) return ''; return new Date(d).toLocaleDateString('zh-CN') }
</script>

<style scoped>
.admin-card { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:6px; cursor:pointer; transition:all 0.15s; }
.admin-card:active { transform:scale(0.97); }
</style>
