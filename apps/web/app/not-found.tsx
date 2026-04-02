import { StatePanel } from '@/src/components/state-panel';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export default async function NotFound() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <div className="py-16">
      <StatePanel
        eyebrow={messages.notFound.eyebrow}
        title={messages.notFound.title}
        description={messages.notFound.description}
        action={{
          href: '/',
          label: messages.notFound.action,
        }}
      />
    </div>
  );
}
