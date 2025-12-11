import React, { useState } from 'react';
import { generateVeoVideo } from '../services/geminiService';

const VeoStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [hasKey, setHasKey] = useState(false);

  React.useEffect(() => {
    // Check if user has selected an API key
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback for dev environment without the wrapper
        setHasKey(!!process.env.API_KEY); 
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const uri = await generateVeoVideo(selectedFile, prompt, aspectRatio);
      
      // If we are in an environment where we need to append the key manually to fetch:
      // Note: The download link from generateVideos typically needs authentication. 
      // In the provided guidance: "The response.body contains the MP4 bytes. You must append an API key when fetching from the download link."
      // Since we can't easily access the raw key string in some environments if it's hidden, 
      // we rely on process.env.API_KEY if available.
      
      const apiKey = process.env.API_KEY;
      const fetchUrl = apiKey ? `${uri}&key=${apiKey}` : uri;
      
      // Fetch the video to create a local blob URL for smoother playback
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('Failed to download generated video');
      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      setVideoUrl(localUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-center justify-start overflow-y-auto">
      <div className="max-w-2xl w-full bg-navy-dark/50 border border-gray-800 p-8 rounded-xl shadow-2xl relative">
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-neon-magenta"></div>
        
        <h2 className="text-2xl font-bold text-white mb-2 font-mono">Veo Creative Studio</h2>
        <p className="text-gray-400 mb-6 text-sm">Upload a static map or image and use AI to animate the infrastructure narrative.</p>

        {!hasKey && (
           <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm">
             <p className="mb-2">Veo generation requires a paid API key.</p>
             <button 
               onClick={handleSelectKey}
               className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded"
             >
               Select API Key
             </button>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="ml-4 underline opacity-70">Billing Info</a>
           </div>
        )}

        <div className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-xs font-mono text-neon-cyan mb-2">SOURCE IMAGE</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-neon-cyan hover:file:bg-gray-700 cursor-pointer"
            />
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-mono text-neon-magenta mb-2">ANIMATION PROMPT (OPTIONAL)</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Cinematic pan of the glowing digital networks..."
              className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-neon-magenta transition-colors"
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="flex gap-4">
             <div>
                <label className="block text-xs font-mono text-gray-500 mb-2">ASPECT RATIO</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                </select>
             </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating || !hasKey}
            className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all
              ${!selectedFile || !hasKey ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 
                isGenerating ? 'bg-gray-800 text-white animate-pulse' : 'bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue bg-[length:200%_auto] hover:bg-[center_right] text-black shadow-glow'}
            `}
          >
            {isGenerating ? 'Generating Video (This may take a minute)...' : 'Generate with Veo'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-sm">
              Error: {error}
            </div>
          )}

          {videoUrl && (
            <div className="mt-8 animate-fade-in">
              <label className="block text-xs font-mono text-green-400 mb-2">RESULT</label>
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full rounded-lg border border-gray-700 shadow-2xl"
              />
              <a 
                href={videoUrl} 
                download="veo-generation.mp4"
                className="inline-block mt-4 text-xs text-neon-cyan underline hover:text-white"
              >
                Download Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeoStudio;