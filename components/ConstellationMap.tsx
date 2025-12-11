import React, { useMemo, useState } from 'react';
import { CountryData, REGIONS } from '../types';

interface ConstellationMapProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData) => void;
  selectedCountry: CountryData | null;
  accentColor: string;
}

const ConstellationMap: React.FC<ConstellationMapProps> = ({ data, onSelectCountry, selectedCountry, accentColor }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Constants for plotting
  const padding = 80; // Increased padding for axes
  const width = 1000; // Abstract units
  const height = 600;

  // Process data into nodes and calculate region centroids
  const { nodes, regionCentroids } = useMemo(() => {
    // 1. Map data to coordinates
    const mappedNodes = data.map(d => ({
      ...d,
      // X = Electricity (flipped so 100 is right), Y = Connectivity (flipped so 100 is top)
      x: padding + (d.electricity / 100) * (width - padding * 2),
      y: height - (padding + (d.connectivity / 100) * (height - padding * 2)),
      // Size log scale based on population (min 4, max 24)
      r: Math.max(4, Math.min(30, Math.log(d.population) * 3)),
    }));

    // 2. Calculate Centroids per region
    const centroids: Record<string, { x: number, y: number, count: number }> = {};
    
    REGIONS.forEach(region => {
      const regionNodes = mappedNodes.filter(n => n.region === region);
      if (regionNodes.length > 0) {
        const sumX = regionNodes.reduce((acc, n) => acc + n.x, 0);
        const sumY = regionNodes.reduce((acc, n) => acc + n.y, 0);
        centroids[region] = {
          x: sumX / regionNodes.length,
          y: sumY / regionNodes.length,
          count: regionNodes.length
        };
      }
    });

    return { nodes: mappedNodes, regionCentroids: centroids };
  }, [data]);

  // Determine colors based on accent config
  const getMainColor = (isHighlight: boolean) => {
    if (accentColor === 'magenta') return isHighlight ? '#ff00ff' : '#6b21a8';
    if (accentColor === 'blue') return isHighlight ? '#0066ff' : '#1e3a8a';
    return isHighlight ? '#00f3ff' : '#0f766e'; // cyan default
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-navy-dark">
      
      {/* --- HEADER INFO --- */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans drop-shadow-lg">
          INFRASTRUCTURE CONSTELLATIONS
        </h2>
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-xs text-neon-cyan font-mono font-bold tracking-widest bg-black/40 px-2 py-1 inline-block rounded w-max backdrop-blur-sm border border-neon-cyan/20">
             Y-AXIS: DIGITAL (4G) • X-AXIS: ENERGY (GRID)
          </p>
          <p className="text-xs text-gray-400 max-w-lg mt-1 leading-relaxed shadow-black drop-shadow-md">
            Mapping the correlation between physical power access and digital connectivity. 
            Countries are grouped by region to reveal geopolitical infrastructure patterns.
          </p>
        </div>
      </div>

      {/* --- LEGEND PANEL --- */}
      <div className="absolute top-6 right-8 z-20 pointer-events-auto">
         <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-4 rounded-lg flex flex-col gap-3 shadow-xl w-48 transition-opacity hover:opacity-100 opacity-80">
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-gray-700 pb-2 mb-1">Visual Legend</h3>
            
            <div className="flex items-center gap-3 group">
               <div className="w-4 h-4 rounded-full border border-white/50 bg-blue-500/30 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-300 block uppercase">Node Size</span>
                  <span className="text-[9px] text-gray-500">Population Scale</span>
               </div>
            </div>
             <div className="flex items-center gap-3 group">
               <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-gray-700 to-white"></div>
               <div>
                  <span className="text-[10px] font-bold text-gray-300 block uppercase">Brightness</span>
                  <span className="text-[9px] text-gray-500">GDP per Capita</span>
               </div>
            </div>
             <div className="flex items-center gap-3 group">
               <div className="w-8 h-px bg-neon-cyan/50 relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-neon-cyan rounded-full"></div>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-300 block uppercase">Network Lines</span>
                  <span className="text-[9px] text-gray-500">Regional Clusters</span>
               </div>
            </div>
         </div>
      </div>

      {/* --- AXIS LABELS (HTML Layer for sharpness) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-8 bottom-12 top-20 border-l border-gray-800 flex flex-col justify-between text-[10px] text-gray-500 font-mono py-2 pl-3">
          <span className="text-neon-blue font-bold tracking-widest bg-navy-dark/80 px-1 rounded">100% DIGITAL</span>
          <span className="opacity-30">50%</span>
          <span className="opacity-30">0%</span>
        </div>
        <div className="absolute left-12 bottom-8 right-8 border-b border-gray-800 flex justify-between text-[10px] text-gray-500 font-mono pt-2 px-2">
          <span className="opacity-30">0%</span>
          <span className="opacity-30">50%</span>
          <span className="text-emerald-400 font-bold tracking-widest bg-navy-dark/80 px-1 rounded">100% ENERGY ACCESS</span>
        </div>
      </div>

      {/* Scanner Effect */}
      <div className="absolute inset-0 pointer-events-none animate-scanline bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10%] w-full z-0 opacity-20"></div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-6xl max-h-[80vh] z-10 p-4">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor={getMainColor(true)} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- QUADRANT ANNOTATIONS (Background) --- */}
        <g className="opacity-10 pointer-events-none select-none">
           {/* Top Right: High Energy, High Tech */}
           <text x={width - padding - 20} y={padding + 40} textAnchor="end" className="fill-white text-4xl font-black font-sans uppercase tracking-tighter">Synergized</text>
           <text x={width - padding - 20} y={padding + 70} textAnchor="end" className="fill-white text-sm font-mono tracking-widest">High Development</text>

           {/* Top Left: Low Energy, High Tech */}
           <text x={padding + 20} y={padding + 40} textAnchor="start" className="fill-neon-blue text-4xl font-black font-sans uppercase tracking-tighter">Leapfrog</text>
           <text x={padding + 20} y={padding + 70} textAnchor="start" className="fill-neon-blue text-sm font-mono tracking-widest">Digital First</text>

           {/* Bottom Right: High Energy, Low Tech */}
           <text x={width - padding - 20} y={height - padding - 40} textAnchor="end" className="fill-emerald-600 text-4xl font-black font-sans uppercase tracking-tighter">Legacy Grid</text>
           <text x={width - padding - 20} y={height - padding - 15} textAnchor="end" className="fill-emerald-600 text-sm font-mono tracking-widest">Energy First</text>

           {/* Bottom Left: Low Energy, Low Tech */}
           <text x={padding + 20} y={height - padding - 40} textAnchor="start" className="fill-gray-500 text-4xl font-black font-sans uppercase tracking-tighter">Emerging</text>
           <text x={padding + 20} y={height - padding - 15} textAnchor="start" className="fill-gray-500 text-sm font-mono tracking-widest">Developing</text>

           {/* Center Crosshair */}
           <line x1={width/2} y1={padding} x2={width/2} y2={height-padding} stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
           <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
        </g>

        {/* 1. Regional Connections (The "Constellations") */}
        {REGIONS.map(region => {
          const centroid = regionCentroids[region];
          if (!centroid) return null;
          
          const regionNodes = nodes.filter(n => n.region === region);
          const isRegionHovered = hoveredRegion === region;
          const isDimmed = hoveredRegion && !isRegionHovered;

          return (
            <g key={`lines-${region}`} className={`transition-opacity duration-500 ${isDimmed ? 'opacity-5' : 'opacity-100'}`}>
              {regionNodes.map(node => (
                <line
                  key={`link-${node.id}`}
                  x1={centroid.x}
                  y1={centroid.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={getMainColor(true)}
                  strokeWidth={isRegionHovered ? 1.5 : 0.5}
                  strokeOpacity={isRegionHovered ? 0.6 : 0.15}
                />
              ))}
              {/* Region Label at Centroid */}
              <text
                x={centroid.x}
                y={centroid.y}
                className={`text-[9px] font-mono fill-gray-400 uppercase transition-all duration-300 ${isRegionHovered ? 'opacity-100 font-bold tracking-widest fill-white' : 'opacity-0'}`}
                textAnchor="middle"
                style={{ textShadow: '0 0 4px black' }}
              >
                {region}
              </text>
            </g>
          );
        })}

        {/* 2. Nodes (The Stars) */}
        {nodes.map(node => {
          const isSelected = selectedCountry?.id === node.id;
          const isRegionHovered = hoveredRegion === node.region;
          const isDimmed = hoveredRegion && !isRegionHovered;

          return (
            <g 
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className={`cursor-pointer transition-all duration-500 ease-out ${isDimmed ? 'opacity-10 grayscale' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredRegion(node.region)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={(e) => { e.stopPropagation(); onSelectCountry(node); }}
            >
              {/* Pulsing Aura for high GDP/Population */}
              {node.population > 100 && (
                 <circle r={node.r * 1.5} fill={getMainColor(true)} className="animate-pulse opacity-10" />
              )}
              
              {/* Selection Ring */}
              {isSelected && (
                <circle r={node.r + 12} stroke="white" strokeWidth="1.5" fill="none" className="animate-spin-slow" strokeDasharray="4 2" />
              )}

              {/* Core Node */}
              <circle 
                r={node.r} 
                fill={node.gap > 0 ? '#10b981' : '#3b82f6'} // Keep green/blue logic for gap polarity
                fillOpacity={0.6 + (Math.min(node.gdp, 60)/100)*0.4} // Opacity based on GDP
                stroke="white"
                strokeWidth={isSelected ? 2 : 0}
                className="transition-all duration-300 hover:scale-125 hover:stroke-2 hover:stroke-white/50"
              />
              
              {/* Hover Label */}
              <g className={`transition-opacity duration-300 ${isRegionHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                <rect x={-20} y={-node.r - 24} width={40} height={14} rx={2} fill="rgba(0,0,0,0.8)" />
                <text 
                  y={-node.r - 14} 
                  textAnchor="middle" 
                  className="text-[9px] fill-white font-mono pointer-events-none font-bold"
                >
                  {node.id}
                </text>
              </g>
            </g>
          );
        })}

      </svg>
    </div>
  );
};

export default ConstellationMap;