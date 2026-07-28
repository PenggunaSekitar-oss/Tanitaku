interface BrandLockupProps {
  compact?: boolean;
}

export function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className="flex min-w-0 items-center" aria-label="TANITA">
      <img
        src="https://res.cloudinary.com/ddc26noa/image/upload/v1784860433/5199_1_j0xnzq.png"
        alt="Logo TANITA"
        className={`w-auto shrink-0 object-contain ${
          compact ? 'h-8 max-w-[128px] sm:h-9' : 'h-10 max-w-[164px]'
        }`}
      />
    </div>
  );
}
