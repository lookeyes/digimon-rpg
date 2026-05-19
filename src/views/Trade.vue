<template>
<div class="page">
  <button class="back-btn" style="margin-bottom:10px;" @click="$router.back()">← 返回</button>
  <div class="page-title"><span>交易场</span></div>
  <div class="tabs">
    <div class="tab" :class="{ active:tab==='market' }" @click="tab='market'">🏪 市场</div>
    <div class="tab" :class="{ active:tab==='mine' }" @click="tab='mine'">📋 我的挂单</div>
    <div class="tab" :class="{ active:tab==='sell' }" @click="tab='sell';loadMyItems()">💰 出售</div>
    <div class="tab" :class="{ active:tab==='backpack' }" @click="tab='backpack';loadMyItems()">🎒 背包</div>
  </div>
  <div v-if="tab==='market'" style="text-align:center;padding:40px 0;color:var(--text-dim);">市场暂无挂单</div>
  <div v-if="tab==='mine'" style="text-align:center;padding:40px 0;color:var(--text-dim);">没有挂单</div>
  <div v-if="tab==='sell'" style="text-align:center;padding:40px 0;color:var(--text-dim);">没有可出售的道具</div>
  <div v-if="tab==='backpack'" style="text-align:center;padding:40px 0;color:var(--text-dim);">背包空空</div>
</div>
<BottomNav/>
</template>
<script setup>
import { ref } from 'vue'
import BottomNav from '../components/BottomNav.vue'
const tab=ref('market')
function loadMyItems(){}
</script>
