export interface Company {
  id: number;
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  market_cap: number;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  pe_ratio: number;
  roe: number;
  description?: string;
  oi_change_percent?: number; // Open Interest Change
}

export interface ExpertOpinion {
  company_id: number;
  overall_rating: number; // 0-100
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  buffett_rating: number;
  buffett_reasoning: string;
  graham_rating: number;
  graham_reasoning: string;
  lynch_rating: number;
  lynch_reasoning: string;
  generated_analysis?: string; // Content from Gemini
}

export interface FinancialMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STOCK_DETAIL = 'STOCK_DETAIL',
  SCREENER = 'SCREENER',
  PORTFOLIO = 'PORTFOLIO',
  ALERTS = 'ALERTS',
  REPORTS = 'REPORTS',
  IPOS = 'IPOS',
  STARTUPS = 'STARTUPS',
  NIFTY_OI = 'NIFTY_OI'
}