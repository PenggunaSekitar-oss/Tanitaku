interface HelpTipProps {
  label: string;
  text: string;
}

export function HelpTip({ label, text }: HelpTipProps) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`Bantuan: ${label}`}
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#CDD2CE] bg-white text-[11px] font-bold text-[#607068] transition-colors hover:border-[#8FA297] hover:text-[#24533F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#759381]/40"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-[80] mb-2 w-60 -translate-x-1/2 rounded-xl border border-[#D8D5CC] bg-[#1E2B24] px-3 py-2.5 text-left text-[11px] font-medium leading-relaxed text-white opacity-0 shadow-[0_10px_28px_rgba(20,31,25,0.18)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
