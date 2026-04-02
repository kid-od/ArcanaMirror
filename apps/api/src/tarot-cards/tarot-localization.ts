import { AppLocale } from '../common/locale';

type MajorArcanaLocaleEntry = {
  name: string;
  keywords: string[];
  essence: string;
  shadow: string;
  emotional: string;
  relationship: string;
  career: string;
  description: string;
};

type SuitLocaleEntry = {
  label: string;
  subtitle: string;
  arc: string;
  tone: string;
  emotionalLens: string;
  relationshipLens: string;
  careerLens: string;
};

type RankLocaleEntry = {
  label: string;
  keywords: string[];
  upright: string;
  reversed: string;
  prompt: string;
};

const majorArcanaZh: Record<string, MajorArcanaLocaleEntry> = {
  'The Fool': {
    name: '愚者',
    keywords: ['启程', '信任', '开放'],
    essence:
      '在答案尚未完全出现前，先回应那股想要开始的召唤，相信好奇本身也能成为一种指引。',
    shadow: '向前冲得太快，以至于把自己更深的需要甩在身后。',
    emotional: '经历过谨慎之后，你也许正在重新学会惊喜与轻盈。',
    relationship: '当你少一点预设、多一点诚实时，关系会更容易松动与靠近。',
    career: '一条新路值得尝试，只要你保持可学习的姿态，不必急着跨出第一大步。',
    description:
      '愚者指向新的起点、带着脆弱感的勇气，以及重新开始时那份安静的智慧。',
  },
  'The Magician': {
    name: '魔术师',
    keywords: ['专注', '能动性', '表达'],
    essence: '你所需的工具其实已经在身边，真正的推进来自意图开始落到行动上。',
    shadow: '试图控制每一个变量，而不是和此刻真实存在的资源合作。',
    emotional: '你的感受需要一个更清晰的出口，而不是继续停留在模糊里。',
    relationship: '当语言真正贴近内心时，沟通本身就能带来修复。',
    career: '你的能力已经足以被整理成一个更自信的方向或表达。',
    description: '魔术师强调资源整合、具身的自信，以及有意识选择所带来的力量。',
  },
  'The High Priestess': {
    name: '女祭司',
    keywords: ['直觉', '静默', '深度'],
    essence: '真正的清晰常来自向内聆听，而不是急着逼出一个结论。',
    shadow: '因为难以解释，就把自己已经知道的内在答案压了回去。',
    emotional: '有个更安静的真相正在请求你的耐心。',
    relationship: '空间、敏感与细致倾听，能让关系里被忽略的东西浮现出来。',
    career: '比起立刻行动，观察与保留可能更有策略性。',
    description: '女祭司尊重直觉、象征语言，以及把等待本身活好的那份智慧。',
  },
  'The Empress': {
    name: '皇后',
    keywords: ['滋养', '创造力', '丰盛'],
    essence: '当你稳定而细致地照料真正有生命力的事物时，成长会自然发生。',
    shadow: '给予过度，最后让支持变成了消耗。',
    emotional: '温柔并不等于软弱，尤其当它也把你自己算进去时。',
    relationship: '当温暖与边界同时存在，爱会更深、更健康。',
    career: '有资源可依、也有足够时间成熟时，创造性的工作会更容易开花。',
    description: '皇后关乎想法的繁盛、身体层面的舒展，以及富有照料感的慷慨。',
  },
  'The Emperor': {
    name: '皇帝',
    keywords: ['结构', '稳定', '领导力'],
    essence: '适度而支持性的秩序，能托住重要的事物，不让它在压力中坍塌。',
    shadow: '把僵硬误当成力量，最后不给柔软留下空间。',
    emotional: '你也许需要更稳的内在边界，才能安全地待在真实里。',
    relationship: '稳定与负责，往往比盛大的姿态更能让人安心。',
    career: '清晰计划、角色边界与扎实领导，会让推进更可持续。',
    description: '皇帝代表稳健的结构、责任感，以及脚踏实地的权威。',
  },
  'The Hierophant': {
    name: '教皇',
    keywords: ['智慧', '仪式', '指引'],
    essence: '值得信任的练习、老师与价值观，会成为你重新稳住自己的方式。',
    shadow: '继续照搬继承来的脚本，却发现它已不适合你的真实生活。',
    emotional: '一个让你落地的日常仪式，也许能帮助你更清楚地听见自己。',
    relationship: '共享价值重要，但也要确认旧规则是否仍然真正服务彼此。',
    career: '导师、训练或成熟的方法框架，会帮助你更安心地推进。',
    description: '教皇探索传统、归属感，以及如何辨认值得信任的指引。',
  },
  'The Lovers': {
    name: '恋人',
    keywords: ['对齐', '选择', '连结'],
    essence: '你被邀请去选择真正对齐的事，而不是只挑那个当下最有吸引力的。',
    shadow: '把能量分散在冲突的欲望之间，迟迟不愿面对更深的选择。',
    emotional: '此刻，完整性与情感本身一样重要。',
    relationship: '当选择、诚实与彼此看见同步发生时，亲密才能真正加深。',
    career: '下一步也许取决于你的工作是否仍然表达了你真实的价值。',
    description: '恋人关乎有意义的选择、关系中的真实，以及由心而发的对齐。',
  },
  'The Chariot': {
    name: '战车',
    keywords: ['方向', '意志力', '推进'],
    essence: '当分散的力量被整合到同一个方向时，前进会变得更有力量。',
    shadow: '朝着目标冲得太快，以至于把内在生活甩在了后面。',
    emotional: '决心当然重要，但它只有在包含情绪诚实时才真正有用。',
    relationship: '关系能否推进，取决于双方是否愿意朝同一个方向移动。',
    career: '专注而持续的投入，有机会打破停滞，让事情重新产生牵引力。',
    description: '战车讲的是纪律化的行动、整合后的努力，以及坚定的前行。',
  },
  Strength: {
    name: '力量',
    keywords: ['勇气', '温柔', '自我信任'],
    essence:
      '真正的力量并不总靠硬碰硬，而是来自稳定、平静、能承载情绪的存在感。',
    shadow: '以为必须压倒脆弱，而不是学着和它站在一起。',
    emotional: '用同情去面对感受，往往比压抑它们更有力量。',
    relationship: '耐心与情绪上的稳定，会把冲突慢慢转成理解。',
    career: '领导力不仅需要信心，也需要情绪成熟。',
    description: '力量映照的是内在韧性、柔和的权威感，以及敢于温柔的勇气。',
  },
  'The Hermit': {
    name: '隐者',
    keywords: ['独处', '洞见', '辨明'],
    essence: '往后退一步，常常能帮助你听见那些一直被喧闹盖住的真相。',
    shadow: '退得太远，让反思慢慢变成了隔绝。',
    emotional: '有些答案需要先在安静里待一会儿，才会变成语言。',
    relationship: '如果距离带来的是洞见而不是逃避，它就可能是有帮助的。',
    career: '一段独立研究或复盘的时期，会让下一步更清楚。',
    description: '隐者邀请你暂时撤离噪音，回到内在指引与更长的视角。',
  },
  'Wheel of Fortune': {
    name: '命运之轮',
    keywords: ['变化', '时机', '循环'],
    essence:
      '生活正在转动，你真正的任务是带着在场感回应，而不是因为不确定而慌张。',
    shadow: '试图把一个本来就会流动的时刻永远固定下来。',
    emotional: '情绪季节正在变化，其中既有不安，也可能有松一口气的空间。',
    relationship: '模式正在改写，此刻的弹性也许比控制更重要。',
    career: '现在格外需要留意时机、机会，以及你调整自己的能力。',
    description: '命运之轮提醒你，变化本身是自然的，而时机里往往也藏着智慧。',
  },
  Justice: {
    name: '正义',
    keywords: ['真实', '平衡', '责任'],
    essence: '清晰需要诚实、比例感，以及看见因果关系的勇气。',
    shadow: '把确定感当作盔甲，却不愿面对完整的图景。',
    emotional: '把事实与感受说清楚，往往能帮你恢复内在平衡。',
    relationship: '修复的前提是公平、责任承担，以及面对真实发生了什么。',
    career: '做决定时，清楚边界、透明逻辑与伦理感会格外重要。',
    description: '正义映照的是完整性、平衡判断，以及真相本身的修复力量。',
  },
  'The Hanged Man': {
    name: '倒吊人',
    keywords: ['暂停', '放下', '新视角'],
    essence: '暂停不一定是惩罚，它也可能刚好是某个洞见需要的角度。',
    shadow: '抓住控制不放，以至于新的看见根本进不来。',
    emotional: '换个角度理解这件事，会让卡住的感觉松一些。',
    relationship: '从对方那一侧重新看一次，整段关系的气氛都可能改变。',
    career: '延迟未必坏，它可能正好帮你质疑一个已经过时的策略。',
    description: '倒吊人强调放下、重新框定，以及静止之中藏着的智慧。',
  },
  Death: {
    name: '死神',
    keywords: ['结束', '转化', '更新'],
    essence: '有些东西正在结束，好让生命围绕着更真实的部分重新组织起来。',
    shadow: '死抓着已经完成使命的篇章，不愿让它真正离开。',
    emotional: '一个周期结束时，悲伤与轻松有时会同时出现。',
    relationship: '某种关系模式也许需要结束，新的健康形态才有空间开始。',
    career: '一个角色、策略或身份正在改变，为更诚实的下一阶段腾出位置。',
    description:
      '死神并不等于厄运，它关乎转化、释放，以及让生命继续流动的勇气。',
  },
  Temperance: {
    name: '节制',
    keywords: ['平衡', '整合', '疗愈'],
    essence: '原本分裂的部分，可以通过耐心、节奏与细致调和变得可被承接。',
    shadow: '试图催促一个原本就需要更温柔时机的疗愈过程。',
    emotional: '你的系统可能正在请求你练习节制、缓慢与稳定。',
    relationship: '互相调整与彼此体谅，会创造更平静的中间地带。',
    career: '真正可持续的推进来自好节奏，而不是持续性焦虑。',
    description: '节制谈的是和谐、修复，以及把不同部分慢慢调和的能力。',
  },
  'The Devil': {
    name: '恶魔',
    keywords: ['执着', '阴影', '解放'],
    essence: '觉察正在揭露那些被恐惧、羞耻或惯性放大了的束缚。',
    shadow: '把熟悉的模式误认成永远无法改变的真相。',
    emotional: '带着同情心的诚实，会慢慢松动那些抓得太紧的东西。',
    relationship: '先承认不健康的动态，才有可能为关系找回自由与照料。',
    career: '耗竭性的工作模式，也许需要更清楚的边界或全新的协商。',
    description: '恶魔邀请你直视那些把你绑住的模式，让选择权重新回来。',
  },
  'The Tower': {
    name: '高塔',
    keywords: ['震动', '真相', '突破'],
    essence: '某个结构正在裂开，因为它已无法继续承载真正的现实。',
    shadow: '太害怕变化，以至于把必要的真相只看成混乱。',
    emotional: '突如其来的看见，往往既令人不安，也让人解脱。',
    relationship: '诚实带来的震动，反而可能为更真实的连接清出空间。',
    career: '计划被打乱，也许正好让你看见哪里需要更稳的基础。',
    description: '高塔象征揭露、结构性变化，以及真相所具有的清场力量。',
  },
  'The Star': {
    name: '星星',
    keywords: ['希望', '更新', '指引'],
    essence: '在经历紧绷之后，希望正以一种更安静、也更可信的方式回来。',
    shadow: '非要等到百分之百确定，才允许自己相信疗愈可能发生。',
    emotional: '你可以稍微放松下来，并信任下一个小而稳的动作。',
    relationship: '温柔与真诚，会帮助关系重新建立一点点信心。',
    career: '比起立刻完美，更重要的是你能否看见更长期的方向。',
    description: '星星带来安慰、修复性的视角，以及更稳定的可能性感。',
  },
  'The Moon': {
    name: '月亮',
    keywords: ['神秘', '感受', '潜意识'],
    essence:
      '一切还没有完全清楚，此刻或许更适合凭感觉慢慢前行，而不是急着索要证据。',
    shadow: '让不确定不断放大恐惧，而不是转向好奇。',
    emotional: '你的直觉很活跃，但它也需要落地与承托。',
    relationship: '当关系里信号混杂时，更适合温柔澄清，而不是急着下结论。',
    career: '一个并不明朗的阶段，需要观察、耐心与细致判断。',
    description: '月亮探索的是暧昧、内在意象，以及在黑暗中摸索感知的智慧。',
  },
  'The Sun': {
    name: '太阳',
    keywords: ['清晰', '喜悦', '生命力'],
    essence: '那些被遮住的部分，正在变得更简单、更温暖，也更容易信任。',
    shadow: '明明此刻需要敞开，你却仍然穿着过厚的铠甲。',
    emotional: '当你允许自己被真正看见时，更明亮的情绪状态就有机会出现。',
    relationship: '温暖、坦率与在场，会把关系重新带回轻松。',
    career: '当可见度与自信配上谦逊时，事情更容易产生推进。',
    description: '太阳代表清楚看见、完整的生命力，以及脚踏实地的乐观。',
  },
  Judgement: {
    name: '审判',
    keywords: ['觉醒', '真相', '新的召唤'],
    essence: '你可能正在听见一个更清晰的召唤，它更贴近现在这个真实的你。',
    shadow: '把过去评判得太苛刻，反而接收不到它真正教会你的东西。',
    emotional: '对自己多一点宽恕，会帮助新篇章更诚实地开始。',
    relationship: '某段关系也许正在问，它是否能进化成更有意识的样子。',
    career: '职业方向的转变，或重新被唤起的使命感，正慢慢显形。',
    description: '审判关乎觉醒、回望，以及回应那个更诚实的召唤。',
  },
  'The World': {
    name: '世界',
    keywords: ['完成', '整合', '圆满'],
    essence: '一个周期正在合拢，让你有机会看见自己已经走了多远。',
    shadow: '匆忙越过完成时刻，错过了那些已经真正整合进来的意义。',
    emotional: '承认自己的成长已经形成整体，本身就能带来一种平静的自豪。',
    relationship: '一段关系可能正在进入更成熟、更整合的章节。',
    career: '长期努力也许正在走向熟成、收束，或一个更广阔的新地平线。',
    description: '世界象征完成、综合，以及整合之后那种深而稳的安定。',
  },
};

