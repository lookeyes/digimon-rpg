<template>
  <div class="page" style="display:flex; flex-direction:column; align-items:center; text-align:center;">
    <button class="back-btn" style="align-self:flex-start; margin-bottom:16px;" @click="$router.back()">← 返回</button>

    <div v-if="loading" class="placeholder-page">
      <div class="icon">⏳</div><h3>加载中...</h3>
    </div>

    <template v-else-if="hatching">
      <div class="hatch-egg-area">
        <div class="hatch-egg-big crack">🥚</div>
        <p class="hatch-countdown">{{ countdownText }}</p>
        <div class="hatch-progress-bar">
          <div class="hatch-progress-fill" :style="{ width: progressPercent+'%' }"></div>
        </div>
      </div>
    </template>

    <template v-else-if="reveal && digimonData && template">
      <div class="det-icon-area" :style="{ background: `linear-gradient(135deg, ${mainColor}22, transparent)`, width:'100%', borderRadius:'12px', padding:'32px 24px', marginBottom:'16px' }">
        <div style="font-size:80px;">{{ mainIcon }}</div>
        <div style="font-size:28px; font-weight:900; margin-top:8px;">{{ digimonData.nickname || template.name }}</div>
        <div style="font-size:14px; color:var(--text-dim);">
          {{ template.stage }} ·
          <span v-for="(f,i) in allFields" :key="f.id">{{ i>0?' + ':'' }}{{ f.emoji }}{{ f.name }}</span>
          · {{ typeIcon }} {{ template.type }}
        </div>
      </div>

      <div class="det-stats-grid" style="width:100%; margin-bottom:12px;">
        <div v-for="s in statBars" :key="s.key" class="det-stat-row">
          <span style="width:24px;font-size:14px;">{{ s.icon }}</span>
          <span style="width:36px;font-size:11px;color:var(--text-dim);font-weight:600;">{{ s.label }}</span>
          <div style="flex:1;height:8px;background:var(--bg-primary);border-radius:4px;overflow:hidden;">
            <div :style="{ width:s.percent+'%', height:'100%', borderRadius:'4px', background:s.color }"></div>
          </div>
          <span style="width:40px;text-align:right;font-size:12px;font-weight:700;">{{ s.display }}</span>
        </div>
      </div>

      <div v-if="natureInfo" style="font-size:13px;color:var(--gold);margin-bottom:8px;">🌟 性格：{{ natureInfo.name }} {{ natureInfo.desc }}</div>
      <div v-if="abilityText" style="font-size:12px;color:var(--accent);margin-bottom:8px;">⚡ {{ abilityText }}</div>
      <div v-if="initialSkills.length>0" style="font-size:12px;color:var(--text-dim);margin-bottom:16px;">
        初始技能：
        <span v-for="s in initialSkills" :key="s.id" class="tag" style="background:var(--accent-glow);border:1px solid var(--accent);color:var(--accent);margin:2px;">{{ s.name }}</span>
      </div>

      <button class="btn btn-primary" @click="goToDetail">查看详情 →</button>
    </template>
  </div>
  <BottomNav />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyEggs, hatchEgg } from '../api/game.js'
import { getTemplate, getField, getNature, getAbility, getSkill, typeIcons } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const route = useRoute()
const router = useRouter()
const eggId = route.params.eggId
const loading = ref(true)
const hatching = ref(true)
const reveal = ref(false)
const digimonData = ref(null)
const countdownText = ref('孵化中...')
const progressPercent = ref(0)
let timer = null
let hatchTimer = null

const template = computed(() => digimonData.value ? getTemplate(digimonData.value.templateId) : null)
const allFields = computed(() => !template.value?.fields ? [] : template.value.fields.map(fid => getField(fid)).filter(Boolean))
const mainIcon = computed(() => allFields.value[0]?.emoji || '❓')
const mainColor = computed(() => allFields.value[0]?.color || '#333')
const typeIcon = computed(() => typeIcons[template.value?.type] || '')

