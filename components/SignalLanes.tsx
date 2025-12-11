import React from 'react';
import { CountryData, REGIONS } from '../types';

interface SignalLanesProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData) => void;
  selectedCountry: CountryData | null;
}

const SignalLanes: React.FC<SignalLanesProps> = ({ data, onSelectCountry, selectedCountry }) => {
  // Group by Region
  const groupedData = REGIONS.reduce((acc, region) => {
    acc[region] = data.filter(d => d.region === region);
    return acc;
  }, {} as Record<string, CountryData[]>);

  const minGap = -50;
  const maxGap = 50;
  const range = maxGap - minGap;

  const getPosition = (gap: number) => {
    const clamped = Math.max(minGap, Math.min(maxGap, gap));
    return ((clamped - minGap) / range) * 100;
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 relative">
       <div className="absolute top-4 right-8 text-xs font-mono text-gray-500">
        <p>STATIC MODE</p>
        <p>COMPARATIVE REGIONAL LANES</p>
      </div>

      <div className="flex justify-between mb-4 px-32 text-xs font-mono text-gray-400 border-b border-gray-800 pb-2">
        <span>Connectivity Leads (Negative Gap)</span>
        <span>0 (Balanced)</span>
        <span>Energy Leads (Positive Gap)</span>
      </div>

      <div className="space-y-8">
        {REGIONS.map(region => (
          <div key={region} className="relative">
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">{region}</h3>
            <div className="relative h-12 bg-gray-900/30 rounded-full border border-gray-800">
              {/* Center Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 border-r border-dashed border-white/20"></div>

              {/* Data Points */}
              {groupedData[region]?.map(country => {
                const left = getPosition(country.gap);
                const isSelected = selectedCountry?.id === country.id;

                return (
                  <div
                    key={country.id}
                    onClick={() => onSelectCountry(country)}
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-sm cursor-pointer transition-all duration-300 transform hover:scale-125 z-10
                      ${country.gap > 0 ? 'bg-emerald-500' : 'bg-blue-500'}
                      ${isSelected ? 'ring-2 ring-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'opacity-80'}
                    `}
                    style={{ left: `${left}%` }}
                    title={`${country.name}: Gap ${country.gap.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalLanes;