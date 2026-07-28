interface InlineNoticeProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

const noticeStyles = {
  success: 'border-[#BFD0C5] bg-[#EDF3EF] text-[#214B39]',
  info: 'border-[#CDD2CD] bg-[#F4F4F0] text-[#3E4A43]',
  error: 'border-[#DFC2BB] bg-[#FAF0ED] text-[#8E3D31]',
};

export function InlineNotice({
  message,
  type = 'info',
  onClose,
}: InlineNoticeProps) {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed ${noticeStyles[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-current/65 transition hover:bg-black/5 hover:text-current"
          aria-label="Tutup pesan"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}
