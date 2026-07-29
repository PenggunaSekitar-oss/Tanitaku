import { motion } from 'motion/react';

const HERO_IMAGE =
  'https://res.cloudinary.com/ddc26noa/image/upload/v1784818378/253483203_1784817786561488_xjv8xj.jpg';

export function BannerCarousel() {
  return (
    <motion.section
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="motion-surface grid overflow-hidden rounded-2xl border border-[#345749] bg-[#173D2F] text-white md:min-h-[178px] md:grid-cols-[1fr_320px]"
    >
      <div className="order-2 flex flex-col justify-center p-5 sm:p-6 md:order-1 md:px-8 md:py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
          }}
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl font-display text-xl font-semibold leading-[1.25] tracking-[-0.035em] sm:text-2xl"
          >
            Ringkasan operasional kebun
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2.5 max-w-lg text-[13px] font-medium leading-relaxed text-[#D3DFD7] sm:text-sm"
          >
            Lihat kondisi lahan, pekerjaan terdekat, biaya, dan prakiraan cuaca tanpa berpindah halaman.
          </motion.p>
        </motion.div>
      </div>
      <div className="order-1 h-[124px] overflow-hidden sm:h-[150px] md:order-2 md:h-full">
        <motion.img
          src={HERO_IMAGE}
          alt="Area pertanian yang dikelola melalui TANITA"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.section>
  );
}
