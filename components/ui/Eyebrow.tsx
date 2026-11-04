interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Mono, uppercase label with a short gold rule. */
export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`font-label flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-6 bg-gold" />
      <span>{children}</span>
    </p>
  );
}
