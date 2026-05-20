<template>
  <div class="page">
    <button class="back-btn" @click="$router.back()">← 返回</button>
    <div class="page-title">🃏 卡牌收藏</div>

    <div class="about-section">
      <div class="about-section-title">📊 全局加成（不累计，取最高档）</div>
      <div class="dex-modal-stats">
        <div class="dex-stat-row"><span>总卡牌数</span><span style="font-weight:700;color:var(--accent);">{{ totalCards }}</span></div>
        <div class="dex-stat-row" v-for="(v,k) in currentBonus" :key="k"><span>{{ statName(k) }}</span><span style="color:var(--green);">+{{ v }}%</span></div>
        <div v-if="totalCards>100" class="dex-stat-row"><span style="font-size:10px;color:var(--text-dim);">已达到最高档(100张)</span></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🏆 里程碑</div>
      <div class="ex-grid">
        <div v-for="m in milestones" :key="m.count" class="ex-card" :style="totalCards>=m.count?{borderColor:'var(--accent)'}:{}">
          <div class="ex-card-icon">{{ totalCards>=m.count?'✅':'🔒' }}</div>
          <div v-if="isCurrentTier(m)" style="font-size:9px;color:var(--accent);">当前加成</div>
          <div class="ex-card-name">{{ m.label }}</div>
          <div class="ex-card-desc" style="font-size:10px;">
            <span v-for="(v,k) in m.bonus" :key="k">{{ statName(k) }}+{{ v }}% </span>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🃏 卡牌收集 ({{ ownedCards }}/50)</div>
      <div class="card-grid">
        <div v-for="card in cardList" :key="card.id" class="card-item" :class="{ owned: card.count>0, missing: card.count===0 }">
          <div class="card-img" v-html="card.sprite"></div>
          <div class="card-info">
            <div class="card-name-text">{{ card.name }}</div>
            <div class="card-stage-text">{{ card.stage }}</div>
          </div>
          <div class="card-count" :class="{ has: card.count>0 }">×{{ card.count }}</div>
        </div>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPlayerInfo } from '../api/game.js'
import { digimonTemplates, cardMilestones, getCardBonus } from '../data/digimonData.js'
import { getDigimonSprite } from '../data/digimonSprites.js'
import BottomNav from '../components/BottomNav.vue'

const playerCards = ref({})
const cardList = computed(() => digimonTemplates.map(t => ({ id: t.id, name: t.name, stage: t.stage, count: playerCards.value[t.id]||0, sprite: getDigimonSprite(t.id, 60, t.name) })))
const totalCards = computed(() => Object.values(playerCards.value).reduce((s,v)=>s+v,0))
const ownedCards = computed(() => cardList.value.filter(c=>c.count>0).length)
const currentBonus = computed(() => getCardBonus(totalCards.value))
const milestones = cardMilestones

function statName(s) { return {hp:'HP'}[s]||s }
function isCurrentTier(m) { const reached = milestones.filter(x => totalCards.value >= x.count); return reached.length>0 && reached[reached.length-1].count === m.count }

onMounted(async () => {
  try {
    const info = await getPlayerInfo()
    let cards = {}
    if (info.cards) try { cards = typeof info.cards === 'string' ? JSON.parse(info.cards) : info.cards } catch(e) {}
    playerCards.value = cards
  } catch(e) {}
})
</script>

<style scoped>
.card-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.card-item { background:var(--bg-card); border:2px solid var(--border); border-radius:10px; padding:8px; text-align:center; transition:all 0.15s; }
.card-item.owned { border-color:var(--accent); box-shadow:0 0 8px var(--accent-glow); }
.card-item.missing { opacity:0.4; }
.card-img { width:50px; height:50px; margin:0 auto 4px; }
.card-img :deep(img) { width:50px; height:50px; }
.card-info { margin-bottom:2px; }
.card-name-text { font-size:10px; font-weight:700; line-height:1.2; }
.card-stage-text { font-size:9px; color:var(--text-dim); }
.card-count { font-size:14px; font-weight:900; color:var(--text-dim); }
.card-count.has { color:var(--accent); }
</style>
