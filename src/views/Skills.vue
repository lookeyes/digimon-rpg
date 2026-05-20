<template>
  <div class="page">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>📜</span> 技能图鉴</div>
    </div>

    <div class="dex-filter">
      <button v-for="f in filters" :key="f.key" class="dex-filter-btn" :class="{ active: activeFilter===f.key }" @click="activeFilter=f.key">{{ f.label }} ({{ counts[f.key] }})</button>
    </div>

    <div v-if="filteredSkills.length===0" style="text-align:center;padding:40px;color:var(--text-dim);">暂无技能</div>

    <div class="skill-list" v-else>
      <div v-for="s in filteredSkills" :key="s.id" class="skill-card" @click="selected=s; showModal=true">
        <div class="skill-card-left">
          <div class="skill-card-name">{{ s.name }}</div>
          <div class="skill-card-tags">
            <span class="tag" :style="skillTagStyle(s.type)">{{ typeLabel(s.type) }}</span>
            <span class="tag field-tag" :style="fieldTagStyle(s.field)">{{ fieldInfo(s.field)?.emoji }}</span>
          </div>
        </div>
        <div class="skill-card-right">
          <span v-if="s.power" style="font-weight:700;">威力{{ s.power }}</span>
          <span v-else style="color:var(--text-dim);">变化</span>
          <span style="color:#4e9fff;font-size:12px;">MP{{ s.mpCost }}</span>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <div v-if="showModal&&selected" class="modal-overlay" @click.self="showModal=false">
      <div class="dex-modal">
        <h2>{{ selected.name }}</h2>
        <div class="dex-modal-tags">
          <span class="tag" :style="skillTagStyle(selected.type)">{{ typeLabel(selected.type) }}</span>
          <span class="tag field-tag" :style="fieldTagStyle(selected.field)">{{ fieldInfo(selected.field)?.emoji }} {{ fieldInfo(selected.field)?.name }}</span>
          <span v-if="selected.accuracy<100" class="tag" style="background:#ff6b3522;border:1px solid #ff6b35;color:#ff6b35;">命中{{ selected.accuracy }}%</span>
          <span v-if="selected.priority" class="tag" style="background:#ffd70022;border:1px solid #ffd700;color:#ffd700;">优先度+{{ selected.priority }}</span>
        </div>
        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;line-height:1.5;">{{ selected.description }}</p>
        <div class="dex-modal-stats">
          <div class="dex-stat-row"><span>威力</span><span>{{ selected.power||'—' }}</span></div>
          <div class="dex-stat-row"><span>命中</span><span>{{ selected.accuracy }}%</span></div>
          <div class="dex-stat-row"><span>MP消耗</span><span style="color:#4e9fff;">{{ selected.mpCost }}</span></div>
          <div class="dex-stat-row"><span>优先度</span><span>{{ selected.priority||0 }}</span></div>
          <div class="dex-stat-row"><span>目标</span><span>{{ targetLabel(selected.target) }}</span></div>
        </div>
        <div v-if="selected.effects&&selected.effects.length>0" style="margin-top:8px;font-size:12px;color:var(--text-dim);">
          <span v-for="ef in selected.effects" :key="ef.type" class="tag" style="background:var(--orange)22;border:1px solid var(--orange);color:var(--orange);margin:2px;">
            {{ effectLabel(ef) }}
          </span>
        </div>
        <div v-if="selected.statChanges" style="margin-top:8px;font-size:12px;">
          <span v-for="sc in selected.statChanges" :key="sc.stat" class="tag" style="background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);margin:2px;">
            {{ statName(sc.stat) }} {{ sc.stages>0?'+':'' }}{{ sc.stages }}
          </span>
        </div>
        <div v-if="selected.healPercent" style="margin-top:8px;font-size:12px;color:var(--green);">
          ✚ 回复最大HP的{{ selected.healPercent }}%
        </div>
        <button class="btn btn-primary" style="width:auto;margin-top:16px;padding:8px 24px;" @click="showModal=false">关闭</button>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { commonSkills, fields } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const activeFilter = ref('all')
const showModal = ref(false)
const selected = ref(null)

const filters = [
  { key: 'all', label: '全部' },
  { key: 'physical', label: '物理' },
  { key: 'special', label: '特殊' },
  { key: 'status', label: '变化' }
]

const counts = computed(() => ({
  all: commonSkills.length,
  physical: commonSkills.filter(s => s.type === 'physical').length,
  special: commonSkills.filter(s => s.type === 'special').length,
  status: commonSkills.filter(s => s.type === 'status').length
}))

const filteredSkills = computed(() => {
  if (activeFilter.value === 'all') return commonSkills
  return commonSkills.filter(s => s.type === activeFilter.value)
})

function fieldInfo(fid) { return fields.find(f => f.id === fid) }
function typeLabel(t) { return { physical: '物理', special: '特殊', status: '变化' }[t] || t }
function targetLabel(t) { return { enemy: '敌方单体', self: '自身', allAllies: '己方全体', allEnemies: '敌方全体' }[t] || t }
function skillTagStyle(t) { return { physical: 'background:#ff6b3522;border:1px solid #ff6b35;color:#ff6b35', special: 'background:#4e9fff22;border:1px solid #4e9fff;color:#4e9fff', status: 'background:#4ecca322;border:1px solid #4ecca3;color:#4ecca3' }[t] || '' }
function fieldTagStyle(fid) { const fd = fields.find(f => f.id === fid); return fd ? `background:${fd.color}22;borderColor:${fd.color};color:${fd.color}` : '' }
function statName(s) { return { atk: '攻击', def: '防御', spAtk: '特攻', spDef: '特防', spd: '速度' }[s] || s }
function effectLabel(ef) {
  const names = { burn: '灼烧', paralysis: '麻痹', poison: '中毒', sleep: '睡眠', freeze: '冰冻', confusion: '混乱' }
  if (ef.type === 'multi_hit') return `多段攻击 ${ef.minHits}-${ef.maxHits}次`
  if (ef.type === 'cureAll') return '治愈全部异常'
  return `${names[ef.type]||ef.type} ${ef.chance}%`
}
</script>

<style scoped>
.skill-list { display:flex; flex-direction:column; gap:6px; }
.skill-card { display:flex; align-items:center; justify-content:space-between; background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:10px 14px; cursor:pointer; transition:all 0.15s; }
.skill-card:active { transform:scale(0.97); }
.skill-card-left { display:flex; flex-direction:column; gap:4px; }
.skill-card-name { font-size:14px; font-weight:700; }
.skill-card-tags { display:flex; gap:4px; }
.skill-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:2px; font-size:13px; }
</style>
