import React, { useState } from 'react';
import { ViewMode, CountryData, VisualizationConfig } from './types';
import { DATA } from './data';
import TeeterSeesaw from './components/TeeterSeesaw';
import SignalLanes from './components/SignalLanes';
import ConstellationMap from './components/ConstellationMap';
import InfoPanel from './components/InfoPanel';
import VeoStudio from './components/VeoStudio';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.REPORT); // Default to Report Mode for assignment submission
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [config, setConfig] = useState<VisualizationConfig>({
    showLabels: true,
    showGrid: true,
    accentColor: 'cyan',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-screen h-screen flex flex-col bg-navy-dark text-slate-200 overflow-hidden font-sans selection:bg-neon-cyan selection:text-black print:h-auto print:overflow-visible`}>
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 z-20 bg-navy-dark/90 backdrop-blur-md shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-magenta rounded-md flex items-center justify-center shadow-glow animate-pulse">
            <span className="font-bold text-black text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-sm md:text-base font-mono">DIGITAL DIVIDE ATLAS</h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider">MULTIDIMENSIONAL INFRASTRUCTURE VISUALIZER</p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex bg-gray-900/80 p-1 rounded-lg border border-gray-700 backdrop-blur-sm gap-1">
           <button 
            onClick={() => setViewMode(ViewMode.REPORT)}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${viewMode === ViewMode.REPORT ? 'bg-emerald-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}
          >
            FULL REPORT
          </button>
           <div className="w-px bg-gray-700 mx-1"></div>
           <button 
            onClick={() => setViewMode(ViewMode.CONSTELLATION)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${viewMode === ViewMode.CONSTELLATION ? 'bg-indigo-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}
          >
            CONSTELLATION
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.TEETER)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${viewMode === ViewMode.TEETER ? 'bg-indigo-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}
          >
            GRAVITY
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.LANES)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${viewMode === ViewMode.LANES ? 'bg-indigo-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'}`}
          >
            LINEAR
          </button>
           <button 
            onClick={() => setViewMode(ViewMode.VEO_STUDIO)}
            className={`ml-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-2 ${viewMode === ViewMode.VEO_STUDIO ? 'bg-gradient-to-r from-neon-magenta to-purple-600 text-white shadow-glow-magenta' : 'text-gray-400 hover:text-white border-l border-gray-700'}`}
          >
            <span>VEO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </button>
        </div>

        {/* Settings / Actions */}
        <div className="hidden md:flex items-center gap-4">
          {viewMode === ViewMode.REPORT && (
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-neon-cyan text-xs font-mono rounded border border-gray-700 transition-colors"
            >
              <span>🖨 SAVE PDF</span>
            </button>
          )}
          <div className="flex gap-2">
            {['cyan', 'magenta', 'blue'].map(c => (
              <button 
                key={c}
                onClick={() => setConfig({...config, accentColor: c as any})}
                className={`w-3 h-3 rounded-full border border-gray-600 transition-transform hover:scale-125 ${config.accentColor === c ? 'ring-2 ring-white scale-125' : ''}`}
                style={{ backgroundColor: c === 'cyan' ? '#00f3ff' : c === 'magenta' ? '#ff00ff' : '#0066ff'}}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative print:overflow-visible print:h-auto print:block">
        {/* Visualization Canvas */}
        <div className={`flex-1 relative h-full transition-all duration-500 ${selectedCountry ? 'mr-0 md:mr-80' : ''} print:mr-0 print:h-auto`}>
          
          {/* REPORT MODE: A Single Scrollable Page */}
          {viewMode === ViewMode.REPORT ? (
             <div className="w-full h-full overflow-y-auto scroll-smooth print:overflow-visible print:h-auto">
                <div className="max-w-6xl mx-auto p-8 pb-32 space-y-20 print:p-0 print:space-y-10">
                    
                    {/* Intro Section */}
                    <div className="text-center py-20 space-y-6 border-b border-gray-800 print:py-10 print:border-none">
                        <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-mono text-xs mb-4 print:border-black print:text-black">
                            FINAL VISUALIZATION PROJECT
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] print:text-black print:drop-shadow-none">
                            THE DIGITAL DIVIDE
                        </h1>
                        <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed print:text-gray-600">
                            Analysing the disparity between <span className="text-emerald-400 font-bold print:text-emerald-700">Physical Energy Infrastructure</span> and <span className="text-blue-400 font-bold print:text-blue-700">Digital Connectivity</span> across the globe.
                        </p>
                    </div>

                    {/* Chart 1: Constellation */}
                    <section className="space-y-4 print:break-inside-avoid">
                        <div className="flex items-end justify-between border-l-4 border-neon-cyan pl-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white print:text-black">01. Constellation Map</h2>
                                <p className="text-gray-400 text-sm mt-1 print:text-gray-600">Global distribution of infrastructure correlation. X: Energy, Y: Digital.</p>
                            </div>
                        </div>
                        <div className="h-[700px] w-full border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative bg-navy-dark print:border-gray-300 print:shadow-none">
                             <ConstellationMap 
                                data={DATA}
                                onSelectCountry={setSelectedCountry}
                                selectedCountry={selectedCountry}
                                accentColor={config.accentColor}
                            />
                        </div>
                    </section>

                    {/* Chart 2: Gravity */}
                    <section className="space-y-4 print:break-inside-avoid">
                         <div className="flex items-end justify-between border-l-4 border-emerald-500 pl-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white print:text-black">02. Infrastructure Gravity</h2>
                                <p className="text-gray-400 text-sm mt-1 print:text-gray-600">Balancing population scale (height) against the connectivity gap (position).</p>
                            </div>
                        </div>
                        <div className="h-[600px] w-full border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative bg-navy-dark print:border-gray-300 print:shadow-none">
                            <TeeterSeesaw 
                                data={DATA} 
                                onSelectCountry={setSelectedCountry} 
                                selectedCountry={selectedCountry}
                                accentColor={config.accentColor}
                            />
                        </div>
                    </section>

                    {/* Chart 3: Linear */}
                    <section className="space-y-4 print:break-inside-avoid">
                        <div className="flex items-end justify-between border-l-4 border-neon-magenta pl-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white print:text-black">03. Regional Lanes</h2>
                                <p className="text-gray-400 text-sm mt-1 print:text-gray-600">Linear comparative analysis grouped by geopolitical regions.</p>
                            </div>
                        </div>
                        <div className="h-[500px] w-full border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative bg-navy-dark print:border-gray-300 print:shadow-none">
                             <SignalLanes 
                                data={DATA} 
                                onSelectCountry={setSelectedCountry} 
                                selectedCountry={selectedCountry}
                            />
                        </div>
                    </section>
                    
                    {/* Footer */}
                    <footer className="text-center text-gray-600 text-xs font-mono pt-20 print:pt-10">
                        <p>GENERATED WITH GOOGLE GEMINI API & REACT</p>
                        <p>2025 DIGITAL ATLAS PROJECT</p>
                    </footer>
                </div>
             </div>
          ) : (
            /* Single View Modes */
            <div className="w-full h-full animate-fade-in print:hidden">
                {viewMode === ViewMode.CONSTELLATION && (
                <ConstellationMap
                    data={DATA}
                    onSelectCountry={setSelectedCountry}
                    selectedCountry={selectedCountry}
                    accentColor={config.accentColor}
                />
                )}

                {viewMode === ViewMode.TEETER && (
                <TeeterSeesaw 
                    data={DATA} 
                    onSelectCountry={setSelectedCountry} 
                    selectedCountry={selectedCountry}
                    accentColor={config.accentColor}
                />
                )}

                {viewMode === ViewMode.LANES && (
                <SignalLanes 
                    data={DATA} 
                    onSelectCountry={setSelectedCountry} 
                    selectedCountry={selectedCountry}
                />
                )}

                {viewMode === ViewMode.VEO_STUDIO && (
                <VeoStudio />
                )}
            </div>
          )}

        </div>

        {/* Right Info Panel (Overlay or Fixed) */}
        {/* Hidden in print mode to avoid covering content */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-80 bg-navy-dark/95 backdrop-blur-xl border-l border-gray-800 transform transition-transform duration-300 z-30 shadow-2xl print:hidden
            ${selectedCountry ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <InfoPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
        </div>
      </main>
    </div>
  );
};

export default App;