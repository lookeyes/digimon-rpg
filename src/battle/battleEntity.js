import { applyTalents } from '../data/digimonData.js'

export const STAGE_MULTIPLIERS = { '-6':0.25, '-5':0.28, '-4':0.33, '-3':0.4, '-2':0.5, '-1':0.66, '0':1.0, '1':1.5, '2':2.0, '3':2.5, '4':3.0, '5':3.5, '6':4.0 }
export const STATUS_ICONS = { burn:'🔥', paralysis:'⚡', poison:'☠️', sleep:'💤', freeze:'❄️', confusion:'🌀' }
export const STATUS_NAMES = { burn:'灼烧', paralysis:'麻痹', poison:'中毒', sleep:'睡眠', freeze:'冰冻', confusion:'混乱' }

export class BattleEntity {
  constructor(digimon, template, skills, isPlayer) {
    this.objectId = digimon.objectId; this.templateId = digimon.templateId; this.name = digimon.nickname || template.name
    this.level = digimon.level; this.fields = template.fields || []; this.type = template.type; this.isPlayer = isPlayer
    this.evolvedName = null
    if (digimon.evolvedTo) { try { this.evolvedName = typeof digimon.evolvedTo === 'string' ? JSON.parse(digimon.evolvedTo).name : digimon.evolvedTo.name } catch(e) {} }
    if (!this.evolvedName && digimon.nickname && template && digimon.nickname !== template.name) { this.evolvedName = digimon.nickname }
    let talents = digimon.talents; if (typeof talents === 'string') { try { talents = JSON.parse(talents) } catch(e) { talents = [] } }
    const rawStats = this._parseStats(digimon.stats); const s = applyTalents(rawStats, talents || [], digimon.level || 1)
    this.maxHp = s.maxHp || 100; this.hp = s.hp || s.maxHp || 100; this.maxMp = s.maxMp || 50; this.mp = s.mp || s.maxMp || 50
    this.atk = s.atk || 20; this.def = s.def || 15; this.spAtk = s.spAtk || 20; this.spDef = s.spDef || 15; this.spd = s.spd || 18
    this.baseAtk = this.atk; this.baseDef = this.def; this.baseSpAtk = this.spAtk; this.baseSpDef = this.spDef; this.baseSpd = this.spd; this.baseAccuracy = 100
    this.stages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, accuracy:0 }; this.status = null; this.statusTurns = 0; this.confusionTurns = 0
    this.skills = skills || []; this.alive = true
  }
  _parseStats(stats) { if (!stats) return {}; if (typeof stats === 'string') { try { return JSON.parse(stats) } catch(e) { return {} } } return stats }
  getEffectiveStat(statName) { const stage = this.stages[statName] || 0; const clamped = Math.max(-6, Math.min(6, stage)); const mult = STAGE_MULTIPLIERS[String(clamped)] || 1.0; const base = this['base' + statName.charAt(0).toUpperCase() + statName.slice(1)] || this[statName]; return Math.floor(base * mult) }
  getAtk() { return this.getEffectiveStat('atk') }; getDef() { return this.getEffectiveStat('def') }; getSpAtk() { return this.getEffectiveStat('spAtk') }; getSpDef() { return this.getEffectiveStat('spDef') }; getSpd() { return this.getEffectiveStat('spd') }
  changeStage(stat, amount) { if (!this.alive) return; const key = stat.toLowerCase(); if (this.stages[key] === undefined) return; this.stages[key] = Math.max(-6, Math.min(6, this.stages[key] + amount)); this.atk = this.getAtk(); this.def = this.getDef(); this.spAtk = this.getSpAtk(); this.spDef = this.getSpDef(); this.spd = this.getSpd() }
  canAct() { if (!this.alive) return false; if (this.status === 'sleep' || this.status === 'freeze') return false; if (this.status === 'paralysis' && Math.random() < 0.25) return false; return true }
  takeDamage(amount) { this.hp = Math.max(0, this.hp - amount); if (this.hp <= 0) { this.alive = false; this.hp = 0 }; if (this.status === 'sleep') { this.status = null; this.statusTurns = 0 } }
  heal(amount) { this.hp = Math.min(this.maxHp, this.hp + amount) }
  restoreMp(amount) { this.mp = Math.min(this.maxMp, this.mp + amount) }
  applyStatus(status, turns) { if (this.status) return false; this.status = status; if (status === 'sleep') this.statusTurns = turns || Math.floor(Math.random() * 3) + 1; if (status === 'freeze') this.statusTurns = 999; if (status === 'confusion') { this.confusionTurns = turns || Math.floor(Math.random() * 4) + 1 } return true }
  onTurnEnd() { if (this.status === 'burn') this.takeDamage(Math.floor(this.maxHp / 16)); if (this.status === 'poison') this.takeDamage(Math.floor(this.maxHp / 8)); if (this.status === 'sleep') { this.statusTurns--; if (this.statusTurns <= 0) this.status = null }; if (this.status === 'freeze') { if (Math.random() < 0.2) this.status = null }; if (this.confusionTurns > 0) { this.confusionTurns-- } }
}
