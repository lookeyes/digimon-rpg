import api from './bmob.js'
import { getCurrentUser } from './auth.js'
import { calcStats, getTemplate, randomNature, initFieldExp, rollDigimon, getUniqueSkillsForDigimon, evoChains, rollTwoTalents, digimonTemplates } from '../data/digimonData.js'

function userId() { const user = getCurrentUser(); return user ? user.objectId : null }
function userPointer() { const id = userId(); if (!id) return null; return { __type:'Pointer', className:'_User', objectId:id } }

export async function getPlayerInfo() {
  const id = userId(); if (!id) throw new Error('未登录')
  const user = await api.getUser(id)
  return { objectId:user.objectId, username:user.username, playerName:user.playerName||user.username, gold:user.gold??10000, items:user.items||'{}', presets:user.presets||null, activePreset:user.activePreset??0 }
}

export async function spendGold(amount) { const info = await getPlayerInfo(); if (info.gold < amount) throw new Error('金币不足'); await api.updateUser(userId(), { gold: info.gold - amount }); return info.gold - amount }
export async function addGold(amount) { const info = await getPlayerInfo(); await api.updateUser(userId(), { gold: info.gold + amount }); return info.gold + amount }
export async function initNewPlayer() { await api.updateUser(userId(), { gold: 500 }) }

export async function createShopEgg(fieldId) {
  let resultTemplateId
  if (fieldId) { const pool = digimonTemplates.filter(t => t.stage === '成长期' && t.fields && t.fields.includes(fieldId)); resultTemplateId = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)].id : rollDigimon() }
  else { resultTemplateId = rollDigimon() }
  const hatchSeconds = 10
  const hatchReadyAt = new Date(Date.now() + hatchSeconds * 1000).toISOString()
  return api.create('PlayerEgg', { owner:userPointer(), eggTemplateId:'shop_egg', rarity:'normal', resultTemplateId, hatchReadyAt, status:'incubating' })
}

export async function getMyEggs(status) { const owner = userPointer(); const where = { owner }; if (status) where.status = status; const result = await api.query('PlayerEgg', where); return result.results || [] }

export async function hatchEgg(eggId) {
  const eggs = await api.query('PlayerEgg', { objectId: eggId }); const egg = (eggs.results||[])[0]
  if (!egg) throw new Error('蛋不存在'); if (egg.status === 'hatched') throw new Error('已孵化过了')
  const now = new Date().toISOString()
  await api.update('PlayerEgg', eggId, { status:'hatched' })
  const template = getTemplate(egg.resultTemplateId); const nature = randomNature(); const abilitiesList = template.abilities || []
  const talents = rollTwoTalents(); const initialSkills = getUniqueSkillsForDigimon(egg.resultTemplateId, 1); const initialSkillIds = initialSkills.map(s => s.id)
  const level = 1; const allocated = { hp:0, mp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 }
  const stats = calcStats(template, level, allocated, nature.id)
  let autoTeam = false
  try { const existing = await getMyDigimons(); if (existing.filter(d => d.isTeam).length < 3) autoTeam = true } catch(e) { autoTeam = true }
  const created = await api.create('PlayerDigimon', { owner:userPointer(), templateId:egg.resultTemplateId, nickname:template?template.name:'???', level, exp:0, stats:JSON.stringify({ hp:stats.maxHp, maxHp:stats.maxHp, mp:stats.maxMp, maxMp:stats.maxMp, atk:stats.atk, def:stats.def, spAtk:stats.spAtk, spDef:stats.spDef, spd:stats.spd }), nature:nature.id, abilities:JSON.stringify(abilitiesList), talents:JSON.stringify(talents.map(t=>({id:t.id,name:t.name,rarity:t.rarity,desc:t.desc}))), freePoints:0, allocatedPoints:JSON.stringify(allocated), equippedSkills:JSON.stringify(initialSkillIds), learnedSkills:JSON.stringify(initialSkillIds), isTeam:autoTeam, obtainedAt:now, fieldExp:JSON.stringify(initFieldExp()) })
  return { objectId:created.objectId, templateId:egg.resultTemplateId, nickname:template?template.name:'???', level, exp:0, stats:{ hp:stats.maxHp, maxHp:stats.maxHp, mp:stats.maxMp, maxMp:stats.maxMp, atk:stats.atk, def:stats.def, spAtk:stats.spAtk, spDef:stats.spDef, spd:stats.spd }, nature:nature.id, abilities:abilitiesList, talents:talents.map(t=>({id:t.id,name:t.name,rarity:t.rarity,desc:t.desc})), freePoints:0, allocatedPoints:allocated, equippedSkills:initialSkillIds, learnedSkills:initialSkillIds, isTeam:autoTeam, obtainedAt:now, fieldExp:initFieldExp(), createdAt:created.createdAt }
}

