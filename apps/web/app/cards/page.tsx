import { CardsLibrary } from '@/src/features/cards/cards-library';
import { StatePanel } from '@/src/components/state-panel';
import { getCards } from '@/src/lib/tarot-api';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const metadata = {
  title: 'Card Library',
};

export const dynamic = 'force-dynamic';

export default async function CardsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const response = await getCards(locale).catch(() => null);

  if (!response) {
    return (
      <StatePanel
        tone="error"
        eyebrow={messages.cards.pageErrorEyebrow}
        title={messages.cards.pageErrorTitle}
        description={messages.cards.pageErrorDescription}
      />
    );
  }

  if (response.total === 0) {
    return (
      <StatePanel
        eyebrow={messages.cards.emptyEyebrow}
        title={messages.cards.emptyTitle}
        description={messages.cards.emptyDescription}
      />
    );
  }

  return <CardsLibrary cards={response.items} filters={response.filters} />;
}
