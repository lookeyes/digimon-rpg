<template>
  <div class="page">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
    </div>

    <div v-if="loading" class="placeholder-page">
      <div class="icon">⏳</div><h3>加载中...</h3>
    </div>

    <template v-else-if="digimon && template">
      <div class="detail-icon-area" :style="{ background: `linear-gradient(135deg, ${bgColor}22, transparent)` }">
        <div class="big-icon" v-html="getDigimonSprite(digimon.templateId) || mainIcon"></div>
        <div class="detail-name">{{ digimon.nickname || template.name }}</div>
        <div class="detail-sub">
          {{ template.stage }} ·
          <span v-for="(f, i) in allFields" :key="f.id">
            <span v-if="i>0"> + </span>{{ f.emoji }}{{ f.name }}
          </span> · {{ typeIcon }} {{ template.type }}种
        </div>
      </div>

      <div class="detail-level-row">
        <div class="level-exp">
          <span>Lv.{{ digimon.level }}</span>
          <span>EXP {{ digimon.exp }}</span>
        </div>
        <div class="exp-bar"><div class="exp-fill" :style="{ width: expPercent+'%' }"></div></div>
      </div>

      <div class="detail-stats-grid">
        <div v-for="s in statBars" :key="s.key" class="detail-stat-row">
          <span class="stat-icon">{{ s.icon }}</span>
          <span class="stat-name">{{ s.label }}</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar" :style="{ width: s.percent+'%', background: s.color }"></div>
          </div>
          <span class="stat-num">{{ s.display }}</span>
        </div>
      </div>

      <div class="detail-section" v-if="natureInfo">
        <h4>性格</h4>
        <div class="nature-display">
          <span class="tag" style="background: #ffd70033; border: 1px solid #ffd700; color: #ffd700;">
            🌟 {{ natureInfo.name }}
          </span>
          <span style="font-size:13px; color: var(--text-dim);">
            {{ natureInfo.boost ? natureInfo.boostLabel+'↑' : '' }}
            {{ natureInfo.boost && natureInfo.reduce ? ' / ' : '' }}
            {{ natureInfo.reduce ? natureInfo.reduceLabel+'↓' : '' }}
            <template v-if="!natureInfo.boost">各项均衡</template>
          </span>
        </div>
      </div>

      <div class="detail-section" v-if="abilityList.length > 0">
        <h4>特性</h4>
        <div class="ability-list">
          <div v-for="a in abilityList" :key="a.id" class="ability-item">
            <span class="tag" style="background: var(--accent-glow); border:1px solid var(--accent); color: var(--accent);">
              ⚡{{ a.name }}
            </span>
            <span style="font-size:12px; color: var(--text-dim);">{{ a.desc }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h4>技能（已装备 {{ equippedSkills.length }}/6）</h4>
        <div class="skill-slots">
          <div v-for="s in equippedSkills" :key="s.id" class="skill-slot equipped" @click="unequip(s.id)">
            <div class="skill-name">{{ s.name }}</div>
            <div class="skill-tags">
              <span class="tag" :style="skillTagStyle(s)">{{ skillTypeLabel(s.type) }}</span>
              <span class="tag field-tag" :style="skillFieldStyle(s)">{{ getField(s.field)?.emoji }}</span>
              <span v-if="s.power>0" class="tag" style="background:var(--bg-primary); border:1px solid var(--border);">威力{{ s.power }}</span>
              <span class="tag" style="background:var(--bg-primary); border:1px solid var(--border); color:#4e9fff;">MP{{ s.mpCost }}</span>
            </div>
          </div>
          <div v-for="i in (6 - equippedSkills.length)" :key="'empty'+i" class="skill-slot empty">空</div>
        </div>

        <div v-if="unequippedSkills.length > 0" style="margin-top:12px;">
          <h4 style="font-size:13px; color: var(--text-dim); margin-bottom:6px;">未装备技能</h4>
          <div class="skill-list">
            <div v-for="s in unequippedSkills" :key="s.id" class="skill-slot unequipped" @click="equip(s.id)">
              <div class="skill-name">{{ s.name }}</div>
              <div class="skill-tags">
                <span class="tag" :style="skillTagStyle(s)">{{ skillTypeLabel(s.type) }}</span>
                <span class="tag field-tag" :style="skillFieldStyle(s)">{{ getField(s.field)?.emoji }}</span>
                <span v-if="s.power>0" class="tag" style="background:var(--bg-primary); border:1px solid var(--border);">威力{{ s.power }}</span>
                <span class="tag" style="background:var(--bg-primary); border:1px solid var(--border); color:#4e9fff;">MP{{ s.mpCost }}</span>
              </div>
              <div style="font-size:10px; color: var(--text-dim); margin-top:2px;">{{ s.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section" v-if="digimon.freePoints > 0">
        <h4>自由能力点分配（剩余 {{ digimon.freePoints }} 点）</h4>
        <div class="alloc-grid">
          <div v-for="s in allocStats" :key="s.key" class="alloc-row">
            <span class="alloc-icon">{{ s.icon }}</span>
            <span class="alloc-name">{{ s.label }}</span>
            <span class="alloc-current">+{{ tempAlloc[s.key] || 0 }}</span>
            <button class="alloc-btn" @click="addPoint(s.key)" :disabled="remaining <= 0">+</button>
            <button class="alloc-btn" @click="remPoint(s.key)" :disabled="(tempAlloc[s.key]||0) <= 0">−</button>
          </div>
        </div>
        <button class="btn btn-primary" style="margin-top:10px;" @click="confirmAlloc" :disabled="totalAlloc <= 0">
          确认分配
        </button>
      </div>

      <div class="detail-section" v-if="template.evolutionTree && template.evolutionTree.length > 0">
        <h4>进化路线</h4>
        <div class="evolution-chain">
          <div class="evolution-step current">{{ template.name }}</div>
          <span v-for="evo in template.evolutionTree" :key="evo.name">
            <span class="evolution-arrow">→</span>
            <div class="evolution-step" :class="{ locked: !canEvolveTo(evo) }">
              {{ evo.name }}
              <div style="font-size:10px; color: var(--text-dim)">
                {{ evo.method === 'level' ? 'Lv.'+evo.condition+' 进化' : '道具进化' }}
              </div>
              <div v-if="evo.fieldExpRequired" style="font-size:10px; color: var(--orange);">
                <span v-for="(req,fid) in evo.fieldExpRequired" :key="fid">
                  {{ getField(fid)?.emoji }}{{ getField(fid)?.name }}≥{{ req }}
                </span>
              </div>
            </div>
          </span>
        </div>
      </div>

      <div class="detail-section">
        <h4>领域经验</h4>
        <div class="field-exp-list">
          <div v-for="f in allFieldExpBars" :key="f.id" class="field-exp-row">
            <span class="field-exp-emoji">{{ f.emoji }}</span>
            <span class="field-exp-name" :class="{ owned: f.owned }">{{ f.name }}</span>
            <div class="field-exp-bar-wrap">
              <div class="field-exp-bar" :style="{ width: f.percent+'%', background: f.color }"></div>
            </div>
            <span class="field-exp-num">{{ f.value }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h4>描述</h4>
        <p style="font-size:14px; color: var(--text-dim); line-height:1.6;">{{ template.description }}</p>
      </div>
    </template>

    <div v-else class="placeholder-page">
      <div class="icon">❓</div><h3>数码宝贝不存在</h3>
    </div>
  </div>
  <BottomNav />
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDigimonDetail, allocatePoints, equipSkill, unequipSkill } from '../api/game.js'
import { getTemplate, getField, getNature, getAbility, getSkill, fields, typeIcons } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import { canEvolve } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const route = useRoute()
const digimon = ref(null)
const loading = ref(true)

const statLabels = { hp: 'HP', mp: 'MP', atk: '攻击', def: '防御', spAtk: '特攻', spDef: '特防', spd: '速度' }
const statIcons = { hp: '❤️', mp: '💎', atk: '⚔️', def: '🛡️', spAtk: '🔥', spDef: '💧', spd: '💨' }
const statColors = { hp: '#e94560', mp: '#4e9fff', atk: '#ff6b35', def: '#4ecca3', spAtk: '#e94560', spDef: '#4e9fff', spd: '#ffd700' }

const template = computed(() => digimon.value ? getTemplate(digimon.value.templateId) : null)
const allFields = computed(() => !template.value?.fields ? [] : template.value.fields.map(fid => getField(fid)).filter(Boolean))
const mainIcon = computed(() => allFields.value[0]?.emoji || '❓')
const bgColor = computed(() => allFields.value[0]?.color || '#333')
const typeIcon = computed(() => typeIcons[template.value?.type] || '')

function parseStats(d) {
  if (!d?.stats) return {}
  if (typeof d.stats === 'string') { try { return JSON.parse(d.stats) } catch(e) { return {} } }
  return d.stats
}

const s = computed(() => parseStats(digimon.value))

const maxStatVal = computed(() => Math.max(s.value.maxHp||1, s.value.atk||1, s.value.def||1, s.value.spAtk||1, s.value.spDef||1, s.value.spd||1))

const statBars = computed(() => {
  if (!digimon.value) return []
  return [
    { key:'hp', icon:statIcons.hp, label:'HP', color:statColors.hp, percent:Math.round((s.value.hp||0)/(s.value.maxHp||1)*100), display:`${s.value.hp||0}/${s.value.maxHp||0}` },
    { key:'mp', icon:statIcons.mp, label:'MP', color:statColors.mp, percent:Math.round((s.value.mp||0)/(s.value.maxMp||1)*100), display:`${s.value.mp||0}/${s.value.maxMp||0}` },
    { key:'atk', icon:statIcons.atk, label:'攻击', color:statColors.atk, percent:Math.round((s.value.atk||0)/maxStatVal.value*100), display:s.value.atk||0 },
    { key:'def', icon:statIcons.def, label:'防御', color:statColors.def, percent:Math.round((s.value.def||0)/maxStatVal.value*100), display:s.value.def||0 },
    { key:'spAtk', icon:statIcons.spAtk, label:'特攻', color:statColors.spAtk, percent:Math.round((s.value.spAtk||0)/maxStatVal.value*100), display:s.value.spAtk||0 },
    { key:'spDef', icon:statIcons.spDef, label:'特防', color:statColors.spDef, percent:Math.round((s.value.spDef||0)/maxStatVal.value*100), display:s.value.spDef||0 },
    { key:'spd', icon:statIcons.spd, label:'速度', color:statColors.spd, percent:Math.round((s.value.spd||0)/maxStatVal.value*100), display:s.value.spd||0 }
  ]
})

const natureInfo = computed(() => {
  if (!digimon.value?.nature) return null
  const n = getNature(digimon.value.nature)
  if (!n) return null
  return {
    name: n.name,
    boost: n.boost,
    reduce: n.reduce,
    boostLabel: n.boost ? statLabels[n.boost] : '',
    reduceLabel: n.reduce ? statLabels[n.reduce] : ''
  }
})

const abilityList = computed(() => {
  if (!digimon.value?.abilities) return []
  let arr = digimon.value.abilities
  if (typeof arr === 'string') { try { arr = JSON.parse(arr) } catch(e) { return [] } }
  return arr.map(id => getAbility(id)).filter(Boolean)
})

const skillTypeLabel = (t) => ({ physical: '物理', special: '特殊', status: '变化' })[t] || t
const skillTypeColor = (t) => ({ physical: '#ff6b35', special: '#4e9fff', status: '#4ecca3' })[t] || '#888'
const skillTagStyle = (s) => ({ background: skillTypeColor(s.type)+'22', borderColor: skillTypeColor(s.type), color: skillTypeColor(s.type) })
const skillFieldStyle = (s) => { const f = getField(s.field); return f ? { background: f.color+'22', borderColor: f.color, color: f.color } : {} }

function parseArr(val) { if (!val) return []; if (typeof val === 'string') { try { return JSON.parse(val) } catch(e) { return [] } } return val }

const allLearnedSkills = computed(() => parseArr(digimon.value?.learnedSkills).map(id => getSkill(id)).filter(Boolean))
const equippedSkillIds = computed(() => parseArr(digimon.value?.equippedSkills))
const equippedSkills = computed(() => equippedSkillIds.value.map(id => getSkill(id)).filter(Boolean))
const unequippedSkills = computed(() => allLearnedSkills.value.filter(s => !equippedSkillIds.value.includes(s.id)))

async function equip(id) {
  try {
    await equipSkill(digimon.value.objectId, id)
    digimon.value = await getDigimonDetail(digimon.value.objectId)
  } catch(e) { alert('装备失败: '+e.message) }
}

async function unequip(id) {
  try {
    await unequipSkill(digimon.value.objectId, id)
    digimon.value = await getDigimonDetail(digimon.value.objectId)
  } catch(e) { alert('卸下失败: '+e.message) }
}

const expPercent = computed(() => {
  if (!digimon.value) return 0
  const need = digimon.value.level * 10
  return Math.min(100, Math.round((digimon.value.exp || 0) / need * 100))
})

const fieldExpData = computed(() => {
  if (!digimon.value?.fieldExp) return {}
  if (typeof digimon.value.fieldExp === 'string') {
    try { return JSON.parse(digimon.value.fieldExp) } catch(e) { return {} }
  }
  return digimon.value.fieldExp
})

const allFieldExpBars = computed(() => {
  const ownedIds = template.value?.fields || []
  return fields.map(f => {
    const value = fieldExpData.value[f.id] || 0
    return { ...f, owned: ownedIds.includes(f.id), value, percent: Math.min(100, value) }
  })
})

function canEvolveTo(evo) { return digimon.value ? canEvolve(digimon.value, evo) : false }

const allocStats = ['hp','mp','atk','def','spAtk','spDef','spd'].map(k => ({ key:k, icon:statIcons[k], label:statLabels[k] }))
const tempAlloc = reactive({ hp:0, mp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 })
const totalAlloc = computed(() => Object.values(tempAlloc).reduce((a,b)=>a+b,0))
const remaining = computed(() => (digimon.value?.freePoints || 0) - totalAlloc.value)

function addPoint(k) { if (remaining.value > 0) tempAlloc[k]++ }
function remPoint(k) { if ((tempAlloc[k]||0) > 0) tempAlloc[k]-- }

async function confirmAlloc() {
  if (totalAlloc.value <= 0) return
  try {
    const result = await allocatePoints(digimon.value.objectId, { ...tempAlloc })
    const updated = await getDigimonDetail(digimon.value.objectId)
    digimon.value = updated
    for (const k of Object.keys(tempAlloc)) tempAlloc[k] = 0
  } catch(e) { alert('分配失败: '+e.message) }
}

onMounted(async () => {
  try { digimon.value = await getDigimonDetail(route.params.id) }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
