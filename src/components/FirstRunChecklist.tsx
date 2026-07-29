interface FirstRunStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionLabel: string;
  onAction: () => void;
}

interface FirstRunChecklistProps {
  steps: FirstRunStep[];
  onDismiss?: () => void;
}

export function FirstRunChecklist({ steps, onDismiss }: FirstRunChecklistProps) {
  const completedCount = steps.filter((step) => step.completed).length;
  const currentStepIndex = steps.findIndex((step) => !step.completed);
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <section
      aria-labelledby="first-run-title"
      className="overflow-hidden rounded-2xl border border-[#B9C8BE] bg-[#FBFAF6] shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-[#D8DED9] bg-[#EEF3EF] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="flex min-w-0 gap-3">
          <span
            className="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#24533F] text-[21px] text-white"
            aria-hidden="true"
          >
            route
          </span>
          <div>
            <p className="text-xs font-semibold text-[#526159]">Mulai dari sini</p>
            <h2 id="first-run-title" className="mt-0.5 font-display text-lg font-semibold text-[#1B3025]">
              Siapkan kebun pertama Anda
            </h2>
            <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-[#617068] sm:text-sm">
              TANITA menghitung jadwal dan kebutuhan bahan dari data lahan. Ikuti tiga langkah ini secara berurutan.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-10 self-start rounded-lg px-3 text-xs font-semibold text-[#5E6A63] hover:bg-white hover:text-[#26342C]"
          >
            Nanti saja
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#435148]">
            {completedCount} dari {steps.length} langkah selesai
          </span>
          <span className="text-xs font-semibold text-[#24533F]">{progress}%</span>
        </div>
        <div
          className="mb-5 h-2 overflow-hidden rounded-full bg-[#E0E4E0]"
          role="progressbar"
          aria-label="Progres penyiapan kebun"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={completedCount}
        >
          <div
            className="h-full rounded-full bg-[#24533F] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const isCurrent = index === currentStepIndex;
            return (
              <li
                key={step.id}
                className={`rounded-xl border p-3.5 ${
                  step.completed
                    ? 'border-[#C6D5CB] bg-[#F0F5F1]'
                    : isCurrent
                      ? 'border-[#759381] bg-white'
                      : 'border-[#DDDCD5] bg-[#F7F6F1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step.completed
                        ? 'bg-[#2D684E] text-white'
                        : isCurrent
                          ? 'bg-[#24533F] text-white'
                          : 'bg-[#E2E2DC] text-[#68736C]'
                    }`}
                    aria-hidden="true"
                  >
                    {step.completed ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#26342C]">{step.title}</h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-[#68736C]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {currentStep && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#D0D8D2] bg-[#F7F8F5] p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium leading-relaxed text-[#59675F] sm:text-sm">
              Langkah berikutnya: <strong className="text-[#26342C]">{currentStep.title}</strong>
            </p>
            <button
              type="button"
              onClick={currentStep.onAction}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#24533F] px-4 text-xs font-semibold text-white hover:bg-[#1B4031]"
            >
              {currentStep.actionLabel}
              <span className="material-symbols-outlined text-[17px]" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
