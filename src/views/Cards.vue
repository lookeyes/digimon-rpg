<template>
  <div class="page">
    <button class="back-btn" @click="$router.back()">← 返回</button>
    <div class="page-title">🃏 卡牌收藏</div>

    <div class="about-section">
      <div class="about-section-title">📊 卡牌加成（每张+1%，不同卡累加）</div>
      <div class="dex-modal-stats">
        <div class="dex-stat-row"><span>已收集种类</span><span style="font-weight:700;color:var(--accent);">{{ ownedCards }}/50</span></div>
        <div class="dex-stat-row" v-for="(v,k) in currentBonus" :key="k"><span>{{ statName(k) }}</span><span style="color:var(--green);">+{{ v }}%</span></div>
        <div v-if="ownedCards===0" style="font-size:11px;color:var(--text-dim);text-align:center;">收集任意数码兽卡牌即可获得对应属性加成</div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🃏 卡牌收集 ({{ ownedCards }}/50)</div>
      <div class="card-grid">
        <div v-for="card in cardList" :key="card.id" class="card-item" :class="{ owned: card.count>0, missing: card.count===0 }">
          <div class="card-img" v-html="card.sprite"></div>
          <div class="card-info">
            <div class="card-name-text">{{ card.name }}</div>
            <div class="card-stage-text">{{ card.stage }} · {{ statName(cardBonusMap[card.id]) }}+1%</div>
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
const cardBonusMap = computed(() => {
  const map = {}
  for (const t of digimonTemplates) {
    const g = {hp:t.growthHp,atk:t.growthAtk,def:t.growthDef,spAtk:t.growthSpAtk,spDef:t.growthSpDef,spd:t.growthSpd}
    const tiers = {S:5,A:4,B:3,C:2,D:1}
    let best='hp',bv=0
    for(const[k,v]of Object.entries(g)){const tv=tiers[v]||0;if(tv>bv){bv=tv;best=k}}
    map[t.id] = best
  }
  return map
})

const currentBonus = computed(() => getCardBonus(playerCards.value))

function statName(s) { return {hp:'HP',atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'}[s]||s }

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
