import { getTemplate, getSkill, getField, fieldChart, typeChart, digimonTemplates, commonSkills, uniqueSkills } from '../data/digimonData.js'
import { BattleEntity } from './battleEntity.js'

const STATUS_NAMES = { burn:'灼烧', paralysis:'麻痹', poison:'中毒', sleep:'睡眠', freeze:'冰冻', confusion:'混乱' }
const STATUS_LIST = ['burn','paralysis','poison','sleep','freeze','confusion']

export class BattleEngine {
  constructor(playerDigimons, onLog, onStateChange, mapFieldId=null, levelMin=1, levelMax=10, cardBonus=null) {
    this.playerTeam=[]; this.enemyTeam=[]; this.allEntities=[]; this.turnOrder=[]; this.currentIdx=0; this.turn=0; this.phase='init'; this.battleLog=[]
    this.onLog=onLog||(()=>{}); this.onStateChange=onStateChange||(()=>{}); this.autoBattle=false; this.fled=false
    this.mapFieldId=mapFieldId; this.levelMin=levelMin; this.levelMax=levelMax; this.cardBonus=cardBonus; this._initTeams(playerDigimons)
  }

  _initTeams(playerDigimons) {
    for (const d of playerDigimons) { const tpl=getTemplate(d.templateId); const skills=this._parseArr(d.equippedSkills).map(id=>getSkill(id)).filter(Boolean); this.playerTeam.push(new BattleEntity(d,tpl,skills,true,this.cardBonus)) }
    const avgLv=Math.floor(playerDigimons.reduce((s,d)=>s+d.level,0)/Math.max(1,playerDigimons.length))
    const lvMin=this.levelMin||1; const lvMax=this.levelMax||10
    const enemyLevel=Math.max(lvMin,Math.min(lvMax,avgLv+Math.floor(Math.random()*3)-1))
    // 根据玩家队伍最高阶段决定敌人阶段
    const stageOrder = { '成长期':0, '成熟期':1, '完全体':2, '究极体':3 }
    let maxStage = 0
    for (const d of playerDigimons) {
      const tpl = getTemplate(d.templateId)
      if (tpl && stageOrder[tpl.stage] !== undefined) maxStage = Math.max(maxStage, stageOrder[tpl.stage])
      if (d.evolvedTo) { try { const evo = typeof d.evolvedTo === 'string' ? JSON.parse(d.evolvedTo) : d.evolvedTo; if (evo?.stage && stageOrder[evo.stage] !== undefined) maxStage = Math.max(maxStage, stageOrder[evo.stage]) } catch(e) {} }
      if (d.nickname) { const nt = digimonTemplates.find(t => t.name === d.nickname); if (nt && stageOrder[nt.stage] !== undefined) maxStage = Math.max(maxStage, stageOrder[nt.stage]) }
    }
    const targetStage = maxStage // 敌人阶段匹配玩家最高阶段
    for (let i=0;i<3;i++) {
      let pool = digimonTemplates.filter(t => !t.name.includes('X')) // X抗体仅在旧世界出现
      if (this.mapFieldId && this.mapFieldId !== 'old_world') { pool = pool.filter(t => t.fields && t.fields.includes(this.mapFieldId)) }
      if (this.mapFieldId === 'old_world') { pool = [...pool, ...digimonTemplates.filter(t => t.name.includes('X'))] }
      // 筛选匹配阶段的敌人
      const stagePool = pool.filter(t => stageOrder[t.stage] === targetStage)
      const finalPool = stagePool.length > 0 ? stagePool : pool.filter(t => stageOrder[t.stage] === targetStage - 1 || stageOrder[t.stage] === targetStage)
      let tpl = finalPool.length > 0 ? finalPool[Math.floor(Math.random() * finalPool.length)] : pool[Math.floor(Math.random() * pool.length)]
      const enemySkills=this._getEnemySkills(tpl,enemyLevel); const stats=this._genEnemyStats(tpl,enemyLevel)
      const fd={objectId:'enemy_'+i,templateId:tpl.id,nickname:tpl.name,level:enemyLevel,stats,equippedSkills:enemySkills.map(s=>s.id),exp:0,fieldExp:{}}
      this.enemyTeam.push(new BattleEntity(fd,tpl,enemySkills,false))
    }
    this.allEntities=[...this.playerTeam,...this.enemyTeam]; this._sortTurnOrder()
  }

