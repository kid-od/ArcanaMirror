import { AppLocale } from './shared';

const messages = {
  en: {
    metadataDescription:
      'Arcana Mirror is a reflective tarot experience with a ritual-like flow, calm symbolism, and emotionally supportive interpretation.',
    header: {
      wordmark: 'Arcana Mirror',
      tagline: 'Mirror Tarot',
      links: {
        home: 'Home',
        single: 'Single Card',
        three: 'Three Card Spread',
        cards: 'Card Library',
        about: 'About',
      },
      localeButton: '中文',
      localeLabel: 'Switch language',
    },
    footer: {
      description:
        'A reflective tarot space for questions, symbols, and emotionally supportive interpretation.',
      links: {
        about: 'About',
        privacy: 'Privacy',
        disclaimer: 'Disclaimer',
      },
      note:
        'Tarot here is offered as symbolic reflection, not fixed destiny or professional advice.',
    },
    home: {
      heroEyebrow: 'Reflective Tarot',
      heroTitle: 'What is your heart trying to ask today?',
      heroDescription:
        'Draw a card, enter a ritual pace, and receive interpretation that feels symbolic, calm, and emotionally supportive rather than fixed or fear-driven.',
      startReading: 'Start Reading',
      exploreCards: 'Explore Cards',
      singleEyebrow: 'Single Card',
      singleTitle: 'A focused mirror for one clear question.',
      singleDescription:
        'Best for a quick emotional check-in, a present concern, or one symbolic direction to reflect on.',
      threeEyebrow: 'Past / Present / Future',
      threeTitle: 'A three-card spread for movement and context.',
      threeDescription:
        'Best when you want to understand how a pattern formed, where you stand now, and what may be unfolding next.',
      chooseEyebrow: 'Choose a Ritual',
      chooseTitle: 'Begin with the spread that matches your pace.',
      chooseDescription:
        'Each path keeps the experience intentional and easy to follow, with room for reflection instead of dramatic prediction.',
      fastEyebrow: 'Fast Reflection',
      fastTitle: 'Single-card reading',
      fastDescription:
        'Ask one question, shuffle, draw, and receive a concise reading with keywords, interpretation, and a gentle reflection prompt.',
      drawOne: 'Draw One Card',
      arcEyebrow: 'Deeper Arc',
      arcTitle: 'Three-card spread',
      arcDescription:
        'Move through past, present, and future to see the emotional theme, likely transition, and what the spread invites you to notice.',
      drawThree: 'Draw Three Cards',
      dailyEyebrow: 'Daily Reflection',
      dailyTitle: 'A quiet card for today.',
      dailyUnavailableEyebrow: 'Unavailable',
      dailyUnavailableTitle: 'The daily card is resting right now.',
      dailyUnavailableDescription:
        'The card catalog could not be reached just now, but you can still begin a reading or browse the library later.',
      philosophyEyebrow: 'How Tarot Is Held Here',
      philosophyTitle: 'Symbolic guidance, not fixed destiny.',
      philosophyParagraphs: [
        'In Arcana Mirror, tarot is a reflective practice. Cards offer symbols, emotional language, and perspective. They are here to help you notice patterns, not to frighten you with absolutes.',
        'Upright cards tend to describe energy that is more available or direct. Reversed cards often point to an inner process, a blocked current, or a lesson that wants more gentle attention.',
        'A helpful reading is not about being told what must happen. It is about seeing your moment more clearly and meeting it with care.',
      ],
      readGuidance: 'Read the guidance notes',
    },
    drawPages: {
      single: {
        title: 'Single-card reading',
        description:
          'A clear, ritual-like draw for one focused question. Move slowly, shuffle once the question feels real, and let one card answer with symbolic precision.',
        prompts: [
          'What is the deeper lesson in this relationship right now?',
          'What deserves my attention in work or study this week?',
          'What part of me is asking for gentler care?',
          'What am I being invited to understand about this decision?',
          'What would support my growth in this season?',
        ],
      },
      three: {
        title: 'Past, present, future',
        description:
          'A three-card spread for questions that need movement and context. Trace what shaped the situation, what is alive now, and what may be forming next.',
        prompts: [
          'How did this pattern begin, and what is changing now?',
          'What am I carrying from the past into the present?',
          'How can I move through this emotional transition more clearly?',
          'What does this situation ask of me now and in the near future?',
          'What is the arc of this question across past, present, and future?',
        ],
      },
    },
    drawFlow: {
      ritualFlow: 'Ritual Flow',
      stepOne: 'Step One',
      questionLabel: 'Question',
      stepTitle: 'Ask what is truly asking for attention.',
      stepDescription:
        'Keep the question open enough for reflection and specific enough to feel emotionally honest.',
      supportEyebrow: 'Ritual Guide',
      supportTitle: 'How this reading will unfold.',
      supportItems: [
        {
          title: 'Let the question take shape',
          body: 'You do not need the perfect wording. Once the question feels honest enough, the ritual can begin to answer.',
        },
        {
          title: 'Choose through slow movement',
          body: 'Inside the chamber, use the ribbon to approach the card that keeps returning to the center with quiet insistence.',
        },
        {
          title: 'Stay on the same page',
          body: 'After you seal the draw, the reveal opens directly below so the reading keeps its sense of continuity.',
        },
      ],
      questionPlaceholder: 'What is my heart trying to understand in this moment?',
      beginRitual: 'Begin the ritual',
      exploreCardsFirst: 'Explore card meanings first',
      questionReady:
        'Then move through three slow beats in the ritual chamber before you turn the cards.',
      questionNotReady:
        'The ritual begins once your question has enough shape to guide the draw.',
      errors: {
        questionRequired:
          'Write a focused question or choose one of the suggested prompts first.',
        readingUnavailable: 'The reading could not be created just now.',
        deckUnavailable:
          'The card catalog could not be prepared for the ritual just now.',
      },
      chapters: {
        question: 'Question',
        descent: 'Descent',
        shuffle: 'Shuffle',
        seal: 'Seal',
        reveal: 'Reveal',
      },
      gesture: {
        loadingDeck: 'Preparing the deck...',
        modalEyebrow: 'Gesture Ritual',
        singleTitle: 'Turn one card through gesture',
        threeTitle: 'Turn the spread with your hand',
        close: 'Close',
        useFallback: 'Use touch ritual',
        instructionsEyebrow: 'How It Works',
        instructionsMove:
          'Keep one hand in view and move gently left or right to turn the ribbon.',
        instructionsPinch:
          'Pinch thumb and index finger together to select a card when the pointer is resting over it.',
        instructionsOpen:
          'After the card turns, pinch once more on the revealed card to enter the full reading.',
        surfaceEyebrow: 'Gesture Surface',
        selectSingleTitle: 'Let one card gather at the center.',
        selectThreeTitle: 'Draw past, present, and future in sequence.',
        turningTitle: 'The card is turning toward the light.',
        revealingTitle: 'The reveal is unfolding.',
        revealReadyTitle: 'The card is ready to be read.',
        turningHint:
          'Stay with the chamber for a moment while the selected cards align with the reading.',
        revealingHint:
          'The cards are turning in sequence. Let the reveal settle before you reach for the deeper interpretation.',
        readyHint:
          'The revealed cards can now carry you into the full interpretation with one more pinch.',
        singleHint:
          'Move slowly, let one veiled card settle under the pointer, then pinch to choose it.',
        threeHint:
          'Draw three cards one by one. Each selected card rests below before the spread turns in sequence.',
        readyToOpen:
          'Pinch on the revealed card to continue into the full reading.',
        statusBooting: 'Preparing the gesture chamber...',
        statusPermission: 'Allow the camera to begin the gesture ritual.',
        statusReady: 'Camera ready. Move your hand into view.',
        statusSearching: 'Looking for a steady hand...',
        statusTracking: 'Hand found. Move and pinch to guide the draw.',
        statusTurning: 'Turning the chosen card...',
        statusRevealReady: 'The reveal is ready for one more pinch.',
        fallbackReasons: {
          unsupported:
            'This browser or device could not support camera gesture control, so the ritual has returned to the touch ribbon below.',
          'permission-denied':
            'Camera permission was not granted, so the ritual has returned to the touch ribbon below.',
          'tracking-lost':
            'The hand could not be tracked steadily, so the ritual has returned to the touch ribbon below.',
          manual:
            'The gesture chamber was closed and the touch ribbon is ready below.',
          'initialization-failed':
            'The gesture chamber could not finish preparing, so the ritual has returned to the touch ribbon below.',
        },
      },
    },
    ritualStage: {
      spreadSingle: 'Single Card Ritual',
      spreadThree: 'Three Card Ritual',
      drawn: 'Drawn',
      yourQuestion: 'Your Question',
      chamberAwake: 'The chamber is awake.',
      questionPending: 'Write a question above before the chamber can respond.',
      questionDescent: 'Enter the chamber and start moving the ribbon.',
      questionSealSingle: 'The selected card is ready below. Turn it when you are ready.',
      questionSealThree: 'The selected cards are ready below. Turn them when you are ready.',
      shufflingReel: 'Shuffling Reel',
      shufflingDescription:
        'Keep the pointer inside this chamber to lock page scrolling. Turn the ribbon with the wheel, swipe, or drag, then choose the card that rises into focus.',
      focus: 'focus',
      back: 'Back',
      next: 'Next',
      errorEyebrow: 'Ritual Error',
      openLibrary: 'Open card library',
      sealDraw: 'Seal the draw',
      sealing: 'Sealing...',
      trayWaiting: 'Waiting',
      traySelected: 'Selected',
      trayDrawn: 'Drawn',
      deck: {
        alreadyDrawn: 'already drawn',
        draw: 'Draw',
        brand: 'Arcana Mirror',
        choose: 'Choose',
        veiled: 'Veiled',
        resting: 'Resting below.',
        clickCard: 'Click this card.',
        stayWithRibbon: 'Stay with the ribbon.',
      },
      positions: {
        single: 'Chosen card',
        past: 'Past',
        present: 'Present',
        future: 'Future',
      },
      stageCopy: {
        descent: {
          eyebrow: 'Descent',
          title: 'Let the room quiet down around the question.',
          body:
            'Keep the pointer inside the chamber and move the ribbon gently. While you are there, the page waits and only the deck responds.',
          cue: 'Wheel, swipe, or drag the ribbon itself.',
        },
        shuffleSingle: {
          eyebrow: 'Shuffle Chamber',
          title: 'Turn the ribbon until one card feels ready.',
          body:
            'The deck stays continuous. Let the center card come into focus, then choose it.',
          cue: 'Click the center card when it catches.',
        },
        shuffleThree: {
          eyebrow: 'Shuffle Chamber',
          title: 'Turn the ribbon and draw three cards in sequence.',
          bodyPrefix: 'Draw ',
          bodyMiddle: ' cards one by one. ',
          bodySingular: 'card is',
          bodyPlural: 'cards are',
          bodySuffix: ' already resting in the tray.',
          cue: 'Keep selecting until past, present, and future are filled.',
        },
        sealSingle: {
          eyebrow: 'Seal The Draw',
          title: 'The chosen card is resting below.',
          body: 'Turn the chosen card when you are ready to receive the reading.',
          cue: 'Use the action bar below to reveal the reading.',
        },
        sealThree: {
          eyebrow: 'Seal The Draw',
          title: 'Past, present, and future are all in place.',
          body: 'Turn the chosen cards together when the sequence feels complete.',
          cue: 'Use the action bar below to reveal the reading.',
        },
      },
    },
    reveal: {
      eyebrow: 'Reveal Sequence',
      emptyTitle: 'The cards will settle here once the draw is sealed.',
      emptyDescription:
        'After you confirm the draw, the reveal moves downward into view and the interpretation begins to unfold without leaving this page.',
      singleTitle: 'One card has turned itself toward the light.',
      threeTitle: 'The spread has taken on a readable shape.',
      reflectionPrompt: 'Reflection Prompt',
      emergingEyebrow: 'What Is Emerging',
      fullReading: 'Full Reading',
      fullReadingDescription:
        'Open the dedicated result page to move from this first impression into the fuller reading, card context, and integrated interpretation.',
      openFullReading: 'Open the full reading',
      opening: 'Opening...',
    },
    cards: {
      pageTitle: 'Card Library',
      pageErrorEyebrow: 'Library Error',
      pageErrorTitle: 'The card library is unavailable right now.',
      pageErrorDescription:
        'The deck could not be loaded from the API. Try again in a moment or begin a draw when the connection returns.',
      emptyEyebrow: 'Empty Library',
      emptyTitle: 'No cards have been prepared yet.',
      emptyDescription:
        'The catalog is still waiting to be seeded. Once cards are available, the library will appear here.',
      headingEyebrow: 'Card Library',
      headingTitle: 'Learn the symbols before or after a reading.',
      headingDescription:
        'Browse the deck by arcana or suit, and use the library as a quiet reference whenever a card keeps returning to mind.',
      searchLabel: 'Search cards',
      searchPlaceholder: 'Search by card name, suit, or keyword',
      noMatchesEyebrow: 'No Matches',
      noMatchesTitle: 'No cards matched that combination.',
      noMatchesDescription:
        'Try a broader search, switch suits, or return to the full deck view.',
      cardErrorEyebrow: 'Card Error',
      cardErrorTitle: 'This card could not be opened.',
      cardErrorDescription:
        'The detail view could not be loaded from the API just now.',
      majorArcana: 'Major Arcana',
      suitSuffix: 'suit',
      upright: 'Upright',
      reversed: 'Reversed',
      emotionalMeaning: 'Emotional Meaning',
      relationshipMeaning: 'Relationship Meaning',
      careerMeaning: 'Career Meaning',
    },
    reading: {
      errorEyebrow: 'Reading Error',
      errorTitle: 'The reading could not be opened.',
      errorDescriptionNotFound:
        'This reading may have expired or the id may be incorrect.',
      errorDescriptionApi:
        'The reading could not be loaded from the API just now.',
      resultEyebrow: 'Reading Result',
      singleTitle: 'Single-card reflection',
      threeTitle: 'Past, present, future spread',
      question: 'Your Question',
      spread: 'Spread',
      spreadSingle: 'Single card',
      spreadThree: 'Past / Present / Future',
      timestamp: 'Timestamp',
      singleCardEyebrow: 'The Card',
      contextEyebrow: 'Why It Landed Here',
      meaningEyebrow: 'What The Card Is Saying',
      combinedEyebrow: 'Expanded Reading',
      combinedTitle: 'Move from the first impression into the wider pattern.',
      reflectionEyebrow: 'Reflection Prompt',
      reflectionTitle: 'Sit with one honest question.',
      positionEyebrow: 'Position Meanings',
    },
    about: {
      eyebrow: 'About Arcana Mirror',
      title: 'A tarot space built for calm, symbolic reflection.',
      description:
        'Mystical atmosphere and modern emotional support can coexist. The goal here is to help you think, feel, and see with more honesty.',
      notes: [
        {
          eyebrow: 'Guidance',
          title: 'Use the cards as reflection, not command.',
          body: 'A reading here is meant to help you notice patterns, emotions, and possible next steps. It is not meant to replace judgment, care, or professional support when those are needed.',
        },
        {
          eyebrow: 'Upright / Reversed',
          title: 'Orientation changes the tone, not your worth.',
          body: 'Upright cards often describe energy that is more direct or available. Reversed cards often suggest a blocked current, a quieter inner process, or a theme that needs time and gentleness.',
        },
        {
          eyebrow: 'Ritual',
          title: 'Move slowly enough to hear what resonates.',
          body: 'A question, a pause, and a clear reveal can make the reading feel more intentional. You do not need perfect certainty to begin; you only need an honest question.',
        },
      ],
      privacyEyebrow: 'Privacy',
      privacyTitle: 'Minimal by design.',
      privacyBody:
        'The MVP keeps things simple. Readings can be created without a user account, and the product is designed to store only what is needed to return a reading result. If account features arrive later, this section should expand with clear details about storage and control.',
      disclaimerEyebrow: 'Disclaimer',
      disclaimerTitle: 'Interpretation, not certainty.',
      disclaimerBody:
        'Tarot content here is not medical, legal, financial, or crisis advice. It should not be used as a substitute for professional support. If a reading touches a difficult area, let it be a prompt for reflection, conversation, or grounded action rather than a fixed command.',
    },
    loading: {
      eyebrow: 'Loading',
      title: 'The cards are settling.',
      description: 'Preparing the next view with a little more calm and clarity.',
    },
    notFound: {
      eyebrow: 'Not Found',
      title: 'That path could not be found.',
      description: 'The page or reading you tried to open may no longer be available.',
      action: 'Return home',
    },
    tarotCard: {
      majorArcana: 'Major Arcana',
      minorArcana: 'Minor Arcana',
      suitSuffix: 'Suit',
      cardBack: 'card back',
      arcanaMirror: 'Arcana Mirror',
      holdQuestion: 'Hold the question gently.',
      uprightPerspective: 'Upright perspective',
      reversedPerspective: 'Reversed perspective',
      gathering: 'The card is still gathering itself.',
      altSuffix: 'tarot card',
    },
  },
  zh: {
    metadataDescription:
      'Arcana Mirror 是一款偏向自我观照的塔罗体验，带有仪式感流程、克制的象征氛围，以及温和支持性的解读。',
    header: {
      wordmark: 'Arcana Mirror',
      tagline: '镜中塔罗',
      links: {
        home: '首页',
        single: '单张抽牌',
        three: '三张牌阵',
        cards: '卡牌库',
        about: '关于',
      },
      localeButton: 'EN',
      localeLabel: '切换语言',
    },
    footer: {
      description:
        '一个用于提问、理解象征，并获得情绪支持性解读的塔罗空间。',
      links: {
        about: '关于',
        privacy: '隐私',
        disclaimer: '免责声明',
      },
      note:
        '这里的塔罗内容用于象征性的自我观照，不代表固定命运，也不构成专业建议。',
    },
    home: {
      heroEyebrow: '反思式塔罗',
      heroTitle: '今天，你的内心真正想问什么？',
      heroDescription:
        '抽一张牌，进入缓慢而有仪式感的节奏，接收更偏向象征、平静与情绪支持的解读，而不是宿命或恐惧式判断。',
      startReading: '开始抽牌',
      exploreCards: '浏览卡牌',
      singleEyebrow: '单张牌',
      singleTitle: '为一个清晰问题准备的聚焦之镜。',
      singleDescription:
        '适合快速情绪检查、当下困惑，或需要一个象征方向来安静思考的时候。',
      threeEyebrow: '过去 / 现在 / 未来',
      threeTitle: '用三张牌看见流动与上下文。',
      threeDescription:
        '适合想理解某个模式如何形成、你现在所处位置，以及接下来可能展开什么的时候。',
      chooseEyebrow: '选择仪式',
      chooseTitle: '从与你当下节奏相匹配的牌阵开始。',
      chooseDescription:
        '每条路径都尽量保持有意识、易进入，并为反思留出空间，而不是制造戏剧化预言。',
      fastEyebrow: '轻度观照',
      fastTitle: '单张抽牌',
      fastDescription:
        '提出一个问题，洗牌、抽牌，并收到包含关键词、解读与温和反思提示的简洁阅读。',
      drawOne: '抽一张牌',
      arcEyebrow: '更深的轨迹',
      arcTitle: '三张牌阵',
      arcDescription:
        '沿着过去、现在与未来移动，看清情绪主题、可能的转折，以及这组牌真正邀请你留意什么。',
      drawThree: '抽三张牌',
      dailyEyebrow: '今日观照',
      dailyTitle: '给今天的一张安静之牌。',
      dailyUnavailableEyebrow: '暂不可用',
      dailyUnavailableTitle: '今日卡牌此刻正在安静休息。',
      dailyUnavailableDescription:
        '暂时无法连接卡牌目录，但你仍然可以开始一次抽牌，或稍后再回来浏览牌库。',
      philosophyEyebrow: '这里如何理解塔罗',
      philosophyTitle: '象征性的指引，而不是固定命运。',
      philosophyParagraphs: [
        '在 Arcana Mirror 里，塔罗更像一种自我观照实践。卡牌提供的是象征、情绪语言与视角，它们帮助你看见模式，而不是用绝对说法制造恐惧。',
        '正位通常描述更容易被看见、被使用的能量；逆位更常指向内在过程、被阻塞的流动，或一个需要更温柔关注的课题。',
        '一次有帮助的阅读，并不是告诉你某件事必然发生，而是让你更清楚地看见此刻，并以更有照料感的方式回应它。',
      ],
      readGuidance: '阅读说明',
    },
    drawPages: {
      single: {
        title: '单张抽牌',
        description:
          '为一个聚焦问题准备的清晰仪式。慢一点，等问题真的落下来，再开始洗牌，让一张牌以象征的方式回应你。',
        prompts: [
          '这段关系当下更深的课题是什么？',
          '本周在工作或学习中，什么最值得我留意？',
          '我内在的哪一部分正在请求更温柔的照顾？',
          '关于这个决定，我被邀请去理解什么？',
          '在这个阶段，什么最能支持我的成长？',
        ],
      },
      three: {
        title: '过去，现在，未来',
        description:
          '适合需要流动与上下文的问题。沿着过去、现在与未来去看清，是什么塑造了局面，此刻什么最鲜活，以及接下来可能形成什么。',
        prompts: [
          '这个模式是如何开始的，而现在又在发生什么变化？',
          '我正把过去的什么带进现在？',
          '我怎样才能更清楚地穿过这段情绪转变？',
          '这个处境此刻以及近期在向我提出什么要求？',
          '这个问题在过去、现在与未来之间呈现出怎样的轨迹？',
        ],
      },
    },
    drawFlow: {
      ritualFlow: '仪式流程',
      stepOne: '第一步',
      questionLabel: '问题',
      stepTitle: '问出那个真正需要被看见的问题。',
      stepDescription:
        '让问题足够开放，能容纳反思；也足够具体，能贴近你此刻真实的情绪。',
      supportEyebrow: '仪式导览',
      supportTitle: '这次阅读会这样展开。',
      supportItems: [
        {
          title: '先让问题慢慢成形',
          body: '你不需要一开始就写得完美。只要问题开始变得诚实，仪式就会回应。',
        },
        {
          title: '在缓慢移动里做选择',
          body: '进入仪式室后，沿着牌带慢慢靠近那张不断回到中心、安静却持续抓住你的牌。',
        },
        {
          title: '结果会在同页展开',
          body: '封牌之后，揭示区会直接在下方打开，让整个阅读保持连续而不被打断。',
        },
      ],
      questionPlaceholder: '此刻，我的内心真正想理解什么？',
      beginRitual: '开始仪式',
      exploreCardsFirst: '先看看卡牌含义',
      questionReady: '接下来进入仪式室，慢慢走过三个节拍，再翻开你的牌。',
      questionNotReady: '当问题开始有了轮廓，仪式也会随之开启。',
      errors: {
        questionRequired: '先写下一个更聚焦的问题，或选择下方提示中的一个。',
        readingUnavailable: '这次阅读暂时还无法生成，请稍后再试。',
        deckUnavailable: '这次仪式暂时还无法准备好卡组，请稍后再试。',
      },
      chapters: {
        question: '提问',
        descent: '沉入',
        shuffle: '洗牌',
        seal: '封牌',
        reveal: '揭示',
      },
      gesture: {
        loadingDeck: '正在准备卡组...',
        modalEyebrow: '手势仪式',
        singleTitle: '用手势翻开这一张牌',
        threeTitle: '用双手带动整组牌阵',
        close: '关闭',
        useFallback: '改用触控仪式',
        instructionsEyebrow: '操作说明',
        instructionsMove: '保持单手在画面中，缓慢左右移动，让牌带跟着你的手势转动。',
        instructionsPinch:
          '当指针停在想要的卡牌上方时，捏合拇指与食指，就能把它选出来。',
        instructionsOpen:
          '当卡牌翻开后，再对着已揭示的牌捏合一次，就能进入完整解读。',
        surfaceEyebrow: '手势操作区',
        selectSingleTitle: '让一张牌慢慢停在中心。',
        selectThreeTitle: '依次抽出过去、现在与未来。',
        turningTitle: '卡牌正在向光慢慢转身。',
        revealingTitle: '揭示正在展开。',
        revealReadyTitle: '这张牌已经准备好被读懂。',
        turningHint:
          '再陪这间仪式室待一会儿，让你选中的牌和阅读结果慢慢对齐。',
        revealingHint:
          '卡牌正在按顺序翻开。先让揭示安静落定，再进入更深的解读。',
        readyHint: '现在只要再捏合一次，就能顺着这些牌进入完整阅读。',
        singleHint: '慢慢移动，让一张未揭示的牌停在指针下方，再捏合把它选出来。',
        threeHint:
          '一张一张地抽牌。每次被选中的牌都会先安放到底部，随后整组牌再依次翻开。',
        readyToOpen: '对着已揭示的牌再捏合一次，就能继续进入完整阅读。',
        statusBooting: '正在准备手势仪式室...',
        statusPermission: '请允许摄像头权限，仪式才会开始回应。',
        statusReady: '摄像头已准备好，把手放进画面里。',
        statusSearching: '正在寻找一只稳定的手...',
        statusTracking: '已经识别到手势，开始移动与捏合吧。',
        statusTurning: '正在翻开你选中的牌...',
        statusRevealReady: '这次揭示已经准备好，只差再一次捏合。',
        fallbackReasons: {
          unsupported:
            '当前浏览器或设备暂时不适合摄像头手势控制，所以仪式已经回到底部的触控牌带。',
          'permission-denied':
            '你没有授予摄像头权限，所以仪式已经回到底部的触控牌带。',
          'tracking-lost':
            '手势识别暂时无法保持稳定，所以仪式已经回到底部的触控牌带。',
          manual: '手势仪式室已经关闭，底部的触控牌带已经准备好。',
          'initialization-failed':
            '手势仪式室暂时没能完成准备，所以仪式已经回到底部的触控牌带。',
        },
      },
    },
    ritualStage: {
      spreadSingle: '单张牌仪式',
      spreadThree: '三张牌仪式',
      drawn: '已抽取',
      yourQuestion: '你的问题',
      chamberAwake: '仪式室已经被唤醒。',
      questionPending: '先在上方写下问题，仪式室才会开始回应。',
      questionDescent: '进入仪式室，开始缓慢转动牌带。',
      questionSealSingle: '你选中的牌已经在下方等待，准备好时就翻开它。',
      questionSealThree: '你选中的牌已经在下方等待，准备好时就一起翻开它们。',
      shufflingReel: '洗牌带',
      shufflingDescription:
        '将手指停留在这个区域时，会优先响应牌带操作。你可以滑动、拖拽或轻扫它，然后选中那张慢慢浮到中心的牌。',
      focus: '焦点',
      back: '上一张',
      next: '下一张',
      errorEyebrow: '仪式异常',
      openLibrary: '打开卡牌库',
      sealDraw: '封存这次抽牌',
      sealing: '正在封牌...',
      trayWaiting: '等待中',
      traySelected: '已选中',
      trayDrawn: '已抽取',
      deck: {
        alreadyDrawn: '已被抽取',
        draw: '抽取',
        brand: 'Arcana Mirror',
        choose: '选择',
        veiled: '未揭示',
        resting: '已安放在下方。',
        clickCard: '点击这张牌。',
        stayWithRibbon: '继续和牌带待在一起。',
      },
      positions: {
        single: '被选中的牌',
        past: '过去',
        present: '现在',
        future: '未来',
      },
      stageCopy: {
        descent: {
          eyebrow: '沉入',
          title: '让问题周围的空间慢慢安静下来。',
          body:
            '把手指留在仪式室里，轻轻移动牌带。此时页面会退到后面，只留下牌堆在回应你。',
          cue: '用轻扫、滑动或拖拽来转动牌带。',
        },
        shuffleSingle: {
          eyebrow: '洗牌室',
          title: '转动牌带，直到有一张牌开始准备好。',
          body: '整副牌会持续流动。让中心那张牌慢慢进入焦点，再把它选出来。',
          cue: '当中心卡牌真正抓住你时，就点选它。',
        },
        shuffleThree: {
          eyebrow: '洗牌室',
          title: '转动牌带，按顺序抽出三张牌。',
          bodyPrefix: '依次抽出 ',
          bodyMiddle: ' 张牌。目前已有 ',
          bodySingular: '张牌',
          bodyPlural: '张牌',
          bodySuffix: ' 安放在下方位置里。',
          cue: '继续选择，直到过去、现在与未来都被填满。',
        },
        sealSingle: {
          eyebrow: '封牌',
          title: '你选中的那张牌已经安放好了。',
          body: '当你准备好接收阅读时，就翻开这张牌。',
          cue: '使用下方操作区揭示阅读结果。',
        },
        sealThree: {
          eyebrow: '封牌',
          title: '过去、现在与未来都已经就位。',
          body: '当这组顺序感觉完整时，就一起翻开三张牌。',
          cue: '使用下方操作区揭示阅读结果。',
        },
      },
    },
    reveal: {
      eyebrow: '揭示阶段',
      emptyTitle: '封牌之后，卡牌会在这里安静落定。',
      emptyDescription:
        '当你确认抽牌后，揭示区会顺着页面自然展开，你不需要离开当前页面就能开始阅读。',
      singleTitle: '有一张牌已经向光慢慢转身。',
      threeTitle: '整组牌已经开始显出可以阅读的形状。',
      reflectionPrompt: '反思提示',
      emergingEyebrow: '此刻浮现的线索',
      fullReading: '完整阅读',
      fullReadingDescription:
        '打开专属结果页，把这一次初见继续读深，看到牌面语境、整合解读，以及更完整的阅读层次。',
      openFullReading: '打开完整阅读',
      opening: '打开中...',
    },
    cards: {
      pageTitle: '卡牌库',
      pageErrorEyebrow: '牌库异常',
      pageErrorTitle: '卡牌库暂时不可用。',
      pageErrorDescription:
        '暂时无法从 API 读取牌组。稍后再试，或等连接恢复后再开始抽牌。',
      emptyEyebrow: '空牌库',
      emptyTitle: '还没有准备好的卡牌。',
      emptyDescription: '卡牌目录还在等待初始化。等数据准备好后，牌库就会出现在这里。',
      headingEyebrow: '卡牌库',
      headingTitle: '在抽牌前或抽牌后，安静地认识这些象征。',
      headingDescription:
        '可以按大阿尔卡那或花色浏览整副牌，也可以把这里当作一处安静参考，回到那些反复出现在你心里的卡牌。',
      searchLabel: '搜索卡牌',
      searchPlaceholder: '按卡牌名、花色或关键词搜索',
      noMatchesEyebrow: '没有匹配结果',
      noMatchesTitle: '没有找到符合这个组合的卡牌。',
      noMatchesDescription: '试着放宽搜索条件、切换花色，或回到完整牌组视图。',
      cardErrorEyebrow: '卡牌异常',
      cardErrorTitle: '这张牌暂时无法打开。',
      cardErrorDescription: '目前无法从 API 读取这张牌的详情。',
      majorArcana: '大阿尔卡那',
      suitSuffix: '花色',
      upright: '正位',
      reversed: '逆位',
      emotionalMeaning: '情绪含义',
      relationshipMeaning: '关系含义',
      careerMeaning: '事业含义',
    },
    reading: {
      errorEyebrow: '阅读异常',
      errorTitle: '这次阅读暂时无法打开。',
      errorDescriptionNotFound: '这条阅读可能已失效，或编号不正确。',
      errorDescriptionApi: '暂时无法从 API 读取这条阅读。',
      resultEyebrow: '阅读结果',
      singleTitle: '单张牌的镜面反思',
      threeTitle: '过去，现在，未来牌阵',
      question: '你的问题',
      spread: '牌阵',
      spreadSingle: '单张牌',
      spreadThree: '过去 / 现在 / 未来',
      timestamp: '时间',
      singleCardEyebrow: '这张牌',
      contextEyebrow: '它为何落在这里',
      meaningEyebrow: '这张牌正在说什么',
      combinedEyebrow: '展开阅读',
      combinedTitle: '把这次抽牌慢慢读深。',
      reflectionEyebrow: '反思提示',
      reflectionTitle: '和一个诚实的问题坐一会儿。',
      positionEyebrow: '位置含义',
    },
    about: {
      eyebrow: '关于 Arcana Mirror',
      title: '一个为平静、象征性反思而设计的塔罗空间。',
      description:
        '神秘感的氛围与现代情绪支持并不冲突。这里想做的，是帮助你更诚实地思考、感受与看见。',
      notes: [
        {
          eyebrow: '指引',
          title: '把卡牌当作反思，而不是命令。',
          body: '这里的阅读，是为了帮助你看见模式、情绪与可能的下一步，而不是替代你的判断、照料能力，或在需要时的专业支持。',
        },
        {
          eyebrow: '正位 / 逆位',
          title: '方向会改变语气，但不会定义你的价值。',
          body: '正位更常描述直接、可被使用的能量；逆位则常提示被阻塞的流动、较安静的内在过程，或一个需要更多时间与温柔的主题。',
        },
        {
          eyebrow: '仪式',
          title: '慢到足以听见真正与你共振的东西。',
          body: '一个问题、一个停顿、一次清晰的揭示，会让阅读更有意图感。你不需要在开始前就百分之百确定，只需要一个诚实的问题。',
        },
      ],
      privacyEyebrow: '隐私',
      privacyTitle: '以最少为原则。',
      privacyBody:
        'MVP 阶段尽量保持简单。你无需创建账号也可以生成阅读，产品只保存返回阅读结果所需的最基本信息。如果以后加入账号功能，这里应补充更明确的存储与控制说明。',
      disclaimerEyebrow: '免责声明',
      disclaimerTitle: '重在理解，而不是确定性。',
      disclaimerBody:
        '这里的塔罗内容不构成医疗、法律、财务或危机干预建议，也不能替代专业支持。如果某次阅读触及困难议题，更适合把它当成一个引向反思、对话与脚踏实地行动的提示，而不是固定命令。',
    },
    loading: {
      eyebrow: '加载中',
      title: '卡牌正在慢慢落定。',
      description: '正在为下一页准备一点更多的平静与清晰。',
    },
    notFound: {
      eyebrow: '未找到',
      title: '这条路径暂时无法被找到。',
      description: '你尝试打开的页面或阅读结果，可能已经不存在了。',
      action: '返回首页',
    },
    tarotCard: {
      majorArcana: '大阿尔卡那',
      minorArcana: '小阿尔卡那',
      suitSuffix: '花色',
      cardBack: '牌背',
      arcanaMirror: 'Arcana Mirror',
      holdQuestion: '轻轻托住你的问题。',
      uprightPerspective: '正位视角',
      reversedPerspective: '逆位视角',
      gathering: '这张牌还在聚拢它的形状。',
      altSuffix: '塔罗牌',
    },
  },
} as const;

export function getMessages(locale: AppLocale) {
  return messages[locale];
}