const suitLocaleZh: Record<string, SuitLocaleEntry> = {
  cups: {
    label: '圣杯',
    subtitle: '圣杯牌组',
    arc: '情绪、直觉、柔软与连结',
    tone: '慢慢靠近自己真正的感受',
    emotionalLens: '你的内在风景正在请求被感受，而不是被匆忙处理。',
    relationshipLens: '关系里的清晰，往往来自共情、真诚与情绪上的在场。',
    careerLens: '真正有意义的工作，常常和价值感、照料感与情绪智能有关。',
  },
  swords: {
    label: '宝剑',
    subtitle: '宝剑牌组',
    arc: '清晰、张力、真相与辨明',
    tone: '即使不舒服，也愿意说出真实',
    emotionalLens: '思绪也许转得很快，先落地，真相才不会显得过于锋利。',
    relationshipLens: '诚实对话重要，但语气与时机同样重要。',
    careerLens: '当决定建立在清晰思考而不是压力上时，结果会更稳。',
  },
  wands: {
    label: '权杖',
    subtitle: '权杖牌组',
    arc: '动力、欲望、创造力与推进',
    tone: '顺着真正有生命力的方向去行动',
    emotionalLens: '当你靠近真正点亮自己的东西，生命力就会回来。',
    relationshipLens: '吸引力很强，但只有加上方向感与照顾，才能变得可持续。',
    careerLens: '主动性、勇气与创造性的风险，会为下一章打开入口。',
  },
  pentacles: {
    label: '星币',
    subtitle: '星币牌组',
    arc: '身体、工作、资源与落地的稳定',
    tone: '去建设那些能在日常里真正支撑你的东西',
    emotionalLens: '透过身体感、休息与实际照顾，你会更容易找回稳定。',
    relationshipLens: '可靠与日常里的小动作，会一点点累积出信任。',
    careerLens: '可持续的进展，来自技能、耐心与看得见的投入。',
  },
};

