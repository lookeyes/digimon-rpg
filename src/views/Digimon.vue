<template>
  <div class="page">
    <div class="page-title"><span>数码宝贝</span> 管理</div>

    <div class="tabs">
      <div class="tab" :class="{ active: tab==='digimon' }" @click="tab='digimon'">我的宝贝</div>
      <div class="tab" :class="{ active: tab==='eggs' }" @click="tab='eggs'">数码蛋</div>
    </div>

    <template v-if="tab==='digimon'">
      <EmptyState v-if="digimons.length===0" icon="🐉" title="还没有数码宝贝" description="去商城买蛋孵化吧！" actionLabel="前往商城" @action="$router.push('/shop')"/>
      <div v-else class="digimon-grid">
        <DigimonCard v-for="d in digimons" :key="d.objectId" :digimon="d" @click="$router.push(`/digimon/${d.objectId}`)"/>
      </div>
    </template>

    <template v-if="tab==='eggs'">
      <EmptyState v-if="eggs.length===0" icon="🥚" title="还没有数码蛋" description="去商城买蛋吧！" actionLabel="前往商城" @action="$router.push('/shop')"/>
      <div v-else class="egg-list">
        <div v-for="egg in eggs" :key="egg.objectId">
          <EggCard :egg="egg"/>
          <button v-if="egg.status==='ready' || isEggReady(egg)" class="btn btn-primary" style="margin-top:4px;" @click="startHatch(egg)">✨ 孵化</button>
        </div>
      </div>
    </template>
  </div>

  <HatchModal :visible="modal.visible" :phase="modal.phase" :digimonData="modal.digimon" :resultTemplateId="modal.templateId" :rarity="modal.rarity" @confirm="modal.visible=false;loadData()" @close="modal.visible=false"/>

  <BottomNav/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyDigimons, getMyEggs, hatchEgg } from '../api/game.js'
import DigimonCard from '../components/DigimonCard.vue'
import EggCard from '../components/EggCard.vue'
import EmptyState from '../components/EmptyState.vue'
import HatchModal from '../components/HatchModal.vue'
import BottomNav from '../components/BottomNav.vue'

const tab = ref('digimon')
const digimons = ref([])
const eggs = ref([])
const modal = ref({ visible:false, phase:'cracking', digimon:null, templateId:'', rarity:'normal' })

function isEggReady(egg) { return egg.status!=='incubating'?false:new Date(egg.hatchReadyAt).getTime()<=Date.now() }

async function loadData() {
  try {
    digimons.value = await getMyDigimons()
    digimons.value.sort((a,b)=>b.level-a.level)
    const allEggs = await getMyEggs()
    eggs.value = allEggs.filter(e => e.status!=='hatched').sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
  } catch(e) { console.error(e) }
}

async function startHatch(egg) {
  modal.value = { visible:true, phase:'cracking', digimon:null, templateId:egg.resultTemplateId, rarity:egg.rarity }
  try {
    const digimon = await hatchEgg(egg.objectId)
    await new Promise(r => setTimeout(r, 1500))
    modal.value.phase = 'reveal'
    modal.value.digimon = digimon
  } catch(e) {
    alert('孵化失败: '+e.message)
    modal.value.visible = false
  }
}

onMounted(()=>{ loadData() })
</script>
