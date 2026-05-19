import api from '../api/bmob.js'
import { getCurrentUser } from '../api/auth.js'
import { getTemplate, getUniqueSkillsForDigimon, getRandomCommonSkills, getExpMultiplier, getGoldMultiplier } from '../data/digimonData.js'

function userId() { const user = getCurrentUser(); return user ? user.objectId : null }

async function processDigimon(digimon, entity, expGain, fieldExpReward, isTeamMember) {
  let talents = digimon.talents
  if (typeof talents === 'string') { try { talents = JSON.parse(talents) } catch(e) { talents = [] } }
  const expMult = getExpMultiplier(talents || [], digimon.level || 1)
  const newExp = (digimon.exp || 0) + Math.floor(expGain * expMult)
  const lv = digimon.level || 1
  let newLevel = lv
  let newFreePoints = digimon.freePoints || 0
  const newSkillsLearned = []
  let remainingExp = newExp

  // Load learned skills once
  let learned = []
  try { learned = typeof digimon.learnedSkills === 'string' ? JSON.parse(digimon.learnedSkills) : (digimon.learnedSkills || []) } catch(e) {}

  while (remainingExp >= newLevel * 10 && newLevel < 100) {
    remainingExp -= newLevel * 10
    newLevel++
    newFreePoints += 5

    // Check unique skills for the NEW level
    const uniqueNew = getUniqueSkillsForDigimon(digimon.templateId, newLevel)
    for (const s of uniqueNew) {
      if (!learned.includes(s.id) && learned.length < 10) {
        learned.push(s.id)
        newSkillsLearned.push(s)
      }
    }

    // Every 5 levels: auto-learn a random common skill
    if (newLevel % 5 === 0) {
      const candidates = getRandomCommonSkills(3)
      for (const c of candidates.slice(0, 1)) {
        if (!learned.includes(c.id) && learned.length < 10) {
          learned.push(c.id)
          newSkillsLearned.push(c)
        }
      }
    }

    await api.update('PlayerDigimon', digimon.objectId, { learnedSkills: JSON.stringify(learned) })
  }

  let currentFieldExp = {}
  try { currentFieldExp = typeof digimon.fieldExp === 'string' ? JSON.parse(digimon.fieldExp) : (digimon.fieldExp || {}) } catch(e) {}
  if (isTeamMember) {
    for (const [fid, val] of Object.entries(fieldExpReward)) {
      currentFieldExp[fid] = (currentFieldExp[fid] || 0) + val
    }
  }

  const hp = entity ? Math.max(1, entity.hp) : digimon.hp
  const mp = entity ? Math.max(0, entity.mp) : digimon.mp

  await api.update('PlayerDigimon', digimon.objectId, {
    hp, mp, exp: remainingExp, level: newLevel,
    freePoints: newFreePoints, fieldExp: JSON.stringify(currentFieldExp)
  })

  return {
    name: digimon.nickname || (getTemplate(digimon.templateId)?.name || '???'),
    level: newLevel,
    levelUps: newSkillsLearned.length > 0 ? newSkillsLearned.map(s => s.name) : [],
    gainedExp: expGain,
    freePointsGained: (newLevel - lv) * 5,
    isTeam: !!entity
  }
}

export async function saveBattleResults(playerTeam, enemyTeam, rewards) {
  const results = []
  const teamIds = playerTeam.filter(e => !e.objectId.startsWith('enemy_')).map(e => e.objectId)

  // Fetch ALL player digimon
  let allDigimons = []
  try {
    const owner = getCurrentUser()
    if (owner) {
      const res = await api.query('PlayerDigimon', {
        owner: { __type: 'Pointer', className: '_User', objectId: owner.objectId }
      })
      allDigimons = res.results || []
    }
  } catch(e) { console.error('获取全员失败:', e) }

  for (const digimon of allDigimons) {
    try {
      const entity = playerTeam.find(e => e.objectId === digimon.objectId)
      const isTeamMember = !!entity
      if (!isTeamMember) continue // Only team members get EXP
      const expGain = rewards.expPer
      const result = await processDigimon(digimon, entity, expGain, rewards.fieldExp, true)
      results.push(result)
    } catch(e) {
      console.error('处理失败:', digimon.objectId, e)
    }
  }

  // Update player gold with talent multipliers
  try {
    let goldMult = 1.0
    for (const digimon of allDigimons) {
      let talents = digimon.talents
      if (typeof talents === 'string') { try { talents = JSON.parse(talents) } catch(e) { talents = [] } }
      goldMult = Math.max(goldMult, getGoldMultiplier(talents || [], digimon.level || 1))
    }
    const user = await api.getUser(userId())
    await api.updateUser(userId(), { gold: (user.gold || 0) + Math.floor(rewards.gold * goldMult) })
  } catch(e) { console.error('更新金币失败:', e) }

  return results
}
