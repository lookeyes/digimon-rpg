<template>
  <div class="page">
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
      <router-link to="/skills" style="display:block;background:var(--bg-card);border:1px solid var(--accent);border-radius:10px;padding:12px 16px;text-align:center;text-decoration:none;color:var(--accent);font-weight:700;font-size:14px;">📜 查看全部通用技能 →</router-link>
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

    <div class="about-section">
      <div class="about-section-title">🎭 25种性格</div>
      <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">性格影响两项能力值，一项提升+10%，另一项降低-10%（5种无修正）</p>
      <div class="about-nature-grid">
        <div v-for="n in allNatures" :key="n.id" class="about-nature-item">
          <div class="about-nature-name">{{ n.name }}</div>
          <div class="about-nature-mod">
            <span v-if="n.boost" style="color:var(--green);">{{ statLabel(n.boost) }}+10%</span>
            <span v-if="n.reduce" style="color:var(--red);">{{ statLabel(n.reduce) }}-10%</span>
            <span v-if="!n.boost&&!n.reduce" style="color:var(--text-dim);">无修正</span>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🌟 40种天赋</div>
      <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">每只数码宝贝随机获得2个天赋。白68.9% / 蓝30% / 紫1% / 红0.1%</p>
      <div v-for="rarity in ['red','purple','blue','white']" :key="rarity" style="margin-bottom:10px;">
        <div class="about-rarity-label" :style="{ color: rarityColor(rarity) }">{{ rarityLabel(rarity) }} ({{ talentsByRarity[rarity].length }})</div>
        <div class="about-talent-list">
          <div v-for="t in talentsByRarity[rarity]" :key="t.id" class="about-talent-item">
            <span class="about-talent-name" :style="{ color: rarityColor(rarity) }">{{ t.name }}</span>
            <span class="about-talent-desc">{{ t.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🎒 装备系统</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">每只数码兽有2个装备槽——🏅徽章和📟暴龙机。装备从宝箱开出（兑换页获取），可在背包或详情页穿戴。</p>
      <div class="about-cards">
        <div class="about-card"><div class="about-card-icon">🏅</div><div class="about-card-title">10种徽章</div><div class="about-card-desc">勇气/友情/知识/诚实/纯真/希望/爱情/光明/温柔/奇迹。随机百分比加成（2%~30%），可在详情页洗练（10000Bits）。</div></div>
        <div class="about-card"><div class="about-card-icon">📟</div><div class="about-card-title">5种暴龙机</div><div class="about-card-desc">初代/D3/方舟/扫描器/装载器。1~3项属性百分比加成（5%~20%），支持锁定洗练（每锁消耗翻倍）。</div></div>
        <div class="about-card"><div class="about-card-icon">🎁</div><div class="about-card-title">装备宝箱</div><div class="about-card-desc">兑换页用材料兑换，开启50%概率获得徽章或暴龙机，直接放入背包。</div></div>
        <div class="about-card"><div class="about-card-icon">🔁</div><div class="about-card-title">洗练系统</div><div class="about-card-desc">徽章洗练10000Bits；暴龙机5000Bits起，锁定属性每项消耗翻倍，保留想要的属性。</div></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🃏 卡牌系统</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">战斗打败敌人有1%概率掉落对应数码兽的卡牌。收集卡牌可激活全局属性加成。</p>
      <div class="about-stats-table">
        <div class="about-stat-row"><span>掉落率</span><span>每只敌人1%概率掉落其卡牌</span></div>
        <div class="about-stat-row"><span>加成属性</span><span>每张卡根据数码兽最高成长率决定加成属性</span></div>
        <div class="about-stat-row"><span>分档加成</span><span>1张+0.5% / 5张+1% / 10张+2% / 100张+3%</span></div>
        <div class="about-stat-row"><span>累加规则</span><span>不同数码兽卡牌加成累加，战斗中实时生效</span></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">☠️ X病毒·旧世界</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">战斗地图的特殊区域——旧世界隐藏着X病毒，冒险中可能感染并触发进化变异。</p>
      <div class="about-stats-table">
        <div class="about-stat-row"><span>感染条件</span><span>旧世界战斗胜利后，编队中每只可感染数码兽1%概率</span></div>
        <div class="about-stat-row"><span>可感染数码兽</span><span>亚古兽/暴龙兽/机械暴龙兽/战斗暴龙兽 + 加布兽线</span></div>
        <div class="about-stat-row"><span>进化触发</span><span>满足进化条件时50%概率获得X抗体(大幅增强)，50%概率死亡</span></div>
        <div class="about-stat-row"><span>X抗体效果</span><span>名字加X后缀，种族值提升，保留原特性</span></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">👑 BOSS挑战</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">挑战6只究极体BOSS，1v3高强度战斗，胜利获得丰厚奖励。</p>
      <div class="about-stats-table">
        <div class="about-stat-row"><span>BOSS数量</span><span>6只究极体（黑暗战斗暴龙兽/究极天使兽/红莲骑士兽等）</span></div>
        <div class="about-stat-row"><span>BOSS强度</span><span>HP×2.5~3.0，全属性×1.3~1.5</span></div>
        <div class="about-stat-row"><span>奖励</span><span>3000Bits + 双倍EXP + 保底3~5个材料</span></div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-section-title">🔄 材料兑换</div>
      <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">战斗掉落的领域材料可在兑换页交换稀有道具。</p>
      <div class="about-stats-table">
        <div class="about-stat-row"><span>可兑换</span><span>技能卷轴/性格薄荷/洗点券/改名卡/装备宝箱/5000Bits</span></div>
        <div class="about-stat-row"><span>掉落率</span><span>每只敌人每个领域30%概率掉落对应材料</span></div>
        <div class="about-stat-row"><span>额外</span><span>8%概率额外掉落技能卷轴</span></div>
      </div>
    </div>

    <BottomNav/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { fields, natures, talents } from '../data/digimonData.js'
import BottomNav from '../components/BottomNav.vue'

const fieldList = computed(() => fields)
const allNatures = computed(() => natures)

const talentsByRarity = computed(() => ({
  red: talents.filter(t => t.rarity === 'red'),
  purple: talents.filter(t => t.rarity === 'purple'),
  blue: talents.filter(t => t.rarity === 'blue'),
  white: talents.filter(t => t.rarity === 'white')
}))

function statLabel(s) { return { atk:'攻击', def:'防御', spAtk:'特攻', spDef:'特防', spd:'速度' }[s]||s }
function rarityColor(r) { return { red:'#ff4444', purple:'#b44dff', blue:'#4e9fff', white:'#aaa' }[r]||'#888' }
function rarityLabel(r) { return { red:'🔴 红色传说', purple:'🟣 紫色稀有', blue:'🔵 蓝色精良', white:'⚪ 白色普通' }[r]||r }
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
.about-nature-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
.about-nature-item { display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border); border-radius:6px; padding:6px 10px; font-size:12px; }
.about-nature-name { font-weight:700; }
.about-nature-mod { display:flex; gap:6px; font-size:11px; }
.about-rarity-label { font-size:13px; font-weight:700; margin-bottom:4px; }
.about-talent-list { display:flex; flex-direction:column; gap:3px; }
.about-talent-item { display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border); border-radius:6px; padding:5px 10px; }
.about-talent-name { font-size:12px; font-weight:700; white-space:nowrap; }
.about-talent-desc { font-size:11px; color:var(--text-dim); text-align:right; }
</style>
