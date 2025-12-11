import React from 'react';
import { CountryData } from '../types';

interface InfoPanelProps {
  country: CountryData | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ country, onClose }) => {
  if (!country) return (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-600 text-center p-8 border-l border-gray-800/50">
      <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl animate-pulse text-gray-400">?</span>
      </div>
      <p className="font-mono text-sm tracking-wider">SELECT A NODE<br/>TO DECODE DATA</p>
    </div>
  );

  const isPositiveGap = country.gap >= 0;

  return (
    <div className="h-full p-6 border-l border-gray-800 bg-gray-900/30 backdrop-blur-sm overflow-y-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{country.name}</h2>
           <p className="text-neon-cyan text-xs font-mono uppercase tracking-widest">{country.region}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
      </div>

      <div className="space-y-6">
        {/* GAP METRIC */}
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-500 ${isPositiveGap ? 'bg-emerald-500 group-hover:w-2' : 'bg-blue-500 group-hover:w-2'}`}></div>
          <h3 className="text-xs font-mono text-gray-500 mb-2 uppercase">Infrastructure Gap</h3>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${isPositiveGap ? 'text-emerald-400' : 'text-blue-400'}`}>
              {country.gap > 0 ? '+' : ''}{country.gap.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            {isPositiveGap 
              ? "Energy infrastructure is more prevalent than high-speed internet." 
              : "Digital connectivity has outpaced physical power grid reliability."}
          </p>
        </div>

        {/* DEMOGRAPHICS (New) */}
        <div className="grid grid-cols-2 gap-3">
             <div className="p-3 bg-gray-800/30 border border-gray-700/50 rounded">
                <h4 className="text-[10px] text-gray-500 font-mono mb-1 uppercase">Population</h4>
                <p className="text-lg font-bold text-white">{country.population}M</p>
             </div>
             <div className="p-3 bg-gray-800/30 border border-gray-700/50 rounded">
                <h4 className="text-[10px] text-gray-500 font-mono mb-1 uppercase">GDP / Cap</h4>
                <p className="text-lg font-bold text-white">${country.gdp}k</p>
             </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4 pt-4 border-t border-gray-800/50">
           <h4 className="text-xs text-gray-500 font-mono uppercase">Core Metrics</h4>
          
          <div className="relative pt-1">
             <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Energy Access</span>
                <span className="font-bold">{country.electricity}%</span>
             </div>
             <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400" style={{ width: `${country.electricity}%` }}></div>
             </div>
          </div>

          <div className="relative pt-1">
             <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>4G Coverage</span>
                <span className="font-bold">{country.connectivity}%</span>
             </div>
             <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-700 to-blue-400" style={{ width: `${country.connectivity}%` }}></div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded border border-indigo-500/20">
            <p className="text-[10px] text-indigo-300 font-mono">AI INSIGHT</p>
            <p className="text-xs text-indigo-100 mt-1 italic">
                "{country.gap < -5 ? 'This region exhibits "leapfrog" behavior, adopting mobile tech faster than traditional utilities.' : 'Balanced growth suggests synchronized infrastructure policy.'}"
            </p>
        </div>

      </div>
    </div>
  );
};

export default InfoPanel;