function parseStats(d) { if (!d?.stats) return {}; if (typeof d.stats==='string') try{return JSON.parse(d.stats)}catch(e){return{}} return d.stats }
const s = computed(() => parseStats(digimonData.value))
const maxS = computed(() => Math.max(s.value.maxHp||1,s.value.atk||1,s.value.def||1,s.value.spAtk||1,s.value.spDef||1,s.value.spd||1))
const statBars = computed(() => !digimonData.value ? [] : [
  { icon:'❤️',label:'HP',color:'#e94560',percent:Math.round((s.value.hp||0)/(s.value.maxHp||1)*100),display:`${s.value.hp||0}/${s.value.maxHp||0}` },
  { icon:'💎',label:'MP',color:'#4e9fff',percent:Math.round((s.value.mp||0)/(s.value.maxMp||1)*100),display:`${s.value.mp||0}/${s.value.maxMp||0}` },
  { icon:'⚔️',label:'攻击',color:'#ff6b35',percent:Math.round((s.value.atk||0)/maxS.value*100),display:s.value.atk||0 },
  { icon:'🛡️',label:'防御',color:'#4ecca3',percent:Math.round((s.value.def||0)/maxS.value*100),display:s.value.def||0 },
  { icon:'🔥',label:'特攻',color:'#e94560',percent:Math.round((s.value.spAtk||0)/maxS.value*100),display:s.value.spAtk||0 },
  { icon:'💧',label:'特防',color:'#4e9fff',percent:Math.round((s.value.spDef||0)/maxS.value*100),display:s.value.spDef||0 },
  { icon:'💨',label:'速度',color:'#ffd700',percent:Math.round((s.value.spd||0)/maxS.value*100),display:s.value.spd||0 }
])

const natureInfo = computed(() => {
  if (!digimonData.value?.nature) return null
  const n = getNature(digimonData.value.nature)
  if (!n) return null
  const desc = n.boost ? `${n.boost}+ / ${n.reduce}−` : '均衡'
  return { name:n.name, desc }
})

const abilityText = computed(() => {
  if (!digimonData.value?.abilities) return ''
  let arr = digimonData.value.abilities
  if (typeof arr==='string') try{arr=JSON.parse(arr)}catch(e){return''}
  return arr.map(id=>getAbility(id)).filter(Boolean).map(a=>a.name).join('  ')
})

const initialSkills = computed(() => {
  if (!digimonData.value?.equippedSkills) return []
  let arr = digimonData.value.equippedSkills
  if (typeof arr==='string') try{arr=JSON.parse(arr)}catch(e){return[]}
  return arr.map(id=>getSkill(id)).filter(Boolean)
})

function goToDetail() {
  if (digimonData.value?.objectId) {
    router.push(`/digimon/${digimonData.value.objectId}`)
  }
}

onMounted(async () => {
  try {
    const eggs = await getMyEggs()
    const egg = eggs.find(e => e.objectId === eggId)
    if (!egg) { hatching.value = false; loading.value = false; alert('蛋不存在'); return }

    if (egg.status === 'hatched') {
      hatching.value = false; loading.value = false; alert('已孵化过了'); return
    }

    countdownText.value = '孵化中...'
    progressPercent.value = 0
    const steps = 5
    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, 300))
      progressPercent.value = i * (100 / steps)
    }

    countdownText.value = '正在孵化...'
    await new Promise(r => setTimeout(r, 800))

    const digimon = await hatchEgg(eggId)
    if (digimon) {
      digimonData.value = digimon
      hatching.value = false
      reveal.value = true
    }
  } catch(e) {
    console.error('孵化失败:', e)
    alert('孵化失败: ' + e.message)
  } finally {
    loading.value = false
    if (timer) clearInterval(timer)
  }
})

onUnmounted(() => { if (timer) clearInterval(timer); if (hatchTimer) clearTimeout(hatchTimer) })
</script>
