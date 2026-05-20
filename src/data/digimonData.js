export const GROWTH_MAP = { S: 3.0, A: 2.5, B: 2.0, C: 1.5, D: 1.0 }

export const fields = [
  { id: 'nature_spirits', name: '自然精灵', emoji: '🌿', color: '#4ecca3', desc: '栖息于森林、草原等自然环境的数码宝贝。' },
  { id: 'deep_savers', name: '深海救星', emoji: '🌊', color: '#4e9fff', desc: '掌管海洋、冰域的水系数码宝贝。' },
  { id: 'nightmare_soldiers', name: '噩梦士兵', emoji: '👻', color: '#b44dff', desc: '操纵黑暗、幻术、恐惧的数码宝贝。' },
  { id: 'wind_guardians', name: '风之守卫', emoji: '🪽', color: '#00d4ff', desc: '掌控天空与风暴的数码宝贝。' },
  { id: 'metal_empire', name: '金属帝国', emoji: '⚙️', color: '#aab', desc: '全身由机械或合金构成的数码宝贝。' },
  { id: 'virus_busters', name: '病毒克星', emoji: '✨', color: '#ffd700', desc: '持有神圣力量的数码宝贝。' },
  { id: 'dragons_roar', name: '龙之咆哮', emoji: '🐲', color: '#e94560', desc: '拥有龙族血统的数码宝贝。' },
  { id: 'jungle_troopers', name: '丛林奇兵', emoji: '🌴', color: '#ffaa00', desc: '虫型与植物型，擅长奇袭和毒素。' },
  { id: 'dark_area', name: '黑暗区域', emoji: '💀', color: '#7b2d8b', desc: '源自黑暗区域的恶魔与不死型。' },
  { id: 'unknown', name: '未知领域', emoji: '❓', color: '#5c6b7a', desc: '不属于任何已知领域的奇特存在。' }
]

export function getField(id) { return fields.find(f => f.id === id) }
export function getFieldByName(name) { return fields.find(f => f.name === name) }

export const fieldChart = {
  nature_spirits:{ strong:'deep_savers', weak:'jungle_troopers' },
  deep_savers:{ strong:'dragons_roar', weak:'nature_spirits' },
  dragons_roar:{ strong:'metal_empire', weak:'deep_savers' },
  metal_empire:{ strong:'jungle_troopers', weak:'dragons_roar' },
  jungle_troopers:{ strong:'nature_spirits', weak:'metal_empire' },
  virus_busters:{ strong:'nightmare_soldiers', weak:'unknown' },
  nightmare_soldiers:{ strong:'wind_guardians', weak:'virus_busters' },
  wind_guardians:{ strong:'dark_area', weak:'nightmare_soldiers' },
  dark_area:{ strong:'unknown', weak:'wind_guardians' },
  unknown:{ strong:'virus_busters', weak:'dark_area' }
}

export const types = ['疫苗', '数据', '病毒', '自由', '未知']
export const typeColors = { '疫苗':'#4ecca3', '数据':'#00d4ff', '病毒':'#e94560', '自由':'#ffd700', '未知':'#b44dff' }
export const typeIcons = { '疫苗':'💉', '数据':'💾', '病毒':'🦠', '自由':'🕊️', '未知':'❓' }
export const typeChart = {
  '疫苗':{ strong:['病毒'], weak:['数据'] },
  '数据':{ strong:['疫苗'], weak:['病毒'] },
  '病毒':{ strong:['数据'], weak:['疫苗'] },
  '自由':{ strong:[], weak:[] },
  '未知':{ strong:['疫苗','数据','病毒','自由'], weak:['疫苗','数据','病毒','自由'] }
}

export const natures = [
  { id:'hardy',name:'勤奋',boost:null,reduce:null},{ id:'docile',name:'坦率',boost:null,reduce:null},
  { id:'bashful',name:'害羞',boost:null,reduce:null},{ id:'serious',name:'认真',boost:null,reduce:null},
  { id:'quirky',name:'浮躁',boost:null,reduce:null},
  { id:'lonely',name:'怕寂寞',boost:'atk',reduce:'def'},{ id:'adamant',name:'固执',boost:'atk',reduce:'spAtk'},
  { id:'naughty',name:'顽皮',boost:'atk',reduce:'spDef'},{ id:'brave',name:'勇敢',boost:'atk',reduce:'spd'},
  { id:'bold',name:'大胆',boost:'def',reduce:'atk'},{ id:'impish',name:'淘气',boost:'def',reduce:'spAtk'},
  { id:'lax',name:'乐天',boost:'def',reduce:'spDef'},{ id:'relaxed',name:'悠闲',boost:'def',reduce:'spd'},
  { id:'modest',name:'保守',boost:'spAtk',reduce:'atk'},{ id:'mild',name:'稳重',boost:'spAtk',reduce:'def'},
  { id:'rash',name:'马虎',boost:'spAtk',reduce:'spDef'},{ id:'quiet',name:'冷静',boost:'spAtk',reduce:'spd'},
  { id:'calm',name:'沉着',boost:'spDef',reduce:'atk'},{ id:'gentle',name:'温顺',boost:'spDef',reduce:'def'},
  { id:'careful',name:'慎重',boost:'spDef',reduce:'spAtk'},{ id:'sassy',name:'狂妄',boost:'spDef',reduce:'spd'},
  { id:'timid',name:'胆小',boost:'spd',reduce:'atk'},{ id:'hasty',name:'急躁',boost:'spd',reduce:'def'},
  { id:'jolly',name:'爽朗',boost:'spd',reduce:'spAtk'},{ id:'naive',name:'天真',boost:'spd',reduce:'spDef'}
]
export function getNature(id) { return natures.find(n => n.id === id) }
export function randomNature() { return natures[Math.floor(Math.random() * natures.length)] }

export const abilities = {
  dragon_will:{ id:'dragon_will', name:'龙之斗志', desc:'体内流淌的龙族之血在危机时刻沸腾。HP低于一半时，攻击力大幅提升20%，越战越勇。' },
  flame_power:{ id:'flame_power', name:'火焰之力', desc:'与生俱来的火焰亲和性，释放龙之咆哮领域的技能时威力增强15%，烈焰焚烧一切敌人。' },
  fur_armor:{ id:'fur_armor', name:'毛皮护甲', desc:'覆盖全身的厚实毛皮如同天然铠甲，受到物理攻击时有20%几率抵消30%的伤害。' },
  frost_breath:{ id:'frost_breath', name:'极寒吐息', desc:'体内蕴含的极寒之力在登场时扩散全场，降低敌方全体速度10%，抢占先机。' },
  gale_wings:{ id:'gale_wings', name:'疾风之翼', desc:'驾驭风之力的双翼不受任何束缚，速度永远不会被对手降低，始终保持巅峰机动性。' },
  blaze_feather:{ id:'blaze_feather', name:'烈焰羽毛', desc:'羽翼中潜藏着灼热的火焰能量，每次攻击有10%几率灼烧对手，造成持续伤害。' },
  hard_shell:{ id:'hard_shell', name:'坚硬甲壳', desc:'经过千锤百炼的甲壳坚不可摧，受到属性克制的伤害时减少25%，弱点也不再致命。' },
  static_discharge:{ id:'static_discharge', name:'静电放电', desc:'甲壳表面蓄积着高压静电，受到近距离物理攻击时有30%几率反噬对手使其麻痹。' },
  ocean_power:{ id:'ocean_power', name:'海洋之力', desc:'与大海的共鸣带来无尽的生命力，每回合结束时自动恢复5%最大HP，续航能力极强。' },
  fish_guard:{ id:'fish_guard', name:'鱼群守护', desc:'呼唤鱼群在身旁形成防护屏障，受到多段攻击时，从第二击开始伤害降低20%。' },
  holy_blessing:{ id:'holy_blessing', name:'神圣加护', desc:'被神圣力量庇护的天使，免疫任何一击必杀类的致命攻击，不会被秒杀。' },
  light_of_hope:{ id:'light_of_hope', name:'希望之光', desc:'击败敌人时希望之光闪耀全身，回复最大HP的15%，在连续战斗中保持持久战力。' },
  saint_scent:{ id:'saint_scent', name:'圣兽嗅觉', desc:'敏锐的圣兽直觉能在登场瞬间洞察对手携带的道具，知己知彼百战不殆。' },
  first_strike_heart:{ id:'first_strike_heart', name:'先制之心', desc:'越是危急时刻反应越是敏捷。HP低于25%时速度激增50%，绝境中逆转战局的关键。' },
  dragon_pressure:{ id:'dragon_pressure', name:'龙之威压', desc:'龙族王者的压迫感令人窒息。登场时威压笼罩全场，降低敌方全体攻击力10%。' },
  berserker:{ id:'berserker', name:'狂战士', desc:'越是受伤战意越是高昂。每次受到攻击后攻击力提升10%，最多叠加3层，如同暴走的战斗机器。' },
  prankster:{ id:'prankster', name:'恶作剧之心', desc:'天性狡猾擅长先发制人，所有变化类技能的优先度+1，总是能抢先干扰对手。' },
  shadow_walk:{ id:'shadow_walk', name:'暗夜潜行', desc:'在阴影中穿梭的身法令人捉摸不定，被攻击时有15%几率完全闪避，毫发无伤。' },
  natural_harmony:{ id:'natural_harmony', name:'自然调和', desc:'与大自然的和谐共鸣能净化一切负面状态，每回合结束时自动解除身上一项异常状态。' },
  seedling_regen:{ id:'seedling_regen', name:'幼苗再生', desc:'即使身负异常状态，生命之芽仍顽强生长，陷入异常时每回合回复10%最大HP，逆境中屹立不倒。' }
}
export function getAbility(id) { return abilities[id] || null }

