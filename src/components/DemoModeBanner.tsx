export function DemoModeBanner() {
  return (
    <aside
      className="border-b border-[#C8A86B] bg-[#FFF8E8] px-4 py-2.5 text-[#5C421E] sm:px-6"
      aria-label="Mode demo"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span
            className="material-symbols-outlined mt-px text-[18px] text-[#8B6328]"
            aria-hidden="true"
          >
            visibility
          </span>
          <p className="leading-relaxed">
            <strong className="font-extrabold">Mode demo · hanya baca.</strong>{' '}
            Jelajahi data kebun contoh tanpa risiko mengubah atau menghapus informasi.
          </p>
        </div>
        <a
          href="https://tanitaku.web.id"
          className="ml-7 inline-flex min-h-8 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#B78A45] bg-white px-3 font-bold text-[#61461F] transition hover:bg-[#F6E9CF] sm:ml-0 sm:self-auto"
        >
          Buka TANITA
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_outward
          </span>
        </a>
      </div>
    </aside>
  );
}