function parseArray(val) { if (!val) return []; if (typeof val === 'string') { try { return JSON.parse(val) } catch(e) { return [] } } return val }

export async function getMyDigimons() { const owner = userPointer(); const result = await api.query('PlayerDigimon', { owner }); return result.results || [] }
export async function getDigimonDetail(objectId) { const result = await api.query('PlayerDigimon', { objectId }); return (result.results||[])[0]||null }

export async function equipSkill(digimonId, skillId) {
  const digimon = await getDigimonDetail(digimonId); const equipped = parseArray(digimon.equippedSkills); const learned = parseArray(digimon.learnedSkills)
  if (equipped.includes(skillId)) throw new Error('技能已装备'); if (equipped.length >= 4) throw new Error('最多装备4个技能'); if (!learned.includes(skillId)) throw new Error('未学会该技能')
  equipped.push(skillId); await api.update('PlayerDigimon', digimonId, { equippedSkills: JSON.stringify(equipped) }); return equipped
}

export async function unequipSkill(digimonId, skillId) {
  const digimon = await getDigimonDetail(digimonId); let equipped = parseArray(digimon.equippedSkills)
  equipped = equipped.filter(id => id !== skillId); await api.update('PlayerDigimon', digimonId, { equippedSkills: JSON.stringify(equipped) }); return equipped
}

export async function forgetSkill(digimonId, skillId) {
  const digimon = await getDigimonDetail(digimonId); let learned = parseArray(digimon.learnedSkills); let equipped = parseArray(digimon.equippedSkills)
  if (learned.length <= 1) throw new Error('至少保留1个技能'); learned = learned.filter(id => id !== skillId); equipped = equipped.filter(id => id !== skillId)
  await api.update('PlayerDigimon', digimonId, { learnedSkills: JSON.stringify(learned), equippedSkills: JSON.stringify(equipped) }); return { learned, equipped }
}

export async function allocatePoints(digimonId, newAllocations) {
  const digimon = await getDigimonDetail(digimonId); const template = getTemplate(digimon.templateId)
  let currentFree = digimon.freePoints || 0; let currentAllocated = {}
  try { currentAllocated = typeof digimon.allocatedPoints === 'string' ? JSON.parse(digimon.allocatedPoints) : (digimon.allocatedPoints || {}) } catch(e) { currentAllocated = {} }
  const totalCost = Object.values(newAllocations).reduce((a,b) => a+b, 0); if (totalCost > currentFree) throw new Error('自由点数不足')
  const allStats = ['hp','mp','atk','def','spAtk','spDef','spd']; const merged = {}
  for (const s of allStats) { merged[s] = (currentAllocated[s]||0) + (newAllocations[s]||0) }
  const newFree = currentFree - totalCost; const stats = calcStats(template, digimon.level, merged, digimon.nature)
  await api.update('PlayerDigimon', digimonId, { stats: JSON.stringify({ hp:stats.maxHp, maxHp:stats.maxHp, mp:stats.maxMp, maxMp:stats.maxMp, atk:stats.atk, def:stats.def, spAtk:stats.spAtk, spDef:stats.spDef, spd:stats.spd }), freePoints: newFree, allocatedPoints: JSON.stringify(merged) })
  return { stats, freePoints: newFree, allocated: merged }
}

export async function changeNature(digimonId, newNatureId) {
  const digimon = await getDigimonDetail(digimonId); const template = getTemplate(digimon.templateId)
  let allocated = {}; try { allocated = typeof digimon.allocatedPoints === 'string' ? JSON.parse(digimon.allocatedPoints) : (digimon.allocatedPoints || {}) } catch(e) { allocated = {} }
  const newStats = calcStats(template, digimon.level, allocated, newNatureId)
  let currentStats = {}; try { currentStats = typeof digimon.stats === 'string' ? JSON.parse(digimon.stats) : (digimon.stats || {}) } catch(e) { currentStats = {} }
  const mergedStats = { ...currentStats, atk:newStats.atk, def:newStats.def, spAtk:newStats.spAtk, spDef:newStats.spDef, spd:newStats.spd }
  await api.update('PlayerDigimon', digimonId, { stats: JSON.stringify(mergedStats), nature: newNatureId }); return newStats
}

