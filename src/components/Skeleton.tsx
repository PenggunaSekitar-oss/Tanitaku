export function ModuleSkeleton() {
  return (
    <div className="tanita-skeleton space-y-5" aria-label="Memuat modul" aria-busy="true">
      <div className="space-y-2 border-b border-[#D9D8D1] pb-5">
        <div className="h-7 w-56 rounded-lg bg-[#E1E0DA]" />
        <div className="h-4 w-full max-w-xl rounded bg-[#E8E7E1]" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 rounded-2xl border border-[#DFDDD5] bg-[#EAE9E3]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-[#DFDDD5] bg-[#EAE9E3]" />
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="tanita-skeleton grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]" aria-label="Memuat prakiraan cuaca" aria-busy="true">
      <div className="h-64 rounded-2xl bg-[#E0E3DF]" />
      <div className="h-64 rounded-2xl border border-[#DFDDD5] bg-[#EAE9E3]" />
    </div>
  );
}
