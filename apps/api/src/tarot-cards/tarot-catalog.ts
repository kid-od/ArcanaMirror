import { AppLocale } from '../common/locale';
import {
  getMajorArcanaLocaleEntry,
  getRankLocaleEntry,
  getSuitLocaleEntry,
} from './tarot-localization';

type SuitKey = 'cups' | 'swords' | 'wands' | 'pentacles';

type MajorArcanaSeed = {
  name: string;
  number: number;
  keywords: string[];
  essence: string;
  shadow: string;
  emotional: string;
  relationship: string;
  career: string;
  description: string;
};

type SuitSeed = {
  key: SuitKey;
  label: string;
  arc: string;
  tone: string;
  emotionalLens: string;
  relationshipLens: string;
  careerLens: string;
  accent: string;
};

type RankSeed = {
  label: string;
  number: number;
  keywords: string[];
  upright: string;
  reversed: string;
  prompt: string;
};

export type TarotCatalogCard = {
  slug: string;
  name: string;
  arcana: 'major' | 'minor';
  suit: SuitKey | null;
  number: number | null;
  imageUrl: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  emotionalMeaning: string;
  relationshipMeaning: string;
  careerMeaning: string;
  description: string;
};

const majorPalette = [
  '#c8a95e',
  '#8f78d6',
  '#6aa6d1',
  '#cf8f6e',
  '#88b89d',
  '#d4c38a',
  '#7b90d8',
  '#c287a9',
];

