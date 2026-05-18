<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="hatch-modal" :class="phase">
      <div v-if="phase==='cracking'" class="hatch-egg">
        <div class="hatch-egg-body crack"><span class="hatch-icon">🥚</span></div>
        <p class="hatch-text">正在孵化中...</p>
      </div>
      <div v-else-if="phase==='reveal'" class="hatch-result">
        <div class="hatch-digimon-icon" v-html="getDigimonSprite(resultTemplateId) || mainIcon"></div>
        <h2 class="hatch-name">{{ displayName }}</h2>
        <div class="hatch-fields">
          <span v-for="f in displayFields" :key="f.id" class="tag field-tag"
            :style="{ background: f.color+'22', borderColor: f.color, color: f.color }">{{ f.emoji }} {{ f.name }}</span>
        </div>
        <div class="hatch-stats">
          <div class="hatch-stat"><span class="stat-label">等级</span><span class="stat-value">Lv.{{ d?.level }}</span></div>
          <div class="hatch-stat"><span class="stat-label">HP</span><span class="stat-value">{{ hatchStats.maxHp }}</span></div>
          <div class="hatch-stat"><span class="stat-label">MP</span><span class="stat-value">{{ hatchStats.maxMp }}</span></div>
          <div class="hatch-stat"><span class="stat-label">攻击</span><span class="stat-value">{{ hatchStats.atk }}</span></div>
          <div class="hatch-stat"><span class="stat-label">防御</span><span class="stat-value">{{ hatchStats.def }}</span></div>
          <div class="hatch-stat"><span class="stat-label">特攻</span><span class="stat-value">{{ hatchStats.spAtk }}</span></div>
          <div class="hatch-stat"><span class="stat-label">特防</span><span class="stat-value">{{ hatchStats.spDef }}</span></div>
          <div class="hatch-stat"><span class="stat-label">速度</span><span class="stat-value">{{ hatchStats.spd }}</span></div>
        </div>
        <div v-if="initialSkills.length > 0" class="hatch-skills">
          <div style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">初始技能</div>
          <div v-for="s in initialSkills" :key="s.id" class="tag" style="background:var(--accent-glow); border:1px solid var(--accent); color:var(--accent); margin:2px;">
            {{ s.name }}
          </div>
        </div>
        <div v-if="natureInfo" class="hatch-nature">{{ natureInfo }}</div>
        <div v-if="abilityText" class="hatch-abilities">{{ abilityText }}</div>
        <button class="btn btn-primary" style="width:auto; margin-top:16px;" @click="$emit('confirm')">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getTemplate, getField, getNature, getAbility, getSkill } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'

const props = defineProps({
  visible: Boolean, phase: String, digimonData: Object, resultTemplateId: String, rarity: String
})
defineEmits(['close','confirm'])

const d = computed(() => props.digimonData)
const template = computed(() => getTemplate(props.resultTemplateId))
const displayName = computed(() => d.value?.nickname || template.value?.name || '???')
const displayFields = computed(() => {
  if (!template.value?.fields) return []
  return template.value.fields.map(fid => getField(fid)).filter(Boolean)
})
const mainIcon = computed(() => displayFields.value[0]?.emoji || '❓')

const natureInfo = computed(() => {
  if (!d.value?.nature) return ''
  const n = getNature(d.value.nature)
  if (!n) return ''
  if (!n.boost) return `性格：${n.name}（均衡）`
  return `性格：${n.name}（${n.boost}+ / ${n.reduce}−）`
})

const abilityText = computed(() => {
  if (!d.value?.abilities) return ''
  let arr = d.value.abilities
  if (typeof arr === 'string') { try { arr = JSON.parse(arr) } catch(e) { return '' } }
  return arr.map(id => getAbility(id)).filter(Boolean).map(a => `⚡${a.name}`).join('  ')
})

const hatchStats = computed(() => {
  if (!d.value?.stats) return {}
  try { return typeof d.value.stats === 'string' ? JSON.parse(d.value.stats) : d.value.stats }
  catch(e) { return {} }
})

const initialSkills = computed(() => {
  if (!d.value?.equippedSkills) return []
  let arr = d.value.equippedSkills
  if (typeof arr === 'string') { try { arr = JSON.parse(arr) } catch(e) { return [] } }
  return arr.map(id => getSkill(id)).filter(Boolean)
})
</script>
