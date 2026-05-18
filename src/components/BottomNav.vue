<template>
  <nav class="bottom-nav">
    <router-link v-for="item in items" :key="item.path" :to="item.path" class="nav-item" active-class="active">
      <span class="icon">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
const items = [
  { path: '/home', icon: '🏠', label: '主页' },
  { path: '/digimon', icon: '🐉', label: '数码宝贝' },
  { path: '/battle', icon: '⚔️', label: '战斗' },
  { path: '/shop', icon: '🛒', label: '商城' },
  { path: '/trade', icon: '💱', label: '交易场' }
]
</script>