  _getEnemySkills(tpl,level){const skills=[]; if(uniqueSkills[tpl.id]){for(const s of uniqueSkills[tpl.id]){if(s.learnLevel<=level)skills.push(s)}};const needed=Math.max(1,6-skills.length);const shuffled=[...commonSkills].sort(()=>Math.random()-0.5);for(let i=0;i<needed&&i<shuffled.length;i++){if(!skills.find(s=>s.id===shuffled[i].id))skills.push(shuffled[i])};return skills.slice(0,6)}
  _genEnemyStats(tpl,level){const g=(tier)=>({S:3.0,A:2.5,B:2.0,C:1.5,D:1.0}[tier]||2.0);const lv=level-1;const b=(k,d)=>Math.floor((tpl[k]||d)+g(tpl['growth'+k.charAt(0).toUpperCase()+k.slice(1)]||'B')*lv);return{hp:b('baseHp',100),maxHp:b('baseHp',100),mp:b('baseMp',40),maxMp:b('baseMp',40),atk:b('baseAtk',25),def:b('baseDef',18),spAtk:b('baseSpAtk',25),spDef:b('baseSpDef',18),spd:b('baseSpd',18)}}
  _parseArr(val){if(!val)return[];if(typeof val==='string')try{return JSON.parse(val)}catch(e){return[]}return val}
  _sortTurnOrder(){this.turnOrder=this.allEntities.filter(e=>e.alive).sort((a,b)=>{if(b.spd!==a.spd)return b.spd-a.spd;return Math.random()-0.5});this.currentIdx=0}

  start(){this.turn=1;this._sortTurnOrder();if(this.currentActor?.isPlayer){if(this.autoBattle){this.phase='animating';setTimeout(()=>this._runAiTurn(),400)}else{this.phase='playerTurn'}}else{this.phase='aiTurn';setTimeout(()=>this._runAiTurn(),400)};this.log(`⚔️ 战斗开始！第 ${this.turn} 回合`);this.onStateChange()}

  get currentActor(){return this.currentIdx<this.turnOrder.length?this.turnOrder[this.currentIdx]:null}
  get playerAlive(){return this.playerTeam.filter(e=>e.alive)}
  get enemyAlive(){return this.enemyTeam.filter(e=>e.alive)}
  get isOver(){return this.playerAlive.length===0||this.enemyAlive.length===0}
  log(msg){this.battleLog.push(msg);if(this.battleLog.length>50)this.battleLog.shift();this.onLog(msg)}
  get targets(){return this.enemyAlive}

  async playerAction(skillId,targetIdx){if(this.phase!=='playerTurn')return;this.phase='animating';const actor=this.currentActor;const skill=actor.skills.find(s=>s.id===skillId);const t=this.targets;const target=t[targetIdx]||t[0];if(!skill||!target){this.phase='playerTurn';return};await this._executeAction(actor,skill,target);this.onStateChange()}

  async _runAiTurn(){this.phase='animating';const actor=this.currentActor;if(!actor||!actor.alive){this._nextTurn();return};const enemies=actor.isPlayer?this.enemyAlive:this.playerAlive;const{skill,target}=this._aiChoose(actor,enemies);await this._executeAction(actor,skill,target);this.onStateChange()}

  _aiChoose(actor,enemies){const heals=actor.skills.filter(s=>s.healPercent&&s.mpCost<=actor.mp);const attacks=actor.skills.filter(s=>s.type!=='status'&&s.mpCost<=actor.mp);const sm=actor.skills.filter(s=>s.type==='status'&&!s.healPercent&&s.mpCost<=actor.mp);if(actor.hp<actor.maxHp*0.3&&heals.length>0)return{skill:heals[0],target:actor};if(sm.length>0&&Math.random()<0.3)return{skill:sm[0],target:enemies[Math.floor(Math.random()*enemies.length)]||actor};if(attacks.length>0){const se=attacks.find(s=>{const rel=fieldChart[s.field];return rel&&enemies.some(e=>e.fields.includes(rel.strong))});const chosen=se||attacks.sort((a,b)=>(b.power||0)-(a.power||0))[0];return{skill:chosen,target:enemies.sort((a,b)=>a.hp-b.hp)[0]}};return{skill:{id:'struggle',name:'挣扎',type:'physical',field:actor.fields[0]||'nature_spirits',power:20,accuracy:100,mpCost:0,effects:[],statChanges:null},target:enemies[0]||actor}}

