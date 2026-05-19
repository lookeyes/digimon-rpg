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
  dragon_will:{ id:'dragon_will', name:'龙之斗志', desc:'HP低于50%时，攻击力提升20%' },
  flame_power:{ id:'flame_power', name:'火焰之力', desc:'龙之咆哮领域技能伤害+15%' },
  fur_armor:{ id:'fur_armor', name:'毛皮护甲', desc:'受到物理攻击时20%几率减30%伤害' },
  frost_breath:{ id:'frost_breath', name:'极寒吐息', desc:'出场时敌方全体速度降低10%' },
  gale_wings:{ id:'gale_wings', name:'疾风之翼', desc:'速度不会被降低' },
  blaze_feather:{ id:'blaze_feather', name:'烈焰羽毛', desc:'攻击时10%几率附加灼烧' },
  hard_shell:{ id:'hard_shell', name:'坚硬甲壳', desc:'受到克制伤害时减少25%' },
  static_discharge:{ id:'static_discharge', name:'静电放电', desc:'受到物理攻击30%几率麻痹对手' },
  ocean_power:{ id:'ocean_power', name:'海洋之力', desc:'每回合结束时恢复5%最大HP' },
  fish_guard:{ id:'fish_guard', name:'鱼群守护', desc:'受到多段攻击后续伤害-20%' },
  holy_blessing:{ id:'holy_blessing', name:'神圣加护', desc:'免疫一击必杀效果' },
  light_of_hope:{ id:'light_of_hope', name:'希望之光', desc:'击败敌方后回复15%最大HP' },
  saint_scent:{ id:'saint_scent', name:'圣兽嗅觉', desc:'出场时探查敌方持有物' },
  first_strike_heart:{ id:'first_strike_heart', name:'先制之心', desc:'HP低于25%时速度提升50%' },
  dragon_pressure:{ id:'dragon_pressure', name:'龙之威压', desc:'出场时降低敌方全体攻击10%' },
  berserker:{ id:'berserker', name:'狂战士', desc:'受击后攻击+10%，最多叠3层' },
  prankster:{ id:'prankster', name:'恶作剧之心', desc:'变化技能优先度+1' },
  shadow_walk:{ id:'shadow_walk', name:'暗夜潜行', desc:'被攻击时15%几率闪避' },
  natural_harmony:{ id:'natural_harmony', name:'自然调和', desc:'每回合结束解除一项异常状态' },
  seedling_regen:{ id:'seedling_regen', name:'幼苗再生', desc:'有异常状态时每回合回复10%HP' }
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
  { id:'lalamon',name:'拉拉兽',stage:'成长期',fields:['nature_spirits','jungle_troopers'],type:'数据',description:'植物类型的数码宝贝，必杀技是「坚果射击」。',baseHp:100,baseMp:45,baseAtk:16,baseDef:20,baseSpAtk:30,baseSpDef:28,baseSpd:17,growthHp:'B',growthMp:'A',growthAtk:'D',growthDef:'B',growthSpAtk:'A',growthSpDef:'S',growthSpd:'C',abilities:['natural_harmony','seedling_regen'],evolutionTree:[{name:'向日葵兽',stage:'成熟期',method:'level',condition:16,fields:['jungle_troopers','nature_spirits'],type:'数据',fieldExpRequired:{jungle_troopers:50}}] }
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
  lalamon:[{id:'nut_shot',name:'坚果射击',type:'physical',field:'jungle_troopers',power:40,accuracy:100,mpCost:8,priority:0,description:'发射坚硬坚果攻击。',effects:[],statChanges:null,target:'enemy',learnLevel:1},{id:'nature_heal',name:'自然治愈',type:'status',field:'nature_spirits',power:0,accuracy:100,mpCost:15,priority:0,description:'自然之力回复50%最大HP。',effects:[],statChanges:null,target:'self',learnLevel:15,healPercent:50}]
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
export function getUniqueSkillsForDigimon(templateId, level) { const skills = uniqueSkills[templateId] || []; return skills.filter(s => s.learnLevel <= level) }
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
  {id:'t_hp_up1',name:'HP增强I',rarity:'white',desc:'HP+10%',effect:{stat:'maxHp',pct:10}},{id:'t_atk_up1',name:'攻击增强I',rarity:'white',desc:'攻击+10%',effect:{stat:'atk',pct:10}},{id:'t_def_up1',name:'防御增强I',rarity:'white',desc:'防御+10%',effect:{stat:'def',pct:10}},{id:'t_spatk_up1',name:'特攻增强I',rarity:'white',desc:'特攻+10%',effect:{stat:'spAtk',pct:10}},{id:'t_spdef_up1',name:'特防增强I',rarity:'white',desc:'特防+10%',effect:{stat:'spDef',pct:10}},{id:'t_spd_up1',name:'速度增强I',rarity:'white',desc:'速度+8%',effect:{stat:'spd',pct:8}},{id:'t_mp_up1',name:'MP增强I',rarity:'white',desc:'MP+10%',effect:{stat:'maxMp',pct:10}},{id:'t_hp_up2',name:'HP增强II',rarity:'white',desc:'HP+15%',effect:{stat:'maxHp',pct:15}},{id:'t_atk_up2',name:'攻击增强II',rarity:'white',desc:'攻击+15%',effect:{stat:'atk',pct:15}},{id:'t_def_up2',name:'防御增强II',rarity:'white',desc:'防御+15%',effect:{stat:'def',pct:15}},{id:'t_exp_up',name:'学习能力',rarity:'white',desc:'EXP获取+20%',effect:{stat:'expGain',pct:20}},{id:'t_gold_up',name:'财运',rarity:'white',desc:'战斗金币+20%',effect:{stat:'goldGain',pct:20}},{id:'t_hp_small',name:'活力',rarity:'white',desc:'HP+80',effect:{stat:'maxHp',flat:80}},{id:'t_atk_small',name:'蛮力',rarity:'white',desc:'攻击+20',effect:{stat:'atk',flat:20}},{id:'t_def_small',name:'坚韧',rarity:'white',desc:'防御+15',effect:{stat:'def',flat:15}},{id:'t_spd_small',name:'敏捷',rarity:'white',desc:'速度+10',effect:{stat:'spd',flat:10}},{id:'t_spatk_small',name:'聪慧',rarity:'white',desc:'特攻+15',effect:{stat:'spAtk',flat:15}},{id:'t_spdef_small',name:'意志',rarity:'white',desc:'特防+15',effect:{stat:'spDef',flat:15}},
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
export function rollDigimon() { return digimonTemplates[Math.floor(Math.random() * digimonTemplates.length)].id }

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
