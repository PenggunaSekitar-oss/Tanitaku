import React from 'react';
import { motion } from 'motion/react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  eyebrow?: string;
}

export function PageHeader({ title, subtitle, action, eyebrow = 'Operasional kebun' }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border-b border-[#D7D3C8] pb-6"
    >
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="max-w-3xl border-l-2 border-[#C76942] pl-4 sm:pl-5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#738078]">{eyebrow}</p>
          <h1 className="font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#18231D] sm:text-[30px]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] font-medium leading-relaxed text-[#657068] sm:text-sm">
            {subtitle}
          </p>
        </div>
        {action && (
          <div className="w-full shrink-0 sm:w-auto sm:max-w-[310px]">
            {action}
          </div>
        )}
      </div>
    </motion.header>
  );
}
