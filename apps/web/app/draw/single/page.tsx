import { DrawFlow } from '@/src/features/reading/draw-flow';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const metadata = {
  title: 'Single Card Reading',
};

export default async function SingleDrawPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <DrawFlow
      spreadType="single"
      title={messages.drawPages.single.title}
      description={messages.drawPages.single.description}
      prompts={messages.drawPages.single.prompts}
    />
  );
}
