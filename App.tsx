import React, { useState } from 'react';
import InputView from './components/InputView';
import AnalysisView from './components/AnalysisView';
import { analyzeStartupIdea } from './services/gemini';
import { AnalysisResult, AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async (pitch: string) => {
    setState({ isLoading: true, error: null, result: null });
    try {
      const result = await analyzeStartupIdea(pitch);
      setState({ isLoading: false, error: null, result });
    } catch (err: any) {
      setState({
        isLoading: false,
        error: err.message || "Something went wrong during analysis. Please try again.",
        result: null
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900 text-slate-50 selection:bg-pink-500 selection:text-white font-sans antialiased">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="relative container mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-screen">
        
        {state.result ? (
          <AnalysisView data={state.result} onReset={handleReset} />
        ) : (
          <InputView onAnalyze={handleAnalyze} isLoading={state.isLoading} />
        )}

        {state.error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/50 backdrop-blur-md rounded-xl flex items-center gap-3 text-red-200">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        <footer className="mt-auto pt-16 text-center text-xs text-indigo-300/60">
          <p>Powered by Google Gemini 2.5 Flash • Market Data via Google Search</p>
        </footer>
      </div>
    </div>
  );
};

export default App;