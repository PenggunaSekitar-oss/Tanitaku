import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 w-full mb-1 pb-2 border-b border-slate-200/80">
      <div className="flex items-center justify-between gap-4 w-full flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-black text-2xl tracking-tight text-slate-950 leading-snug flex items-center gap-2">
            {title}
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-semibold max-w-3xl leading-snug">
            {subtitle}
          </p>
        </div>
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

