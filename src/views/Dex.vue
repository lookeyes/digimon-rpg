<template>
  <div class="page" style="padding-bottom:80px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>📖</span> 数码图鉴</div>
    </div>

    <!-- 阶段筛选 -->
    <div class="dex-filter">
      <button v-for="s in stages" :key="s.key" class="dex-filter-btn" :class="{ active: filter===s.key }" @click="filter=s.key">{{ s.label }} ({{ counts[s.key] }})</button>
    </div>

    <!-- 列表 -->
    <div class="dex-grid">
      <div v-for="(d,i) in filteredList" :key="i" class="dex-card" @click="selected=d;showModal=true">
        <div class="dex-card-icon" v-html="spriteFor(d)"></div>
        <div class="dex-card-name">{{ d.name }}</div>
        <div class="dex-card-info">
          <span class="tag" :style="{ background: typeColor(d.type)+'22', color: typeColor(d.type) }">{{ d.type }}</span>
          <span class="tag field-tag" v-for="f in (d.fields||[]).slice(0,2)" :key="f" :style="{ background: fieldColor(f)+'22', borderColor: fieldColor(f), color: fieldColor(f) }">{{ fieldEmoji(f) }}</span>
        </div>
        <div class="dex-card-stage">{{ d.stage }}</div>
      </div>
    </div>

    <div v-if="filteredList.length===0" style="text-align:center;padding:40px;color:var(--text-dim);">暂无数据</div>

    <!-- 详情弹窗 -->
    <div v-if="showModal&&selected" class="modal-overlay" @click.self="showModal=false">
      <div class="dex-modal">
        <div class="dex-modal-icon" v-html="spriteFor(selected,140)"></div>
        <h2>{{ selected.name }}</h2>
        <div class="dex-modal-tags">
          <span class="tag" :style="{ background: typeColor(selected.type)+'33', color: typeColor(selected.type) }">{{ selected.type }}</span>
          <span class="tag" style="background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);">{{ selected.stage }}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:12px;">
          <span v-for="f in (selected.fields||[])" :key="f" class="tag field-tag" :style="{ background: fieldColor(f)+'22', borderColor: fieldColor(f), color: fieldColor(f) }">{{ fieldEmoji(f) }} {{ fieldName(f) }}</span>
        </div>
        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;line-height:1.5;">{{ selected.description||'暂无描述' }}</p>
        <div v-if="selected.baseHp" class="dex-modal-stats">
          <div class="dex-stat-row"><span>HP</span><span>{{ selected.baseHp }}</span></div>
          <div class="dex-stat-row"><span>MP</span><span>{{ selected.baseMp }}</span></div>
          <div class="dex-stat-row"><span>攻击</span><span>{{ selected.baseAtk }}</span></div>
          <div class="dex-stat-row"><span>防御</span><span>{{ selected.baseDef }}</span></div>
          <div class="dex-stat-row"><span>特攻</span><span>{{ selected.baseSpAtk }}</span></div>
          <div class="dex-stat-row"><span>特防</span><span>{{ selected.baseSpDef }}</span></div>
          <div class="dex-stat-row"><span>速度</span><span>{{ selected.baseSpd }}</span></div>
        </div>
        <div v-if="selected.abilities" style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">
          <span v-for="a in selected.abilities" :key="a" class="tag" style="background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);margin:2px;">⚡{{ abilityName(a) }}</span>
        </div>
        <div v-if="evoInfo" style="margin-top:8px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:6px;">进化路线</div>
          <div class="dex-evo-chain"><span v-for="(step, i) in evoChain" :key="i">{{ i>0?' → ':'' }}<span :class="step.name===selected.name?'dex-evo-current':''">{{ step.name }}</span></span></div>
          <div v-if="nextEvos.length>0" style="font-size:12px;color:var(--text-dim);margin-top:6px;">→ {{ nextEvos.map(e=>e.name).join(' / ') }}</div>
        </div>
        <button class="btn btn-primary" style="width:auto;margin-top:16px;padding:8px 24px;" @click="showModal=false">关闭</button>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { digimonTemplates, evoChains, fields, typeColors, abilities } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import BottomNav from '../components/BottomNav.vue'

const filter = ref('all')
const showModal = ref(false)
const selected = ref(null)

const stages = [
  { key:'all', label:'全部' },
  { key:'成长期', label:'成长期' },
  { key:'成熟期', label:'成熟期' },
  { key:'完全体', label:'完全体' },
  { key:'究极体', label:'究极体' }
]

function buildAllDigimon() {
  const all = []
  const seen = new Set()

  // 成长期 (from templates)
  for (const t of digimonTemplates) {
    if (seen.has(t.name)) continue; seen.add(t.name)
    all.push({ ...t, _id: t.id })
  }

  // Collect all forms from evoChains
  for (const [from, targets] of Object.entries(evoChains)) {
    if (!seen.has(from)) { seen.add(from); all.push(buildEntry(from, targets[0]?.stage === '完全体' ? '成熟期' : targets[0]?.stage === '究极体' ? '完全体' : null, null, targets)) }
    for (const tgt of targets) {
      if (!seen.has(tgt.name)) {
        seen.add(tgt.name)
        all.push(buildEntry(tgt.name, tgt.stage, tgt.fields, evoChains[tgt.name]||[]))
      }
    }
  }

  // Sort by stage
  const order = { '成长期':0, '成熟期':1, '完全体':2, '究极体':3 }
  all.sort((a,b) => (order[a.stage]||0) - (order[b.stage]||0) || a.name.localeCompare(b.name))
  return all
}

