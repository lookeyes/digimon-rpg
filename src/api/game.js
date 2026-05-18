import api from './bmob.js'
import { getCurrentUser } from './auth.js'
import { calcStats, getTemplate, randomNature, initFieldExp, rollDigimon, getUniqueSkillsForDigimon } from '../data/digimonData.js'

function userId() {
  const user = getCurrentUser()
  return user ? user.objectId : null
}

function userPointer() {
  const id = userId()
  if (!id) return null
  return { __type: 'Pointer', className: '_User', objectId: id }
}

export async function getPlayerInfo() {
  const id = userId()
  if (!id) throw new Error('未登录')
  const user = await api.getUser(id)
  return {
    objectId: user.objectId,
    username: user.username,
    playerName: user.playerName || user.username,
    gold: user.gold ?? 500
  }
}

export async function spendGold(amount) {
  const info = await getPlayerInfo()
  if (info.gold < amount) throw new Error('金币不足')
  await api.updateUser(userId(), { gold: info.gold - amount })
  return info.gold - amount
}

export async function addGold(amount) {
  const info = await getPlayerInfo()
  await api.updateUser(userId(), { gold: info.gold + amount })
  return info.gold + amount
}

export async function initNewPlayer() {
  await api.updateUser(userId(), { gold: 500 })
}

export async function createShopEgg() {
  const resultTemplateId = rollDigimon()
  const hatchSeconds = 10
  const hatchReadyAt = new Date(Date.now() + hatchSeconds * 1000).toISOString()
  return api.create('PlayerEgg', {
    owner: userPointer(),
    eggTemplateId: 'shop_egg',
    rarity: 'normal',
    resultTemplateId,
    hatchReadyAt,
    status: 'incubating'
  })
}

export async function getMyEggs(status) {
  const owner = userPointer()
  const where = { owner }
  if (status) where.status = status
  const result = await api.query('PlayerEgg', where)
  return result.results || []
}

export async function hatchEgg(eggId) {
  const eggs = await api.query('PlayerEgg', { objectId: eggId })
  const egg = (eggs.results || [])[0]
  if (!egg) throw new Error('蛋不存在')
  if (egg.status === 'hatched') throw new Error('已孵化过了')

  const now = new Date().toISOString()
  await api.update('PlayerEgg', eggId, { status: 'hatched' })

  const template = getTemplate(egg.resultTemplateId)
  const nature = randomNature()
  const abilitiesList = template.abilities || []
  const level = 1
  const allocated = { hp: 0, mp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 }
  const stats = calcStats(template, level, allocated, nature.id)

  const initialSkills = getUniqueSkillsForDigimon(egg.resultTemplateId, 1)
  const initialSkillIds = initialSkills.map(s => s.id)

  const created = await api.create('PlayerDigimon', {
    owner: userPointer(),
    templateId: egg.resultTemplateId,
    nickname: template ? template.name : '???',
    level,
    exp: 0,
    stats: JSON.stringify({ hp: stats.maxHp, maxHp: stats.maxHp, mp: stats.maxMp, maxMp: stats.maxMp, atk: stats.atk, def: stats.def, spAtk: stats.spAtk, spDef: stats.spDef, spd: stats.spd }),
    nature: nature.id,
    abilities: JSON.stringify(abilitiesList),
    freePoints: 0,
    allocatedPoints: JSON.stringify(allocated),
    equippedSkills: JSON.stringify(initialSkillIds),
    learnedSkills: JSON.stringify(initialSkillIds),
    isTeam: false,
    obtainedAt: now,
    fieldExp: JSON.stringify(initFieldExp())
  })

  return {
    objectId: created.objectId,
    templateId: egg.resultTemplateId,
    nickname: template ? template.name : '???',
    level,
    exp: 0,
    stats: { hp: stats.maxHp, maxHp: stats.maxHp, mp: stats.maxMp, maxMp: stats.maxMp, atk: stats.atk, def: stats.def, spAtk: stats.spAtk, spDef: stats.spDef, spd: stats.spd },
    nature: nature.id,
    abilities: abilitiesList,
    freePoints: 0,
    allocatedPoints: allocated,
    equippedSkills: initialSkillIds,
    learnedSkills: initialSkillIds,
    isTeam: false,
    obtainedAt: now,
    fieldExp: initFieldExp(),
    createdAt: created.createdAt
  }
}

export async function getMyDigimons() {
  const owner = userPointer()
  const result = await api.query('PlayerDigimon', { owner })
  return result.results || []
}

