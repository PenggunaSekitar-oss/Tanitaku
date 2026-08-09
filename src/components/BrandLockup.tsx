interface BrandLockupProps {
  compact?: boolean;
  inverse?: boolean;
  descriptor?: boolean;
}

export function BrandLockup({
  compact = false,
  inverse = false,
  descriptor = false,
}: BrandLockupProps) {
  return (
    <div className="flex min-w-0 items-center gap-3" aria-label="TANITA">
      <img
        src="/tanita-logo-official.png"
        alt="Logo TANITA"
        width="164"
        height="40"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        className={`w-auto shrink-0 object-contain ${inverse ? 'brightness-0 invert' : ''} ${
          compact ? 'h-8 max-w-[128px] sm:h-9' : 'h-10 max-w-[164px]'
        }`}
      />
      {descriptor && (
        <span className={`hidden border-l pl-3 text-[10px] font-semibold uppercase leading-[1.35] tracking-[0.12em] sm:block ${
          inverse ? 'border-white/20 text-white/58' : 'border-[#D4D1C7] text-[#707A73]'
        }`}>
          Field<br />operations
        </span>
      )}
    </div>
  );
}
