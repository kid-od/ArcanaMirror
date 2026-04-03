import Image from 'next/image';
import { getMessages } from '@/src/i18n/messages';
import { AppLocale } from '@/src/i18n/shared';

type TarotCardVisualMode = 'reveal' | 'back';

type TarotCardVisualProps = {
  locale?: AppLocale;
  name: string;
  imageUrl?: string;
  arcana?: string;
  suit?: string | null;
  orientation?: 'upright' | 'reversed';
  className?: string;
  mode?: TarotCardVisualMode;
  label?: string;
  caption?: string;
  details?: 'full' | 'compact';
};

function getLocalizedSuitLabel(locale: AppLocale, suit?: string | null) {
  if (!suit) {
    return null;
  }

  const suitLabels: Record<AppLocale, Record<string, string>> = {
    en: {
      cups: 'Cups',
      swords: 'Swords',
      wands: 'Wands',
      pentacles: 'Pentacles',
    },
    zh: {
      cups: '圣杯',
      swords: '宝剑',
      wands: '权杖',
      pentacles: '星币',
    },
  };

  return suitLabels[locale][suit] ?? suit;
}

function getCardMetaLabel(locale: AppLocale, arcana?: string, suit?: string | null) {
  const messages = getMessages(locale);

  if (arcana === 'major') {
    return messages.tarotCard.majorArcana;
  }

  const suitLabel = getLocalizedSuitLabel(locale, suit);

  return suitLabel
    ? `${suitLabel} ${messages.tarotCard.suitSuffix}`
    : messages.tarotCard.minorArcana;
}

function BackFace({
  name,
  label,
  caption,
  compact,
}: {
  name: string;
  label?: string;
  caption?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[3/5] overflow-hidden ${
        compact ? 'rounded-[1.2rem]' : 'rounded-[1.45rem]'
      } border border-[var(--color-accent)]/18 bg-[linear-gradient(180deg,_rgba(12,18,36,0.96),_rgba(27,34,57,0.96))]`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(143,120,214,0.22),_transparent_44%),radial-gradient(circle_at_bottom,_rgba(200,169,94,0.18),_transparent_52%)]" />
      <div
        className={`absolute ${
          compact ? 'inset-[0.65rem] rounded-[0.95rem]' : 'inset-[0.8rem] rounded-[1.15rem]'
        } border border-dashed border-[var(--color-accent)]/22`}
      />
      <div className={`absolute inset-x-0 ${compact ? 'top-[18%]' : 'top-[17%]'} flex justify-center`}>
        <div
          className={`rounded-full border border-[var(--color-accent)]/22 bg-[radial-gradient(circle,_rgba(200,169,94,0.2),_transparent_72%)] ${
            compact ? 'h-20 w-20' : 'h-24 w-24'
          }`}
        />
      </div>
      <div className={`absolute inset-x-0 ${compact ? 'top-[30%]' : 'top-[29%]'} flex justify-center`}>
        <div className={`${compact ? 'h-36 w-36' : 'h-44 w-44'} rounded-full border border-white/6`} />
      </div>
      <div
        className={`absolute inset-x-0 ${compact ? 'bottom-7 px-3' : 'bottom-10 px-4'} flex flex-col items-center text-center`}
      >
        <p
          className={`uppercase text-[var(--color-accent-soft)] ${
            compact ? 'text-[9px] tracking-[0.34em]' : 'text-[10px] tracking-[0.42em]'
          }`}
        >
          {label ?? 'Arcana Mirror'}
        </p>
        <p
          className={`mt-4 font-display text-[var(--color-foreground)] ${
            compact ? 'text-[1.7rem] leading-tight' : 'text-3xl'
          }`}
        >
          {name}
        </p>
        <p
          className={`mt-2 text-[var(--color-muted)] ${
            compact ? 'text-[11px] leading-5' : 'text-xs leading-6'
          }`}
        >
          {caption ?? 'Hold the question gently.'}
        </p>
      </div>
    </div>
  );
}

export function TarotCardVisual({
  locale = 'en',
  name,
  imageUrl,
  arcana = 'major',
  suit,
  orientation = 'upright',
  className = '',
  mode = 'reveal',
  label,
  caption,
  details = 'full',
}: TarotCardVisualProps) {
  const messages = getMessages(locale);
  const revealMode = mode === 'reveal';
  const compactMode = details === 'compact';
  const orientationLabel =
    orientation === 'upright'
      ? locale === 'zh'
        ? '正位'
        : 'upright'
      : locale === 'zh'
        ? '逆位'
        : 'reversed';

  return (
    <figure
      className={`group relative overflow-hidden rounded-[1.8rem] border border-white/12 bg-[var(--color-panel)] ${
        compactMode ? 'p-2.5' : 'p-3'
      } shadow-[0_20px_60px_rgba(0,0,0,0.28)] ${className}`}
    >
      <div
        className={`absolute z-10 flex items-center justify-between gap-3 rounded-full border border-white/8 bg-[rgba(8,12,24,0.78)] uppercase text-[var(--color-accent-soft)] backdrop-blur-md ${
          compactMode
            ? 'inset-x-4 top-3 px-3 py-1.5 text-[9px] tracking-[0.24em]'
            : 'inset-x-5 top-4 px-4 py-2 text-[10px] tracking-[0.3em]'
        }`}
      >
        <span className="min-w-0 truncate pr-2">
          {label ?? getCardMetaLabel(locale, arcana, suit)}
        </span>
        <span className="shrink-0">
          {revealMode ? orientationLabel : messages.tarotCard.cardBack}
        </span>
      </div>

      {revealMode && imageUrl ? (
        <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0b1021]">
          <Image
            src={imageUrl}
            alt={`${name} ${messages.tarotCard.altSuffix}`}
            width={384}
            height={640}
            unoptimized
            className={`aspect-[3/5] h-auto w-full object-cover transition-transform duration-700 ${
              orientation === 'reversed'
                ? 'rotate-180'
                : 'group-hover:scale-[1.02]'
            }`}
          />
        </div>
      ) : (
        <BackFace
          name={name}
          label={label ?? messages.tarotCard.arcanaMirror}
          caption={caption ?? messages.tarotCard.holdQuestion}
          compact={compactMode}
        />
      )}

      {compactMode ? null : (
        <figcaption className="px-2 pb-2 pt-4">
          <p className="font-display text-2xl text-[var(--color-foreground)]">
            {name}
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {caption
              ? caption
              : revealMode
                ? orientation === 'upright'
                  ? messages.tarotCard.uprightPerspective
                  : messages.tarotCard.reversedPerspective
                : messages.tarotCard.gathering}
          </p>
        </figcaption>
      )}
    </figure>
  );
}