const majorArcanaSeeds: MajorArcanaSeed[] = [
  {
    name: 'The Fool',
    number: 0,
    keywords: ['beginnings', 'trust', 'openness'],
    essence:
      'an invitation to begin before every answer is visible, trusting that curiosity can become a form of guidance.',
    shadow: 'leaping ahead so quickly that your deeper needs are left behind.',
    emotional: 'You may be rediscovering wonder after a period of caution.',
    relationship:
      'A connection can soften when you meet it with honesty instead of over-planning.',
    career:
      'A new path looks promising when you stay teachable and do not rush the first step.',
    description:
      'The Fool speaks to fresh motion, vulnerable courage, and the quiet wisdom of beginning again.',
  },
  {
    name: 'The Magician',
    number: 1,
    keywords: ['focus', 'agency', 'expression'],
    essence:
      'the tools are already near you, and progress grows when intention becomes action.',
    shadow:
      'trying to control every variable instead of working with what is alive right now.',
    emotional:
      'Your feelings want a clearer outlet instead of staying abstract.',
    relationship:
      'Communication becomes healing when your words match your inner truth.',
    career:
      'Your skill set is ready to be shaped into a more confident offer or direction.',
    description:
      'The Magician centers resourcefulness, embodied confidence, and the power of deliberate choice.',
  },
  {
    name: 'The High Priestess',
    number: 2,
    keywords: ['intuition', 'stillness', 'depth'],
    essence:
      'clarity arrives through listening beneath the surface rather than forcing a quick conclusion.',
    shadow: 'withholding your inner knowing because it feels hard to explain.',
    emotional: 'A quieter truth is asking for your patience.',
    relationship:
      'Space, sensitivity, and careful listening can reveal what words alone have missed.',
    career:
      'Strategic pause and observation may be wiser than immediate action.',
    description:
      'The High Priestess honors intuition, symbolism, and the intelligence of waiting well.',
  },
  {
    name: 'The Empress',
    number: 3,
    keywords: ['nourishment', 'creativity', 'abundance'],
    essence:
      'growth becomes easier when you tend to what is life-giving with steadiness and care.',
    shadow: 'over-giving until support turns into depletion.',
    emotional:
      'Softness can be strength when it includes care for yourself too.',
    relationship:
      'Affection deepens when warmth is paired with healthy boundaries.',
    career:
      'Creative work flourishes when it is resourced and given room to mature.',
    description:
      'The Empress is about fertility of ideas, embodied comfort, and compassionate generosity.',
  },
  {
    name: 'The Emperor',
    number: 4,
    keywords: ['structure', 'stability', 'leadership'],
    essence:
      'supportive order can hold what matters so it does not collapse under pressure.',
    shadow:
      'mistaking rigidity for strength and leaving no room for tenderness.',
    emotional:
      'You may need steadier internal boundaries to feel safe in your truth.',
    relationship:
      'Consistency and accountability can be more reassuring than grand gestures.',
    career:
      'Clear plans, role clarity, and grounded leadership support sustainable progress.',
    description:
      'The Emperor represents wise structure, responsibility, and grounded authority.',
  },
  {
    name: 'The Hierophant',
    number: 5,
    keywords: ['wisdom', 'ritual', 'guidance'],
    essence:
      'meaning can grow through trusted practices, teachers, and values that steady you.',
    shadow: 'following inherited scripts that no longer fit your real life.',
    emotional: 'A grounding ritual may help you hear yourself more clearly.',
    relationship:
      'Shared values matter, but so does checking whether the old rules still serve you both.',
    career:
      'Mentorship, training, or a proven framework can help you move with more confidence.',
    description:
      'The Hierophant explores tradition, belonging, and the search for trustworthy guidance.',
  },
  {
    name: 'The Lovers',
    number: 6,
    keywords: ['alignment', 'choice', 'connection'],
    essence:
      'you are being asked to choose what is truly aligned, not merely what is immediately appealing.',
    shadow:
      'splitting your energy between conflicting desires and avoiding the deeper decision.',
    emotional: 'Integrity matters as much as emotion right now.',
    relationship:
      'Closeness grows when choice, honesty, and mutual recognition move together.',
    career:
      'The next step may depend on whether your work still reflects your real values.',
    description:
      'The Lovers points to meaningful choice, relational truth, and heart-led alignment.',
  },
  {
    name: 'The Chariot',
    number: 7,
    keywords: ['direction', 'willpower', 'momentum'],
    essence:
      'forward motion strengthens when scattered forces are brought into a shared direction.',
    shadow: 'driving so hard toward a goal that your inner life falls behind.',
    emotional:
      'Resolve can help, but it works best when it includes emotional honesty.',
    relationship:
      'Progress depends on whether both people are willing to move in the same direction.',
    career:
      'Focused commitment can break a stalled pattern and create visible traction.',
    description:
      'The Chariot speaks to disciplined movement, integrated effort, and determined progress.',
  },
  {
    name: 'Strength',
    number: 8,
    keywords: ['courage', 'gentleness', 'self-trust'],
    essence:
      'real strength appears when force softens into calm, steady presence.',
    shadow:
      'thinking you must overpower vulnerability instead of befriending it.',
    emotional:
      'Meeting your feelings with compassion may be more powerful than suppressing them.',
    relationship:
      'Patience and emotional steadiness can transform conflict into understanding.',
    career: 'Leadership may ask for emotional maturity as much as confidence.',
    description:
      'Strength reflects inner resilience, soft authority, and brave tenderness.',
  },
  {
    name: 'The Hermit',
    number: 9,
    keywords: ['solitude', 'insight', 'discernment'],
    essence:
      'stepping back can help you hear the truth that noise has been covering.',
    shadow: 'withdrawing so far that reflection turns into isolation.',
    emotional: 'Some answers need quiet before they can become language.',
    relationship:
      'Distance may be useful if it creates insight rather than avoidance.',
    career:
      'A period of independent study or review can clarify your next move.',
    description:
      'The Hermit invites thoughtful retreat, inner guidance, and meaningful perspective.',
  },
  {
    name: 'Wheel of Fortune',
    number: 10,
    keywords: ['change', 'timing', 'cycles'],
    essence:
      'life is turning, and your task is to respond with presence rather than panic.',
    shadow: 'trying to freeze a moment that was always meant to move.',
    emotional:
      'A changing emotional season can bring relief as well as uncertainty.',
    relationship:
      'Patterns are shifting, and flexibility may matter more than control.',
    career: 'Timing, opportunity, and adaptation are especially important now.',
    description:
      'Wheel of Fortune reminds you that change is natural and that timing carries wisdom.',
  },
  {
    name: 'Justice',
    number: 11,
    keywords: ['truth', 'balance', 'accountability'],
    essence:
      'clarity asks for honesty, proportion, and the willingness to see cause and effect.',
    shadow: 'using certainty as armor while ignoring the full picture.',
    emotional: 'Naming the truth clearly may restore internal balance.',
    relationship:
      'Repair depends on fairness, responsibility, and what is actually happening.',
    career:
      'Decisions benefit from clean boundaries, transparent logic, and ethical steadiness.',
    description:
      'Justice reflects integrity, balanced judgment, and the healing force of truth.',
  },
  {
    name: 'The Hanged Man',
    number: 12,
    keywords: ['pause', 'surrender', 'new perspective'],
    essence:
      'a pause may not be punishment; it may be the exact angle needed for insight.',
    shadow: 'clinging to control so tightly that nothing new can be seen.',
    emotional: 'Reframing the situation may soften a feeling of being stuck.',
    relationship:
      'Seeing the connection from the other side can change the whole tone.',
    career:
      'A delay may be useful if it helps you question an outdated strategy.',
    description:
      'The Hanged Man centers surrender, reframing, and the wisdom hidden inside stillness.',
  },
  {
    name: 'Death',
    number: 13,
    keywords: ['release', 'transition', 'renewal'],
    essence:
      'something is ending so that life can reorganize around what is more truthful now.',
    shadow: 'holding onto a chapter that has already completed its work.',
    emotional: 'Grief and relief may be arriving together as a cycle closes.',
    relationship:
      'A relationship pattern may need to end before something healthier can begin.',
    career:
      'A role, strategy, or identity is changing, making room for a more honest next phase.',
    description:
      'Death is not doom; it is transformation, release, and the courage to let life move.',
  },
  {
    name: 'Temperance',
    number: 14,
    keywords: ['balance', 'integration', 'healing'],
    essence:
      'what feels divided can become workable through patience, pacing, and careful blending.',
    shadow: 'trying to rush a healing process that needs gentler timing.',
    emotional: 'Your system may be asking for moderation and steadiness.',
    relationship:
      'Mutual adjustment and compassion can create a calmer middle ground.',
    career:
      'Sustainable progress comes from good pacing, not constant urgency.',
    description:
      'Temperance speaks to harmony, restoration, and the art of balanced effort.',
  },
  {
    name: 'The Devil',
    number: 15,
    keywords: ['attachment', 'shadow', 'liberation'],
    essence:
      'awareness is revealing where fear, shame, or habit has had more power than it deserves.',
    shadow: 'mistaking a familiar pattern for an unchangeable truth.',
    emotional:
      'Compassionate honesty can loosen what has felt gripping or compulsive.',
    relationship:
      'Naming unhealthy dynamics is the first step toward more freedom and care.',
    career:
      'Exhausting work patterns may need clearer boundaries or a different agreement.',
    description:
      'The Devil invites clear-eyed awareness of binding patterns so that choice can return.',
  },
  {
    name: 'The Tower',
    number: 16,
    keywords: ['disruption', 'truth', 'breakthrough'],
    essence:
      'a structure is cracking because it can no longer hold what is real.',
    shadow:
      'fearing change so much that necessary truth feels like chaos alone.',
    emotional:
      'A sudden realization can be unsettling and freeing at the same time.',
    relationship:
      'Honest disruption may clear space for a more genuine connection.',
    career:
      'A shaken plan may ultimately reveal where stronger foundations are needed.',
    description:
      'The Tower marks revelation, structural change, and the clearing power of truth.',
  },
  {
    name: 'The Star',
    number: 17,
    keywords: ['hope', 'renewal', 'guidance'],
    essence:
      'hope is returning in a quieter, more trustworthy form after strain.',
    shadow:
      'waiting for certainty before allowing yourself to believe in healing.',
    emotional: 'There is room to soften and trust the next small step.',
    relationship: 'Gentleness and sincerity can rebuild faith in a connection.',
    career: 'Long-term vision matters more than immediate perfection.',
    description:
      'The Star offers reassurance, healing perspective, and a steadier sense of possibility.',
  },
  {
    name: 'The Moon',
    number: 18,
    keywords: ['mystery', 'feeling', 'subconscious'],
    essence:
      'not everything is clear yet, and feeling your way forward may be wiser than forcing proof.',
    shadow: 'letting uncertainty amplify fear instead of curiosity.',
    emotional:
      'Your intuition is active, but it may need grounding as well as trust.',
    relationship:
      'Mixed signals invite gentle clarification rather than harsh conclusions.',
    career:
      'An unclear phase may require observation, patience, and careful discernment.',
    description:
      'The Moon explores ambiguity, inner imagery, and the wisdom of feeling through the dark.',
  },
  {
    name: 'The Sun',
    number: 19,
    keywords: ['clarity', 'joy', 'vitality'],
    essence:
      'what has been hidden is becoming simpler, warmer, and easier to trust.',
    shadow: 'staying armored when the moment is asking for openness.',
    emotional:
      'A brighter emotional tone is possible when you let yourself be fully seen.',
    relationship:
      'Warmth, candor, and presence can restore ease to the connection.',
    career:
      'Visibility and confidence support momentum when paired with humility.',
    description:
      'The Sun represents clear seeing, wholehearted energy, and grounded optimism.',
  },
  {
    name: 'Judgement',
    number: 20,
    keywords: ['awakening', 'truth', 'renewed calling'],
    essence:
      'you may be hearing a clearer call toward the life that fits your present self.',
    shadow:
      'judging the past so harshly that you cannot receive what it taught you.',
    emotional:
      'Self-forgiveness can help a new chapter begin with more honesty.',
    relationship:
      'A connection may be asking whether it can evolve into something more conscious.',
    career: 'A vocational shift or renewed purpose may be coming into focus.',
    description:
      'Judgement is about awakening, reflection, and answering a more honest call.',
  },
  {
    name: 'The World',
    number: 21,
    keywords: ['completion', 'integration', 'wholeness'],
    essence:
      'a cycle is coming together, offering perspective on how far you have already traveled.',
    shadow:
      'rushing past completion and missing the meaning of what has been integrated.',
    emotional:
      'There can be calm pride in recognizing the fullness of your growth.',
    relationship:
      'A relationship may be reaching a more mature and integrated chapter.',
    career:
      'A long effort may be resolving into mastery, closure, or a wider horizon.',
    description:
      'The World marks completion, synthesis, and the deep steadiness that follows integration.',
  },
];

