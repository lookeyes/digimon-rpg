<template>
  <div class="egg-card" :style="{ borderColor: eggColor }">
    <div class="egg-card-icon">🥚</div>
    <div class="egg-card-info">
      <div class="egg-card-rarity" :style="{ color: eggColor }">{{ rarityLabel }}</div>
      <div v-if="isReady" class="egg-card-ready">孵化完成！</div>
      <div v-else-if="isIncubating" class="egg-card-timer">{{ timeLeft }}</div>
      <div v-else class="egg-card-done">已孵化</div>
    </div>
    <div class="egg-card-glow" :style="{ boxShadow: `0 0 12px ${eggColor}` }"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getEggType } from '../data/digimonData.js'

const props = defineProps({
  egg: { type: Object, required: true }
})

const rarityLabels = { normal: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }
const rarityLabel = computed(() => rarityLabels[props.egg.rarity] || '?')

const eggType = computed(() => getEggType(props.egg.rarity))
const eggColor = computed(() => eggType.value?.color || '#888')

const isReady = computed(() => props.egg.status === 'ready' || (props.egg.status === 'incubating' && remaining.value <= 0))
const isIncubating = computed(() => props.egg.status === 'incubating' && remaining.value > 0)

const remaining = ref(0)
const timeLeft = ref('')
let timer = null

function update() {
  if (props.egg.status !== 'incubating') return
  const ms = new Date(props.egg.hatchReadyAt).getTime() - Date.now()
  remaining.value = ms
  if (ms <= 0) {
    timeLeft.value = '孵化完成！'
    clearInterval(timer)
    return
  }
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    timeLeft.value = `剩余 ${h}小时${m}分钟`
  } else if (m > 0) {
    timeLeft.value = `剩余 ${m}分${sec}秒`
  } else {
    timeLeft.value = `剩余 ${sec}秒`
  }
}

onMounted(() => {
  update()
  if (props.egg.status === 'incubating') {
    timer = setInterval(update, 1000)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
