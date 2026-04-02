type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl leading-none text-[var(--color-foreground)] md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
        {description}
      </p>
    </div>
  );
}