const suitSeeds: SuitSeed[] = [
  {
    key: 'cups',
    label: 'Cups',
    arc: 'emotion, intuition, tenderness, and connection',
    tone: 'softening into what you genuinely feel',
    emotionalLens:
      'Your inner landscape is asking to be felt without rushing it.',
    relationshipLens:
      'Relational clarity comes through empathy, sincerity, and emotional presence.',
    careerLens:
      'Meaningful work may depend on values, care, and emotional intelligence.',
    accent: '#8aa6f0',
  },
  {
    key: 'swords',
    label: 'Swords',
    arc: 'clarity, tension, truth, and discernment',
    tone: 'naming what is real even when it is uncomfortable',
    emotionalLens:
      'Thoughts may be moving quickly; grounding can help truth feel less sharp.',
    relationshipLens:
      'Honest conversations matter, but tone and timing matter too.',
    careerLens:
      'Decisions improve when they are based on clear thinking instead of pressure.',
    accent: '#9bc3d4',
  },
  {
    key: 'wands',
    label: 'Wands',
    arc: 'drive, desire, creativity, and momentum',
    tone: 'following what feels alive enough to move',
    emotionalLens:
      'Vitality returns when you stay close to what genuinely inspires you.',
    relationshipLens:
      'Chemistry is strong, but it becomes sustainable through direction and care.',
    careerLens:
      'Initiative, courage, and creative risk can open the next chapter.',
    accent: '#d49c62',
  },
  {
    key: 'pentacles',
    label: 'Pentacles',
    arc: 'body, work, resources, and grounded stability',
    tone: 'building what can support you in ordinary life',
    emotionalLens:
      'Steadiness may be found through embodiment, rest, and practical care.',
    relationshipLens:
      'Reliability and everyday gestures create trust over time.',
    careerLens:
      'Sustainable progress is built through skill, patience, and tangible effort.',
    accent: '#93b178',
  },
];