export async function getDigimonDetail(objectId) {
  const result = await api.query('PlayerDigimon', { objectId })
  return (result.results || [])[0] || null
}

export async function allocatePoints(digimonId, newAllocations) {
  const digimon = await getDigimonDetail(digimonId)
  const template = getTemplate(digimon.templateId)

  let currentFree = digimon.freePoints || 0
  let currentAllocated = {}
  try {
    currentAllocated = typeof digimon.allocatedPoints === 'string'
      ? JSON.parse(digimon.allocatedPoints)
      : (digimon.allocatedPoints || {})
  } catch (e) { currentAllocated = {} }

  const totalCost = Object.values(newAllocations).reduce((a, b) => a + b, 0)
  if (totalCost > currentFree) throw new Error('自由点数不足')

  const allStats = ['hp', 'mp', 'atk', 'def', 'spAtk', 'spDef', 'spd']
  const merged = {}
  for (const s of allStats) {
    merged[s] = (currentAllocated[s] || 0) + (newAllocations[s] || 0)
  }

  const newFree = currentFree - totalCost
  const stats = calcStats(template, digimon.level, merged, digimon.nature)

  await api.update('PlayerDigimon', digimonId, {
    stats: JSON.stringify({ hp: stats.maxHp, maxHp: stats.maxHp, mp: stats.maxMp, maxMp: stats.maxMp, atk: stats.atk, def: stats.def, spAtk: stats.spAtk, spDef: stats.spDef, spd: stats.spd }),
    freePoints: newFree,
    allocatedPoints: JSON.stringify(merged)
  })

  return { stats, freePoints: newFree, allocated: merged }
}

export async function changeNature(digimonId, newNatureId) {
  const digimon = await getDigimonDetail(digimonId)
  const template = getTemplate(digimon.templateId)

  let allocated = {}
  try {
    allocated = typeof digimon.allocatedPoints === 'string'
      ? JSON.parse(digimon.allocatedPoints)
      : (digimon.allocatedPoints || {})
  } catch (e) { allocated = {} }

  const newStats = calcStats(template, digimon.level, allocated, newNatureId)

  let currentStats = {}
  try {
    currentStats = typeof digimon.stats === 'string' ? JSON.parse(digimon.stats) : (digimon.stats || {})
  } catch (e) { currentStats = {} }

  const mergedStats = { ...currentStats, atk: newStats.atk, def: newStats.def, spAtk: newStats.spAtk, spDef: newStats.spDef, spd: newStats.spd }

  await api.update('PlayerDigimon', digimonId, {
    stats: JSON.stringify(mergedStats),
    nature: newNatureId
  })

  return newStats
}

export async function addFieldExp(digimonId, enemyTemplateId) {
  const template = getTemplate(enemyTemplateId)
  if (!template || !template.fields) return false

  const digimon = await getDigimonDetail(digimonId)
  if (!digimon) return false

  let currentExp = digimon.fieldExp
  if (!currentExp) {
    currentExp = initFieldExp()
  } else if (typeof currentExp === 'string') {
    try { currentExp = JSON.parse(currentExp) } catch (e) { currentExp = initFieldExp() }
  }

  const xpPerField = Math.ceil(10 / template.fields.length)
  for (const fieldId of template.fields) {
    if (currentExp[fieldId] !== undefined) currentExp[fieldId] += xpPerField
  }

  await api.update('PlayerDigimon', digimonId, { fieldExp: JSON.stringify(currentExp) })
  return true
}

function parseArray(val) {
  if (!val) return []
  if (typeof val === 'string') { try { return JSON.parse(val) } catch (e) { return [] } }
  return val
}

export async function equipSkill(digimonId, skillId) {
  const digimon = await getDigimonDetail(digimonId)
  const equipped = parseArray(digimon.equippedSkills)
  const learned = parseArray(digimon.learnedSkills)

  if (equipped.includes(skillId)) throw new Error('技能已装备')
  if (equipped.length >= 6) throw new Error('最多装备6个技能')
  if (!learned.includes(skillId)) throw new Error('未学会该技能')

  equipped.push(skillId)
  await api.update('PlayerDigimon', digimonId, { equippedSkills: JSON.stringify(equipped) })
  return equipped
}

export async function unequipSkill(digimonId, skillId) {
  const digimon = await getDigimonDetail(digimonId)
  let equipped = parseArray(digimon.equippedSkills)
  equipped = equipped.filter(id => id !== skillId)
  await api.update('PlayerDigimon', digimonId, { equippedSkills: JSON.stringify(equipped) })
  return equipped
}
