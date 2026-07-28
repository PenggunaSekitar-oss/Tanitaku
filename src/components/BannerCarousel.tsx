const HERO_IMAGE =
  'https://res.cloudinary.com/ddc26noa/image/upload/v1784818378/253483203_1784817786561488_xjv8xj.jpg';

export function BannerCarousel() {
  return (
    <section className="grid overflow-hidden rounded-2xl border border-[#345749] bg-[#173D2F] text-white md:min-h-[178px] md:grid-cols-[1fr_320px]">
      <div className="order-2 flex flex-col justify-center p-5 sm:p-6 md:order-1 md:px-8 md:py-6">
        <div>
          <h1 className="max-w-xl font-display text-xl font-semibold leading-[1.25] tracking-[-0.035em] sm:text-2xl">
            Ringkasan operasional kebun
          </h1>
          <p className="mt-2.5 max-w-lg text-[13px] font-medium leading-relaxed text-[#D3DFD7] sm:text-sm">
            Lihat kondisi lahan, pekerjaan terdekat, biaya, dan prakiraan cuaca tanpa berpindah halaman.
          </p>
        </div>
      </div>
      <div className="order-1 h-[124px] overflow-hidden sm:h-[150px] md:order-2 md:h-full">
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