  async _executeAction(actor,skill,target) {
    if (!actor.alive) { this._nextTurn(); return }
    if (actor.confusionTurns>0) { this.log(`${actor.name} 陷入混乱！`); if(Math.random()<0.5){ const dmg=this._calcDamage(actor,{...skill,power:20},actor); actor.takeDamage(dmg); this.log(`${actor.name} 攻击了自己，造成 ${dmg} 伤害！`); this._nextTurn(); return } }
    if (!actor.canAct()) { this.log(`${actor.name} ${actor.status==='freeze'?'被冰冻无法行动！':'正在睡眠...'}`); actor.onTurnEnd(); this._nextTurn(); return }
    if (skill.mpCost>0&&actor.mp<skill.mpCost) { this.log(`${actor.name} MP不足，只能挣扎！`); const dmg=this._calcDamage(actor,{type:'physical',field:actor.fields[0]||'nature_spirits',power:20},target); target.takeDamage(dmg); this.log(`挣扎造成 ${dmg} 伤害！`); this._nextTurn(); return }
    actor.mp-=skill.mpCost||0; this.log(`${actor.name} 使用了 ${skill.name}！`)
    if (skill.accuracy<100&&Math.random()*100>skill.accuracy) { this.log('但是没有命中！'); this._nextTurn(); return }
    if (skill.type==='status') this._executeStatus(actor,skill,target); else this._executeAttack(actor,skill,target)
    if (!target.alive) this.log(`${target.name} 倒下了！`)
    await new Promise(r=>setTimeout(r,500)); this._nextTurn()
  }

  _executeAttack(actor,skill,target) {
    const physical=skill.type==='physical'; const atk=physical?actor.getAtk():actor.getSpAtk(); const def=physical?target.getDef():target.getSpDef()
    if (!skill.power||skill.power===0) return
    let dmg=Math.floor(((2*actor.level+10)/250)*(atk/Math.max(1,def))*skill.power+2)
    let hasStab=false, fieldAdv=0, typeAdv=0
    // STAB
    if (actor.fields.includes(skill.field)) { dmg=Math.floor(dmg*1.5); hasStab=true }
    // 领域克制
    const rel=fieldChart[skill.field]; if (rel) { let m=1.0; for (const df of target.fields) { if (df===rel.strong) { m*=1.5; fieldAdv++ } if (df===rel.weak) { m*=0.75; fieldAdv-- } }; if (m!==1.0) dmg=Math.floor(dmg*m) }
    // 种族克制
    const tr=typeChart[actor.type]; if (tr?.strong?.includes(target.type)) { dmg=Math.floor(dmg*1.5); typeAdv++ }; if (tr?.weak?.includes(target.type)) { dmg=Math.floor(dmg*0.75); typeAdv-- }
    // 暴击
    const isCrit=Math.random()<1/16; if (isCrit) { dmg=Math.floor(dmg*1.5); this.log('💥 会心一击！') }
    // 随机
    dmg=Math.floor(dmg*(0.85+Math.random()*0.15))
    if (actor.status==='burn'&&physical) { dmg=Math.floor(dmg*0.5); this.log('🔥 灼烧状态物理伤害减半...') }
    dmg=Math.max(1,dmg)
    // 克制提示
    if (hasStab) this.log('✨ 本领域加成！伤害×1.5')
    if (fieldAdv>0) { const sn=rel?.strong; const fn=sn?getField(sn)?.name:'?'; this.log(`🔺 领域克制！对${fn}领域×1.5`) }
    if (fieldAdv<0) { const wn=rel?.weak; const fn=wn?getField(wn)?.name:'?'; this.log(`🔻 领域不利...对${fn}领域×0.75`) }
    if (typeAdv>0) this.log(`🔺 种族克制！${actor.type}→${target.type} ×1.5`)
    if (typeAdv<0) this.log(`🔻 种族不利...${actor.type}→${target.type} ×0.75`)
    target.takeDamage(dmg)
    this.log(`造成 ${dmg} 伤害！`)
    if (skill.effects) { for (const ef of skill.effects) { if (ef.type&&ef.chance&&Math.random()*100<ef.chance&&STATUS_LIST.includes(ef.type)&&target.applyStatus(ef.type)) this.log(`${target.name} ${STATUS_NAMES[ef.type]}了！`) } }
  }

