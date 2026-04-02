import { DrawFlow } from '@/src/features/reading/draw-flow';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const metadata = {
  title: 'Three Card Reading',
};

export default async function ThreeDrawPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <DrawFlow
      spreadType="three"
      title={messages.drawPages.three.title}
      description={messages.drawPages.three.description}
      prompts={messages.drawPages.three.prompts}
    />
  );
}
