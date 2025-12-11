import React, { useState, useRef, useEffect } from 'react';
import { CountryData } from '../types';

interface TeeterSeesawProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData | null) => void;
  selectedCountry: CountryData | null;
  accentColor: string;
}

const TeeterSeesaw: React.FC<TeeterSeesawProps> = ({ data, onSelectCountry, selectedCountry, accentColor }) => {
  const [beamAngle, setBeamAngle] = useState(10);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  // Constants
  const width = 800;
  const height = 500;
  const cx = width / 2;
  const cy = height * 0.75; // Lower pivot to allow tall buildings
  const beamLength = 640;

  // Process data for stacking
  const processedData = React.useMemo(() => {
    // We categorize primarily by Gap Direction to place on Left or Right
    // Left: Connectivity Leads (Gap < 0)
    // Right: Energy Leads (Gap > 0)
    // Position on beam = Magnitude of Gap
    return data.map(d => {
        // Normalize gap to distance from center (0 to beamLength/2)
        // Max gap is approx 20. Scale carefully.
        const gapMag = Math.abs(d.gap);
        const dist = Math.min(gapMag * 15, beamLength/2 - 20); 
        
        // Direction multiplier
        const dir = d.gap >= 0 ? 1 : -1;
        
        return {
            ...d,
            beamPos: dir * (20 + dist), // +20 buffer from center pivot
            // Height based on population (scaled)
            barHeight: Math.max(10, Math.log(d.population) * 25) 
        };
    });
  }, [data]);

  // Calculate "Weight" (torque) for auto-balancing visual hint
  const torque = processedData.reduce((acc, d) => acc + (d.beamPos * d.population), 0);
  // Optional: Auto-tilt based on data weight? 
  // For now, let's keep it interactive but visualize the "stress" on the pivot.

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastY.current = e.clientY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - lastY.current;
    setBeamAngle(prev => Math.max(-25, Math.min(25, prev + deltaY * 0.2)));
    lastY.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-navy-dark">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-navy-dark to-navy-dark pointer-events-none"></div>

      <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 z-10">
        <p>GRAVITY MODE</p>
        <p>HEIGHT = POPULATION | POS = GAP INTENSITY</p>
      </div>
      
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full max-w-5xl cursor-move touch-none z-10"
        onMouseDown={handleMouseDown}
      >
        <defs>
          <linearGradient id="barGradientPos" x1="0" y1="1" x2="0" y2="0">
             <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8"/>
             <stop offset="100%" stopColor="#10b981" stopOpacity="0.9"/>
          </linearGradient>
          <linearGradient id="barGradientNeg" x1="0" y1="1" x2="0" y2="0">
             <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8"/>
             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9"/>
          </linearGradient>
           <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Pivot Base */}
        <path d={`M ${cx} ${cy} L ${cx - 30} ${height} L ${cx + 30} ${height} Z`} className="fill-slate-800" />
        <circle cx={cx} cy={cy} r={6} className="fill-neon-cyan animate-pulse" />

        {/* The Rotating System */}
        <g transform={`rotate(${beamAngle} ${cx} ${cy})`} className="transition-transform duration-100 ease-out">
          
          {/* Main Beam */}
          <rect 
            x={cx - beamLength / 2} 
            y={cy - 6} 
            width={beamLength} 
            height={12} 
            rx={2}
            className="fill-slate-700 stroke-slate-600"
          />
          {/* Beam Detail Lines */}
          <line x1={cx - beamLength/2} y1={cy} x2={cx + beamLength/2} y2={cy} stroke="rgba(255,255,255,0.1)" strokeDasharray="10 5" />

          {/* Labels on Beam */}
          <text x={cx - beamLength/2 + 10} y={cy + 25} className="fill-blue-500 text-[8px] font-mono tracking-widest uppercase">Connectivity Dominant</text>
          <text x={cx + beamLength/2 - 10} y={cy + 25} className="fill-emerald-500 text-[8px] font-mono tracking-widest uppercase" textAnchor="end">Energy Dominant</text>

          {/* Render Countries as Skyscrapers */}
          {processedData.map((d) => {
             const isSelected = selectedCountry?.id === d.id;
             const barWidth = 14;
             
             // X position relative to pivot center
             const x = cx + d.beamPos - barWidth/2;
             // Y is on top of the beam (cy - 6) minus height
             const yBase = cy - 6;
             
             return (
               <g 
                 key={d.id}
                 onClick={(e) => { e.stopPropagation(); onSelectCountry(d); }}
                 className="cursor-pointer hover:opacity-100 opacity-90 transition-opacity"
               >
                 {/* The Building */}
                 <rect
                   x={x}
                   y={yBase - d.barHeight}
                   width={barWidth}
                   height={d.barHeight}
                   fill={d.gap >= 0 ? "url(#barGradientPos)" : "url(#barGradientNeg)"}
                   className={`${isSelected ? 'stroke-white stroke-2' : 'stroke-white/10 stroke-1'}`}
                   filter={isSelected ? "url(#neon-glow)" : ""}
                 />
                 
                 {/* Top Cap / Roof Light */}
                 <rect 
                    x={x} 
                    y={yBase - d.barHeight} 
                    width={barWidth} 
                    height={2} 
                    className={d.gap >= 0 ? "fill-emerald-300" : "fill-blue-300"} 
                 />

                 {/* Hover/Select Info Line */}
                 {(isSelected) && (
                    <g>
                        <line x1={x + barWidth/2} y1={yBase - d.barHeight} x2={x + barWidth/2} y2={yBase - d.barHeight - 20} stroke="white" strokeWidth="1" />
                        <text x={x + barWidth/2} y={yBase - d.barHeight - 25} textAnchor="middle" className="fill-white text-[10px] font-bold shadow-black drop-shadow-md">
                            {d.id}
                        </text>
                    </g>
                 )}
               </g>
             );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TeeterSeesaw;