  _executeStatus(actor,skill,target) {
    const at=skill.target==='self'?actor:target
    if (skill.statChanges) { const sn={atk:'攻击',def:'防御',spAtk:'特攻',spDef:'特防',spd:'速度'}; for (const sc of skill.statChanges) { const t=sc.target==='self'?actor:target; t.changeStage(sc.stat,sc.stages); const dir=sc.stages>0?'提升':'降低'; this.log(`${t.name} ${sn[sc.stat]||sc.stat}${dir}${Math.abs(sc.stages)}级！`) } }
    if (skill.effects) { for (const ef of skill.effects) { if (ef.type&&ef.chance&&Math.random()*100<ef.chance&&STATUS_LIST.includes(ef.type)&&target.applyStatus(ef.type)) this.log(`${target.name} ${STATUS_NAMES[ef.type]}了！`) } }
    if (skill.healPercent) { const amt=Math.floor(actor.maxHp*skill.healPercent/100); actor.heal(amt); this.log(`${actor.name} 回复了 ${amt} HP！`) }
  }

  _calcDamage(attacker,skill,defender,isCrit=false) {
    const physical=skill.type==='physical'; const atk=physical?attacker.getAtk():attacker.getSpAtk(); const def=physical?defender.getDef():defender.getSpDef()
    if (!skill.power||skill.power===0) return 0
    let dmg=Math.floor(((2*attacker.level+10)/250)*(atk/Math.max(1,def))*skill.power+2)
    if (attacker.fields.includes(skill.field)) dmg=Math.floor(dmg*1.5)
    const rel=fieldChart[skill.field]; if (rel) { let m=1.0; for (const df of defender.fields) { if (df===rel.strong) m*=1.5; if (df===rel.weak) m*=0.75 }; dmg=Math.floor(dmg*m) }
    const tr=typeChart[attacker.type]; if (tr?.strong?.includes(defender.type)) dmg=Math.floor(dmg*1.5); if (tr?.weak?.includes(defender.type)) dmg=Math.floor(dmg*0.75)
    dmg=Math.floor(dmg*(0.85+Math.random()*0.15)); if (isCrit) dmg=Math.floor(dmg*1.5); if (attacker.status==='burn'&&physical) dmg=Math.floor(dmg*0.5)
    return Math.max(1,dmg)
  }

  _nextTurn() {
    this.currentIdx++
    if (this.currentIdx>=this.turnOrder.length||this.isOver) {
      for (const e of this.turnOrder) { if (e.alive) e.onTurnEnd() }
      if (this.isOver) { this.phase='ended'; this.log(this.playerAlive.length>0?'🎉 战斗胜利！':'💀 战斗失败...'); this.onStateChange(); return }
      this.turn++; this._sortTurnOrder(); this.log(`── 第 ${this.turn} 回合 ──`)
    }
    this.onStateChange(); if (!this.currentActor?.alive) { this._nextTurn(); return }
    if (this.currentActor?.isPlayer) { if (this.autoBattle) { this.phase='animating'; setTimeout(()=>this._runAiTurn(),300) } else { this.phase='playerTurn' } }
    else { this.phase='aiTurn'; setTimeout(()=>this._runAiTurn(),400) }
  }

  getRewards() { const totalLv=this.enemyTeam.reduce((s,e)=>s+e.level,0); const fe={}; for (const enemy of this.enemyTeam) { for (const fid of enemy.fields) { fe[fid]=(fe[fid]||0)+5 } }; return { expPer:Math.floor(totalLv*10/Math.max(1,this.playerTeam.length)), gold:totalLv*30, fieldExp:fe } }
}