const rankLocaleZh: Record<string, RankLocaleEntry> = {
  Ace: {
    label: '王牌',
    keywords: ['开端', '种子', '邀约'],
    upright: '一个新的入口正在出现，值得被温柔地留意。',
    reversed: '入口依然存在，只是犹豫或怀疑正在让它变得黯淡。',
    prompt: '哪个开始还需要你多给一点信任？',
  },
  Two: {
    label: '二',
    keywords: ['平衡', '选择', '交换'],
    upright: '一个重要的选择或互动，正在塑造接下来的篇章。',
    reversed: '你努力维持的平衡，可能比表面看起来更吃力。',
    prompt: '你现在正试图同时托住什么？',
  },
  Three: {
    label: '三',
    keywords: ['生长', '扩展', '协作'],
    upright: '事情正透过连结、反馈或共享能量开始生长。',
    reversed: '成长是可能的，只是失衡或错位让它慢了下来。',
    prompt: '怎样才能让它以更健康的方式长大？',
  },
  Four: {
    label: '四',
    keywords: ['稳定', '暂停', '保护'],
    upright: '当你尊重真正能修复自己的东西时，稳定就会出现。',
    reversed: '抓得太紧，反而会让休息与稳定更难被感受到。',
    prompt: '你真正需要的是稳定，而不是着急，在哪里？',
  },
  Five: {
    label: '五',
    keywords: ['张力', '变化', '摩擦'],
    upright: '摩擦正在暴露出那些需要调整或被诚实看见的地方。',
    reversed: '冲突也许转向了内在，或仍在表面下持续发酵。',
    prompt: '哪股张力正在请求你带着照料去面对？',
  },
  Six: {
    label: '六',
    keywords: ['移动', '支持', '重新平衡'],
    upright: '局面正在朝更可承接的节奏移动。',
    reversed: '转变是可能的，只是目前这段过渡还没有真正完成。',
    prompt: '什么会让这段过渡更稳一点？',
  },
  Seven: {
    label: '七',
    keywords: ['辨明', '试探', '内在策略'],
    upright: '辨明很重要，因为不是每个选项都值得你投入同样的能量。',
    reversed: '当你不再把注意力分散到太多方向时，混乱会慢慢退下去。',
    prompt: '什么真正值得你的能量，什么并不值得？',
  },
  Eight: {
    label: '八',
    keywords: ['动能', '技巧', '流动'],
    upright: '当努力变得更专注、更熟练时，动能就会建立起来。',
    reversed: '进展起伏不定，也许是在提醒你调整节奏或方向。',
    prompt: '怎样的节奏会更支持你清晰地推进？',
  },
  Nine: {
    label: '九',
    keywords: ['门槛', '韧性', '整合'],
    upright: '你正站在一个门槛前，需要的是韧性与视角。',
    reversed: '疲惫或怀疑，正在让这个门槛显得比实际更沉重。',
    prompt: '什么支持会帮助你留在这个门槛前，而不逃开？',
  },
  Ten: {
    label: '十',
    keywords: ['圆满', '重量', '完成'],
    upright: '一个周期正在走向饱满，同时显露出它的收获与重量。',
    reversed: '完成已近，只是你也许得先放下一部分负荷。',
    prompt: '你准备完成什么，或准备放下什么？',
  },
  Page: {
    label: '侍者',
    keywords: ['好奇', '学习', '讯息'],
    upright: '新的洞见会透过好奇心与愿意学习的姿态到来。',
    reversed: '讯息已经出现，只是稚嫩或分心让它显得模糊。',
    prompt: '在这里，保持可学习的姿态会是什么样？',
  },
  Knight: {
    label: '骑士',
    keywords: ['追寻', '驱动', '方向'],
    upright: '当目标感与节奏感保持连结时，强烈的行动力就会变得可用。',
    reversed: '驱动力很强，但它的方向或时机可能还需要再调整。',
    prompt: '怎样的行动会同时显得勇敢又稳妥？',
  },
  Queen: {
    label: '皇后',
    keywords: ['成熟', '照料', '具身智慧'],
    upright: '成熟的在场感与内在稳定，会很好地塑造这个局面。',
    reversed: '你需要更多照顾，尤其当情绪或现实储备已经偏薄时。',
    prompt: '你怎样能用稳定与照料来带领这个时刻？',
  },
  King: {
    label: '国王',
    keywords: ['权威', '掌握', '守护'],
    upright: '当领导力建立在清晰与责任上时，它会变得更稳健。',
    reversed: '控制欲可能遮住了真正的守护感，提醒你回到更有智慧的中心。',
    prompt: '在这里，负责任的领导会是什么样？',
  },
};

export function getMajorArcanaLocaleEntry(name: string, locale: AppLocale) {
  if (locale === 'zh') {
    return majorArcanaZh[name];
  }

  return null;
}

export function getSuitLocaleEntry(suit: string, locale: AppLocale) {
  if (locale === 'zh') {
    return suitLocaleZh[suit];
  }

  return null;
}

export function getRankLocaleEntry(rank: string, locale: AppLocale) {
  if (locale === 'zh') {
    return rankLocaleZh[rank];
  }

  return null;
}
