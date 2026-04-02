import { StatePanel } from '@/src/components/state-panel';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export default async function Loading() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <div className="py-16">
      <StatePanel
        eyebrow={messages.loading.eyebrow}
        title={messages.loading.title}
        description={messages.loading.description}
      />
    </div>
  );
}
