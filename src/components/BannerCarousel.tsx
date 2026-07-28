const HERO_IMAGE =
  'https://res.cloudinary.com/ddc26noa/image/upload/v1784818378/253483203_1784817786561488_xjv8xj.jpg';

export function BannerCarousel() {
  return (
    <section className="grid min-h-[260px] overflow-hidden rounded-[22px] border border-[#345749] bg-[#173D2F] text-white md:grid-cols-[1.05fr_0.95fr]">
      <div className="order-2 flex flex-col justify-between p-6 sm:p-8 md:order-1 md:p-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7D8CC]">
            Ruang kerja kebun
          </p>
          <h1 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-[1.16] tracking-[-0.04em] sm:text-3xl">
            Catatan lapangan yang rapi untuk keputusan yang bisa dipertanggungjawabkan.
          </h1>
          <p className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-[#D3DFD7]">
            Pantau lahan, jadwal, biaya, dan prakiraan cuaca dalam satu alur kerja yang
            sederhana.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-4 text-[11px] font-semibold text-[#D7E1DA]">
          <span>Data tersimpan lokal</span>
          <span>Sumber cuaca BMKG</span>
          <span>Tanpa data contoh</span>
        </div>
      </div>
      <div className="order-1 min-h-[210px] overflow-hidden md:order-2 md:min-h-full">
        <img
          src={HERO_IMAGE}
          alt="Area pertanian yang dikelola melalui TANITA"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
