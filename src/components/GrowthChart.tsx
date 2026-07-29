import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Tanaman } from '../context/TaniOpsContext';
import { calculateHST } from '../utils/calculations';

interface GrowthChartProps {
  tanamanList: Tanaman[];
}

const formatPlantLabel = (plant: Tanaman): string => {
  const commodity = plant.komoditas.trim() || 'Tanaman';
  const variety = plant.varietas.trim();
  return variety ? `${commodity} · ${variety}` : commodity;
};

export function GrowthChart({ tanamanList }: GrowthChartProps) {
  const activePlants = tanamanList
    .filter((plant) => plant.status !== 'Panen')
    .map((plant) => ({
      id: plant.id,
      label: formatPlantLabel(plant),
      hst: calculateHST(plant.tanggalTanam),
      plantingDate: plant.tanggalTanam,
    }))
    .sort((left, right) => right.hst - left.hst);

  if (activePlants.length === 0) {
    return (
      <section className="rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6] p-8 text-center">
        <span className="material-symbols-outlined text-3xl text-[#839087]" aria-hidden="true">
          bar_chart
        </span>
        <h3 className="mt-3 font-display text-base font-semibold text-[#243129]">
          Belum ada tanaman aktif
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs font-medium leading-relaxed text-[#707A73]">
          Grafik umur akan terbentuk dari tanggal tanam yang dicatat pada Data Lahan.
        </p>
      </section>
    );
  }

  const visiblePlants = activePlants.slice(0, 12);
  const sortedAges = activePlants.map((plant) => plant.hst).sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedAges.length / 2);
  const medianAge =
    sortedAges.length % 2 === 0
      ? Math.round(((sortedAges[middleIndex - 1] ?? 0) + (sortedAges[middleIndex] ?? 0)) / 2)
      : (sortedAges[middleIndex] ?? 0);
  const chartHeight = Math.max(260, Math.min(520, visiblePlants.length * 42 + 80));

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D8D5CC] bg-[#FBFAF6]">
      <div className="motion-stagger grid grid-cols-3 border-b border-[#E2DFD7]">
        {[
          ['Tanaman aktif', activePlants.length],
          ['Umur median', `${medianAge} HST`],
          ['Umur tertinggi', `${sortedAges.at(-1) ?? 0} HST`],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`px-4 py-4 sm:px-5 ${index > 0 ? 'border-l border-[#E2DFD7]' : ''}`}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A837D]">
              {label}
            </p>
            <p className="mt-1 font-display text-base font-semibold tracking-[-0.03em] text-[#233229] sm:text-lg">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 sm:p-5">
        <div style={{ height: chartHeight }} className="w-full" aria-label="Grafik umur tanaman aktif">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={visiblePlants}
              layout="vertical"
              margin={{ top: 8, right: 20, bottom: 12, left: 6 }}
            >
              <CartesianGrid horizontal={false} stroke="#E2DFD7" />
              <XAxis
                type="number"
                unit=" HST"
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#6C756F', fontWeight: 600 }}
                axisLine={{ stroke: '#CFCBC1' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={118}
                tick={{ fontSize: 10, fill: '#35433B', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#F0EFEA' }}
                formatter={(value) => [`${Number(value)} HST`, 'Umur']}
                labelFormatter={(label) => String(label)}
                contentStyle={{
                  border: '1px solid #D8D5CC',
                  borderRadius: 12,
                  background: '#FBFAF6',
                  boxShadow: '0 8px 24px rgba(24, 35, 29, 0.08)',
                  fontSize: 11,
                }}
              />
              <Bar
                dataKey="hst"
                name="Umur tanaman"
                radius={[0, 6, 6, 0]}
                maxBarSize={20}
                isAnimationActive
                animationBegin={120}
                animationDuration={850}
                animationEasing="ease-out"
              >
                {visiblePlants.map((plant, index) => (
                  <Cell
                    key={plant.id}
                    fill={index === 0 ? '#24533F' : '#668373'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {activePlants.length > visiblePlants.length && (
          <p className="mt-2 text-center text-[10px] font-medium text-[#747D77]">
            Menampilkan 12 tanaman tertua dari {activePlants.length} tanaman aktif.
          </p>
        )}
        <p className="mt-3 border-t border-[#E2DFD7] pt-3 text-[10px] font-medium leading-relaxed text-[#747D77]">
          Umur dihitung dari tanggal tanam hingga tanggal perangkat. Grafik tidak menaksir fase
          biologis atau waktu panen.
        </p>
      </div>
    </section>
  );
}
