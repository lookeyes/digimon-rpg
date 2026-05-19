<template>
  <div class="page" style="padding-bottom:80px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="page-title" style="margin:0;"><span>📋</span> 游戏介绍</div>
    </div>

    <div class="about-hero">
      <div class="about-hero-icon">🐉</div>
      <h1 style="font-size:22px;margin:8px 0;">数码宝贝RPG</h1>
      <p style="font-size:13px;color:var(--text-dim);">收集、培养、进化你的数码宝贝，在数码世界中展开冒险！</p>
    </div>

    <div class="about-section">
      <div class="about-section-title">🎮 核心玩法</div>
      <div class="about-cards">
        <div class="about-card"><div class="about-card-icon">🥚</div><div class="about-card-title">获取数码蛋</div><div class="about-card-desc">在商城购买数码蛋，每颗蛋对应不同领域的数码宝贝。孵化后即可获得属于你的伙伴。</div></div>
        <div class="about-card"><div class="about-card-icon">⚔️</div><div class="about-card-title">回合制战斗</div><div class="about-card-desc">3v3 速度制回合战斗。技能分物理/特殊/变化三类，10 个领域相互克制，种族相克，策略丰富。</div></div>
        <div class="about-card"><div class="about-card-icon">🔄</div><div class="about-card-title">进化系统</div><div class="about-card-desc">成长期→成熟期→完全体→究极体，三段进化。达到等级要求并积累足够的领域经验即可进化，能力大幅提升。</div></div>
        <div class="about-card"><div class="about-card-icon">⭐</div><div class="about-card-title">性格与天赋</div><div class="about-card-desc">25 种性格影响能力值 ±10%。40 种天赋分白/蓝/紫/红四档，双天赋搭配打造独一无二的数码宝贝。</div></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🌐 十领域克制</div>
      <div class="about-field-list">
        <div v-for="f in fieldList" :key="f.id" class="about-field-item">
          <span class="about-field-emoji">{{ f.emoji }}</span>
          <div>
            <div class="about-field-name" :style="{ color: f.color }">{{ f.name }}</div>
            <div class="about-field-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>
      <p style="font-size:11px;color:var(--text-dim);margin-top:8px;text-align:center;">自然精灵→深海救星→龙之咆哮→金属帝国→丛林奇兵→自然精灵（物理环）<br/>病毒克星→噩梦士兵→风之守卫→黑暗区域→未知领域→病毒克星（精神环）</p>
    </div>

    <div class="about-section">
      <div class="about-section-title">⚡ 种族克制</div>
      <div style="text-align:center;font-size:13px;color:var(--text-dim);line-height:1.8;">
        <span class="tag" style="background:#4ecca322;color:#4ecca3;">💉 疫苗</span> 克 <span class="tag" style="background:#e9456022;color:#e94560;">🦠 病毒</span><br/>
        <span class="tag" style="background:#e9456022;color:#e94560;">🦠 病毒</span> 克 <span class="tag" style="background:#00d4ff22;color:#00d4ff;">💾 数据</span><br/>
        <span class="tag" style="background:#00d4ff22;color:#00d4ff;">💾 数据</span> 克 <span class="tag" style="background:#4ecca322;color:#4ecca3;">💉 疫苗</span>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">📊 能力值系统</div>
      <div class="about-stats-table">
        <div class="about-stat-row"><span>HP</span><span>生命值，归零即倒下</span></div>
        <div class="about-stat-row"><span>MP</span><span>技能消耗的能量</span></div>
        <div class="about-stat-row"><span>攻击 / 防御</span><span>物理技能的攻防</span></div>
        <div class="about-stat-row"><span>特攻 / 特防</span><span>特殊技能的攻防</span></div>
        <div class="about-stat-row"><span>速度</span><span>决定每回合行动顺序</span></div>
      </div>
      <p style="font-size:11px;color:var(--text-dim);margin-top:4px;">能力值 = 种族值 + 成长率 × (等级-1) + 自由点分配</p>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { fields } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const fieldList = computed(() => fields)
</script>

<style scoped>
.about-hero { text-align:center; padding:20px; background:var(--bg-card); border-radius:12px; margin-bottom:14px; border:1px solid var(--border); }
.about-hero-icon { font-size:48px; }
.about-section { margin-bottom:16px; }
.about-section-title { font-size:15px; font-weight:700; margin-bottom:10px; }
.about-cards { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.about-card { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:12px; text-align:center; }
.about-card-icon { font-size:28px; margin-bottom:6px; }
.about-card-title { font-size:13px; font-weight:700; margin-bottom:4px; }
.about-card-desc { font-size:11px; color:var(--text-dim); line-height:1.5; }
.about-field-list { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.about-field-item { display:flex; align-items:center; gap:8px; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px 10px; }
.about-field-emoji { font-size:22px; }
.about-field-name { font-size:12px; font-weight:700; }
.about-field-desc { font-size:10px; color:var(--text-dim); }
.about-stats-table { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; overflow:hidden; }
.about-stat-row { display:flex; padding:6px 12px; font-size:12px; }
.about-stat-row:not(:last-child) { border-bottom:1px solid var(--border); }
.about-stat-row span:first-child { font-weight:700; min-width:80px; color:var(--accent); }
.about-stat-row span:last-child { color:var(--text-dim); }
</style>