export async function evolveDigimon(digimonId, evolutionIndex) {
  const digimon = await getDigimonDetail(digimonId); if (!digimon) throw new Error('数码宝贝不存在')
  const tpl = getTemplate(digimon.templateId)
  const currentName = digimon.nickname || ''; const chain = evoChains[currentName] || tpl?.evolutionTree
  if (!chain || chain.length === 0) throw new Error('无法进化'); const target = chain[evolutionIndex]
  if (!target) throw new Error('进化路线不存在')
  if (target.method === 'level' && digimon.level < target.condition) throw new Error(`需要达到Lv.${target.condition}`)
  if (target.fieldExpRequired) { let fexp = digimon.fieldExp; if (typeof fexp === 'string') try { fexp = JSON.parse(fexp) } catch(e) { fexp = {} }; for (const [fid, req] of Object.entries(target.fieldExpRequired)) { if ((fexp[fid]||0) < req) throw new Error(`领域经验不足`) } }
  let allocated = {}; try { allocated = typeof digimon.allocatedPoints === 'string' ? JSON.parse(digimon.allocatedPoints) : (digimon.allocatedPoints || {}) } catch(e) { allocated = {} }
  const newTpl = digimonTemplates.find(t => t.name === target.name)
  let newTplId, stats, evolvedTo
  if (newTpl) { newTplId = newTpl.id; stats = calcStats(newTpl, digimon.level, allocated, digimon.nature); evolvedTo = null }
  else { newTplId = digimon.templateId; const stageMult = { '成熟期':1.3, '完全体':1.6, '究极体':2.0 }; const mult = stageMult[target.stage]||1.3; stats = calcStats(tpl, digimon.level, allocated, digimon.nature); stats = { hp:Math.floor(stats.maxHp*mult), maxHp:Math.floor(stats.maxHp*mult), mp:Math.floor(stats.maxMp*1.1), maxMp:Math.floor(stats.maxMp*1.1), atk:Math.floor(stats.atk*mult), def:Math.floor(stats.def*mult), spAtk:Math.floor(stats.spAtk*mult), spDef:Math.floor(stats.spDef*mult), spd:Math.floor(stats.spd*1.1) }; evolvedTo = { name:target.name, stage:target.stage, fields:target.fields, type:target.type } }
  let learned = parseArray(digimon.learnedSkills); const oldSkills = getUniqueSkillsForDigimon(digimon.templateId, 100, currentName||undefined); const oldIds = new Set(oldSkills.map(s=>s.id)); learned = learned.filter(id => !oldIds.has(id)); for (const s of getUniqueSkillsForDigimon(newTplId, digimon.level, target.name)) { if (!learned.includes(s.id)) learned.push(s.id) }
  const updateData = { templateId:newTplId, nickname:target.name, learnedSkills:JSON.stringify(learned), stats:JSON.stringify(stats), hp:stats.maxHp||stats.hp }; if (evolvedTo) updateData.evolvedTo = JSON.stringify(evolvedTo)
  await api.update('PlayerDigimon', digimonId, updateData); return true
}

export async function addFieldExp(digimonId, enemyTemplateId) {
  const template = getTemplate(enemyTemplateId); if (!template || !template.fields) return false
  const digimon = await getDigimonDetail(digimonId); if (!digimon) return false
  let currentExp = digimon.fieldExp; if (!currentExp) { currentExp = initFieldExp() } else if (typeof currentExp === 'string') { try { currentExp = JSON.parse(currentExp) } catch(e) { currentExp = initFieldExp() } }
  const xpPerField = Math.ceil(10 / template.fields.length); for (const fieldId of template.fields) { if (currentExp[fieldId] !== undefined) currentExp[fieldId] += xpPerField }
  await api.update('PlayerDigimon', digimonId, { fieldExp: JSON.stringify(currentExp) }); return true
}
