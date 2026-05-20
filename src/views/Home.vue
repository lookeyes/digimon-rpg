<template>
  <div class="page">
    <div class="page-title">你好，<span>{{ user?.username }}</span></div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="value">{{ digimonCount }}</div>
        <div class="label">数码宝贝</div>
      </div>
      <div class="stat-card">
        <div class="value">{{ battleCount }}</div>
        <div class="label">战斗次数</div>
      </div>
      <div class="stat-card">
        <div class="value">{{ coinCount }}</div>
        <div class="label">Bits</div>
      </div>
    </div>

    <div class="menu-grid">
      <router-link to="/digimon" class="menu-item">
        <div class="menu-icon">🐉</div>
        <div class="menu-label">数码宝贝</div>
      </router-link>
      <router-link to="/battle" class="menu-item">
        <div class="menu-icon">⚔️</div>
        <div class="menu-label">战斗</div>
      </router-link>
      <router-link to="/shop" class="menu-item">
        <div class="menu-icon">🛒</div>
        <div class="menu-label">商城</div>
      </router-link>
      <router-link to="/trade" class="menu-item">
        <div class="menu-icon">💱</div>
        <div class="menu-label">交易场</div>
      </router-link>
      <router-link to="/dex" class="menu-item">
        <div class="menu-icon">📖</div>
        <div class="menu-label">图鉴</div>
      </router-link>
      <router-link to="/about" class="menu-item">
        <div class="menu-icon">📋</div>
        <div class="menu-label">介绍</div>
      </router-link>
      <router-link to="/backpack" class="menu-item">
        <div class="menu-icon">🎒</div>
        <div class="menu-label">背包</div>
      </router-link>
      <router-link to="/exchange" class="menu-item">
        <div class="menu-icon">🔄</div>
        <div class="menu-label">兑换</div>
      </router-link>
      <router-link to="/boss" class="menu-item">
        <div class="menu-icon">👑</div>
        <div class="menu-label">BOSS</div>
      </router-link>
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <button class="btn btn-secondary" @click="handleLogout" style="width: auto; padding: 10px 36px;">
        退出登录
      </button>
    </div>
  </div>

  <BottomNav />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../api/auth.js'
import { getPlayerInfo, getMyDigimons } from '../api/game.js'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const user = ref(getCurrentUser())
const digimonCount = ref(0)
const battleCount = ref(0)
const coinCount = ref(0)

async function loadData() {
  try {
    const info = await getPlayerInfo()
    coinCount.value = info.gold
    const digimons = await getMyDigimons()
    digimonCount.value = digimons.length
  } catch (e) {
    console.error('加载首页数据失败:', e)
  }
}

function handleLogout() {
  logout()
  router.push('/login')
}

onMounted(() => {
  loadData()
})
</script>
