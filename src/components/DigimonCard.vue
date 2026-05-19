<template>
  <div class="digimon-card" @click="$emit('click')">
    <div class="digimon-card-icon" v-html="sprite"></div>
    <div class="digimon-card-name">{{ displayName }}</div>
    <div class="digimon-card-level">Lv.{{ digimon.level }}</div>
    <div class="digimon-card-tags">
      <span v-for="f in displayFields" :key="f.id" class="tag field-tag"
        :style="{ background: f.color+'22', borderColor: f.color, color: f.color }">{{ f.emoji }}</span>
      <span class="tag type-tag" :style="{ background: typeColor+'33', color: typeColor }">{{ typeIcon }} {{ typeLabel }}</span>
      <span v-if="natureName" class="tag" style="background:#ffd70022; border:1px solid #ffd700; color:#ffd700; font-size:10px;">
        {{ natureName }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getTemplate, getField, getNature, typeColors, typeIcons, digimonTemplates } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'

const props = defineProps({ digimon: { type: Object, required: true } })
defineEmits(['click'])

const template = computed(() => getTemplate(props.digimon.templateId))
const displayFields = computed(() => {
  if (!template.value?.fields) return []
  return template.value.fields.slice(0,2).map(fid => getField(fid)).filter(Boolean)
})
const evoName = computed(() => { const d = props.digimon; if (!d) return template.value?.name||null; if (d.evolvedTo) { try { const evo = typeof d.evolvedTo === 'string' ? JSON.parse(d.evolvedTo) : d.evolvedTo; if (evo.name) return evo.name } catch (e) {} } if (d.nickname && digimonTemplates.some(t => t.name === d.nickname)) return d.nickname; return template.value?.name||null })
const sprite = computed(() => getDigimonSprite(props.digimon.templateId, 50, evoName.value) || displayFields.value[0]?.emoji || '❓')
const displayName = computed(() => props.digimon.nickname || template.value?.name || '???')
const typeLabel = computed(() => template.value?.type || '?')
const typeIcon = computed(() => typeIcons[typeLabel.value] || '')
const typeColor = computed(() => typeColors[typeLabel.value] || '#888')
const natureName = computed(() => {
  if (!props.digimon.nature) return ''
  const n = getNature(props.digimon.nature)
  return n ? n.name : ''
})
</script>
