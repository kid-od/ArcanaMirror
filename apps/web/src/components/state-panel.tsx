import Link from 'next/link';

type StatePanelProps = {
  title: string;
  description: string;
  eyebrow?: string;
  tone?: 'default' | 'error' | 'success';
  action?: {
    href: string;
    label: string;
  };
};

const toneStyles = {
  default: 'border-white/10 bg-[var(--color-panel)]',
  error: 'border-rose-400/30 bg-[rgba(78,20,36,0.48)]',
  success: 'border-emerald-300/20 bg-[rgba(15,56,44,0.45)]',
} as const;

export function StatePanel({
  title,
  description,
  eyebrow,
  tone = 'default',
  action,
}: StatePanelProps) {
  return (
    <section
      className={`rounded-[1.75rem] border p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] ${toneStyles[tone]}`}
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl text-[var(--color-foreground)]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
        {description}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex rounded-full border border-[var(--color-accent)]/35 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
        >
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}