export const digimonTemplates = [
  { id:'agumon',name:'亚古兽',stage:'成长期',fields:['nature_spirits','dragons_roar'],type:'疫苗',description:'爬虫类型的数码宝贝，必杀技是从口中吐出火焰弹「小型火焰」。',baseHp:110,baseMp:40,baseAtk:30,baseDef:20,baseSpAtk:25,baseSpDef:18,baseSpd:18,growthHp:'B',growthMp:'C',growthAtk:'A',growthDef:'B',growthSpAtk:'B',growthSpDef:'C',growthSpd:'B',abilities:['dragon_will','flame_power'],evolutionTree:[{name:'暴龙兽',stage:'成熟期',method:'level',condition:16,fields:['dragons_roar','nature_spirits'],type:'疫苗',fieldExpRequired:{dragons_roar:50}}] },
  { id:'gabumon',name:'加布兽',stage:'成长期',fields:['deep_savers','dragons_roar'],type:'数据',description:'披着毛皮的爬虫类型数码宝贝，必杀技是「爆炎火焰弹」。',baseHp:100,baseMp:45,baseAtk:22,baseDef:18,baseSpAtk:32,baseSpDef:20,baseSpd:22,growthHp:'B',growthMp:'B',growthAtk:'C',growthDef:'C',growthSpAtk:'A',growthSpDef:'B',growthSpd:'A',abilities:['fur_armor','frost_breath'],evolutionTree:[{name:'加鲁鲁兽',stage:'成熟期',method:'level',condition:16,fields:['deep_savers','nature_spirits'],type:'数据',fieldExpRequired:{deep_savers:50}}] },
  { id:'piyomon',name:'比丘兽',stage:'成长期',fields:['wind_guardians','nature_spirits'],type:'疫苗',description:'雏鸟类型的数码宝贝，必杀技是「魔法火焰」。',baseHp:95,baseMp:42,baseAtk:22,baseDef:16,baseSpAtk:28,baseSpDef:16,baseSpd:28,growthHp:'C',growthMp:'B',growthAtk:'C',growthDef:'D',growthSpAtk:'B',growthSpDef:'D',growthSpd:'S',abilities:['gale_wings','blaze_feather'],evolutionTree:[{name:'巴多拉兽',stage:'成熟期',method:'level',condition:16,fields:['wind_guardians','dragons_roar'],type:'疫苗',fieldExpRequired:{wind_guardians:50}}] },
  { id:'tentomon',name:'甲虫兽',stage:'成长期',fields:['jungle_troopers','metal_empire'],type:'疫苗',description:'昆虫类型的数码宝贝，必杀技是「小型雷电」。',baseHp:115,baseMp:35,baseAtk:20,baseDef:28,baseSpAtk:22,baseSpDef:26,baseSpd:15,growthHp:'B',growthMp:'C',growthAtk:'C',growthDef:'A',growthSpAtk:'C',growthSpDef:'A',growthSpd:'D',abilities:['hard_shell','static_discharge'],evolutionTree:[{name:'比多兽',stage:'成熟期',method:'level',condition:16,fields:['jungle_troopers','metal_empire'],type:'疫苗',fieldExpRequired:{jungle_troopers:50}}] },
  { id:'gomamon',name:'哥玛兽',stage:'成长期',fields:['deep_savers','nature_spirits'],type:'疫苗',description:'海兽类型的数码宝贝，必杀技是「鱼群大暴走」。',baseHp:105,baseMp:40,baseAtk:22,baseDef:22,baseSpAtk:22,baseSpDef:24,baseSpd:18,growthHp:'B',growthMp:'B',growthAtk:'C',growthDef:'B',growthSpAtk:'C',growthSpDef:'B',growthSpd:'C',abilities:['ocean_power','fish_guard'],evolutionTree:[{name:'海狮兽',stage:'成熟期',method:'level',condition:16,fields:['deep_savers','nature_spirits'],type:'疫苗',fieldExpRequired:{deep_savers:50}}] },
  { id:'patamon',name:'巴达兽',stage:'成长期',fields:['wind_guardians','virus_busters'],type:'数据',description:'哺乳类型的数码宝贝，必杀技是「空气炮」。',baseHp:88,baseMp:50,baseAtk:15,baseDef:12,baseSpAtk:35,baseSpDef:14,baseSpd:24,growthHp:'D',growthMp:'A',growthAtk:'D',growthDef:'D',growthSpAtk:'S',growthSpDef:'D',growthSpd:'B',abilities:['holy_blessing','light_of_hope'],evolutionTree:[{name:'天使兽',stage:'成熟期',method:'level',condition:16,fields:['virus_busters','wind_guardians'],type:'数据',fieldExpRequired:{virus_busters:50}}] },
  { id:'plotmon',name:'小狗兽',stage:'成长期',fields:['nature_spirits','virus_busters'],type:'疫苗',description:'圣兽类型的数码宝贝，必杀技是「小狗咆哮」。',baseHp:92,baseMp:48,baseAtk:18,baseDef:14,baseSpAtk:28,baseSpDef:20,baseSpd:26,growthHp:'C',growthMp:'A',growthAtk:'D',growthDef:'D',growthSpAtk:'B',growthSpDef:'B',growthSpd:'S',abilities:['saint_scent','first_strike_heart'],evolutionTree:[{name:'迪路兽',stage:'成熟期',method:'level',condition:16,fields:['virus_busters','nature_spirits'],type:'疫苗',fieldExpRequired:{virus_busters:50}}] },
  { id:'guilmon',name:'基尔兽',stage:'成长期',fields:['dragons_roar','dark_area'],type:'病毒',description:'魔龙类型的数码宝贝，必杀技是「基尔火炮」。',baseHp:120,baseMp:35,baseAtk:32,baseDef:24,baseSpAtk:20,baseSpDef:18,baseSpd:14,growthHp:'A',growthMp:'C',growthAtk:'A',growthDef:'B',growthSpAtk:'D',growthSpDef:'C',growthSpd:'D',abilities:['dragon_pressure','berserker'],evolutionTree:[{name:'古拉兽',stage:'成熟期',method:'level',condition:16,fields:['dragons_roar','dark_area'],type:'病毒',fieldExpRequired:{dragons_roar:50}}] },
  { id:'impmon',name:'小妖兽',stage:'成长期',fields:['nightmare_soldiers','dark_area'],type:'病毒',description:'小恶魔类型的数码宝贝，必杀技是「暗夜之炎」。',baseHp:80,baseMp:42,baseAtk:34,baseDef:12,baseSpAtk:24,baseSpDef:12,baseSpd:27,growthHp:'D',growthMp:'B',growthAtk:'S',growthDef:'D',growthSpAtk:'C',growthSpDef:'D',growthSpd:'A',abilities:['prankster','shadow_walk'],evolutionTree:[{name:'恶魔兽',stage:'成熟期',method:'level',condition:16,fields:['nightmare_soldiers','dark_area'],type:'病毒',fieldExpRequired:{nightmare_soldiers:50}}] },
  { id:'lalamon',name:'拉拉兽',stage:'成长期',fields:['nature_spirits','jungle_troopers'],type:'数据',description:'植物类型的数码宝贝，必杀技是「坚果射击」。',baseHp:100,baseMp:45,baseAtk:16,baseDef:20,baseSpAtk:30,baseSpDef:28,baseSpd:17,growthHp:'B',growthMp:'A',growthAtk:'D',growthDef:'B',growthSpAtk:'A',growthSpDef:'S',growthSpd:'C',abilities:['natural_harmony','seedling_regen'],evolutionTree:[{name:'向日葵兽',stage:'成熟期',method:'level',condition:16,fields:['jungle_troopers','nature_spirits'],type:'数据',fieldExpRequired:{jungle_troopers:50}}] },

  // 成熟期 (10只)
  { id:'greymon',name:'暴龙兽',stage:'成熟期',fields:['dragons_roar','nature_spirits'],type:'疫苗',description:'恐龙型数码宝贝，头骨覆盖坚硬甲壳，必杀技是「超级火焰」。',baseHp:145,baseMp:55,baseAtk:50,baseDef:32,baseSpAtk:38,baseSpDef:28,baseSpd:28,growthHp:'A',growthMp:'C',growthAtk:'S',growthDef:'B',growthSpAtk:'B',growthSpDef:'C',growthSpd:'B',abilities:['dragon_will','flame_power'],evolutionTree:[{name:'机械暴龙兽',stage:'完全体',method:'level',condition:32,fields:['dragons_roar','metal_empire'],type:'疫苗',fieldExpRequired:{dragons_roar:150,metal_empire:50}},{name:'丧尸暴龙兽',stage:'完全体',method:'level',condition:34,fields:['dark_area','dragons_roar'],type:'病毒',fieldExpRequired:{dark_area:200}}] },
  { id:'garurumon',name:'加鲁鲁兽',stage:'成熟期',fields:['deep_savers','nature_spirits'],type:'数据',description:'狼型数码宝贝，覆盖着青白色毛皮，必杀技是「妖狐火焰」。',baseHp:130,baseMp:60,baseAtk:42,baseDef:28,baseSpAtk:50,baseSpDef:32,baseSpd:36,growthHp:'B',growthMp:'B',growthAtk:'B',growthDef:'C',growthSpAtk:'A',growthSpDef:'B',growthSpd:'S',abilities:['fur_armor','frost_breath'],evolutionTree:[{name:'兽人加鲁鲁',stage:'完全体',method:'level',condition:32,fields:['deep_savers','nature_spirits'],type:'数据',fieldExpRequired:{deep_savers:150}}] },
  { id:'birdramon',name:'巴多拉兽',stage:'成熟期',fields:['wind_guardians','dragons_roar'],type:'疫苗',description:'巨鸟型数码宝贝，双翼缠绕着火焰，必杀技是「陨石巨翼」。',baseHp:125,baseMp:56,baseAtk:44,baseDef:24,baseSpAtk:46,baseSpDef:24,baseSpd:44,growthHp:'C',growthMp:'B',growthAtk:'B',growthDef:'D',growthSpAtk:'A',growthSpDef:'D',growthSpd:'S',abilities:['gale_wings','blaze_feather'],evolutionTree:[{name:'伽楼达兽',stage:'完全体',method:'level',condition:32,fields:['wind_guardians','nature_spirits'],type:'疫苗',fieldExpRequired:{wind_guardians:150}}] },
  { id:'kabuterimon',name:'比多兽',stage:'成熟期',fields:['jungle_troopers','metal_empire'],type:'疫苗',description:'昆虫型数码宝贝，拥有坚硬的蓝色甲壳，必杀技是「米加巨炮」。',baseHp:150,baseMp:48,baseAtk:38,baseDef:45,baseSpAtk:38,baseSpDef:42,baseSpd:22,growthHp:'A',growthMp:'C',growthAtk:'B',growthDef:'S',growthSpAtk:'C',growthSpDef:'S',growthSpd:'D',abilities:['hard_shell','static_discharge'],evolutionTree:[{name:'超比多兽',stage:'完全体',method:'level',condition:32,fields:['jungle_troopers','metal_empire'],type:'疫苗',fieldExpRequired:{jungle_troopers:150}}] },
  { id:'ikkakumon',name:'海狮兽',stage:'成熟期',fields:['deep_savers','nature_spirits'],type:'疫苗',description:'海兽型数码宝贝，头顶长有尖锐独角，必杀技是「北极光击」。',baseHp:138,baseMp:54,baseAtk:42,baseDef:36,baseSpAtk:38,baseSpDef:38,baseSpd:26,growthHp:'B',growthMp:'B',growthAtk:'B',growthDef:'A',growthSpAtk:'B',growthSpDef:'A',growthSpd:'C',abilities:['ocean_power','fish_guard'],evolutionTree:[{name:'祖顿兽',stage:'完全体',method:'level',condition:32,fields:['deep_savers','nature_spirits'],type:'疫苗',fieldExpRequired:{deep_savers:150}}] },
  { id:'angemon',name:'天使兽',stage:'成熟期',fields:['virus_busters','wind_guardians'],type:'数据',description:'天使型数码宝贝，拥有六片闪耀羽翼，必杀技是「天堂之拳」。',baseHp:115,baseMp:68,baseAtk:32,baseDef:22,baseSpAtk:58,baseSpDef:28,baseSpd:36,growthHp:'D',growthMp:'S',growthAtk:'C',growthDef:'D',growthSpAtk:'S',growthSpDef:'C',growthSpd:'A',abilities:['holy_blessing','light_of_hope'],evolutionTree:[{name:'神圣天使兽',stage:'完全体',method:'level',condition:32,fields:['virus_busters','wind_guardians'],type:'数据',fieldExpRequired:{virus_busters:150}}] },
  { id:'tailmon',name:'迪路兽',stage:'成熟期',fields:['virus_busters','nature_spirits'],type:'疫苗',description:'圣兽型数码宝贝，尾巴上戴着神圣环，必杀技是「猫猫拳」。',baseHp:120,baseMp:64,baseAtk:36,baseDef:26,baseSpAtk:48,baseSpDef:34,baseSpd:42,growthHp:'C',growthMp:'S',growthAtk:'C',growthDef:'C',growthSpAtk:'A',growthSpDef:'B',growthSpd:'S',abilities:['saint_scent','first_strike_heart'],evolutionTree:[{name:'天女兽',stage:'完全体',method:'level',condition:32,fields:['virus_busters','wind_guardians'],type:'疫苗',fieldExpRequired:{virus_busters:150}}] },
  { id:'growlmon',name:'古拉兽',stage:'成熟期',fields:['dragons_roar','dark_area'],type:'病毒',description:'魔龙型数码宝贝，浑身燃烧着暗红火焰，必杀技是「魔龙火焰」。',baseHp:158,baseMp:48,baseAtk:55,baseDef:38,baseSpAtk:32,baseSpDef:28,baseSpd:20,growthHp:'S',growthMp:'C',growthAtk:'S',growthDef:'B',growthSpAtk:'D',growthSpDef:'C',growthSpd:'D',abilities:['dragon_pressure','berserker'],evolutionTree:[{name:'大古拉兽',stage:'完全体',method:'level',condition:32,fields:['dragons_roar','metal_empire'],type:'病毒',fieldExpRequired:{dragons_roar:150}}] },
  { id:'devimon',name:'恶魔兽',stage:'成熟期',fields:['nightmare_soldiers','dark_area'],type:'病毒',description:'堕天使型数码宝贝，拥有漆黑的恶魔之翼，必杀技是「死亡之爪」。',baseHp:105,baseMp:56,baseAtk:52,baseDef:22,baseSpAtk:42,baseSpDef:22,baseSpd:40,growthHp:'D',growthMp:'B',growthAtk:'S',growthDef:'D',growthSpAtk:'B',growthSpDef:'D',growthSpd:'A',abilities:['prankster','shadow_walk'],evolutionTree:[{name:'吸血魔兽',stage:'完全体',method:'level',condition:32,fields:['dark_area','nightmare_soldiers'],type:'病毒',fieldExpRequired:{dark_area:150}}] },
  { id:'sunflowmon',name:'向日葵兽',stage:'成熟期',fields:['jungle_troopers','nature_spirits'],type:'数据',description:'植物型数码宝贝，外形如同巨大向日葵，必杀技是「阳光烈焰」。',baseHp:130,baseMp:62,baseAtk:28,baseDef:34,baseSpAtk:50,baseSpDef:44,baseSpd:24,growthHp:'B',growthMp:'A',growthAtk:'D',growthDef:'A',growthSpAtk:'A',growthSpDef:'S',growthSpd:'C',abilities:['natural_harmony','seedling_regen'],evolutionTree:[{name:'丁香兽',stage:'完全体',method:'level',condition:32,fields:['jungle_troopers','nature_spirits'],type:'数据',fieldExpRequired:{jungle_troopers:150}}] },

  // 完全体 (11只)
  { id:'metal_greymon',name:'机械暴龙兽',stage:'完全体',fields:['dragons_roar','metal_empire'],type:'疫苗',description:'改造型数码宝贝，身体一半以上已机械化，必杀技是「究极破坏炮」。',baseHp:180,baseMp:68,baseAtk:72,baseDef:52,baseSpAtk:60,baseSpDef:42,baseSpd:38,growthHp:'S',growthMp:'C',growthAtk:'S',growthDef:'A',growthSpAtk:'A',growthSpDef:'B',growthSpd:'B',abilities:['dragon_will','flame_power'],evolutionTree:[{name:'战斗暴龙兽',stage:'究极体',method:'level',condition:48,fields:['dragons_roar','virus_busters'],type:'疫苗',fieldExpRequired:{dragons_roar:300}}] },
  { id:'skull_greymon',name:'丧尸暴龙兽',stage:'完全体',fields:['dark_area','dragons_roar'],type:'病毒',description:'不死型数码宝贝，只剩下骨骸的暴龙兽暴走形态，必杀技是「零式导弹」。',baseHp:168,baseMp:58,baseAtk:85,baseDef:40,baseSpAtk:48,baseSpDef:32,baseSpd:44,growthHp:'A',growthMp:'C',growthAtk:'S',growthDef:'C',growthSpAtk:'B',growthSpDef:'C',growthSpd:'A',abilities:['berserker','dragon_pressure'],evolutionTree:[{name:'黑暗战斗暴龙兽',stage:'究极体',method:'level',condition:48,fields:['dark_area','dragons_roar'],type:'病毒',fieldExpRequired:{dark_area:300}}] },
  { id:'were_garurumon',name:'兽人加鲁鲁',stage:'完全体',fields:['deep_savers','nature_spirits'],type:'数据',description:'兽人型数码宝贝，以双足行走的狼人战士，必杀技是「凯撒锐爪」。',baseHp:162,baseMp:72,baseAtk:68,baseDef:42,baseSpAtk:62,baseSpDef:44,baseSpd:50,growthHp:'B',growthMp:'B',growthAtk:'A',growthDef:'B',growthSpAtk:'A',growthSpDef:'B',growthSpd:'S',abilities:['fur_armor','frost_breath'],evolutionTree:[{name:'钢铁加鲁鲁',stage:'究极体',method:'level',condition:48,fields:['deep_savers','metal_empire'],type:'数据',fieldExpRequired:{deep_savers:300,metal_empire:100}}] },
  { id:'garudamon',name:'伽楼达兽',stage:'完全体',fields:['wind_guardians','nature_spirits'],type:'疫苗',description:'鸟人型数码宝贝，拥有四片巨大羽翼的守护神，必杀技是「影翼斩」。',baseHp:155,baseMp:68,baseAtk:65,baseDef:36,baseSpAtk:68,baseSpDef:36,baseSpd:58,growthHp:'C',growthMp:'B',growthAtk:'A',growthDef:'D',growthSpAtk:'S',growthSpDef:'C',growthSpd:'S',abilities:['gale_wings','blaze_feather'],evolutionTree:[{name:'凤凰兽',stage:'究极体',method:'level',condition:48,fields:['wind_guardians','virus_busters'],type:'疫苗',fieldExpRequired:{wind_guardians:300}}] },
  { id:'atlur_kabuterimon',name:'超比多兽',stage:'完全体',fields:['jungle_troopers','metal_empire'],type:'疫苗',description:'昆虫型数码宝贝，全身覆盖红色金属甲壳，必杀技是「巨角粉碎」。',baseHp:188,baseMp:58,baseAtk:55,baseDef:68,baseSpAtk:52,baseSpDef:64,baseSpd:30,growthHp:'S',growthMp:'C',growthAtk:'B',growthDef:'S',growthSpAtk:'B',growthSpDef:'S',growthSpd:'D',abilities:['hard_shell','static_discharge'],evolutionTree:[{name:'力神比多兽',stage:'究极体',method:'level',condition:48,fields:['jungle_troopers','virus_busters'],type:'疫苗',fieldExpRequired:{jungle_troopers:300}}] },
  { id:'zudomon',name:'祖顿兽',stage:'完全体',fields:['deep_savers','nature_spirits'],type:'疫苗',description:'海兽型数码宝贝，背着巨大龟壳挥舞雷神之锤，必杀技是「雷神之锤」。',baseHp:172,baseMp:66,baseAtk:65,baseDef:58,baseSpAtk:52,baseSpDef:52,baseSpd:34,growthHp:'A',growthMp:'B',growthAtk:'A',growthDef:'S',growthSpAtk:'B',growthSpDef:'A',growthSpd:'C',abilities:['ocean_power','fish_guard'],evolutionTree:[{name:'维京兽',stage:'究极体',method:'level',condition:48,fields:['deep_savers','metal_empire'],type:'疫苗',fieldExpRequired:{deep_savers:300}}] },
  { id:'holy_angemon',name:'神圣天使兽',stage:'完全体',fields:['virus_busters','wind_guardians'],type:'数据',description:'大天使型数码宝贝，左手装备圣剑右手持有天国之门，必杀技是「天国之门」。',baseHp:142,baseMp:82,baseAtk:48,baseDef:38,baseSpAtk:78,baseSpDef:45,baseSpd:50,growthHp:'D',growthMp:'S',growthAtk:'C',growthDef:'C',growthSpAtk:'S',growthSpDef:'B',growthSpd:'S',abilities:['holy_blessing','light_of_hope'],evolutionTree:[{name:'究极天使兽',stage:'究极体',method:'level',condition:48,fields:['virus_busters','nature_spirits'],type:'数据',fieldExpRequired:{virus_busters:300}}] },
  { id:'angewomon',name:'天女兽',stage:'完全体',fields:['virus_busters','wind_guardians'],type:'疫苗',description:'大天使型数码宝贝，手持神圣弓箭的女战神，必杀技是「神圣弓箭」。',baseHp:148,baseMp:78,baseAtk:52,baseDef:38,baseSpAtk:70,baseSpDef:52,baseSpd:55,growthHp:'C',growthMp:'S',growthAtk:'B',growthDef:'C',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['saint_scent','first_strike_heart'],evolutionTree:[{name:'神圣天女兽',stage:'究极体',method:'level',condition:48,fields:['virus_busters','nature_spirits'],type:'疫苗',fieldExpRequired:{virus_busters:300}}] },
  { id:'megalo_growlmon',name:'大古拉兽',stage:'完全体',fields:['dragons_roar','metal_empire'],type:'病毒',description:'机械型数码宝贝，双臂装备等离子利刃，必杀技是「原子爆裂」。',baseHp:192,baseMp:58,baseAtk:80,baseDef:55,baseSpAtk:45,baseSpDef:42,baseSpd:28,growthHp:'S',growthMp:'C',growthAtk:'S',growthDef:'A',growthSpAtk:'D',growthSpDef:'C',growthSpd:'D',abilities:['dragon_pressure','berserker'],evolutionTree:[{name:'红莲骑士兽',stage:'究极体',method:'level',condition:48,fields:['dragons_roar','virus_busters'],type:'病毒',fieldExpRequired:{dragons_roar:300}}] },
  { id:'vamdemon',name:'吸血魔兽',stage:'完全体',fields:['dark_area','nightmare_soldiers'],type:'病毒',description:'不死型数码宝贝，披着黑色斗篷的吸血鬼之王，必杀技是「血蝙蝠」。',baseHp:135,baseMp:70,baseAtk:68,baseDef:34,baseSpAtk:62,baseSpDef:36,baseSpd:52,growthHp:'D',growthMp:'A',growthAtk:'S',growthDef:'D',growthSpAtk:'A',growthSpDef:'C',growthSpd:'S',abilities:['prankster','shadow_walk'],evolutionTree:[{name:'怨毒吸血魔兽',stage:'究极体',method:'level',condition:48,fields:['dark_area','nightmare_soldiers'],type:'病毒',fieldExpRequired:{dark_area:300}}] },
  { id:'lilamon',name:'丁香兽',stage:'完全体',fields:['jungle_troopers','nature_spirits'],type:'数据',description:'妖精型数码宝贝，拥有花朵般美丽的姿态，必杀技是「花仙炮」。',baseHp:158,baseMp:76,baseAtk:42,baseDef:52,baseSpAtk:72,baseSpDef:62,baseSpd:34,growthHp:'B',growthMp:'A',growthAtk:'D',growthDef:'A',growthSpAtk:'S',growthSpDef:'S',growthSpd:'C',abilities:['natural_harmony','seedling_regen'],evolutionTree:[{name:'蔷薇兽',stage:'究极体',method:'level',condition:48,fields:['jungle_troopers','virus_busters'],type:'数据',fieldExpRequired:{jungle_troopers:300}}] },

  // 究极体 (11只)
  { id:'war_greymon',name:'战斗暴龙兽',stage:'究极体',fields:['dragons_roar','virus_busters'],type:'疫苗',description:'龙人型数码宝贝，身穿超金属铠甲的最强龙战士，必杀技是「盖亚之力」。',baseHp:215,baseMp:80,baseAtk:98,baseDef:72,baseSpAtk:82,baseSpDef:62,baseSpd:54,growthHp:'S',growthMp:'B',growthAtk:'S',growthDef:'A',growthSpAtk:'S',growthSpDef:'B',growthSpd:'A',abilities:['dragon_will','flame_power'] },
  { id:'black_war_greymon',name:'黑暗战斗暴龙兽',stage:'究极体',fields:['dark_area','dragons_roar'],type:'病毒',description:'龙人型数码宝贝，被黑暗力量侵蚀的战斗暴龙兽，必杀技是「黑暗盖亚」。',baseHp:205,baseMp:75,baseAtk:105,baseDef:60,baseSpAtk:88,baseSpDef:55,baseSpd:58,growthHp:'S',growthMp:'B',growthAtk:'S',growthDef:'B',growthSpAtk:'S',growthSpDef:'C',growthSpd:'A',abilities:['berserker','dragon_pressure'] },
  { id:'metal_garurumon',name:'钢铁加鲁鲁',stage:'究极体',fields:['deep_savers','metal_empire'],type:'数据',description:'改造型数码宝贝，全身机械化装备无数导弹，必杀技是「绝对冷冻气」。',baseHp:195,baseMp:85,baseAtk:82,baseDef:62,baseSpAtk:88,baseSpDef:58,baseSpd:62,growthHp:'A',growthMp:'A',growthAtk:'A',growthDef:'B',growthSpAtk:'S',growthSpDef:'B',growthSpd:'S',abilities:['fur_armor','frost_breath'] },
  { id:'phoenixmon',name:'凤凰兽',stage:'究极体',fields:['wind_guardians','virus_busters'],type:'疫苗',description:'圣鸟型数码宝贝，拥有不死之身的神圣凤凰，必杀技是「星光爆破」。',baseHp:182,baseMp:80,baseAtk:78,baseDef:50,baseSpAtk:90,baseSpDef:52,baseSpd:68,growthHp:'C',growthMp:'A',growthAtk:'A',growthDef:'C',growthSpAtk:'S',growthSpDef:'C',growthSpd:'S',abilities:['gale_wings','blaze_feather'] },
  { id:'hercules_kabuterimon',name:'力神比多兽',stage:'究极体',fields:['jungle_troopers','virus_busters'],type:'疫苗',description:'昆虫型数码宝贝，拥有黄金甲壳的最强昆虫王者，必杀技是「千兆冲击」。',baseHp:225,baseMp:68,baseAtk:75,baseDef:88,baseSpAtk:66,baseSpDef:82,baseSpd:38,growthHp:'S',growthMp:'C',growthAtk:'A',growthDef:'S',growthSpAtk:'B',growthSpDef:'S',growthSpd:'D',abilities:['hard_shell','static_discharge'] },
  { id:'vikemon',name:'维京兽',stage:'究极体',fields:['deep_savers','metal_empire'],type:'疫苗',description:'巨人型数码宝贝，身披重甲手持巨斧的北欧战士，必杀技是「北极暴风雪」。',baseHp:210,baseMp:76,baseAtk:88,baseDef:78,baseSpAtk:66,baseSpDef:70,baseSpd:42,growthHp:'S',growthMp:'B',growthAtk:'S',growthDef:'S',growthSpAtk:'B',growthSpDef:'A',growthSpd:'C',abilities:['ocean_power','fish_guard'] },
  { id:'seraphimon',name:'究极天使兽',stage:'究极体',fields:['virus_busters','nature_spirits'],type:'数据',description:'炽天使型数码宝贝，最高位天使之一，必杀技是「七星天堂」。',baseHp:172,baseMp:95,baseAtk:62,baseDef:54,baseSpAtk:100,baseSpDef:62,baseSpd:60,growthHp:'C',growthMp:'S',growthAtk:'B',growthDef:'B',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['holy_blessing','light_of_hope'] },
  { id:'ophanimon',name:'神圣天女兽',stage:'究极体',fields:['virus_busters','nature_spirits'],type:'疫苗',description:'座天使型数码宝贝，手持圣晶结界守护秩序，必杀技是「伊甸针刺」。',baseHp:178,baseMp:92,baseAtk:68,baseDef:55,baseSpAtk:92,baseSpDef:68,baseSpd:66,growthHp:'C',growthMp:'S',growthAtk:'B',growthDef:'B',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['saint_scent','first_strike_heart'] },
  { id:'dukemon',name:'红莲骑士兽',stage:'究极体',fields:['dragons_roar','virus_busters'],type:'病毒',description:'圣骑士型数码宝贝，手持圣枪的红色骑士，必杀技是「圣枪古拉姆」。',baseHp:210,baseMp:72,baseAtk:100,baseDef:72,baseSpAtk:62,baseSpDef:58,baseSpd:42,growthHp:'S',growthMp:'C',growthAtk:'S',growthDef:'A',growthSpAtk:'C',growthSpDef:'C',growthSpd:'B',abilities:['dragon_pressure','berserker'] },
  { id:'venom_vamdemon',name:'怨毒吸血魔兽',stage:'究极体',fields:['dark_area','nightmare_soldiers'],type:'病毒',description:'魔兽型数码宝贝，吸收无数数据进化而成的恐怖魔王，必杀技是「剧毒之血」。',baseHp:168,baseMp:85,baseAtk:88,baseDef:48,baseSpAtk:80,baseSpDef:52,baseSpd:64,growthHp:'C',growthMp:'A',growthAtk:'S',growthDef:'D',growthSpAtk:'S',growthSpDef:'C',growthSpd:'S',abilities:['prankster','shadow_walk'] },
  { id:'rosemon',name:'蔷薇兽',stage:'究极体',fields:['jungle_troopers','virus_busters'],type:'数据',description:'妖精型数码宝贝，美丽而危险的蔷薇女王，必杀技是「荆棘之鞭」。',baseHp:185,baseMp:88,baseAtk:58,baseDef:66,baseSpAtk:96,baseSpDef:78,baseSpd:46,growthHp:'A',growthMp:'S',growthAtk:'C',growthDef:'A',growthSpAtk:'S',growthSpDef:'S',growthSpd:'C',abilities:['natural_harmony','seedling_regen'] },

  // X抗体形态 (8只)
  { id:'agumon_x',name:'亚古兽X',stage:'成长期',fields:['nature_spirits','dragons_roar'],type:'疫苗',description:'感染X病毒后获得X抗体的亚古兽，力量大幅增强。',baseHp:132,baseMp:48,baseAtk:38,baseDef:26,baseSpAtk:32,baseSpDef:24,baseSpd:24,growthHp:'A',growthMp:'B',growthAtk:'S',growthDef:'A',growthSpAtk:'A',growthSpDef:'B',growthSpd:'A',abilities:['dragon_will','flame_power'] },
  { id:'greymon_x',name:'暴龙兽X',stage:'成熟期',fields:['dragons_roar','nature_spirits'],type:'疫苗',description:'X抗体的暴龙兽，头角更加巨大锋利，超级火焰威力倍增。',baseHp:175,baseMp:66,baseAtk:62,baseDef:40,baseSpAtk:48,baseSpDef:36,baseSpd:36,growthHp:'S',growthMp:'B',growthAtk:'S',growthDef:'A',growthSpAtk:'A',growthSpDef:'B',growthSpd:'A',abilities:['dragon_will','flame_power'] },
  { id:'metal_greymon_x',name:'机械暴龙兽X',stage:'完全体',fields:['dragons_roar','metal_empire'],type:'疫苗',description:'X抗体的机械暴龙兽，机械化装甲进一步强化，究极破坏炮可连发。',baseHp:215,baseMp:80,baseAtk:88,baseDef:64,baseSpAtk:74,baseSpDef:52,baseSpd:46,growthHp:'S',growthMp:'B',growthAtk:'S',growthDef:'S',growthSpAtk:'S',growthSpDef:'A',growthSpd:'A',abilities:['dragon_will','flame_power'] },
  { id:'war_greymon_x',name:'战斗暴龙兽X',stage:'究极体',fields:['dragons_roar','virus_busters'],type:'疫苗',description:'X抗体的战斗暴龙兽，龙族克星之力达到极致，盖亚之力毁灭一切。',baseHp:255,baseMp:95,baseAtk:118,baseDef:86,baseSpAtk:98,baseSpDef:74,baseSpd:64,growthHp:'S',growthMp:'A',growthAtk:'S',growthDef:'S',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['dragon_will','flame_power'] },
  { id:'gabumon_x',name:'加布兽X',stage:'成长期',fields:['deep_savers','dragons_roar'],type:'数据',description:'X抗体的加布兽，毛皮更加厚实，爆炎火焰弹温度更高。',baseHp:120,baseMp:54,baseAtk:28,baseDef:24,baseSpAtk:40,baseSpDef:26,baseSpd:28,growthHp:'A',growthMp:'A',growthAtk:'B',growthDef:'B',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['fur_armor','frost_breath'] },
  { id:'garurumon_x',name:'加鲁鲁兽X',stage:'成熟期',fields:['deep_savers','nature_spirits'],type:'数据',description:'X抗体的加鲁鲁兽，青白毛皮闪耀金属光泽，妖狐火焰冻结万物。',baseHp:156,baseMp:72,baseAtk:52,baseDef:36,baseSpAtk:62,baseSpDef:40,baseSpd:44,growthHp:'A',growthMp:'A',growthAtk:'A',growthDef:'B',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['fur_armor','frost_breath'] },
  { id:'were_garurumon_x',name:'兽人加鲁鲁X',stage:'完全体',fields:['deep_savers','nature_spirits'],type:'数据',description:'X抗体的兽人加鲁鲁，狼人战士的敏捷与力量达到巅峰。',baseHp:195,baseMp:86,baseAtk:84,baseDef:52,baseSpAtk:76,baseSpDef:54,baseSpd:62,growthHp:'A',growthMp:'A',growthAtk:'S',growthDef:'A',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['fur_armor','frost_breath'] },
  { id:'metal_garurumon_x',name:'钢铁加鲁鲁X',stage:'究极体',fields:['deep_savers','metal_empire'],type:'数据',description:'X抗体的钢铁加鲁鲁，全身武器系统升级，绝对冷冻气可冻结时空。',baseHp:235,baseMp:100,baseAtk:98,baseDef:74,baseSpAtk:106,baseSpDef:70,baseSpd:74,growthHp:'S',growthMp:'S',growthAtk:'S',growthDef:'A',growthSpAtk:'S',growthSpDef:'A',growthSpd:'S',abilities:['fur_armor','frost_breath'] }
]

