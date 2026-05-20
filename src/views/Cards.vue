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
      <div class="ex-mat-grid">
        <div v-for="card in cardList" :key="card.id" class="ex-mat-item" :class="{ owned: card.count>0 }">
          <span>{{ card.count>0?'🃏':'🂠' }}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ card.name }}</div>
            <div style="font-size:10px;color:var(--text-dim);">{{ card.stage }}</div>
          </div>
          <span style="font-size:13px;font-weight:700;" :style="{color:card.count>0?'var(--accent)':'var(--text-dim)'}">×{{ card.count }}</span>
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
import BottomNav from '../components/BottomNav.vue'

const playerCards = ref({})
const cardList = computed(() => digimonTemplates.map(t => ({ id: t.id, name: t.name, stage: t.stage, count: playerCards.value[t.id]||0 })))
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
.ex-mat-item.owned { border-color: var(--accent); }
</style>
