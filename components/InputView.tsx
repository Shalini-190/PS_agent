import React, { useState } from 'react';

interface Props {
  onAnalyze: (pitch: string) => void;
  isLoading: boolean;
}

const InputView: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [pitch, setPitch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pitch.trim()) {
      onAnalyze(pitch);
    }
  };

  const loadingPhrases = [
    "Crunching the numbers...",
    "Scanning competitor landscape...",
    "Consulting the virtual board...",
    "Measuring market depth...",
    "Checking recent patent filings...",
    "Identifying fatal flaws..."
  ];

  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // Rotate loading phrases
  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingPhraseIndex(prev => (prev + 1) % loadingPhrases.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingPhrases.length]);

  return (
    <div className="w-full max-w-2xl mt-8 animate-fade-in-up">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl shadow-lg mb-6 transform rotate-3 hover:rotate-6 transition-transform">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Founder Reality Check</h1>
          <p className="text-indigo-200 text-lg">
            Validate your startup idea with a brutal, data-driven AI venture analyst using real-time search.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pitch" className="block text-sm font-semibold text-indigo-100 mb-2 uppercase tracking-wide">
              Pitch Your Idea
            </label>
            <textarea
              id="pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="e.g., Uber for dog walking but with a subscription model for premium treats..."
              className="w-full h-40 p-4 rounded-xl border border-white/10 bg-black/20 focus:bg-black/30 text-white placeholder:text-white/30 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none shadow-inner"
              disabled={isLoading}
            />
             <p className="text-xs text-indigo-300 mt-2 text-right font-medium">
              Be specific. Include traction, revenue, or tech details for a "GO".
            </p>
          </div>

          <button
            type="submit"
            disabled={!pitch.trim() || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-xl ${
              !pitch.trim() || isLoading
                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white border border-white/20 hover:shadow-pink-500/25'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingPhrases[loadingPhraseIndex]}
              </span>
            ) : (
              "Roast My Idea"
            )}
          </button>
        </form>
        
        {!isLoading && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest text-center mb-4">Try a Sample Pitch</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setPitch("A social network for hamsters.")} className="text-xs bg-white/5 hover:bg-white/20 text-indigo-100 px-4 py-2 rounded-full border border-white/10 transition-all">
                🐹 Hamster Social
              </button>
               <button onClick={() => setPitch("A B2B AI platform automating medical coding for hospitals. We have $50k MRR, 3 signed hospital networks, and 15% MoM growth. Our tech reduces claim denials by 40% verified by pilot data.")} className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 px-4 py-2 rounded-full border border-blue-500/30 transition-all font-semibold">
                🚀 High-Growth SaaS
              </button>
               <button onClick={() => setPitch("Proprietary solid-state battery electrolyte that increases EV range by 40% and charges in 10 minutes. We have 3 signed LOIs from major auto OEMs worth $20M. 3 patents granted. Team includes ex-Tesla battery leads and Stanford PhDs.")} className="text-xs bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-100 px-4 py-2 rounded-full border border-emerald-500/30 transition-all font-semibold">
                🔋 Deep Tech
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputView;