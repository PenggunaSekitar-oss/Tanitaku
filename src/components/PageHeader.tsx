import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="w-full border-b border-[#D9D8D1] pb-5">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-3xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7E8781]">
            TANITA / Operasional kebun
          </p>
          <h1 className="font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#18231D] sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[#657068]">
            {subtitle}
          </p>
        </div>
        {action && (
          <div className="w-full shrink-0 sm:w-auto">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
