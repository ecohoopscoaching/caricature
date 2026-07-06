
import React, { useState, useEffect } from 'react';
import { CaricatureStyle, ProcessingState } from './types';
import StyleToggle from './components/StyleToggle';
import ImageUploader from './components/ImageUploader';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<CaricatureStyle>(CaricatureStyle.EGO_DISTORTER);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    resultUrl: null,
  });

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Proceed regardless of immediate check result due to race condition rules
    setHasApiKey(true);
  };

  const handleEnhance = async () => {
    if (!sourceImage) return;

    setState({ isProcessing: true, error: null, resultUrl: null });

    try {
      const result = await geminiService.generateCaricature(sourceImage, selectedStyle);
      setState({ isProcessing: false, error: null, resultUrl: result });
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "";
      
      if (errorMessage.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setState({ 
          isProcessing: false, 
          error: "API Key error. Please re-select your key.", 
          resultUrl: null 
        });
      } else {
        setState({ 
          isProcessing: false, 
          error: "Oops! The ego was too large for Gemini 3 Pro to handle. Try again!", 
          resultUrl: null 
        });
      }
    }
  };

  const handleReset = () => {
    setState({ isProcessing: false, error: null, resultUrl: null });
    setSourceImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass max-w-xl p-12 rounded-[3rem] shadow-2xl border-2 border-white/20 animate-in fade-in zoom-in duration-500">
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Activate The Pro Ego</h2>
          <p className="text-blue-100/70 mb-8 text-lg leading-relaxed">
            To use Gemini 3 Pro for ultra-distorted masterpieces, you need to connect your own API key from a paid GCP project.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-300 hover:text-white underline text-sm transition-colors"
            >
              Learn about billing requirements
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for initial check
  if (hasApiKey === null) return null;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 selection:bg-blue-400 selection:text-navy-900">
      {/* Header Section */}
      <header className="pt-16 pb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-400/10 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-white">CARICATURIST</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-blue-400/20 text-blue-300 text-xs font-black px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-widest">Powered by Gemini 3 Pro</span>
        </div>
        <p className="text-blue-100/70 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
          The world's first AI-powered comedy mirror. <br className="hidden md:block" />
          Distort your reality into a hilarious masterpiece.
        </p>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto space-y-16">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-10">
            <div className="glass p-8 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-2xl rounded-full group-hover:bg-blue-400/10 transition-colors"></div>
              <h2 className="text-white text-3xl font-black mb-6 flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-400 text-navy-900 flex items-center justify-center text-lg font-black shadow-lg shadow-blue-400/20">1</span>
                Style Selection
              </h2>
              <StyleToggle 
                selectedStyle={selectedStyle} 
                onSelect={setSelectedStyle} 
              />
            </div>
          </div>

          {/* Upload Column */}
          <div className="lg:col-span-5">
            <div className="glass p-8 rounded-[2rem] h-full flex flex-col group">
              <h2 className="text-white text-3xl font-black mb-6 flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-400 text-navy-900 flex items-center justify-center text-lg font-black shadow-lg shadow-blue-400/20">2</span>
                The Victim
              </h2>
              <div className="flex-grow flex items-center justify-center">
                <ImageUploader 
                  previewUrl={sourceImage} 
                  onImageSelect={setSourceImage} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <section className="flex flex-col items-center py-8">
          <div className="relative group">
            {sourceImage && !state.isProcessing && (
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            )}
            <button
              onClick={handleEnhance}
              disabled={!sourceImage || state.isProcessing}
              className={`
                relative px-16 py-6 rounded-full font-black text-2xl tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-4
                ${!sourceImage 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/10' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-2xl hover:scale-105 active:scale-95'}
              `}
            >
              {state.isProcessing ? (
                <>
                  <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pro-Distorting...
                </>
              ) : 'Enhance the Ego'}
            </button>
          </div>

          {state.error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-200 px-8 py-4 rounded-2xl animate-in slide-in-from-top-4">
              <p className="font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {state.error}
              </p>
            </div>
          )}
        </section>

        {/* Result Showcase */}
        {state.resultUrl && (
          <section id="result-section" className="pt-8 pb-20 animate-in fade-in zoom-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
            <div className="glass p-10 md:p-16 rounded-[4rem] max-w-5xl mx-auto shadow-[0_0_100px_rgba(96,165,250,0.2)] relative overflow-hidden border-2 border-white/10">
               {/* Ambient Glows */}
               <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 blur-[100px] -z-10"></div>
               <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10"></div>

               <div className="flex flex-col items-center">
                  <div className="w-full max-w-2xl aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] mb-12 border-4 border-white/5 ring-1 ring-white/20 group">
                    <img src={state.resultUrl} alt="Your Caricature" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = state.resultUrl!;
                        link.download = `pro-ego-${selectedStyle.toLowerCase()}.png`;
                        link.click();
                      }}
                      className="flex-1 bg-white text-navy-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download
                    </button>
                    <button 
                      onClick={handleReset}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all border border-white/20 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                    >
                      Reset Victim
                    </button>
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* Loading Messages */}
        {state.isProcessing && (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
            <p className="text-blue-200/60 font-medium italic animate-pulse px-6">
              {["Consulting the high-pro distortion field...", "Applying advanced comedic theory...", "Gemini 3 Pro is exaggerating your nose...", "Calculating peak ridiculousness...", "Warping reality with 1K precision..."][Math.floor(Date.now() / 2000) % 5]}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-32 text-center pb-12 border-t border-white/5 pt-12">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-white/20 uppercase tracking-[0.8em] text-[10px] font-black mb-8">Powered by EcoHoops Intelligent Vision x Gemini 3 Pro</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
            <span className="text-white font-black text-2xl italic tracking-tighter">GENESIS</span>
            <span className="text-white font-black text-2xl italic tracking-tighter">KINETIC</span>
            <span className="text-white font-black text-2xl italic tracking-tighter">LEGACY</span>
            <span className="text-white font-black text-2xl italic tracking-tighter">VISION</span>
          </div>
          <p className="mt-12 text-blue-100/20 text-xs font-medium">© {new Date().getFullYear()} The Caricaturist Studio. Embrace the Absurd.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
