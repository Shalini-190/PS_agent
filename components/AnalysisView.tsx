import React from 'react';
import { AnalysisResult, Recommendation } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

const getRecommendationColor = (rec: Recommendation) => {
  switch (rec) {
    case Recommendation.GO: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case Recommendation.ITERATE: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case Recommendation.NO_GO: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    default: return 'text-gray-400';
  }
};

const AnalysisView: React.FC<Props> = ({ data, onReset }) => {
  const scoreColor = data.marketRealismScore > 75 ? '#34d399' : data.marketRealismScore > 40 ? '#fbbf24' : '#f43f5e';
  
  const chartData = [
    { name: 'Score', value: data.marketRealismScore },
    { name: 'Remaining', value: 100 - data.marketRealismScore },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in-up">
      
      {/* Header & Verdict */}
      <div className="flex flex-col md:flex-row gap-6 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Final Verdict</h2>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>
          
          <div className={`inline-flex items-center px-6 py-3 rounded-xl border-2 text-4xl font-black mb-4 ${getRecommendationColor(data.recommendation)}`}>
            {data.recommendation}
          </div>
          <p className="text-lg text-slate-200 leading-relaxed font-light">"{data.reasoning}"</p>
        </div>

        {/* Score Gauge */}
        <div className="flex flex-col items-center justify-center bg-black/20 rounded-2xl p-6 min-w-[200px]">
           <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                  paddingAngle={5}
                >
                  <Cell fill={scoreColor} />
                  <Cell fill="rgba(255,255,255,0.1)" />
                </Pie>
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="white">
                  {data.marketRealismScore}
                </text>
                <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold uppercase" fill="rgba(255,255,255,0.5)">
                  Realism
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Market Reality Check */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
               <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h3 className="font-bold text-lg text-white">Market Reality</h3>
          </div>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">{data.scoreJustification}</p>
          
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">Competitive Landscape</h4>
          <div className="flex flex-wrap gap-2">
            {data.competitors.map((comp, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 text-slate-200 text-xs rounded-full border border-white/5 hover:border-white/20 transition-colors cursor-default">
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="bg-white/5 backdrop-blur-md border border-rose-500/20 p-6 rounded-2xl hover:bg-rose-900/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg className="w-24 h-24 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          </div>
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-rose-500/20 rounded-lg">
               <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">Red Flags & Risks</h3>
          </div>
          <ul className="space-y-3 relative z-10">
            {data.redFlags.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="text-rose-500 mt-0.5 text-lg">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Execution Plan - NEW SECTION */}
      <div className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
           </div>
           <h3 className="font-bold text-2xl text-white">Execution Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Tech Stack */}
           <div className="space-y-2">
             <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Build Strategy</h4>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-sm text-slate-300 mb-2 font-semibold">Recommended Stack</p>
                <p className="text-sm text-slate-400">{data.executionPlan?.techStackRecommendation || "No specific stack recommended."}</p>
                <div className="mt-3">
                   <p className="text-sm text-slate-300 mb-1 font-semibold">MVP Features</p>
                   <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {data.executionPlan?.mvpFeatures.map((feat, i) => <li key={i}>{feat}</li>)}
                   </ul>
                </div>
             </div>
           </div>

           {/* GTM */}
           <div className="space-y-2">
             <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Go-To-Market</h4>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 h-full">
                <p className="text-sm text-slate-300 mb-2 font-semibold">Primary Channel</p>
                <p className="text-sm text-emerald-400 font-medium mb-3">{data.executionPlan?.salesChannel}</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focus all energy here. Do not diversify until you have 10 paying customers.
                </p>
             </div>
           </div>

           {/* Next Steps */}
           <div className="space-y-2">
             <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">First 30 Days</h4>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 h-full flex flex-col justify-center">
                <ul className="space-y-3">
                  {data.executionPlan?.firstMonthGoals.map((goal, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 flex-shrink-0">
                        {i+1}
                      </div>
                      {goal}
                    </li>
                  ))}
                </ul>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assumptions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-amber-500/20 rounded-lg">
               <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             </div>
            <h3 className="font-bold text-lg text-white">Hidden Assumptions</h3>
          </div>
           <ul className="space-y-2">
            {data.coreAssumptions.map((assumption, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-500 font-bold text-xs mt-0.5">?</span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>

        {/* Pivot Suggestions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-pink-500/20 rounded-lg">
                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
            <h3 className="font-bold text-lg text-white">Pivot & Improve</h3>
          </div>
          <div className="space-y-3">
            {data.pivotSuggestions.map((suggestion, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-lg text-sm text-indigo-100 border border-white/10">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources - NEW SECTION */}
      {data.sources && data.sources.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Market Data Sources</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/5 group"
              >
                <div className="p-1.5 bg-white/10 rounded-md text-slate-400 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">{source.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{new URL(source.url).hostname}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <button
          onClick={onReset}
          className="group text-indigo-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 mx-auto px-6 py-2 rounded-full hover:bg-white/5"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Check Another Idea
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;