export const uniqueSkills = {
  agumon:[{id:'baby_flame',name:'小型火焰',type:'special',field:'dragons_roar',power:40,accuracy:100,mpCost:8,priority:0,description:'吐出小型火焰弹攻击。',effects:[{type:'burn',chance:10}],statChanges:null,target:'enemy',learnLevel:1},{id:'dragon_rage',name:'龙之怒',type:'special',field:'dragons_roar',power:90,accuracy:100,mpCost:20,priority:0,description:'释放龙族愤怒的烈焰。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  gabumon:[{id:'blaze_shot',name:'爆炎弹',type:'special',field:'dragons_roar',power:40,accuracy:100,mpCost:8,priority:0,description:'发射爆裂火焰弹。',effects:[{type:'burn',chance:10}],statChanges:null,target:'enemy',learnLevel:1},{id:'absolute_frost',name:'绝对冰息',type:'special',field:'deep_savers',power:90,accuracy:100,mpCost:20,priority:0,description:'极寒吐息冻结一切。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:20}],
  piyomon:[{id:'gale_blade',name:'疾风刃',type:'physical',field:'wind_guardians',power:40,accuracy:100,mpCost:8,priority:0,description:'以疾风之翼斩击。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'storm_wing',name:'风暴翼',type:'physical',field:'wind_guardians',power:90,accuracy:100,mpCost:20,priority:1,description:'以风暴之势优先攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  tentomon:[{id:'spark_horn',name:'电击角',type:'physical',field:'jungle_troopers',power:40,accuracy:100,mpCost:8,priority:0,description:'带电的角撞击对手。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy',learnLevel:1},{id:'thunder_storm',name:'万雷击',type:'special',field:'metal_empire',power:90,accuracy:100,mpCost:20,priority:0,description:'召唤万雷轰击。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy',learnLevel:20}],
  gomamon:[{id:'water_shot',name:'水流弹',type:'special',field:'deep_savers',power:40,accuracy:100,mpCost:8,priority:0,description:'喷射高压水流弹。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'fish_frenzy',name:'鱼群大暴走',type:'physical',field:'deep_savers',power:90,accuracy:100,mpCost:20,priority:0,description:'召唤鱼群猛烈冲击。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  patamon:[{id:'air_shot',name:'空气炮',type:'special',field:'wind_guardians',power:40,accuracy:100,mpCost:8,priority:0,description:'吸入空气后吐出空气弹。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'heaven_fist',name:'天堂之拳',type:'special',field:'virus_busters',power:90,accuracy:100,mpCost:20,priority:0,description:'神圣的一拳制裁。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  plotmon:[{id:'puppy_howl',name:'小狗咆哮',type:'special',field:'virus_busters',power:40,accuracy:100,mpCost:8,priority:0,description:'神圣的咆哮攻击。',effects:[{type:'confusion',chance:10}],statChanges:null,target:'enemy',learnLevel:1},{id:'holy_judgment',name:'神圣制裁',type:'special',field:'virus_busters',power:90,accuracy:100,mpCost:20,priority:0,description:'神圣之力制裁邪恶。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  guilmon:[{id:'guil_cannon',name:'基尔火炮',type:'special',field:'dragons_roar',power:40,accuracy:100,mpCost:8,priority:0,description:'口中吐出火焰弹。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'dark_dragon_flame',name:'魔龙炎',type:'special',field:'dark_area',power:95,accuracy:100,mpCost:25,priority:0,description:'魔龙之炎灼烧对手，自身HP-5%。',effects:[{type:'burn',chance:10}],statChanges:null,target:'enemy',learnLevel:20,recoilPercent:5}],
  impmon:[{id:'night_fire',name:'暗夜之炎',type:'special',field:'nightmare_soldiers',power:45,accuracy:100,mpCost:10,priority:0,description:'暗夜之炎灼烧对手。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'chaos_strike',name:'混沌一击',type:'physical',field:'dark_area',power:100,accuracy:100,mpCost:25,priority:0,description:'混沌之力的一击，可能混乱。',effects:[{type:'confusion',chance:20}],statChanges:null,target:'enemy',learnLevel:20}],
  lalamon:[{id:'nut_shot',name:'坚果射击',type:'physical',field:'jungle_troopers',power:40,accuracy:100,mpCost:8,priority:0,description:'发射坚硬坚果攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'nature_heal',name:'自然治愈',type:'status',field:'nature_spirits',power:0,accuracy:100,mpCost:15,priority:0,description:'自然之力回复50%最大HP。',effects:[],statChanges:null,target:'self',learnLevel:15,healPercent:50}],
  '暴龙兽':[{id:'mega_flame',name:'超级火焰',type:'special',field:'dragons_roar',power:60,accuracy:95,mpCost:12,priority:0,description:'吐出超级高温火焰弹。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:16},{id:'horn_buster',name:'巨角冲击',type:'physical',field:'nature_spirits',power:100,accuracy:90,mpCost:22,priority:0,description:'用巨大头角猛烈冲撞。',effects:[],statChanges:null,target:'enemy',learnLevel:26}],
  '加鲁鲁兽':[{id:'fox_fire',name:'妖狐火焰',type:'special',field:'deep_savers',power:60,accuracy:95,mpCost:12,priority:0,description:'青色妖狐之火灼烧对手。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:16},{id:'frost_fang',name:'冰霜獠牙',type:'physical',field:'deep_savers',power:100,accuracy:90,mpCost:22,priority:0,description:'凝结冰霜的獠牙撕咬。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:26}],
  '巴多拉兽':[{id:'meteor_wing',name:'陨石巨翼',type:'physical',field:'wind_guardians',power:60,accuracy:95,mpCost:12,priority:0,description:'以陨石之势展开巨翼攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'flame_vortex',name:'火焰漩涡',type:'special',field:'dragons_roar',power:100,accuracy:90,mpCost:22,priority:0,description:'制造烈焰漩涡吞噬对手。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:26}],
  '比多兽':[{id:'mega_blaster',name:'米加巨炮',type:'special',field:'metal_empire',power:60,accuracy:95,mpCost:12,priority:0,description:'从角中发射高能量光线。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'beetle_horn',name:'甲虫角突',type:'physical',field:'jungle_troopers',power:100,accuracy:90,mpCost:22,priority:0,description:'巨大甲虫角猛烈突刺。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy',learnLevel:26}],
  '海狮兽':[{id:'northern_lights',name:'北极光击',type:'special',field:'deep_savers',power:60,accuracy:95,mpCost:12,priority:0,description:'释放绚丽的北极光攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'ice_breath',name:'冰霜吐息',type:'special',field:'deep_savers',power:100,accuracy:90,mpCost:22,priority:0,description:'极寒吐息冻结万物。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:26}],
  '天使兽':[{id:'heaven_knuckle',name:'天堂之拳',type:'physical',field:'virus_busters',power:60,accuracy:95,mpCost:12,priority:0,description:'蕴含神圣之力的拳击。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'holy_light',name:'神圣之光',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:15,priority:0,description:'圣光治愈回复35%最大HP。',effects:[],statChanges:null,target:'self',learnLevel:24,healPercent:35}],
  '迪路兽':[{id:'cat_punch',name:'猫猫拳',type:'physical',field:'nature_spirits',power:60,accuracy:100,mpCost:12,priority:1,description:'灵巧快速的猫拳优先攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'holy_ring',name:'神圣环',type:'special',field:'virus_busters',power:100,accuracy:95,mpCost:22,priority:0,description:'释放神圣光环冲击对手。',effects:[],statChanges:null,target:'enemy',learnLevel:26}],
  '古拉兽':[{id:'demon_fire',name:'魔龙火焰',type:'special',field:'dragons_roar',power:60,accuracy:95,mpCost:12,priority:0,description:'魔龙之焰灼烧一切。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:16},{id:'plasma_blade',name:'等离子刃',type:'physical',field:'metal_empire',power:100,accuracy:90,mpCost:22,priority:0,description:'等离子能量化的利刃斩击。',effects:[],statChanges:null,target:'enemy',learnLevel:26}],
  '恶魔兽':[{id:'death_claw',name:'死亡之爪',type:'physical',field:'nightmare_soldiers',power:60,accuracy:95,mpCost:12,priority:0,description:'黑暗之爪撕裂对手。',effects:[{type:'confusion',chance:10}],statChanges:null,target:'enemy',learnLevel:16},{id:'dark_wave',name:'黑暗波动',type:'special',field:'dark_area',power:100,accuracy:90,mpCost:22,priority:0,description:'释放黑暗能量波动。',effects:[{type:'confusion',chance:15}],statChanges:null,target:'enemy',learnLevel:26}],
  '向日葵兽':[{id:'solar_beam',name:'阳光烈焰',type:'special',field:'jungle_troopers',power:60,accuracy:100,mpCost:12,priority:0,description:'聚集阳光发射强力光束。',effects:[],statChanges:null,target:'enemy',learnLevel:16},{id:'petal_dance',name:'花之舞',type:'special',field:'nature_spirits',power:100,accuracy:90,mpCost:22,priority:0,description:'花瓣旋风翩翩起舞。',effects:[{type:'sleep',chance:10}],statChanges:null,target:'enemy',learnLevel:26}],
  '机械暴龙兽':[{id:'giga_destroyer',name:'究极破坏炮',type:'special',field:'dragons_roar',power:80,accuracy:95,mpCost:16,priority:0,description:'从胸部发射究极破坏光线。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'trident_arm',name:'三叉戟臂',type:'physical',field:'metal_empire',power:120,accuracy:90,mpCost:26,priority:0,description:'机械三叉戟臂粉碎一击。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '丧尸暴龙兽':[{id:'zero_missile',name:'零式导弹',type:'physical',field:'dark_area',power:80,accuracy:95,mpCost:16,priority:0,description:'从脊椎发射追踪导弹。',effects:[],statChanges:null,target:'enemy',learnLevel:34},{id:'dark_roar',name:'黑暗咆哮',type:'special',field:'dragons_roar',power:120,accuracy:90,mpCost:26,priority:0,description:'黑暗能量的狂暴咆哮。',effects:[{type:'confusion',chance:15}],statChanges:null,target:'enemy',learnLevel:44}],
  '兽人加鲁鲁':[{id:'kaiser_claw',name:'凯撒锐爪',type:'physical',field:'nature_spirits',power:80,accuracy:95,mpCost:16,priority:0,description:'凯撒般的锐利爪击。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'crescent_blade',name:'弦月斩',type:'physical',field:'deep_savers',power:120,accuracy:90,mpCost:26,priority:0,description:'如弦月般的华丽斩击。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '伽楼达兽':[{id:'shadow_wing',name:'影翼斩',type:'physical',field:'wind_guardians',power:80,accuracy:100,mpCost:16,priority:1,description:'影翼一闪优先攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'fire_storm',name:'火焰风暴',type:'special',field:'dragons_roar',power:120,accuracy:90,mpCost:26,priority:0,description:'召唤烈焰风暴席卷战场。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:42}],
  '超比多兽':[{id:'horn_crush',name:'巨角粉碎',type:'physical',field:'jungle_troopers',power:80,accuracy:95,mpCost:16,priority:0,description:'粉碎一切的巨角冲撞。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'insect_plague',name:'虫灾',type:'special',field:'metal_empire',power:120,accuracy:90,mpCost:26,priority:0,description:'召唤虫群铺天盖地袭击。',effects:[{type:'poison',chance:15}],statChanges:null,target:'enemy',learnLevel:42}],
  '祖顿兽':[{id:'thor_hammer',name:'雷神之锤',type:'physical',field:'deep_savers',power:80,accuracy:95,mpCost:16,priority:0,description:'挥舞雷神之锤重击。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy',learnLevel:32},{id:'ice_storm',name:'冰风暴',type:'special',field:'nature_spirits',power:120,accuracy:90,mpCost:26,priority:0,description:'召唤极寒冰风暴。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:42}],
  '神圣天使兽':[{id:'heaven_gate',name:'天国之门',type:'special',field:'virus_busters',power:80,accuracy:95,mpCost:16,priority:0,description:'开启天国之门释放圣光。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'holy_judgment',name:'圣光裁决',type:'special',field:'wind_guardians',power:120,accuracy:90,mpCost:26,priority:0,description:'神圣之光裁决罪恶。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '天女兽':[{id:'holy_arrow',name:'神圣弓箭',type:'special',field:'virus_busters',power:80,accuracy:95,mpCost:16,priority:0,description:'射出神圣之箭贯穿邪恶。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'angel_kiss',name:'天使之吻',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:18,priority:0,description:'天使之吻回复50%最大HP。',effects:[],statChanges:null,target:'self',learnLevel:40,healPercent:50}],
  '大古拉兽':[{id:'atomic_blaster',name:'原子爆裂',type:'special',field:'dragons_roar',power:80,accuracy:95,mpCost:16,priority:0,description:'原子级能量爆裂炮击。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'double_edge',name:'双重刃',type:'physical',field:'metal_empire',power:120,accuracy:90,mpCost:26,priority:0,description:'双臂利刃双重斩击。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '吸血魔兽':[{id:'blood_bat',name:'血蝙蝠',type:'special',field:'dark_area',power:80,accuracy:95,mpCost:16,priority:0,description:'释放血蝙蝠群吸取生命。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'night_lord',name:'暗夜之王',type:'special',field:'nightmare_soldiers',power:120,accuracy:90,mpCost:26,priority:0,description:'暗夜之王的绝对威压。',effects:[{type:'confusion',chance:20}],statChanges:null,target:'enemy',learnLevel:42}],
  '丁香兽':[{id:'fairy_cannon',name:'花仙炮',type:'special',field:'jungle_troopers',power:80,accuracy:95,mpCost:16,priority:0,description:'花仙之力凝聚的炮击。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'sleep_powder',name:'沉睡花粉',type:'status',field:'nature_spirits',power:0,accuracy:85,mpCost:14,priority:0,description:'撒播令对手沉睡的花粉。',effects:[{type:'sleep',chance:100}],statChanges:null,target:'enemy',learnLevel:40}],
  '战斗暴龙兽':[{id:'gaia_force',name:'盖亚之力',type:'special',field:'dragons_roar',power:100,accuracy:95,mpCost:20,priority:0,description:'凝聚盖亚之力的大气能量弹。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'dragon_buster',name:'龙族克星',type:'physical',field:'virus_busters',power:150,accuracy:90,mpCost:30,priority:0,description:'对龙族敌人的致命一击。',effects:[],statChanges:null,target:'enemy',learnLevel:55}],
  '黑暗战斗暴龙兽':[{id:'dark_gaia',name:'黑暗盖亚',type:'special',field:'dark_area',power:100,accuracy:95,mpCost:20,priority:0,description:'黑暗之力的盖亚能量炮。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'jet_black_claw',name:'漆黑之爪',type:'physical',field:'dragons_roar',power:150,accuracy:90,mpCost:30,priority:0,description:'漆黑之爪撕裂一切。',effects:[{type:'confusion',chance:15}],statChanges:null,target:'enemy',learnLevel:55}],
  '钢铁加鲁鲁':[{id:'absolute_zero',name:'绝对冷冻气',type:'special',field:'deep_savers',power:100,accuracy:95,mpCost:20,priority:0,description:'绝对零度的冷冻气弹。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:48},{id:'garuru_tomahawk',name:'加鲁鲁战斧',type:'physical',field:'metal_empire',power:150,accuracy:90,mpCost:30,priority:0,description:'化为战斧的猛烈一击。',effects:[],statChanges:null,target:'enemy',learnLevel:55}],
  '凤凰兽':[{id:'starlight_explosion',name:'星光爆破',type:'special',field:'wind_guardians',power:100,accuracy:95,mpCost:20,priority:0,description:'星光之力的璀璨爆发。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'rebirth_flame',name:'涅槃重生',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:25,priority:0,description:'涅槃之火回复60%最大HP。',effects:[],statChanges:null,target:'self',learnLevel:55,healPercent:60}],
  '力神比多兽':[{id:'giga_impact',name:'千兆冲击',type:'physical',field:'jungle_troopers',power:100,accuracy:95,mpCost:20,priority:0,description:'千兆级别的冲击撞击。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'beetle_armor',name:'甲虫装甲',type:'status',field:'metal_empire',power:0,accuracy:100,mpCost:18,priority:0,description:'防御和特防大幅提升2级。',effects:[],statChanges:[{stat:'def',stages:2,target:'self'},{stat:'spDef',stages:2,target:'self'}],target:'self',learnLevel:55}],
  '维京兽':[{id:'arctic_blizzard',name:'北极暴风雪',type:'special',field:'deep_savers',power:100,accuracy:95,mpCost:20,priority:0,description:'召唤北极的极寒暴风雪。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy',learnLevel:48},{id:'viking_fury',name:'海盗之怒',type:'physical',field:'nature_spirits',power:150,accuracy:90,mpCost:30,priority:0,description:'海盗之怒的狂暴打击。',effects:[],statChanges:null,target:'enemy',learnLevel:55}],
  '究极天使兽':[{id:'septentrion',name:'七星天堂',type:'special',field:'virus_busters',power:100,accuracy:95,mpCost:20,priority:0,description:'召唤七个神圣光球审判对手。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'testament',name:'神圣考验',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:22,priority:0,description:'特攻大幅提升2级并回复30%HP。',effects:[],statChanges:[{stat:'spAtk',stages:2,target:'self'}],target:'self',learnLevel:55,healPercent:30}],
  '神圣天女兽':[{id:'eden_needle',name:'伊甸针刺',type:'special',field:'virus_busters',power:100,accuracy:100,mpCost:20,priority:1,description:'神圣之针刺穿邪恶优先攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'sacred_crystal',name:'圣晶结界',type:'status',field:'nature_spirits',power:0,accuracy:100,mpCost:20,priority:0,description:'展开圣晶结界回复40%HP并治愈异常。',effects:[{type:'cureAll',chance:100}],statChanges:null,target:'self',learnLevel:55,healPercent:40}],
  '红莲骑士兽':[{id:'royal_spear',name:'圣枪古拉姆',type:'physical',field:'dragons_roar',power:100,accuracy:95,mpCost:20,priority:0,description:'以传说中的圣枪贯穿对手。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'final_elysion',name:'极乐净土',type:'special',field:'virus_busters',power:150,accuracy:90,mpCost:30,priority:0,description:'释放净化一切的极乐之光。',effects:[],statChanges:null,target:'enemy',learnLevel:55}],
  '怨毒吸血魔兽':[{id:'venom_blood',name:'剧毒之血',type:'special',field:'dark_area',power:100,accuracy:95,mpCost:20,priority:0,description:'剧毒之血侵蚀对手。',effects:[{type:'poison',chance:20}],statChanges:null,target:'enemy',learnLevel:48},{id:'nightmare_reaper',name:'噩梦收割',type:'physical',field:'nightmare_soldiers',power:150,accuracy:90,mpCost:30,priority:0,description:'噩梦般的镰刀收割灵魂。',effects:[{type:'confusion',chance:15}],statChanges:null,target:'enemy',learnLevel:55}],
  '蔷薇兽':[{id:'thorn_whip',name:'荆棘之鞭',type:'physical',field:'jungle_troopers',power:100,accuracy:95,mpCost:20,priority:0,description:'荆棘之鞭无情抽打对手。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'forbidden_temptation',name:'禁忌诱惑',type:'status',field:'virus_busters',power:0,accuracy:85,mpCost:18,priority:0,description:'魅惑对手使其混乱并降低特防2级。',effects:[{type:'confusion',chance:100}],statChanges:[{stat:'spDef',stages:-2,target:'enemy'}],target:'enemy',learnLevel:55}],
  '亚古兽X':[{id:'baby_flame_x',name:'小型火焰X',type:'special',field:'dragons_roar',power:60,accuracy:100,mpCost:10,priority:0,description:'X抗体强化的高温火焰弹。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:1},{id:'dragon_rage_x',name:'龙之怒X',type:'special',field:'dragons_roar',power:110,accuracy:100,mpCost:22,priority:0,description:'X抗体龙族愤怒的烈焰。',effects:[],statChanges:null,target:'enemy',learnLevel:20}],
  '暴龙兽X':[{id:'mega_flame_x',name:'超级火焰X',type:'special',field:'dragons_roar',power:80,accuracy:95,mpCost:14,priority:0,description:'X抗体强化的超级高温火焰。',effects:[{type:'burn',chance:20}],statChanges:null,target:'enemy',learnLevel:16},{id:'horn_buster_x',name:'巨角冲击X',type:'physical',field:'nature_spirits',power:120,accuracy:90,mpCost:24,priority:0,description:'X抗体巨大头角粉碎冲撞。',effects:[],statChanges:null,target:'enemy',learnLevel:26}],
  '机械暴龙兽X':[{id:'giga_destroyer_x',name:'究极破坏炮X',type:'special',field:'dragons_roar',power:100,accuracy:95,mpCost:18,priority:0,description:'X抗体强化的究极破坏光线。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'trident_arm_x',name:'三叉戟臂X',type:'physical',field:'metal_empire',power:140,accuracy:90,mpCost:28,priority:0,description:'X抗体三叉戟臂毁灭一击。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '战斗暴龙兽X':[{id:'gaia_force_x',name:'盖亚之力X',type:'special',field:'dragons_roar',power:120,accuracy:95,mpCost:22,priority:0,description:'X抗体极限盖亚能量弹。',effects:[],statChanges:null,target:'enemy',learnLevel:48},{id:'dragon_buster_x',name:'龙族克星X',type:'physical',field:'virus_busters',power:170,accuracy:90,mpCost:32,priority:0,description:'X抗体对龙族敌人的终极一击。',effects:[],statChanges:null,target:'enemy',learnLevel:55}],
  '加布兽X':[{id:'blaze_shot_x',name:'爆炎弹X',type:'special',field:'dragons_roar',power:60,accuracy:100,mpCost:10,priority:0,description:'X抗体强化的爆裂火焰弹。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy',learnLevel:1},{id:'absolute_frost_x',name:'绝对冰息X',type:'special',field:'deep_savers',power:110,accuracy:100,mpCost:22,priority:0,description:'X抗体极限冰息冻结一切。',effects:[{type:'freeze',chance:15}],statChanges:null,target:'enemy',learnLevel:20}],
  '加鲁鲁兽X':[{id:'fox_fire_x',name:'妖狐火焰X',type:'special',field:'deep_savers',power:80,accuracy:95,mpCost:14,priority:0,description:'X抗体强化的青蓝妖狐之火。',effects:[{type:'burn',chance:20}],statChanges:null,target:'enemy',learnLevel:16},{id:'frost_fang_x',name:'冰霜獠牙X',type:'physical',field:'deep_savers',power:120,accuracy:90,mpCost:24,priority:0,description:'X抗体极寒獠牙撕咬。',effects:[{type:'freeze',chance:15}],statChanges:null,target:'enemy',learnLevel:26}],
  '兽人加鲁鲁X':[{id:'kaiser_claw_x',name:'凯撒锐爪X',type:'physical',field:'nature_spirits',power:100,accuracy:95,mpCost:18,priority:0,description:'X抗体凯撒般的锐利爪击。',effects:[],statChanges:null,target:'enemy',learnLevel:32},{id:'crescent_blade_x',name:'弦月斩X',type:'physical',field:'deep_savers',power:140,accuracy:90,mpCost:28,priority:0,description:'X抗体弦月般的华丽斩击。',effects:[],statChanges:null,target:'enemy',learnLevel:42}],
  '钢铁加鲁鲁X':[{id:'absolute_zero_x',name:'绝对冷冻气X',type:'special',field:'deep_savers',power:120,accuracy:95,mpCost:22,priority:0,description:'X抗体绝对零度冷冻气弹。',effects:[{type:'freeze',chance:15}],statChanges:null,target:'enemy',learnLevel:48},{id:'garuru_tomahawk_x',name:'加鲁鲁战斧X',type:'physical',field:'metal_empire',power:170,accuracy:90,mpCost:32,priority:0,description:'X抗体战斧的终极一击。',effects:[],statChanges:null,target:'enemy',learnLevel:55}]
}

export const commonSkills = [
  {id:'slash',name:'爪击',type:'physical',field:'nature_spirits',power:40,accuracy:100,mpCost:8,priority:0,description:'用利爪攻击。',effects:[],statChanges:null,target:'enemy'},
  {id:'bite',name:'啃咬',type:'physical',field:'nightmare_soldiers',power:50,accuracy:100,mpCost:10,priority:0,description:'用尖牙啃咬。',effects:[{type:'confusion',chance:10}],statChanges:null,target:'enemy'},
  {id:'tackle',name:'撞击',type:'physical',field:'nature_spirits',power:35,accuracy:100,mpCost:5,priority:0,description:'用身体撞击对手。',effects:[],statChanges:null,target:'enemy'},
  {id:'wing_attack',name:'翅膀攻击',type:'physical',field:'wind_guardians',power:45,accuracy:100,mpCost:8,priority:0,description:'用翅膀猛击。',effects:[],statChanges:null,target:'enemy'},
  {id:'poison_sting',name:'毒针',type:'physical',field:'jungle_troopers',power:25,accuracy:100,mpCost:6,priority:0,description:'射出毒针。',effects:[{type:'poison',chance:30}],statChanges:null,target:'enemy'},
  {id:'rock_throw',name:'岩石投掷',type:'physical',field:'nature_spirits',power:50,accuracy:90,mpCost:10,priority:0,description:'投掷巨大岩石。',effects:[],statChanges:null,target:'enemy'},
  {id:'drill_rush',name:'钻头冲击',type:'physical',field:'metal_empire',power:60,accuracy:95,mpCost:12,priority:0,description:'如钻头般旋转冲击。',effects:[],statChanges:null,target:'enemy'},
  {id:'flying_kick',name:'飞踢',type:'physical',field:'wind_guardians',power:55,accuracy:95,mpCost:10,priority:0,description:'飞身踢击对手。',effects:[],statChanges:null,target:'enemy'},
  {id:'dark_raid',name:'暗袭',type:'physical',field:'dark_area',power:50,accuracy:100,mpCost:10,priority:0,description:'暗影中的偷袭。',effects:[],statChanges:null,target:'enemy'},
  {id:'fury_swipes',name:'疯狂乱抓',type:'physical',field:'nature_spirits',power:18,accuracy:90,mpCost:12,priority:0,description:'疯狂乱抓2-5次。',effects:[{type:'multi_hit',minHits:2,maxHits:5}],statChanges:null,target:'enemy'},
  {id:'fatal_claw',name:'必杀爪',type:'physical',field:'dragons_roar',power:75,accuracy:90,mpCost:15,priority:0,description:'致命一击的利爪。',effects:[],statChanges:null,target:'enemy'},
  {id:'dragon_tail',name:'龙尾',type:'physical',field:'dragons_roar',power:60,accuracy:95,mpCost:12,priority:0,description:'用龙尾横扫。',effects:[],statChanges:null,target:'enemy'},
  {id:'iron_head',name:'铁头锤',type:'physical',field:'metal_empire',power:70,accuracy:95,mpCost:14,priority:0,description:'钢铁般坚硬的头锤。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy'},
  {id:'earthquake',name:'地震',type:'physical',field:'nature_spirits',power:80,accuracy:100,mpCost:18,priority:0,description:'引发地震攻击全体。',effects:[],statChanges:null,target:'allEnemies'},
  {id:'quick_attack',name:'电光石火',type:'physical',field:'wind_guardians',power:40,accuracy:100,mpCost:8,priority:1,description:'以极快速度先制攻击。',effects:[],statChanges:null,target:'enemy'},
  {id:'fireball',name:'火球',type:'special',field:'dragons_roar',power:45,accuracy:100,mpCost:8,priority:0,description:'发射灼热火球。',effects:[{type:'burn',chance:10}],statChanges:null,target:'enemy'},
  {id:'water_gun',name:'水枪',type:'special',field:'deep_savers',power:45,accuracy:100,mpCost:8,priority:0,description:'喷射高压水流。',effects:[],statChanges:null,target:'enemy'},
  {id:'whirlwind',name:'旋风',type:'special',field:'wind_guardians',power:45,accuracy:100,mpCost:8,priority:0,description:'释放旋风攻击。',effects:[],statChanges:null,target:'enemy'},
  {id:'thunder_bolt',name:'雷击',type:'special',field:'metal_empire',power:50,accuracy:95,mpCost:10,priority:0,description:'释放雷电攻击。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy'},
  {id:'light_ball',name:'光弹',type:'special',field:'virus_busters',power:50,accuracy:100,mpCost:10,priority:0,description:'发射神圣光弹。',effects:[],statChanges:null,target:'enemy'},
  {id:'shadow_ball',name:'暗影球',type:'special',field:'dark_area',power:55,accuracy:95,mpCost:10,priority:0,description:'发射暗影能量球。',effects:[],statChanges:null,target:'enemy'},
  {id:'dragon_breath',name:'龙息',type:'special',field:'dragons_roar',power:55,accuracy:95,mpCost:10,priority:0,description:'龙族吐息攻击。',effects:[{type:'paralysis',chance:10}],statChanges:null,target:'enemy'},
  {id:'sludge_bomb',name:'淤泥弹',type:'special',field:'jungle_troopers',power:60,accuracy:95,mpCost:12,priority:0,description:'投掷淤泥弹。',effects:[{type:'poison',chance:20}],statChanges:null,target:'enemy'},
  {id:'ice_beam',name:'冰冻光束',type:'special',field:'deep_savers',power:65,accuracy:95,mpCost:14,priority:0,description:'冰之光束冻结一切。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'enemy'},
  {id:'psychic_wave',name:'精神波',type:'special',field:'unknown',power:60,accuracy:100,mpCost:12,priority:0,description:'释放精神能量波。',effects:[{type:'confusion',chance:10}],statChanges:null,target:'enemy'},
  {id:'magic_flame',name:'魔法火焰',type:'special',field:'dragons_roar',power:65,accuracy:95,mpCost:14,priority:0,description:'魔法火焰灼烧对手。',effects:[{type:'burn',chance:15}],statChanges:null,target:'enemy'},
  {id:'blizzard',name:'暴风雪',type:'special',field:'deep_savers',power:75,accuracy:85,mpCost:18,priority:0,description:'暴风雪覆盖全场。',effects:[{type:'freeze',chance:10}],statChanges:null,target:'allEnemies'},
  {id:'thunder',name:'雷电',type:'special',field:'metal_empire',power:80,accuracy:85,mpCost:18,priority:0,description:'召唤巨大雷电。',effects:[{type:'paralysis',chance:20}],statChanges:null,target:'enemy'},
  {id:'holy_light',name:'神圣光芒',type:'special',field:'virus_busters',power:65,accuracy:100,mpCost:14,priority:0,description:'神圣之光净化一切。',effects:[],statChanges:null,target:'enemy'},
  {id:'dark_wave',name:'暗黑波动',type:'special',field:'dark_area',power:65,accuracy:100,mpCost:14,priority:0,description:'暗黑能量波。',effects:[],statChanges:null,target:'enemy'},
  {id:'draco_meteor',name:'龙星群',type:'special',field:'dragons_roar',power:95,accuracy:90,mpCost:25,priority:0,description:'召唤流星群坠落。',effects:[],statChanges:[{stat:'spAtk',stages:-2,target:'self'}],target:'allEnemies'},
  {id:'petal_dance',name:'花之舞',type:'special',field:'jungle_troopers',power:70,accuracy:95,mpCost:16,priority:0,description:'花瓣之舞攻击。',effects:[],statChanges:null,target:'enemy'},
  {id:'aurora_beam',name:'极光',type:'special',field:'deep_savers',power:55,accuracy:100,mpCost:12,priority:0,description:'极光之美攻击。',effects:[],statChanges:null,target:'enemy'},
  {id:'meteor',name:'流星',type:'special',field:'unknown',power:85,accuracy:90,mpCost:20,priority:0,description:'召唤流星坠落。',effects:[],statChanges:null,target:'enemy'},
  {id:'roar',name:'吼叫',type:'status',field:'nature_spirits',power:0,accuracy:100,mpCost:5,priority:0,description:'降低对手攻击1级。',effects:[],statChanges:[{stat:'atk',stages:-1,target:'enemy'}],target:'enemy'},
  {id:'leer',name:'瞪眼',type:'status',field:'nightmare_soldiers',power:0,accuracy:100,mpCost:5,priority:0,description:'降低对手防御1级。',effects:[],statChanges:[{stat:'def',stages:-1,target:'enemy'}],target:'enemy'},
  {id:'harden',name:'变硬',type:'status',field:'metal_empire',power:0,accuracy:100,mpCost:5,priority:0,description:'自身防御提升1级。',effects:[],statChanges:[{stat:'def',stages:1,target:'self'}],target:'self'},
  {id:'focus_energy',name:'集气',type:'status',field:'nature_spirits',power:0,accuracy:100,mpCost:8,priority:0,description:'提升自身攻击1级。',effects:[],statChanges:[{stat:'atk',stages:1,target:'self'}],target:'self'},
  {id:'agility',name:'高速移动',type:'status',field:'wind_guardians',power:0,accuracy:100,mpCost:8,priority:0,description:'速度提升2级。',effects:[],statChanges:[{stat:'spd',stages:2,target:'self'}],target:'self'},
  {id:'meditate',name:'冥想',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:8,priority:0,description:'特攻+特防各提升1级。',effects:[],statChanges:[{stat:'spAtk',stages:1,target:'self'},{stat:'spDef',stages:1,target:'self'}],target:'self'},
  {id:'protect',name:'守护',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:10,priority:3,description:'本回合完全抵挡攻击。',effects:[],statChanges:null,target:'self'},
  {id:'sword_dance',name:'剑舞',type:'status',field:'metal_empire',power:0,accuracy:100,mpCost:12,priority:0,description:'攻击大幅提升2级。',effects:[],statChanges:[{stat:'atk',stages:2,target:'self'}],target:'self'},
  {id:'heal_bell',name:'治愈铃声',type:'status',field:'virus_busters',power:0,accuracy:100,mpCost:12,priority:0,description:'治愈己方全体异常状态。',effects:[],statChanges:null,target:'allAllies'},
  {id:'substitute',name:'替身',type:'status',field:'unknown',power:0,accuracy:100,mpCost:15,priority:0,description:'消耗25%HP制造替身抵挡攻击。',effects:[],statChanges:null,target:'self'},
  {id:'reflect',name:'反射盾',type:'status',field:'metal_empire',power:0,accuracy:100,mpCost:12,priority:0,description:'己方受到物理伤害减半（5回合）。',effects:[],statChanges:null,target:'allAllies'},
  {id:'toxic',name:'剧毒',type:'status',field:'dark_area',power:0,accuracy:90,mpCost:12,priority:0,description:'使对手中剧毒。',effects:[{type:'poison',chance:100}],statChanges:null,target:'enemy'},
  {id:'hypnosis',name:'催眠术',type:'status',field:'nightmare_soldiers',power:0,accuracy:70,mpCost:10,priority:0,description:'使对手陷入睡眠。',effects:[{type:'sleep',chance:100}],statChanges:null,target:'enemy'},
  {id:'thunder_wave',name:'电磁波',type:'status',field:'metal_empire',power:0,accuracy:90,mpCost:10,priority:0,description:'使对手麻痹。',effects:[{type:'paralysis',chance:100}],statChanges:null,target:'enemy'},
  {id:'will_o_wisp',name:'鬼火',type:'status',field:'dark_area',power:0,accuracy:85,mpCost:10,priority:0,description:'使对手灼烧。',effects:[{type:'burn',chance:100}],statChanges:null,target:'enemy'}
]

export function getSkill(id) {
  for (const sid of Object.keys(uniqueSkills)) { const found = uniqueSkills[sid].find(s => s.id === id); if (found) return found }
  return commonSkills.find(s => s.id === id) || null
}
export function getUniqueSkillsForDigimon(templateId, level, name) { let skills = uniqueSkills[templateId] || []; if (name) { const ns = uniqueSkills[name] || []; for (const s of ns) { if (!skills.find(x => x.id === s.id)) skills.push(s) } }; return skills.filter(s => s.learnLevel <= level) }
export function isUniqueSkill(skillId) { for (const sid of Object.keys(uniqueSkills)) { if (uniqueSkills[sid].some(s => s.id === skillId)) return true } return false }
export function getRandomCommonSkills(count) { const shuffled = [...commonSkills].sort(() => Math.random() - 0.5); return shuffled.slice(0, count) }

export const evoChains = {
  '暴龙兽':[{name:'机械暴龙兽',stage:'完全体',method:'level',condition:32,fields:['dragons_roar','metal_empire'],type:'疫苗',fieldExpRequired:{dragons_roar:150,metal_empire:50}},{name:'丧尸暴龙兽',stage:'完全体',method:'level',condition:34,fields:['dark_area','dragons_roar'],type:'病毒',fieldExpRequired:{dark_area:200}}],
  '丧尸暴龙兽':[{name:'黑暗战斗暴龙兽',stage:'究极体',method:'level',condition:48,fields:['dark_area','dragons_roar'],type:'病毒',fieldExpRequired:{dark_area:300}}],
  '加鲁鲁兽':[{name:'兽人加鲁鲁',stage:'完全体',method:'level',condition:32,fields:['deep_savers','nature_spirits'],type:'数据',fieldExpRequired:{deep_savers:150}}],
  '巴多拉兽':[{name:'伽楼达兽',stage:'完全体',method:'level',condition:32,fields:['wind_guardians','nature_spirits'],type:'疫苗',fieldExpRequired:{wind_guardians:150}}],
  '比多兽':[{name:'超比多兽',stage:'完全体',method:'level',condition:32,fields:['jungle_troopers','metal_empire'],type:'疫苗',fieldExpRequired:{jungle_troopers:150}}],
  '海狮兽':[{name:'祖顿兽',stage:'完全体',method:'level',condition:32,fields:['deep_savers','nature_spirits'],type:'疫苗',fieldExpRequired:{deep_savers:150}}],
  '天使兽':[{name:'神圣天使兽',stage:'完全体',method:'level',condition:32,fields:['virus_busters','wind_guardians'],type:'数据',fieldExpRequired:{virus_busters:150}}],
  '迪路兽':[{name:'天女兽',stage:'完全体',method:'level',condition:32,fields:['virus_busters','wind_guardians'],type:'疫苗',fieldExpRequired:{virus_busters:150}}],
  '古拉兽':[{name:'大古拉兽',stage:'完全体',method:'level',condition:32,fields:['dragons_roar','metal_empire'],type:'病毒',fieldExpRequired:{dragons_roar:150}}],
  '恶魔兽':[{name:'吸血魔兽',stage:'完全体',method:'level',condition:32,fields:['dark_area','nightmare_soldiers'],type:'病毒',fieldExpRequired:{dark_area:150}}],
  '向日葵兽':[{name:'丁香兽',stage:'完全体',method:'level',condition:32,fields:['jungle_troopers','nature_spirits'],type:'数据',fieldExpRequired:{jungle_troopers:150}}],
  '机械暴龙兽':[{name:'战斗暴龙兽',stage:'究极体',method:'level',condition:48,fields:['dragons_roar','virus_busters'],type:'疫苗',fieldExpRequired:{dragons_roar:300}}],
  '兽人加鲁鲁':[{name:'钢铁加鲁鲁',stage:'究极体',method:'level',condition:48,fields:['deep_savers','metal_empire'],type:'数据',fieldExpRequired:{deep_savers:300,metal_empire:100}}],
  '伽楼达兽':[{name:'凤凰兽',stage:'究极体',method:'level',condition:48,fields:['wind_guardians','virus_busters'],type:'疫苗',fieldExpRequired:{wind_guardians:300}}],
  '超比多兽':[{name:'力神比多兽',stage:'究极体',method:'level',condition:48,fields:['jungle_troopers','virus_busters'],type:'疫苗',fieldExpRequired:{jungle_troopers:300}}],
  '祖顿兽':[{name:'维京兽',stage:'究极体',method:'level',condition:48,fields:['deep_savers','metal_empire'],type:'疫苗',fieldExpRequired:{deep_savers:300}}],
  '神圣天使兽':[{name:'究极天使兽',stage:'究极体',method:'level',condition:48,fields:['virus_busters','nature_spirits'],type:'数据',fieldExpRequired:{virus_busters:300}}],
  '天女兽':[{name:'神圣天女兽',stage:'究极体',method:'level',condition:48,fields:['virus_busters','nature_spirits'],type:'疫苗',fieldExpRequired:{virus_busters:300}}],
  '大古拉兽':[{name:'红莲骑士兽',stage:'究极体',method:'level',condition:48,fields:['dragons_roar','virus_busters'],type:'病毒',fieldExpRequired:{dragons_roar:300}}],
  '吸血魔兽':[{name:'怨毒吸血魔兽',stage:'究极体',method:'level',condition:48,fields:['dark_area','nightmare_soldiers'],type:'病毒',fieldExpRequired:{dark_area:300}}],
  '丁香兽':[{name:'蔷薇兽',stage:'究极体',method:'level',condition:48,fields:['jungle_troopers','virus_busters'],type:'数据',fieldExpRequired:{jungle_troopers:300}}]
}

export function getEvolutionOptions(digimon) {
  let name = digimon.nickname || ''
  if (!evoChains[name] && digimon.evolvedTo) {
    try { const evo = typeof digimon.evolvedTo === 'string' ? JSON.parse(digimon.evolvedTo) : digimon.evolvedTo; if (evo?.name) name = evo.name } catch(e) {}
  }
  if (evoChains[name]) return evoChains[name]
  if (!digimon.evolvedTo) { const tpl = getTemplate(digimon.templateId); return tpl?.evolutionTree || [] }
  return []
}

export const talents = [
  {id:'t_hp_up1',name:'HP增强I',rarity:'white',desc:'HP+10%',effect:{stat:'maxHp',pct:10}},{id:'t_atk_up1',name:'攻击增强I',rarity:'white',desc:'攻击+10%',effect:{stat:'atk',pct:10}},{id:'t_def_up1',name:'防御增强I',rarity:'white',desc:'防御+10%',effect:{stat:'def',pct:10}},{id:'t_spatk_up1',name:'特攻增强I',rarity:'white',desc:'特攻+10%',effect:{stat:'spAtk',pct:10}},{id:'t_spdef_up1',name:'特防增强I',rarity:'white',desc:'特防+10%',effect:{stat:'spDef',pct:10}},{id:'t_spd_up1',name:'速度增强I',rarity:'white',desc:'速度+8%',effect:{stat:'spd',pct:8}},{id:'t_mp_up1',name:'MP增强I',rarity:'white',desc:'MP+10%',effect:{stat:'maxMp',pct:10}},{id:'t_hp_up2',name:'HP增强II',rarity:'white',desc:'HP+15%',effect:{stat:'maxHp',pct:15}},{id:'t_atk_up2',name:'攻击增强II',rarity:'white',desc:'攻击+15%',effect:{stat:'atk',pct:15}},{id:'t_def_up2',name:'防御增强II',rarity:'white',desc:'防御+15%',effect:{stat:'def',pct:15}},{id:'t_exp_up',name:'学习能力',rarity:'white',desc:'EXP获取+20%',effect:{stat:'expGain',pct:20}},{id:'t_gold_up',name:'财运',rarity:'white',desc:'战斗Bits+20%',effect:{stat:'goldGain',pct:20}},{id:'t_hp_small',name:'活力',rarity:'white',desc:'HP+80',effect:{stat:'maxHp',flat:80}},{id:'t_atk_small',name:'蛮力',rarity:'white',desc:'攻击+20',effect:{stat:'atk',flat:20}},{id:'t_def_small',name:'坚韧',rarity:'white',desc:'防御+15',effect:{stat:'def',flat:15}},{id:'t_spd_small',name:'敏捷',rarity:'white',desc:'速度+10',effect:{stat:'spd',flat:10}},{id:'t_spatk_small',name:'聪慧',rarity:'white',desc:'特攻+15',effect:{stat:'spAtk',flat:15}},{id:'t_spdef_small',name:'意志',rarity:'white',desc:'特防+15',effect:{stat:'spDef',flat:15}},
  {id:'t_crit_up',name:'会心一击',rarity:'blue',desc:'暴击率+5%',effect:{stat:'critRate',pct:5}},{id:'t_iron_wall',name:'铁壁',rarity:'blue',desc:'受到物理伤害-10%',effect:{type:'physReduce',pct:10}},{id:'t_magic_shield',name:'魔力护盾',rarity:'blue',desc:'受到特殊伤害-10%',effect:{type:'specReduce',pct:10}},{id:'t_first_strike',name:'先发制人',rarity:'blue',desc:'首回合速度+20%',effect:{type:'firstTurnSpd',pct:20}},{id:'t_unyielding',name:'不屈',rarity:'blue',desc:'HP<20%时防御+30%',effect:{type:'lowHpDef',pct:30}},{id:'t_precision',name:'精准',rarity:'blue',desc:'命中率+10%',effect:{type:'accuracy',pct:10}},{id:'t_hp_regen',name:'自愈',rarity:'blue',desc:'每回合回复2%HP',effect:{type:'regen',pct:2}},{id:'t_mp_saver',name:'节能',rarity:'blue',desc:'MP消耗-15%',effect:{type:'mpReduce',pct:15}},{id:'t_counter',name:'反击',rarity:'blue',desc:'受到物理攻击时10%反击',effect:{type:'counter',chance:10}},{id:'t_focus',name:'集中',rarity:'blue',desc:'特攻+特防各+10%',effect:{stat:'spAtk',pct:10,stat2:'spDef',pct2:10}},{id:'t_warrior',name:'战士',rarity:'blue',desc:'攻击+防御各+10%',effect:{stat:'atk',pct:10,stat2:'def',pct2:10}},{id:'t_evasion',name:'闪避',rarity:'blue',desc:'闪避率+5%',effect:{type:'evasion',pct:5}},
  {id:'t_dragon_slayer',name:'龙族杀手',rarity:'purple',desc:'对龙之咆哮领域伤害+25%',effect:{type:'fieldDmg',field:'dragons_roar',pct:25}},{id:'t_holy_guard',name:'圣光庇护',rarity:'purple',desc:'免疫一击必杀',effect:{type:'immuneOhko'}},{id:'t_dark_hunter',name:'暗夜猎手',rarity:'purple',desc:'对黑暗区域领域伤害+25%',effect:{type:'fieldDmg',field:'dark_area',pct:25}},{id:'t_nature_force',name:'自然之力',rarity:'purple',desc:'每回合回复4%HP',effect:{type:'regen',pct:4}},{id:'t_berserk',name:'狂暴',rarity:'purple',desc:'HP<30%时攻击+40%',effect:{type:'lowHpAtk',pct:40}},{id:'t_quick_learner',name:'天才',rarity:'purple',desc:'EXP获取+30%',effect:{stat:'expGain',pct:30}},
  {id:'t_miracle',name:'奇迹',rarity:'red',desc:'所有能力值+10%',effect:{type:'allStats',pct:10}},{id:'t_phoenix',name:'不死鸟',rarity:'red',desc:'战斗中首次HP归零时复活保留1HP',effect:{type:'revive'}},{id:'t_king',name:'王者资质',rarity:'red',desc:'EXP获取+50%',effect:{stat:'expGain',pct:50}},{id:'t_god_speed',name:'神速',rarity:'red',desc:'速度+30%，必定先手',effect:{type:'godSpeed',pct:30}}
]

export function rollTalent() {
  const roll = Math.random() * 100
  const reds = talents.filter(t => t.rarity === 'red'), purples = talents.filter(t => t.rarity === 'purple'), blues = talents.filter(t => t.rarity === 'blue'), whites = talents.filter(t => t.rarity === 'white')
  if (roll < 0.1 && reds.length > 0) return reds[Math.floor(Math.random() * reds.length)]
  if (roll < 1.1 && purples.length > 0) return purples[Math.floor(Math.random() * purples.length)]
  if (roll < 31.1 && blues.length > 0) return blues[Math.floor(Math.random() * blues.length)]
  return whites[Math.floor(Math.random() * whites.length)]
}
export function rollTwoTalents() { const t1 = rollTalent(); let t2 = rollTalent(); while (t2.id === t1.id) t2 = rollTalent(); return [t1, t2] }
export function getTalent(id) { return talents.find(t => t.id === id) || null }

export function applyTalents(stats, talentList, level) {
  if (!talentList || !Array.isArray(talentList)) return stats
  const result = { ...stats }
  for (const t of talentList) {
    if (!t || !t.effect) continue
    const e = t.effect
    if (e.stat && e.pct && e.stat2 && e.pct2) {
      const k1 = e.stat === 'maxHp' ? 'maxHp' : e.stat, k2 = e.stat2 === 'maxHp' ? 'maxHp' : e.stat2
      if (result[k1] !== undefined) result[k1] = Math.floor(result[k1] * (1 + e.pct / 100))
      if (result[k2] !== undefined) result[k2] = Math.floor(result[k2] * (1 + e.pct2 / 100))
      continue
    }
    if (e.stat && e.pct) { const key = e.stat === 'maxHp' ? 'maxHp' : e.stat === 'maxMp' ? 'maxMp' : e.stat; if (result[key] !== undefined) result[key] = Math.floor(result[key] * (1 + e.pct / 100)) }
    if (e.stat && e.flat) { const key = e.stat === 'maxHp' ? 'maxHp' : e.stat === 'maxMp' ? 'maxMp' : e.stat; if (result[key] !== undefined) result[key] += e.flat }
    if (e.type === 'allStats' && e.pct) { for (const k of ['maxHp','maxMp','atk','def','spAtk','spDef','spd']) { if (result[k] !== undefined) result[k] = Math.floor(result[k] * (1 + e.pct / 100)) } }
  }
  if (result.hp && result.maxHp) result.hp = Math.min(result.hp, result.maxHp)
  return result
}
export function getExpMultiplier(talentList, level) { if (!talentList || !Array.isArray(talentList)) return 1.0; let mult = 1.0; for (const t of talentList) { if (t?.effect?.stat === 'expGain' && t.effect.pct) mult *= (1 + t.effect.pct / 100) } return mult }
export function getGoldMultiplier(talentList, level) { if (!talentList || !Array.isArray(talentList)) return 1.0; let mult = 1.0; for (const t of talentList) { if (t?.effect?.stat === 'goldGain' && t.effect.pct) mult *= (1 + t.effect.pct / 100) } return mult }

export const eggTypes = [{id:'shop_egg',rarity:'normal',name:'数码蛋',color:'#00d4ff',probability:100,hatchSeconds:1800,levelBonus:1,statBonus:0}]
export const devEggTypes = eggTypes.map(e => ({...e, hatchSeconds:10}))

export function getTemplate(id) { return digimonTemplates.find(d => d.id === id) }
export function getEggType() { return eggTypes[0] }
export function rollDigimon() { const child = digimonTemplates.filter(t => t.stage === '成长期'); return child[Math.floor(Math.random() * child.length)].id }

export function calcStats(template, level, allocated, natureId) {
  const nature = getNature(natureId)
  const growth = tier => GROWTH_MAP[tier] || 2.0
  const lvFactor = level - 1
  const stats = {}
  const statMap = { hp:['baseHp','growthHp','maxHp'], mp:['baseMp','growthMp','maxMp'], atk:['baseAtk','growthAtk','atk'], def:['baseDef','growthDef','def'], spAtk:['baseSpAtk','growthSpAtk','spAtk'], spDef:['baseSpDef','growthSpDef','spDef'], spd:['baseSpd','growthSpd','spd'] }
  for (const [key, [baseKey, growthKey]] of Object.entries(statMap)) {
    const base = template[baseKey] || 20
    const g = growth(template[growthKey] || 'C')
    let value = Math.floor(base + g * lvFactor + (allocated[key] || 0))
    if (key !== 'hp' && key !== 'mp' && nature) { if (nature.boost === key) value = Math.floor(value * 1.1); if (nature.reduce === key) value = Math.floor(value * 0.9) }
    stats[statMap[key][2]] = value
  }
  stats.hp = stats.maxHp
  return stats
}

export function initFieldExp() { return { nature_spirits:0, deep_savers:0, nightmare_soldiers:0, wind_guardians:0, metal_empire:0, virus_busters:0, dragons_roar:0, jungle_troopers:0, dark_area:0, unknown:0 } }

export function canEvolve(digimon, targetEvolution) {
  if (!targetEvolution.fieldExpRequired) return true
  let exp = digimon.fieldExp
  if (!exp) return false
  if (typeof exp === 'string') { try { exp = JSON.parse(exp) } catch(e) { return false } }
  for (const [fieldId, required] of Object.entries(targetEvolution.fieldExpRequired)) { if ((exp[fieldId] || 0) < required) return false }
  return true
}

// 领域掉落表
export const fieldDropTable = {
  dragons_roar:{item:'dragon_scale',name:'龙之鳞片',icon:'🐉',rate:0.3},
  virus_busters:{item:'holy_feather',name:'神圣羽毛',icon:'🪶',rate:0.3},
  dark_area:{item:'dark_crystal',name:'暗之结晶',icon:'💎',rate:0.3},
  nature_spirits:{item:'nature_orb',name:'自然宝珠',icon:'🔮',rate:0.3},
  metal_empire:{item:'metal_fragment',name:'金属碎片',icon:'⚙️',rate:0.3},
  deep_savers:{item:'ocean_pearl',name:'深海珍珠',icon:'🦪',rate:0.3},
  wind_guardians:{item:'wind_essence',name:'风之精华',icon:'💨',rate:0.3},
  jungle_troopers:{item:'jungle_seed',name:'丛林种子',icon:'🌱',rate:0.3},
  nightmare_soldiers:{item:'nightmare_core',name:'噩梦核心',icon:'👁️',rate:0.3},
  unknown:{item:'virus_antibody',name:'病毒抗体',icon:'💉',rate:0.25}
}

// 卡牌加成系统——每种卡按收集数量分档加成，不同卡累加
export const cardMilestones = [{count:1,label:'1张',pct:1},{count:5,label:'5张',pct:2},{count:10,label:'10张',pct:3},{count:100,label:'100张',pct:5}]
export function getCardBonus(cards) {
  const bonus = {}
  for (const [cardId, count] of Object.entries(cards||{})) {
    if (count < 1) continue
    const tpl = digimonTemplates.find(t => t.id === cardId); if (!tpl) continue
    const stat = cardBonusStat(tpl); if (!stat) continue
    let pct = 0
    for (const m of cardMilestones) { if (count >= m.count) pct = m.pct }
    if (pct > 0) bonus[stat] = (bonus[stat]||0) + pct
  }
  return bonus
}
function cardBonusStat(tpl) {
  const g = {hp:tpl.growthHp,atk:tpl.growthAtk,def:tpl.growthDef,spAtk:tpl.growthSpAtk,spDef:tpl.growthSpDef,spd:tpl.growthSpd}
  const tiers = {S:5,A:4,B:3,C:2,D:1}
  let best = 'hp', bestVal = 0
  for (const [k,v] of Object.entries(g)) { const tv = tiers[v]||0; if (tv > bestVal) { bestVal = tv; best = k } }
  return best
}
export function getCardPct(count) { let p = 0; for (const m of cardMilestones) { if (count >= m.count) p = m.pct }; return p }

// X病毒可感染列表
export const xVirusTargets = ['亚古兽','暴龙兽','机械暴龙兽','战斗暴龙兽','加布兽','加鲁鲁兽','兽人加鲁鲁','钢铁加鲁鲁']
export function getXAntibodyName(name) { return name + 'X' }

export function rollDrops(enemyTeam) {
  const drops = []
  for (const enemy of enemyTeam) {
    for (const fid of (enemy.fields||[])) {
      const cfg = fieldDropTable[fid]
      if (cfg && Math.random() < cfg.rate) {
        const existing = drops.find(d => d.id === cfg.item)
        if (existing) existing.count++
        else drops.push({id:cfg.item,name:cfg.name,icon:cfg.icon,count:1})
      }
    }
  }
  // Bonus: skill scroll chance
  if (Math.random() < 0.08) {
    const existing = drops.find(d => d.id === 'skill_scroll')
    if (existing) existing.count++
    else drops.push({id:'skill_scroll',name:'技能卷轴',icon:'📜',count:1})
  }
  return drops
}
