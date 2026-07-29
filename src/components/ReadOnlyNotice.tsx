interface ReadOnlyNoticeProps {
  message?: string;
}

export function ReadOnlyNotice({ message }: ReadOnlyNoticeProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#C9C6BC] bg-[#F8F6EE] p-4 text-[#405047]">
      <span
        className="material-symbols-outlined mt-px text-[20px] text-[#24533F]"
        aria-hidden="true"
      >
        lock
      </span>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#24533F]">
          Tampilan hanya baca
        </p>
        <p className="mt-1 text-xs font-medium leading-relaxed text-[#68726C]">
          {message ?? 'Form dan aksi perubahan dinonaktifkan pada mode demo.'}
        </p>
      </div>
    </div>
  );
}
