import { SectionHeading } from '@/src/components/section-heading';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const metadata = {
  title: 'About',
};

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
        <SectionHeading
          eyebrow={messages.about.eyebrow}
          title={messages.about.title}
          description={messages.about.description}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {messages.about.notes.map((note) => (
          <article
            key={note.title}
            className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {note.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl text-[var(--color-foreground)]">
              {note.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {note.body}
            </p>
          </article>
        ))}
      </section>

      <section
        id="privacy"
        className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
          {messages.about.privacyEyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
          {messages.about.privacyTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          {messages.about.privacyBody}
        </p>
      </section>

      <section
        id="disclaimer"
        className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
          {messages.about.disclaimerEyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
          {messages.about.disclaimerTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          {messages.about.disclaimerBody}
        </p>
      </section>
    </div>
  );
}
