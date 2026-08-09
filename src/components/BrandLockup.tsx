interface BrandLockupProps {
  compact?: boolean;
}

export function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className="flex min-w-0 items-center" aria-label="TANITA">
      <img
        src="/tanita-logo-official.png"
        alt="Logo TANITA"
        width="164"
        height="40"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        className={`w-auto shrink-0 object-contain ${
          compact ? 'h-8 max-w-[128px] sm:h-9' : 'h-10 max-w-[164px]'
        }`}
      />
    </div>
  );
}