const rankSeeds: RankSeed[] = [
  {
    label: 'Ace',
    number: 1,
    keywords: ['opening', 'seed', 'offer'],
    upright: 'a first opening is appearing and deserves gentle attention.',
    reversed:
      'the opening is present, but hesitation or doubt may be dimming it.',
    prompt: 'What beginning wants a little more trust?',
  },
  {
    label: 'Two',
    number: 2,
    keywords: ['balance', 'choice', 'exchange'],
    upright: 'a meaningful choice or exchange is shaping the next chapter.',
    reversed:
      'the balancing act may be harder to maintain than it first appears.',
    prompt: 'What are you trying to hold together at once?',
  },
  {
    label: 'Three',
    number: 3,
    keywords: ['growth', 'expansion', 'collaboration'],
    upright:
      'something begins to grow through connection, feedback, or shared energy.',
    reversed: 'growth is possible, though misalignment may be slowing it down.',
    prompt: 'What would help this grow in a healthier way?',
  },
  {
    label: 'Four',
    number: 4,
    keywords: ['stability', 'pause', 'protection'],
    upright: 'stability is available when you honor what truly restores you.',
    reversed: 'holding too tightly can make rest or stability harder to feel.',
    prompt: 'Where do you need steadiness rather than urgency?',
  },
  {
    label: 'Five',
    number: 5,
    keywords: ['tension', 'change', 'friction'],
    upright: 'friction is revealing what needs adjustment or honest attention.',
    reversed:
      'the conflict may be turning inward or lingering beneath the surface.',
    prompt: 'What tension is asking to be addressed with care?',
  },
  {
    label: 'Six',
    number: 6,
    keywords: ['movement', 'support', 'rebalancing'],
    upright: 'the situation is shifting toward a more workable rhythm.',
    reversed:
      'movement is possible, though the transition may feel incomplete.',
    prompt: 'What would make this transition feel steadier?',
  },
  {
    label: 'Seven',
    number: 7,
    keywords: ['discernment', 'testing', 'inner strategy'],
    upright:
      'discernment matters because not every option deserves equal energy.',
    reversed:
      'confusion may ease once you stop scattering attention in many directions.',
    prompt: 'What deserves your energy, and what does not?',
  },
  {
    label: 'Eight',
    number: 8,
    keywords: ['momentum', 'skill', 'movement'],
    upright: 'momentum builds when effort becomes more focused and practiced.',
    reversed:
      'progress may be uneven because your pace or direction needs adjusting.',
    prompt: 'What kind of rhythm would support cleaner progress?',
  },
  {
    label: 'Nine',
    number: 9,
    keywords: ['threshold', 'resilience', 'integration'],
    upright:
      'you are near a threshold that asks for resilience and perspective.',
    reversed:
      'fatigue or doubt may be making the threshold feel heavier than it is.',
    prompt: 'What support would help you stay present at this threshold?',
  },
  {
    label: 'Ten',
    number: 10,
    keywords: ['culmination', 'weight', 'completion'],
    upright:
      'a cycle is reaching fullness, revealing both its rewards and its weight.',
    reversed:
      'completion is near, though part of the load may need to be released first.',
    prompt: 'What are you ready to complete or set down?',
  },
  {
    label: 'Page',
    number: 11,
    keywords: ['curiosity', 'learning', 'message'],
    upright:
      'fresh insight arrives through curiosity and a willingness to learn.',
    reversed:
      'the message is present, but immaturity or distraction may blur it.',
    prompt: 'What would it look like to stay teachable here?',
  },
  {
    label: 'Knight',
    number: 12,
    keywords: ['pursuit', 'drive', 'direction'],
    upright:
      'strong motion is available when purpose and pacing stay connected.',
    reversed:
      'drive may be strong, but its direction or timing could need refinement.',
    prompt: 'What kind of movement would feel both brave and grounded?',
  },
  {
    label: 'Queen',
    number: 13,
    keywords: ['maturity', 'care', 'embodied wisdom'],
    upright:
      'mature presence and inner steadiness can shape this situation well.',
    reversed:
      'care is needed, especially if emotional or practical reserves feel thin.',
    prompt: 'How can you lead this moment with steadiness and care?',
  },
  {
    label: 'King',
    number: 14,
    keywords: ['authority', 'mastery', 'stewardship'],
    upright:
      'leadership grows stronger when it is grounded in clarity and responsibility.',
    reversed:
      'control may be overshadowing stewardship, calling for a wiser center.',
    prompt: 'What would responsible leadership look like here?',
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildMotif(kind: string, accent: string) {
  switch (kind) {
    case 'cups':
      return `
        <path d="M96 120c14 0 26-12 26-26V74H70v20c0 14 12 26 26 26Z" fill="none" stroke="${accent}" stroke-width="5"/>
        <path d="M89 120v18h14v-18" stroke="${accent}" stroke-width="5"/>
        <path d="M78 138h36" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      `;
    case 'swords':
      return `
        <path d="M96 58v86" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M76 82h40" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M96 46l16 16H80l16-16Z" fill="none" stroke="${accent}" stroke-width="5"/>
      `;
    case 'wands':
      return `
        <path d="M74 128c10-30 26-55 48-74" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
        <circle cx="122" cy="54" r="8" fill="none" stroke="${accent}" stroke-width="4"/>
        <circle cx="114" cy="70" r="5" fill="none" stroke="${accent}" stroke-width="4"/>
      `;
    case 'pentacles':
      return `
        <polygon points="96,52 106,82 138,82 112,100 122,132 96,112 70,132 80,100 54,82 86,82" fill="none" stroke="${accent}" stroke-width="5"/>
        <circle cx="96" cy="92" r="36" fill="none" stroke="${accent}" stroke-opacity="0.45" stroke-width="3"/>
      `;
    default:
      return `
        <circle cx="96" cy="86" r="32" fill="none" stroke="${accent}" stroke-width="5"/>
        <path d="M96 48v76" stroke="${accent}" stroke-opacity="0.85" stroke-width="4"/>
        <path d="M66 104l30-56 30 56" fill="none" stroke="${accent}" stroke-opacity="0.6" stroke-width="4"/>
      `;
  }
}

function buildImageUrl(
  name: string,
  accent: string,
  subtitle: string,
  motifKind: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="384" height="640" viewBox="0 0 192 320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f1325" />
          <stop offset="100%" stop-color="#1b2035" />
        </linearGradient>
      </defs>
      <rect width="192" height="320" rx="18" fill="url(#bg)"/>
      <rect x="10" y="10" width="172" height="300" rx="14" fill="none" stroke="${accent}" stroke-opacity="0.65" stroke-width="2"/>
      <circle cx="96" cy="160" r="82" fill="${accent}" fill-opacity="0.08"/>
      ${buildMotif(motifKind, accent)}
      <text x="96" y="224" font-family="Georgia, serif" font-size="16" text-anchor="middle" fill="#f5efdc">${name}</text>
      <text x="96" y="250" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" letter-spacing="2" fill="${accent}">${subtitle}</text>
      <circle cx="38" cy="42" r="2" fill="#f2dcc0" fill-opacity="0.8"/>
      <circle cx="146" cy="58" r="2" fill="#f2dcc0" fill-opacity="0.6"/>
      <circle cx="132" cy="270" r="1.5" fill="#f2dcc0" fill-opacity="0.7"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildMajorArcanaCards(locale: AppLocale): TarotCatalogCard[] {
  return majorArcanaSeeds.map((seed, index) => {
    const accent = majorPalette[index % majorPalette.length];
    const localized = getMajorArcanaLocaleEntry(seed.name, locale);
    const name = localized?.name ?? seed.name;
    const keywords = localized?.keywords ?? seed.keywords;
    const description = localized?.description ?? seed.description;
    const uprightMeaning = localized
      ? `${name}提示：${localized.essence}`
      : `${seed.name} suggests ${seed.essence}`;
    const reversedMeaning = localized
      ? `逆位的${name}可能指向：${localized.shadow}`
      : `Reversed, ${seed.name} can point to ${seed.shadow}`;
    const emotionalMeaning = localized?.emotional ?? seed.emotional;
    const relationshipMeaning = localized?.relationship ?? seed.relationship;
    const careerMeaning = localized?.career ?? seed.career;
    const subtitle = locale === 'zh' ? '大阿尔卡那' : 'MAJOR ARCANA';

    return {
      slug: slugify(seed.name),
      name,
      arcana: 'major',
      suit: null,
      number: seed.number,
      imageUrl: buildImageUrl(name, accent, subtitle, 'major'),
      keywords,
      uprightMeaning,
      reversedMeaning,
      emotionalMeaning,
      relationshipMeaning,
      careerMeaning,
      description,
    };
  });
}

function buildMinorArcanaCards(locale: AppLocale): TarotCatalogCard[] {
  return suitSeeds.flatMap((suit) =>
    rankSeeds.map((rank) => {
      const localizedSuit = getSuitLocaleEntry(suit.key, locale);
      const localizedRank = getRankLocaleEntry(rank.label, locale);
      const name =
        localizedSuit && localizedRank
          ? `${localizedSuit.label}${localizedRank.label}`
          : `${rank.label} of ${suit.label}`;
      const suitKeywords = localizedSuit
        ? [...localizedRank!.keywords, localizedSuit.label, localizedSuit.tone]
        : [...rank.keywords, suit.key, suit.tone];
      const uprightMeaning =
        localizedSuit && localizedRank
          ? `${name}提示：${localizedRank.upright} 在这一花色里，课题与${localizedSuit.arc}有关。`
          : `${name} suggests ${rank.upright} In this suit, the lesson is about ${suit.arc}.`;
      const reversedMeaning =
        localizedSuit && localizedRank
          ? `逆位的${name}可能指向：${localizedRank.reversed} 更深的课题也许与${localizedSuit.tone}有关。`
          : `Reversed, ${name} can point to ${rank.reversed} The deeper lesson may be about ${suit.tone}.`;
      const emotionalMeaning =
        localizedSuit && localizedRank
          ? `${localizedSuit.emotionalLens}${name}提醒你思考：${localizedRank.prompt}`
          : `${suit.emotionalLens} ${name} points to ${rank.prompt.toLowerCase()}`;
      const relationshipMeaning =
        localizedSuit && localizedRank
          ? `${localizedSuit.relationshipLens}${name}邀请你留意，这段动态如何被${localizedSuit.arc}所塑造。`
          : `${suit.relationshipLens} ${name} asks you to notice how this dynamic is shaped by ${suit.arc}.`;
      const careerMeaning =
        localizedSuit && localizedRank
          ? `${localizedSuit.careerLens}${name}暗示：${localizedRank.upright}`
          : `${suit.careerLens} ${name} suggests ${rank.upright}`;
      const description =
        localizedSuit && localizedRank
          ? `${name}探索的是${localizedSuit.arc}，尤其透过${localizedRank.keywords[0]}与${localizedRank.keywords[1]}这两个角度。`
          : `${name} explores ${suit.arc}, especially through the lens of ${rank.keywords[0]} and ${rank.keywords[1]}.`;
      const subtitle =
        localizedSuit?.subtitle ?? `${suit.label.toUpperCase()} SUIT`;

      return {
        slug: slugify(`${rank.label} of ${suit.label}`),
        name,
        arcana: 'minor',
        suit: suit.key,
        number: rank.number,
        imageUrl: buildImageUrl(name, suit.accent, subtitle, suit.key),
        keywords: suitKeywords,
        uprightMeaning,
        reversedMeaning,
        emotionalMeaning,
        relationshipMeaning,
        careerMeaning,
        description,
      };
    }),
  );
}

export function getTarotCardCatalog(
  locale: AppLocale = 'en',
): TarotCatalogCard[] {
  return [...buildMajorArcanaCards(locale), ...buildMinorArcanaCards(locale)];
}

export const TAROT_CARD_CATALOG: TarotCatalogCard[] = getTarotCardCatalog('en');