function buildEntry(name, stage, flds, next) {
  // Try to find a template for this name
  const tpl = digimonTemplates.find(t => t.name === name)
  if (tpl) return { ...tpl, _id: tpl.id }
  // Lookup from evoChains values for type/fields
  for (const [, targets] of Object.entries(evoChains)) {
    const found = targets.find(t => t.name === name)
    if (found) {
      return {
        _id: name, name, stage: stage||found.stage,
        fields: flds||found.fields||[], type: found.type||'自由',
        description: '', baseHp:0, baseMp:0, baseAtk:0, baseDef:0, baseSpAtk:0, baseSpDef:0, baseSpd:0,
        abilities: []
      }
    }
  }
  return { _id:name, name, stage:stage||'自由', fields:flds||[], type:'自由', description:'', baseHp:0,baseMp:0,baseAtk:0,baseDef:0,baseSpAtk:0,baseSpDef:0,baseSpd:0,abilities:[] }
}

const allDigimon = buildAllDigimon()

const counts = computed(() => {
  const c = { all: allDigimon.length, '成长期':0, '成熟期':0, '完全体':0, '究极体':0 }
  for (const d of allDigimon) { if (c[d.stage] !== undefined) c[d.stage]++ }
  return c
})

const filteredList = computed(() => {
  if (filter.value === 'all') return allDigimon
  return allDigimon.filter(d => d.stage === filter.value)
})

function spriteFor(d, size=80) {
  return getDigimonSprite(d._id||d.name, size, d.name) || '❓'
}

function typeColor(t) { return typeColors[t]||'#888' }
function fieldColor(f) { const fd = fields.find(x=>x.id===f); return fd?.color||'#888' }
function fieldEmoji(f) { const fd = fields.find(x=>x.id===f); return fd?.emoji||'?' }
function fieldName(f) { const fd = fields.find(x=>x.id===f); return fd?.name||f }
function abilityName(id) { return abilities[id]?.name||id }

// Evo chain for selected
const evoChain = computed(() => {
  if (!selected.value) return []
  const name = selected.value.name
  // Find the chain
  const chain = [selected.value]
  // Go backwards: who evolves into this?
  let current = name
  // Simple: just show pre-evo from template evolutionTree
  for (const t of digimonTemplates) {
    if (t.evolutionTree) {
      for (const e of t.evolutionTree) {
        if (e.name === current) { chain.unshift(t); current = t.name; break }
      }
    }
  }
  // Also check evoChains
  for (const [from, targets] of Object.entries(evoChains)) {
    for (const tgt of targets) {
      if (tgt.name === current) { chain.unshift({ name:from, stage:tgt.stage==='完全体'?'成熟期':tgt.stage==='究极体'?'完全体':'成熟期' }); current = from; break }
    }
  }
  return chain
})

const nextEvos = computed(() => {
  if (!selected.value) return []
  const name = selected.value.name
  if (evoChains[name]) return evoChains[name]
  // Check template evolutionTree
  for (const t of digimonTemplates) {
    if (t.name === name || t.id === name) return t.evolutionTree||[]
  }
  return []
})
</script>

<style scoped>
.dex-filter { display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
.dex-filter-btn { padding:6px 14px; border-radius:20px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-dim); font-size:12px; font-family:inherit; cursor:pointer; transition:all .2s; }
.dex-filter-btn.active { background:var(--accent); color:#fff; border-color:var(--accent); }
.dex-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.dex-card { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:10px; text-align:center; cursor:pointer; transition:all .15s; position:relative; }
.dex-card:active { transform:scale(.96); }
.dex-card-icon { margin-bottom:6px; }
.dex-card-name { font-size:13px; font-weight:700; margin-bottom:4px; }
.dex-card-info { display:flex; gap:4px; flex-wrap:wrap; justify-content:center; margin-bottom:2px; }
.dex-card-stage { font-size:10px; color:var(--text-dim); position:absolute; top:6px; right:8px; }
.dex-modal { background:var(--bg-card); border-radius:16px; padding:20px; max-width:360px; width:90%; max-height:80vh; overflow-y:auto; text-align:center; }
.dex-modal-icon { margin-bottom:8px; }
.dex-modal-tags { display:flex; gap:6px; justify-content:center; margin-bottom:10px; }
.dex-modal-stats { background:var(--bg-primary); border-radius:8px; padding:10px 14px; margin-bottom:12px; }
.dex-stat-row { display:flex; justify-content:space-between; font-size:12px; padding:2px 0; color:var(--text-dim); }
.dex-evo-chain { font-size:13px; color:var(--text-dim); }
.dex-evo-current { color:var(--accent); font-weight:700; }
</style>
