import api from '../api/bmob.js'
import { getCurrentUser } from '../api/auth.js'
import { getTemplate, getUniqueSkillsForDigimon, getExpMultiplier, getGoldMultiplier, rollDrops } from '../data/digimonData.js'

function userId() { const user = getCurrentUser(); return user ? user.objectId : null }

async function processDigimon(digimon, entity, expGain, fieldExpReward, isTeamMember) {
  let talents = digimon.talents; if (typeof talents === 'string') { try { talents = JSON.parse(talents) } catch(e) { talents = [] } }
  const expMult = getExpMultiplier(talents || [], digimon.level || 1)
  const newExp = (digimon.exp || 0) + Math.floor(expGain * expMult)
  const lv = digimon.level || 1; let newLevel = lv; let newFreePoints = digimon.freePoints || 0; const newSkillsLearned = []; let remainingExp = newExp
  let learned = []; try { learned = typeof digimon.learnedSkills === 'string' ? JSON.parse(digimon.learnedSkills) : (digimon.learnedSkills || []) } catch(e) {}
  while (remainingExp >= newLevel * 10 && newLevel < 100) {
    remainingExp -= newLevel * 10; newLevel++; newFreePoints += 5
    const displayName = digimon.nickname || (getTemplate(digimon.templateId)?.name || null); const uniqueNew = getUniqueSkillsForDigimon(digimon.templateId, newLevel, displayName)
    for (const s of uniqueNew) { if (!learned.includes(s.id) && learned.length < 10) { learned.push(s.id); newSkillsLearned.push(s) } }
    if (newLevel % 5 === 0) {
      const { getRandomCommonSkills } = await import('../data/digimonData.js')
      const candidates = getRandomCommonSkills(3)
      for (const c of candidates.slice(0, 1)) { if (!learned.includes(c.id) && learned.length < 10) { learned.push(c.id); newSkillsLearned.push(c) } }
    }
    await api.update('PlayerDigimon', digimon.objectId, { learnedSkills: JSON.stringify(learned) })
  }
  let currentFieldExp = {}; try { currentFieldExp = typeof digimon.fieldExp === 'string' ? JSON.parse(digimon.fieldExp) : (digimon.fieldExp || {}) } catch(e) {}
  if (isTeamMember) { for (const [fid, val] of Object.entries(fieldExpReward)) { currentFieldExp[fid] = (currentFieldExp[fid] || 0) + val } }
  const hp = entity ? Math.max(1, entity.hp) : digimon.hp; const mp = entity ? Math.max(0, entity.mp) : digimon.mp
  await api.update('PlayerDigimon', digimon.objectId, { hp, mp, exp:remainingExp, level:newLevel, freePoints:newFreePoints, fieldExp:JSON.stringify(currentFieldExp) })
  return { name: digimon.nickname || (getTemplate(digimon.templateId)?.name || '???'), level:newLevel, levelUps: newSkillsLearned.length > 0 ? newSkillsLearned.map(s => s.name) : [], gainedExp:expGain, freePointsGained:(newLevel-lv)*5, isTeam:!!entity }
}

export async function saveBattleResults(playerTeam, enemyTeam, rewards) {
  const results = []; let allDigimons = []
  try { const owner = getCurrentUser(); if (owner) { const res = await api.query('PlayerDigimon', { owner: { __type:'Pointer', className:'_User', objectId:owner.objectId } }); allDigimons = res.results || [] } } catch(e) {}
  for (const digimon of allDigimons) {
    try { const entity = playerTeam.find(e => e.objectId === digimon.objectId); const isTeamMember = !!entity; if (!isTeamMember) continue; const expGain = rewards.expPer; const result = await processDigimon(digimon, entity, expGain, rewards.fieldExp, true); results.push(result) } catch(e) { console.error(e) }
  }
  // Roll drops
  let drops = []
  try {
    drops = rollDrops(enemyTeam)
    if (drops.length > 0) {
      const user = await api.getUser(userId())
      let items = {}
      try { items = typeof user.items === 'string' ? JSON.parse(user.items) : (user.items || {}) } catch(e) {}
      for (const d of drops) { items[d.id] = (items[d.id] || 0) + d.count }
      await api.updateUser(userId(), { items: JSON.stringify(items) })
    }
  } catch(e) { console.error('更新掉落失败:', e) }
  // Roll cards
  let cardDrops = []
  try {
    for (const enemy of enemyTeam) {
      if (Math.random() < 0.01) {
        const tpl = getTemplate(enemy.templateId); if (!tpl) continue
        const cardId = tpl.id; const cardName = tpl.name
        const exist = cardDrops.find(c => c.id === cardId)
        if (exist) exist.count++; else cardDrops.push({id:cardId, name:cardName, count:1})
      }
    }
    if (cardDrops.length > 0) {
      const user = await api.getUser(userId())
      let cards = {}
      try { cards = typeof user.cards === 'string' ? JSON.parse(user.cards) : (user.cards || {}) } catch(e) {}
      for (const c of cardDrops) { cards[c.id] = (cards[c.id] || 0) + c.count }
      await api.updateUser(userId(), { cards: JSON.stringify(cards) })
    }
  } catch(e) { console.error('更新卡牌失败:', e) }
  // Update gold
  try { let goldMult = 1.0; for (const digimon of allDigimons) { let t = digimon.talents; if (typeof t === 'string') try { t = JSON.parse(t) } catch(e) { t = [] }; goldMult = Math.max(goldMult, getGoldMultiplier(t||[], digimon.level||1)) }; const user = await api.getUser(userId()); await api.updateUser(userId(), { gold: (user.gold||0) + Math.floor(rewards.gold*goldMult) }) } catch(e) { console.error('更新Bits失败:', e) }
  results._drops = drops; results._cards = cardDrops
  return results
}
