'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { SectionHeading } from '@/src/components/section-heading';
import { StatePanel } from '@/src/components/state-panel';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';
import { useLocale } from '@/src/i18n/locale-provider';
import { CardFilter, CardSummary } from '@/src/lib/tarot-api';

type CardsLibraryProps = {
  cards: CardSummary[];
  filters: CardFilter[];
};

export function CardsLibrary({ cards, filters }: CardsLibraryProps) {
  const { locale, messages } = useLocale();
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesFilter =
        activeFilter === 'all' ? true : card.filterKey === activeFilter;
      const matchesQuery =
        deferredQuery.length === 0
          ? true
          : `${card.name} ${card.description} ${card.keywords.join(' ')}`
              .toLowerCase()
              .includes(deferredQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, cards, deferredQuery]);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-8">
        <SectionHeading
          eyebrow={messages.cards.headingEyebrow}
          title={messages.cards.headingTitle}
          description={messages.cards.headingDescription}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="block">
            <span className="sr-only">{messages.cards.searchLabel}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.cards.searchPlaceholder}
              className="w-full rounded-full border border-white/10 bg-[#0c1224] px-5 py-3 text-sm text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[rgba(224,214,198,0.45)] focus:border-[var(--color-accent)]/35"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = filter.id === activeFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-[var(--color-panel-strong)] text-[var(--color-foreground)]'
                      : 'border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {visibleCards.length === 0 ? (
        <StatePanel
          eyebrow={messages.cards.noMatchesEyebrow}
          title={messages.cards.noMatchesTitle}
          description={messages.cards.noMatchesDescription}
        />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCards.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.slug}`}
              className="flex h-full flex-col gap-4 transition-transform hover:-translate-y-1"
            >
              <TarotCardVisual
                locale={locale}
                name={card.name}
                imageUrl={card.imageUrl}
                arcana={card.arcana}
                suit={card.suit}
                className="w-full shrink-0"
              />
              <div className="px-1">
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
