import { motion } from 'motion/react';

const HERO_IMAGE =
  'https://res.cloudinary.com/ddc26noa/image/upload/v1784818378/253483203_1784817786561488_xjv8xj.jpg';

interface BannerCarouselProps {
  onNavigate: (view: string) => void;
}

export function BannerCarousel({ onNavigate }: BannerCarouselProps) {
  return (
    <motion.section
      className="dashboard-hero grid overflow-hidden rounded-[18px] border border-[#2E5A4A] bg-[#12382D] text-white md:min-h-[286px] md:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]"
    >
      <div className="order-2 flex flex-col justify-between p-6 sm:p-8 md:order-1 md:p-9 lg:p-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8CEC4]"
          >
            <span className="h-px w-7 bg-[#C76942]" aria-hidden="true" />
            Ruang kendali kebun
          </motion.p>
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-title max-w-[620px] text-[34px] font-semibold leading-[1.02] text-[#FFFDF5] sm:text-[42px] lg:text-[48px]"
          >
            Setiap keputusan kebun, dalam satu pandangan.
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[560px] text-[13px] font-medium leading-relaxed text-[#C6D5CF] sm:text-sm"
          >
            Pantau kondisi lahan, pekerjaan terdekat, biaya, dan cuaca dengan catatan yang tetap mudah ditelusuri.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={() => onNavigate('pemantauan')}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-[#F2EFE2] px-4 text-xs font-bold text-[#173E33] transition hover:bg-white"
          >
            Buka data lahan
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('log')}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-white/20 px-4 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.06]"
          >
            <span className="material-symbols-outlined text-[17px]">add_notes</span>
            Catat aktivitas
          </button>
        </motion.div>
      </div>
      <div className="dashboard-hero__image order-1 h-[180px] overflow-hidden sm:h-[220px] md:order-2 md:h-full">
        <motion.img
          src={HERO_IMAGE}
          alt="Area pertanian yang dikelola melalui TANITA"
          width="960"
          height="640"
          className="h-full w-full object-cover saturate-[0.88] contrast-[1.03]"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.section>
  );
}
