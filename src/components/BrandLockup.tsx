interface BrandLockupProps {
  compact?: boolean;
  inverse?: boolean;
}

export function BrandLockup({ compact = false, inverse = false }: BrandLockupProps) {
  const primaryText = inverse ? 'text-white' : 'text-[#183127]';
  const secondaryText = inverse ? 'text-white/60' : 'text-[#69736D]';

  return (
    <div className="flex min-w-0 items-center gap-2.5" aria-label="TANITA">
      <img
        src="/tanita-icon.svg"
        alt=""
        aria-hidden="true"
        className={`${compact ? 'h-8 w-8 rounded-[10px]' : 'h-9 w-9 rounded-xl'} shrink-0`}
      />
      <div className="min-w-0">
        <span className={`block font-display text-sm font-bold tracking-[-0.02em] ${primaryText}`}>
          TANITA
        </span>
        {!compact && (
          <span className={`block truncate text-[9px] font-semibold uppercase tracking-[0.16em] ${secondaryText}`}>
            Operasional Kebun
          </span>
        )}
      </div>
    </div>
  );
}
