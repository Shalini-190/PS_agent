export enum Recommendation {
  GO = 'GO',
  ITERATE = 'ITERATE',
  NO_GO = 'NO-GO'
}

export interface ExecutionPlan {
  techStackRecommendation: string;
  mvpFeatures: string[];
  salesChannel: string;
  firstMonthGoals: string[];
}

export interface Source {
  title: string;
  url: string;
}

export interface AnalysisResult {
  marketRealismScore: number;
  scoreJustification: string;
  coreAssumptions: string[];
  redFlags: string[];
  competitors: string[];
  pivotSuggestions: string[];
  recommendation: Recommendation;
  reasoning: string;
  executionPlan: ExecutionPlan;
  sources: Source[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}