import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  PieChart, 
  ListFilter, 
  Bell, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Menu,
  X,
  User,
  ArrowRight,
  BrainCircuit,
  FileText,
  RefreshCcw,
  Trash2,
  Plus,
  Download,
  Calendar,
  Briefcase,
  Rocket,
  Activity,
  BarChart3,
  Newspaper,
  Gavel,
  LogOut
} from 'lucide-react';
import { ViewState, Company, ExpertOpinion } from './types';
import { StockChart } from './components/StockChart';
import { generateStockAnalysis, getExpertScoreAnalysis } from './services/geminiService';

// --- MOCK DATA GENERATORS ---

const MOCK_COMPANIES: Company[] = [
  { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', industry: 'Oil & Gas', market_cap: 1700000, current_price: 2450.50, price_change: 25.40, price_change_percent: 1.05, pe_ratio: 24.5, roe: 14.2 },
  { id: 2, symbol: 'TCS', name: 'Tata Consultancy Svcs', sector: 'Technology', industry: 'IT Services', market_cap: 1200000, current_price: 3890.00, price_change: -12.30, price_change_percent: -0.32, pe_ratio: 31.2, roe: 38.5 },
  { id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Finance', industry: 'Banking', market_cap: 950000, current_price: 1650.75, price_change: 10.15, price_change_percent: 0.62, pe_ratio: 19.8, roe: 16.8 },
  { id: 4, symbol: 'INFY', name: 'Infosys Limited', sector: 'Technology', industry: 'IT Services', market_cap: 650000, current_price: 1420.20, price_change: -5.50, price_change_percent: -0.39, pe_ratio: 26.4, roe: 29.1 },
  { id: 5, symbol: 'ITC', name: 'ITC Limited', sector: 'Consumer', industry: 'FMCG', market_cap: 540000, current_price: 435.60, price_change: 2.10, price_change_percent: 0.48, pe_ratio: 28.1, roe: 24.5 },
];

const MOCK_STARTUPS: Company[] = [
  { 
    id: 201, 
    symbol: 'ZEPTO', 
    name: 'Zepto', 
    sector: 'Consumer', 
    industry: 'Quick Commerce', 
    market_cap: 11600, 
    current_price: 1250, 
    price_change: 150, 
    price_change_percent: 12.5, 
    pe_ratio: 0, 
    roe: -12.5,
    description: "Zepto is India's fastest growing quick-commerce app delivering groceries and essentials in 10 minutes. Founded by Aadit Palicha and Kaivalya Vohra, it has revolutionized last-mile delivery with its dark store network." 
  },
  { 
    id: 202, 
    symbol: 'PHYSICSWALLAH', 
    name: 'PhysicsWallah', 
    sector: 'EdTech', 
    industry: 'Education', 
    market_cap: 9100, 
    current_price: 850, 
    price_change: 45, 
    price_change_percent: 5.5, 
    pe_ratio: 45.2, 
    roe: 18.2,
    description: "An Indian educational technology company that provides affordable and comprehensive learning resources for students preparing for JEE, NEET, and other competitive exams. Known for its strong community and profitability."
  },
  { 
    id: 203, 
    symbol: 'CRED', 
    name: 'CRED', 
    sector: 'Fintech', 
    industry: 'Payments', 
    market_cap: 53000, 
    current_price: 420, 
    price_change: -10, 
    price_change_percent: -2.3, 
    pe_ratio: 0, 
    roe: -8.5,
    description: "CRED is a members-only credit card bill payment platform that rewards members for clearing their credit card bills on time. It offers a premium lifestyle experience for high-trust individuals."
  },
  { 
    id: 204, 
    symbol: 'LENSKART', 
    name: 'Lenskart', 
    sector: 'Retail', 
    industry: 'Eyewear', 
    market_cap: 37000, 
    current_price: 2100, 
    price_change: 12, 
    price_change_percent: 0.6, 
    pe_ratio: 0, 
    roe: -5.1,
    description: "Lenskart is an Indian optical prescription eyewear retail chain. As of 2023, Lenskart has over 2,000 stores in India and is one of the leading omni-channel eyewear brands in Asia."
  },
  { 
    id: 205, 
    symbol: 'GROWW', 
    name: 'Groww', 
    sector: 'Fintech', 
    industry: 'Investment', 
    market_cap: 24900, 
    current_price: 180, 
    price_change: 5, 
    price_change_percent: 2.8, 
    pe_ratio: 32.5, 
    roe: 12.4,
    description: "Groww is an online investment platform that allows investors to invest in Mutual Funds and Stocks. It aims to make investment simple and accessible to everyone in India."
  }
];

const MOCK_NIFTY_OI_STOCKS: Company[] = [
  { id: 301, symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Services', industry: 'Trading', market_cap: 280000, current_price: 3150.00, price_change: 85.00, price_change_percent: 2.7, pe_ratio: 120.5, roe: 9.8, oi_change_percent: 12.5 },
  { id: 302, symbol: 'SBIN', name: 'State Bank of India', sector: 'Finance', industry: 'Public Sector Bank', market_cap: 540000, current_price: 620.50, price_change: 15.20, price_change_percent: 2.5, pe_ratio: 9.8, roe: 16.5, oi_change_percent: 9.8 },
  { id: 303, symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Finance', industry: 'Banking', market_cap: 720000, current_price: 1050.25, price_change: -10.50, price_change_percent: -0.9, pe_ratio: 18.5, roe: 17.2, oi_change_percent: 8.2 },
  { id: 304, symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', industry: 'Automobiles', market_cap: 310000, current_price: 950.00, price_change: 25.00, price_change_percent: 2.7, pe_ratio: 18.2, roe: 22.5, oi_change_percent: 15.3 },
  { id: 305, symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance', industry: 'NBFC', market_cap: 450000, current_price: 7200.00, price_change: 150.00, price_change_percent: 2.1, pe_ratio: 35.5, roe: 23.5, oi_change_percent: 7.5 },
];

const UPCOMING_IPOS = [
  { 
    id: 1, 
    symbol: 'NOVATECH',
    name: 'NovaTech Solutions', 
    sector: 'Technology',
    industry: 'Software',
    market_cap: 4500,
    current_price: 480, // Upper band as reference
    price_change: 0,
    price_change_percent: 0,
    pe_ratio: 0,
    roe: 18.5,
    description: "NovaTech Solutions is a leading provider of enterprise AI solutions. This Mainboard IPO is aimed at funding global expansion and R&D facilities.",
    openDate: 'Oct 28', 
    closeDate: 'Oct 30', 
    priceBand: '₹450 - ₹480', 
    issueSize: '₹1,200 Cr', 
    status: 'Open', 
    minInvestment: '₹14,400' 
  },
  { 
    id: 2, 
    symbol: 'GREENEARTH',
    name: 'GreenEarth Energy', 
    sector: 'Energy',
    industry: 'Renewables',
    market_cap: 2800,
    current_price: 125,
    price_change: 0,
    price_change_percent: 0,
    pe_ratio: 0,
    roe: 12.4,
    description: "GreenEarth Energy operates solar and wind power plants across Western India with a total capacity of 500MW.",
    openDate: 'Nov 02', 
    closeDate: 'Nov 05', 
    priceBand: '₹110 - ₹125', 
    issueSize: '₹850 Cr', 
    status: 'Upcoming', 
    minInvestment: '₹13,750' 
  },
  { 
    id: 3, 
    symbol: 'URBANLOG',
    name: 'Urban Logistics Ltd', 
    sector: 'Services',
    industry: 'Logistics',
    market_cap: 1500,
    current_price: 225,
    price_change: 0,
    price_change_percent: 0,
    pe_ratio: 0,
    roe: 9.8,
    description: "Urban Logistics specializes in last-mile delivery solutions for e-commerce giants and hyperlocal delivery networks.",
    openDate: 'Nov 10', 
    closeDate: 'Nov 12', 
    priceBand: '₹210 - ₹225', 
    issueSize: '₹500 Cr', 
    status: 'Upcoming', 
    minInvestment: '₹14,175' 
  },
];

const CLOSED_IPOS = [
  { id: 101, name: 'Quantum Defence', listingDate: '15 Oct 2023', issuePrice: 175, listingPrice: 320, gain: 82.8 },
  { id: 102, name: 'BlueSky Airlines', listingDate: '10 Oct 2023', issuePrice: 650, listingPrice: 680, gain: 4.6 },
  { id: 103, name: 'MediCare Plus', listingDate: '01 Oct 2023', issuePrice: 400, listingPrice: 380, gain: -5.0 },
  { id: 104, name: 'Electro Mobility', listingDate: '25 Sep 2023', issuePrice: 76, listingPrice: 155, gain: 103.9 },
];

const getMockNews = (companyName: string) => [
  { 
    id: 1, 
    title: `${companyName} reports strong 12% YoY growth in quarterly revenue, beating street estimates`, 
    date: '2 hours ago', 
    type: 'Earnings',
    sentiment: 'positive'
  },
  { 
    id: 2, 
    title: `Supreme Court admits petition regarding environmental compliance in new manufacturing plant`, 
    date: '1 day ago', 
    type: 'Legal',
    sentiment: 'negative'
  },
  { 
    id: 3, 
    title: `Annual General Meeting (AGM) scheduled for next month to discuss global expansion plans`, 
    date: '3 days ago', 
    type: 'Event',
    sentiment: 'neutral'
  },
  { 
    id: 4, 
    title: `Market rumors suggest potential strategic partnership with European rival`, 
    date: '5 days ago', 
    type: 'News',
    sentiment: 'neutral'
  },
];

const generateChartData = (basePrice: number, period: '1D' | '1W' | '1M' | '6M' = '1M') => {
  const data = [];
  let current = basePrice * 0.8;
  const now = new Date();
  
  let days = 30;
  if (period === '1D') days = 1; 
  if (period === '1W') days = 7;
  if (period === '1M') days = 30;
  if (period === '6M') days = 180;
  
  const points = period === '1D' ? 24 : days; 

  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    if (period === '1D') {
        date.setHours(date.getHours() - i);
    } else {
        date.setDate(date.getDate() - i);
    }
    
    const volatility = period === '1D' ? 0.005 : 0.05;
    const change = (Math.random() - 0.48) * (basePrice * volatility);
    current += change;
    
    let dateStr = '';
    if (period === '1D') dateStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    else if (period === '6M') dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    else dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

    data.push({
      date: dateStr,
      value: Number(current.toFixed(2))
    });
  }
  return data;
};

// --- COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border border-transparent ${
      active 
        ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20 shadow-[0_0_15px_rgba(0,224,255,0.1)]' 
        : 'text-gray-400 hover:bg-dark-hover hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const MetricCard = ({ label, value, trend, subLabel }: { label: string, value: string, trend?: number, subLabel?: string }) => (
  <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg">
    <div className="text-sm text-gray-400 font-medium mb-2">{label}</div>
    <div className="flex items-end justify-between">
      <div className="text-2xl font-bold font-mono text-white tracking-tight">{value}</div>
      {trend !== undefined && (
        <div className={`flex items-center text-sm font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    {subLabel && <div className="text-xs text-gray-500 mt-2">{subLabel}</div>}
  </div>
);

const ExpertGauge = ({ score, expert, reasoning }: { score: number, expert: string, reasoning: string }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (s >= 50) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (s >= 50) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="p-5 rounded-xl border border-dark-border bg-dark-card/50 hover:bg-dark-card transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-white text-lg">{expert} Model</h4>
          <span className="text-xs text-gray-400">Analysis Strategy</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getColor(score)}`}>
          {score}/100
        </div>
      </div>
      <div className="w-full bg-dark-base h-2 rounded-full mb-4 overflow-hidden border border-dark-border">
        <div 
          className={`h-full rounded-full ${getBarColor(score)} transition-all duration-1000 ease-out relative`} 
          style={{ width: `${score}%` }}
        >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed font-light">
        {reasoning}
      </p>
    </div>
  );
};

// --- PAGES ---

const Dashboard = ({ onSelectStock }: { onSelectStock: (c: Company) => void }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="NIFTY 50" value="21,456.30" trend={0.85} />
        <MetricCard label="SENSEX" value="71,680.15" trend={0.92} />
        <MetricCard label="Portfolio Value" value="₹12.4L" trend={1.2} subLabel="+₹14,230 today" />
        <MetricCard label="Active Alerts" value="3" subLabel="2 price, 1 news" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-dark-card rounded-xl border border-dark-border overflow-hidden shadow-lg">
          <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-card/50">
            <h3 className="font-bold text-lg text-white">Top Movers</h3>
            <button className="text-sm text-brand-cyan font-medium hover:text-white transition-colors">View All</button>
          </div>
          <div className="divide-y divide-dark-border">
            {MOCK_COMPANIES.map((company) => (
              <div 
                key={company.id} 
                onClick={() => onSelectStock(company)}
                className="p-4 flex items-center justify-between hover:bg-dark-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-dark-base flex items-center justify-center text-brand-cyan font-bold text-xs border border-dark-border">
                    {company.symbol.substring(0,2)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{company.symbol}</div>
                    <div className="text-xs text-gray-500">{company.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-white">₹{company.current_price.toLocaleString()}</div>
                  <div className={`text-xs font-semibold ${company.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {company.price_change > 0 ? '+' : ''}{company.price_change_percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between relative overflow-hidden border border-white/10">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="text-yellow-400" fill="currentColor" />
              <h3 className="font-bold text-lg">AI Market Insight</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-light">
              "The IT sector shows resilience despite global headwinds. Banking remains strong due to credit growth. Watch for volatility in Energy stocks this week."
            </p>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors w-full">
              Read Full Report
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-cyan/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

const CompanyDetail = ({ company, onBack }: { company: Company, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'expert'>('overview');
  const [timeFrame, setTimeFrame] = useState<'1D' | '1W' | '1M' | '6M'>('1M');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [buffettReason, setBuffettReason] = useState("Loading analysis...");
  const [grahamReason, setGrahamReason] = useState("Loading analysis...");

  const chartData = React.useMemo(() => 
    generateChartData(company.current_price, timeFrame), 
  [company.current_price, timeFrame]);

  const refreshData = async () => {
    setLoading(true);
    if (aiAnalysis) {
      setBuffettReason("Updating analysis...");
      setGrahamReason("Updating analysis...");
    }

    const analysis = await generateStockAnalysis(company.symbol, company.name, company.current_price);
    setAiAnalysis(analysis);
    
    const bReason = await getExpertScoreAnalysis(company.symbol, 'Buffett');
    const gReason = await getExpertScoreAnalysis(company.symbol, 'Graham');
    setBuffettReason(bReason);
    setGrahamReason(gReason);
    
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [company]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors group">
        <ArrowRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-xl bg-dark-base flex items-center justify-center text-brand-cyan font-bold text-xl border border-dark-border shadow-inner">
            {company.symbol.substring(0,2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{company.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="bg-dark-hover px-2 py-0.5 rounded text-gray-300 border border-dark-border">{company.sector}</span>
              <span>•</span>
              <span>{company.industry}</span>
              {company.pe_ratio === 0 && (
                  <>
                     <span>•</span>
                     <span className="text-brand-purple font-semibold">Startup</span>
                  </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-white">₹{company.current_price.toLocaleString()}</div>
          <div className={`flex items-center justify-end font-semibold ${company.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {company.price_change >= 0 ? <TrendingUp size={18} className="mr-1"/> : <TrendingDown size={18} className="mr-1"/>}
            {company.price_change > 0 ? '+' : ''}{company.price_change} ({company.price_change_percent}%)
          </div>
          <div className="text-xs text-gray-500 mt-1">
             {company.pe_ratio === 0 ? "Latest Valuation" : `As of ${new Date().toLocaleTimeString()}`}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'overview' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('financials')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === 'financials' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Financials
        </button>
        <button 
          onClick={() => setActiveTab('expert')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all flex items-center ${activeTab === 'expert' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          <BrainCircuit size={16} className="mr-2" />
          Expert Engine
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="font-bold text-white">{company.pe_ratio === 0 ? "Valuation Trend" : "Price Performance"}</h3>
                    
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-dark-base p-1 rounded-lg border border-dark-border">
                            {(['1D', '1W', '1M', '6M'] as const).map(tf => (
                                <button 
                                    key={tf}
                                    onClick={() => setTimeFrame(tf)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeFrame === tf ? 'bg-dark-hover text-brand-cyan shadow-sm border border-dark-border' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-1 bg-dark-base p-1 rounded-lg border border-dark-border">
                             <button 
                                onClick={() => setChartType('area')}
                                className={`p-1.5 rounded-md transition-all ${chartType === 'area' ? 'bg-dark-hover text-brand-cyan shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Area Chart"
                             >
                                <TrendingUp size={16} />
                             </button>
                             <button 
                                onClick={() => setChartType('line')}
                                className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-dark-hover text-brand-cyan shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Line Chart"
                             >
                                <Activity size={16} />
                             </button>
                             <button 
                                onClick={() => setChartType('bar')}
                                className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-dark-hover text-brand-cyan shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Bar Chart"
                             >
                                <BarChart3 size={16} />
                             </button>
                        </div>
                    </div>
                </div>
                <StockChart 
                    data={chartData} 
                    type={chartType} 
                    color={company.price_change >= 0 ? '#10B981' : '#EF4444'} 
                />
              </div>

              {/* AI Summary */}
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit size={100} className="text-brand-cyan" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="font-bold text-white flex items-center">
                    <Zap size={18} className="text-brand-cyan mr-2" fill="currentColor" />
                    AI Analysis
                  </h3>
                  {loading && <span className="text-xs text-brand-cyan animate-pulse">Generating insights...</span>}
                </div>
                
                {!loading && aiAnalysis ? (
                  <div className="space-y-4 relative z-10">
                    <p className="text-gray-300 text-sm leading-relaxed">{aiAnalysis.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <div className="text-emerald-400 font-bold text-sm mb-1">Bull Case</div>
                        <p className="text-emerald-200/80 text-xs">{aiAnalysis.bull_case}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <div className="text-red-400 font-bold text-sm mb-1">Bear Case</div>
                        <p className="text-red-200/80 text-xs">{aiAnalysis.bear_case}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-dark-base rounded-lg animate-pulse border border-dark-border"></div>
                )}
              </div>

               {/* Trending News & Events */}
               <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg">
                 <h3 className="font-bold text-white mb-4 flex items-center">
                    <Newspaper size={18} className="mr-2 text-brand-cyan" />
                    Trending News & Corporate Events
                 </h3>
                 <div className="space-y-4">
                    {getMockNews(company.name).map((news) => (
                      <div key={news.id} className="flex items-start space-x-3 pb-3 border-b border-dark-border last:border-0 last:pb-0 hover:bg-dark-hover/50 p-2 rounded-lg transition-colors cursor-pointer">
                          <div className={`mt-1 min-w-[32px] h-8 rounded-lg flex items-center justify-center border ${
                             news.type === 'Legal' ? 'bg-red-900/20 text-red-400 border-red-500/20' :
                             news.type === 'Earnings' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                             news.type === 'Event' ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'
                          }`}>
                             {news.type === 'Legal' ? <Gavel size={14} /> : 
                              news.type === 'Event' ? <Calendar size={14} /> : 
                              <FileText size={14} />}
                          </div>
                          <div>
                             <h4 className="text-sm font-medium text-gray-200 leading-snug hover:text-brand-cyan transition-colors">{news.title}</h4>
                             <div className="flex items-center mt-1 space-x-2">
                                <span className="text-xs font-semibold text-gray-500 bg-dark-base px-1.5 py-0.5 rounded border border-dark-border">{news.type}</span>
                                <span className="text-xs text-gray-600">• {news.date}</span>
                             </div>
                          </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          )}

          {activeTab === 'expert' && (
             <div className="space-y-6">
                <div className="bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 border border-brand-blue/30 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div className="flex items-center space-x-4">
                     <div className="p-3 bg-brand-blue/20 rounded-full text-brand-cyan border border-brand-blue/40">
                       <BrainCircuit size={24} />
                     </div>
                     <div>
                       <h3 className="text-white font-bold">DishaStock Expert Engine</h3>
                       <p className="text-brand-cyan text-sm">We use 5 distinct valuation models to score this {company.pe_ratio === 0 ? "startup" : "stock"}.</p>
                     </div>
                   </div>
                   <button 
                      onClick={refreshData}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-dark-base text-brand-cyan border border-brand-cyan/30 rounded-lg text-sm font-semibold hover:bg-brand-cyan/10 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                      <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                      <span>{loading ? 'Analyzing...' : 'Refresh Analysis'}</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <ExpertGauge 
                     score={82} 
                     expert="Warren Buffett" 
                     reasoning={buffettReason}
                   />
                   <ExpertGauge 
                     score={45} 
                     expert="Benjamin Graham" 
                     reasoning={grahamReason}
                   />
                   <ExpertGauge 
                     score={65} 
                     expert="Peter Lynch" 
                     reasoning="Growth rate is decent relative to PE, but PEG ratio is slightly elevated compared to historical averages for this sector."
                   />
                   <ExpertGauge 
                     score={70} 
                     expert="Jhunjhunwala" 
                     reasoning="Strong bullish momentum and high delivery volume suggest institutional interest is building up."
                   />
                </div>
             </div>
          )}

          {activeTab === 'financials' && (
            <div className="bg-dark-card rounded-xl border border-dark-border shadow-lg overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-dark-base text-gray-400 font-medium">
                   <tr>
                     <th className="px-6 py-4">Metric (Annual)</th>
                     <th className="px-6 py-4 text-right">2021</th>
                     <th className="px-6 py-4 text-right">2022</th>
                     <th className="px-6 py-4 text-right">2023</th>
                     <th className="px-6 py-4 text-right">TTM</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-dark-border">
                   <tr>
                     <td className="px-6 py-4 font-medium text-gray-200">Revenue (Cr)</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">15,400</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">18,200</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">22,500</td>
                     <td className="px-6 py-4 text-right font-mono text-brand-cyan font-bold">24,100</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 font-medium text-gray-200">Net Profit (Cr)</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">2,100</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">2,800</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">3,400</td>
                     <td className="px-6 py-4 text-right font-mono text-brand-cyan font-bold">3,850</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 font-medium text-gray-200">EPS (₹)</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">45.2</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">52.1</td>
                     <td className="px-6 py-4 text-right font-mono text-gray-400">68.4</td>
                     <td className="px-6 py-4 text-right font-mono text-brand-cyan font-bold">72.5</td>
                   </tr>
                 </tbody>
               </table>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg">
             <h3 className="font-bold text-white mb-4">Fundamentals</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-dark-border">
                  <span className="text-gray-400 text-sm">Market Cap</span>
                  <span className="font-mono font-medium text-white">₹{company.market_cap.toLocaleString()}Cr</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-border">
                  <span className="text-gray-400 text-sm">P/E Ratio</span>
                  <span className="font-mono font-medium text-white">{company.pe_ratio === 0 ? 'N/A' : company.pe_ratio}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-border">
                  <span className="text-gray-400 text-sm">ROE</span>
                  <span className={`font-mono font-medium ${company.roe >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{company.roe}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-border">
                  <span className="text-gray-400 text-sm">Div. Yield</span>
                  <span className="font-mono font-medium text-white">0.0%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-border">
                  <span className="text-gray-400 text-sm">Book Value</span>
                  <span className="font-mono font-medium text-white">₹450.20</span>
                </div>
             </div>
          </div>
          
          <button className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold hover:bg-brand-blue/80 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Add to Portfolio
          </button>
          <button className="w-full bg-transparent text-gray-300 border border-dark-border py-3 rounded-lg font-bold hover:bg-dark-hover hover:border-brand-cyan hover:text-white transition-all">
            Set Price Alert
          </button>
        </div>
      </div>
    </div>
  );
};

const Screener = ({ onSelectStock }: { onSelectStock: (c: Company) => void }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Stock Screener</h2>
         <div className="flex space-x-2">
           <button className="px-4 py-2 bg-dark-card border border-dark-border text-gray-300 rounded-lg text-sm font-medium hover:bg-dark-hover transition-colors">Saved Screens</button>
           <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/80 transition-colors shadow-lg">+ New Screen</button>
         </div>
      </div>

      <div className="bg-dark-card p-4 rounded-xl border border-dark-border shadow-lg flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 px-3 py-2 bg-dark-base rounded-md border border-dark-border">
           <span className="text-xs font-bold text-gray-500 uppercase">Sector</span>
           <select className="bg-transparent text-sm font-medium outline-none text-white [&>option]:bg-dark-base">
             <option>All Sectors</option>
             <option>Technology</option>
             <option>Finance</option>
             <option>Energy</option>
           </select>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-dark-base rounded-md border border-dark-border">
           <span className="text-xs font-bold text-gray-500 uppercase">Market Cap</span>
           <select className="bg-transparent text-sm font-medium outline-none text-white [&>option]:bg-dark-base">
             <option>Large Cap</option>
             <option>Mid Cap</option>
             <option>Small Cap</option>
           </select>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-dark-base rounded-md border border-dark-border">
           <span className="text-xs font-bold text-gray-500 uppercase">P/E Ratio</span>
           <select className="bg-transparent text-sm font-medium outline-none text-white [&>option]:bg-dark-base">
             <option>Below 15</option>
             <option>15 - 30</option>
             <option>Above 30</option>
           </select>
        </div>
        <button className="ml-auto text-brand-cyan text-sm font-medium hover:text-white transition-colors">Reset Filters</button>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-dark-base border-b border-dark-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400">Company</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Price</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">P/E</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Market Cap</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Div Yield</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Expert Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {MOCK_COMPANIES.map(company => (
              <tr 
                key={company.id} 
                className="hover:bg-dark-hover transition-colors cursor-pointer group"
                onClick={() => onSelectStock(company)}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-white group-hover:text-brand-cyan transition-colors">{company.symbol}</div>
                  <div className="text-xs text-gray-500">{company.name}</div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-200">₹{company.current_price.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-mono text-gray-200">{company.pe_ratio}</td>
                <td className="px-6 py-4 text-right font-mono text-gray-200">₹{(company.market_cap / 1000).toFixed(1)}T</td>
                <td className="px-6 py-4 text-right font-mono text-gray-200">1.2%</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    company.pe_ratio < 25 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {company.pe_ratio < 25 ? '85/100' : '65/100'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'RELIANCE', condition: 'Price > ₹2,500', status: 'Active', created: '2 days ago' },
    { id: 2, symbol: 'TCS', condition: 'Price < ₹3,800', status: 'Triggered', created: '1 week ago' },
    { id: 3, symbol: 'HDFCBANK', condition: 'PE Ratio < 18', status: 'Active', created: '3 days ago' },
  ]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">My Alerts</h2>
         <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/80 flex items-center shadow-lg">
           <Plus size={16} className="mr-2" /> Create Alert
         </button>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-base border-b border-dark-border">
             <tr>
               <th className="px-6 py-4 font-semibold text-sm text-gray-400">Symbol</th>
               <th className="px-6 py-4 font-semibold text-sm text-gray-400">Condition</th>
               <th className="px-6 py-4 font-semibold text-sm text-gray-400">Status</th>
               <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {alerts.map(alert => (
              <tr key={alert.id} className="hover:bg-dark-hover transition-colors">
                <td className="px-6 py-4 font-bold text-white">{alert.symbol}</td>
                <td className="px-6 py-4 text-gray-300">{alert.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    alert.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Reports = () => {
   const reports = [
     { id: 1, title: 'Daily Market Summary', date: 'Oct 26, 2023', type: 'Market Update' },
     { id: 2, title: 'HDFCBANK Deep Dive Analysis', date: 'Oct 24, 2023', type: 'Stock Analysis' },
     { id: 3, title: 'IT Sector Outlook Q3', date: 'Oct 20, 2023', type: 'Sector Report' },
   ];

   return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Research Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg hover:shadow-xl hover:border-brand-cyan/30 transition-all group">
             <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-cyan mb-4 group-hover:bg-brand-blue/20 transition-colors border border-brand-blue/20">
               <FileText size={24} />
             </div>
             <h3 className="font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">{report.title}</h3>
             <div className="text-sm text-gray-500 mb-4">{report.type} • {report.date}</div>
             <button className="w-full py-2 border border-dark-border rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-hover hover:text-white transition-colors flex items-center justify-center">
               <Download size={16} className="mr-2" /> Download PDF
             </button>
          </div>
        ))}
      </div>
    </div>
   );
};

const IPOSection = ({ onSelectStock }: { onSelectStock: (c: Company) => void }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">IPO Central</h2>
            <div className="flex space-x-2">
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    2 Open Now
                 </span>
            </div>
        </div>

        {/* Upcoming Section */}
        <div className="space-y-4">
             <h3 className="font-bold text-gray-200 text-lg flex items-center">
                <Calendar className="mr-2 text-brand-cyan" size={20}/> Upcoming & Open IPOs
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {UPCOMING_IPOS.map(ipo => (
                    <div key={ipo.id} className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg hover:shadow-xl hover:border-brand-cyan/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-dark-base rounded-lg flex items-center justify-center font-bold text-gray-500 border border-dark-border">
                                {ipo.name.substring(0, 1)}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${ipo.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                {ipo.status}
                            </span>
                        </div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">{ipo.name}</h4>
                        <div className="text-xs text-gray-500 mb-4">Mainboard IPO</div>
                        
                        <div className="space-y-2 text-sm border-t border-dark-border pt-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price Band</span>
                                <span className="font-medium text-gray-300">{ipo.priceBand}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500">Dates</span>
                                <span className="font-medium text-gray-300">{ipo.openDate} - {ipo.closeDate}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500">Min Inv.</span>
                                <span className="font-medium text-gray-300">{ipo.minInvestment}</span>
                            </div>
                        </div>
                        <button 
                           onClick={() => onSelectStock(ipo)}
                           className="w-full mt-4 bg-brand-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-blue/80 transition-colors shadow-lg"
                        >
                            View Details
                        </button>
                    </div>
                ))}
             </div>
        </div>

        {/* Closed/Listed Section */}
        <div className="space-y-4">
            <h3 className="font-bold text-gray-200 text-lg">Recent Listings</h3>
            <div className="bg-dark-card rounded-xl border border-dark-border shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-dark-base border-b border-dark-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-400">Company</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-400">Listing Date</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Issue Price</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Listing Price</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-400 text-right">Listing Gain</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                        {CLOSED_IPOS.map(ipo => (
                            <tr key={ipo.id} className="hover:bg-dark-hover transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{ipo.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{ipo.listingDate}</td>
                                <td className="px-6 py-4 text-sm text-right font-mono text-gray-300">₹{ipo.issuePrice}</td>
                                <td className="px-6 py-4 text-sm text-right font-mono text-gray-300">₹{ipo.listingPrice}</td>
                                <td className={`px-6 py-4 text-sm text-right font-bold ${ipo.gain > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {ipo.gain > 0 ? '+' : ''}{ipo.gain}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

const StartupsSection = ({ onSelectStock }: { onSelectStock: (c: Company) => void }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
       <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-white">Startup Radar</h2>
            <p className="text-gray-400 text-sm mt-1">Discover high-growth private companies and pre-IPO opportunities.</p>
         </div>
         <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/80 shadow-lg">
           Submit Pitch
         </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STARTUPS.map(startup => (
            <div key={startup.id} 
                 onClick={() => onSelectStock(startup)}
                 className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg hover:shadow-xl hover:border-brand-purple/50 transition-all cursor-pointer group"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-500/20">
                        {startup.name.substring(0,1)}
                    </div>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs font-bold border border-indigo-500/30">
                        {startup.market_cap > 8300 ? 'Unicorn' : 'Soonicorn'}
                    </span>
                </div>
                
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-brand-purple transition-colors">{startup.name}</h3>
                <div className="flex items-center text-xs text-gray-400 mb-3">
                    <span>{startup.industry}</span>
                    <span className="mx-2">•</span>
                    <span>Valuation: ₹{(startup.market_cap / 100).toFixed(1)}B</span>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 h-16 leading-relaxed">
                    {startup.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div className="text-xs font-semibold text-gray-500">
                        Expert Rating
                    </div>
                    <div className="flex items-center text-indigo-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        View Analysis <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

const NiftyOISection = () => {
    const [selectedStock, setSelectedStock] = useState<Company>(MOCK_NIFTY_OI_STOCKS[0]);
    const [timeFrame, setTimeFrame] = useState<'1D' | '1W' | '1M' | '6M'>('1M');
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    const highOIStocks = MOCK_NIFTY_OI_STOCKS.filter(stock => (stock.oi_change_percent || 0) > 7);
    const chartData = generateChartData(selectedStock.current_price, timeFrame);

    return (
        <div className="space-y-8 animate-fade-in pb-10">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Activity className="mr-3 text-brand-cyan" /> High OI Stocks (Nifty 50)
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Stocks with Open Interest change greater than 7%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Stock List */}
                <div className="lg:col-span-1 bg-dark-card rounded-xl border border-dark-border shadow-lg overflow-hidden h-[500px] flex flex-col">
                    <div className="p-4 border-b border-dark-border bg-dark-base">
                        <h3 className="font-bold text-gray-300 text-sm">Top Movers by OI</h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {highOIStocks.map(stock => (
                            <div 
                                key={stock.id}
                                onClick={() => setSelectedStock(stock)}
                                className={`p-4 border-b border-dark-border cursor-pointer transition-colors hover:bg-dark-hover ${selectedStock.id === stock.id ? 'bg-brand-blue/10 border-l-4 border-l-brand-blue' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-white">{stock.symbol}</div>
                                    <div className="text-xs font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                                        OI: +{stock.oi_change_percent}%
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                     <div className="text-sm font-mono text-gray-400">₹{stock.current_price.toLocaleString()}</div>
                                     <div className={`text-xs font-semibold ${stock.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {stock.price_change > 0 ? '+' : ''}{stock.price_change_percent}%
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Chart */}
                <div className="lg:col-span-2 space-y-4">
                     <div className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedStock.name}</h3>
                                <span className="text-sm text-gray-500">{selectedStock.symbol} • Nifty 50</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 bg-dark-base p-1 rounded-lg border border-dark-border">
                                {(['1D', '1W', '1M', '6M'] as const).map(tf => (
                                    <button 
                                        key={tf}
                                        onClick={() => setTimeFrame(tf)}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeFrame === tf ? 'bg-dark-hover text-brand-cyan shadow-sm border border-dark-border' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-2 bg-dark-base p-1 rounded-lg border border-dark-border">
                                 <button 
                                    onClick={() => setChartType('line')}
                                    className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-dark-hover text-brand-cyan shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                    title="Line Chart"
                                 >
                                    <TrendingUp size={16} />
                                 </button>
                                 <button 
                                    onClick={() => setChartType('bar')}
                                    className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-dark-hover text-brand-cyan shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                    title="Bar Chart"
                                 >
                                    <BarChart3 size={16} />
                                 </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <StockChart 
                                data={chartData} 
                                type={chartType} 
                                color={selectedStock.price_change >= 0 ? '#10B981' : '#EF4444'} 
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-dark-border">
                             <div>
                                 <div className="text-xs text-gray-500 mb-1">Open Interest</div>
                                 <div className="font-mono font-bold text-white text-lg">1.2Cr</div>
                             </div>
                             <div>
                                 <div className="text-xs text-gray-500 mb-1">OI Change</div>
                                 <div className="font-mono font-bold text-emerald-400 text-lg">+{selectedStock.oi_change_percent}%</div>
                             </div>
                             <div>
                                 <div className="text-xs text-gray-500 mb-1">Volume</div>
                                 <div className="font-mono font-bold text-white text-lg">45.2L</div>
                             </div>
                             <div>
                                 <div className="text-xs text-gray-500 mb-1">PCR</div>
                                 <div className="font-mono font-bold text-white text-lg">1.12</div>
                             </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    )
}

// --- MAIN LAYOUT ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = searchQuery
    ? [...MOCK_COMPANIES, ...MOCK_STARTUPS, ...MOCK_NIFTY_OI_STOCKS].filter(c => 
        c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectStock = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView(ViewState.STOCK_DETAIL);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleBack = () => {
    setSelectedCompany(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onSelectStock={handleSelectStock} />;
      case ViewState.STOCK_DETAIL:
        return selectedCompany ? <CompanyDetail company={selectedCompany} onBack={handleBack} /> : <Dashboard onSelectStock={handleSelectStock} />;
      case ViewState.SCREENER:
        return <Screener onSelectStock={handleSelectStock} />;
      case ViewState.PORTFOLIO:
        return <div className="p-8 text-center text-gray-500">Portfolio Feature Coming Soon</div>;
      case ViewState.ALERTS:
        return <Alerts />;
      case ViewState.REPORTS:
        return <Reports />;
      case ViewState.IPOS:
        return <IPOSection onSelectStock={handleSelectStock} />;
      case ViewState.STARTUPS:
        return <StartupsSection onSelectStock={handleSelectStock} />;
      case ViewState.NIFTY_OI:
        return <NiftyOISection />;
      default:
        return <Dashboard onSelectStock={handleSelectStock} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex font-sans text-gray-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-dark-card border-r border-dark-border flex-col fixed h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-8 border-b border-dark-border flex items-center space-x-3">
           <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
             <TrendingUp className="text-white" size={24} />
           </div>
           <span className="text-2xl font-bold text-white tracking-tight">DishaStock</span>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === ViewState.DASHBOARD} 
            onClick={() => setCurrentView(ViewState.DASHBOARD)} 
          />
          <SidebarItem 
            icon={ListFilter} 
            label="Screener" 
            active={currentView === ViewState.SCREENER} 
            onClick={() => setCurrentView(ViewState.SCREENER)} 
          />
          <SidebarItem 
            icon={PieChart} 
            label="Portfolio" 
            active={currentView === ViewState.PORTFOLIO} 
            onClick={() => setCurrentView(ViewState.PORTFOLIO)} 
          />
          <SidebarItem 
            icon={Briefcase} 
            label="IPOs" 
            active={currentView === ViewState.IPOS} 
            onClick={() => setCurrentView(ViewState.IPOS)} 
          />
          <SidebarItem 
            icon={Rocket} 
            label="Startups" 
            active={currentView === ViewState.STARTUPS} 
            onClick={() => setCurrentView(ViewState.STARTUPS)} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Nifty OI > 7%" 
            active={currentView === ViewState.NIFTY_OI} 
            onClick={() => setCurrentView(ViewState.NIFTY_OI)} 
          />
          
          <div className="pt-8 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Tools
          </div>
          <SidebarItem 
            icon={Bell} 
            label="Alerts" 
            active={currentView === ViewState.ALERTS} 
            onClick={() => setCurrentView(ViewState.ALERTS)} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Reports" 
            active={currentView === ViewState.REPORTS} 
            onClick={() => setCurrentView(ViewState.REPORTS)} 
          />
        </nav>

        <div className="p-6 border-t border-dark-border bg-dark-base/30">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-hover cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white shadow-lg">
              <User size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">Guest User</div>
              <div className="text-xs text-gray-400">Free Plan</div>
            </div>
            <Settings size={18} className="text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar - Mobile */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-dark-card border-r border-dark-border z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-dark-border flex justify-between items-center">
           <span className="text-xl font-bold text-white">DishaStock</span>
           <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="p-6 space-y-2">
           <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentView === ViewState.DASHBOARD} onClick={() => { setCurrentView(ViewState.DASHBOARD); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={ListFilter} label="Screener" active={currentView === ViewState.SCREENER} onClick={() => { setCurrentView(ViewState.SCREENER); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={PieChart} label="Portfolio" active={currentView === ViewState.PORTFOLIO} onClick={() => { setCurrentView(ViewState.PORTFOLIO); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={Briefcase} label="IPOs" active={currentView === ViewState.IPOS} onClick={() => { setCurrentView(ViewState.IPOS); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={Rocket} label="Startups" active={currentView === ViewState.STARTUPS} onClick={() => { setCurrentView(ViewState.STARTUPS); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={BarChart3} label="Nifty OI" active={currentView === ViewState.NIFTY_OI} onClick={() => { setCurrentView(ViewState.NIFTY_OI); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={Bell} label="Alerts" active={currentView === ViewState.ALERTS} onClick={() => { setCurrentView(ViewState.ALERTS); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={FileText} label="Reports" active={currentView === ViewState.REPORTS} onClick={() => { setCurrentView(ViewState.REPORTS); setIsMobileMenuOpen(false); }} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
         {/* Background Glow */}
         <div className="fixed top-0 left-0 w-full h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none -z-10 transform -translate-y-1/2"></div>

        {/* Top Navbar */}
        <header className="bg-dark-base/80 backdrop-blur-md border-b border-dark-border h-20 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="mr-4 text-gray-400">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 max-w-xl mx-4 lg:mx-0 relative z-50" ref={searchRef}>
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 setShowSuggestions(true);
               }}
               onFocus={() => setShowSuggestions(true)}
               placeholder="Search stocks (e.g., RELIANCE, TCS)..." 
               className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 transition-all shadow-inner"
             />
             
             {/* Suggestions Dropdown */}
             {showSuggestions && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card rounded-xl shadow-2xl border border-dark-border max-h-96 overflow-y-auto z-50">
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map(company => (
                            <div 
                                key={company.id}
                                onClick={() => handleSelectStock(company)}
                                className="p-4 hover:bg-dark-hover cursor-pointer flex justify-between items-center border-b border-dark-border last:border-none group"
                            >
                                <div>
                                    <div className="font-bold text-white group-hover:text-brand-cyan transition-colors">{company.symbol}</div>
                                    <div className="text-xs text-gray-500">{company.name}</div>
                                </div>
                                <div className="text-right">
                                     <div className="font-mono text-sm text-gray-300">₹{company.current_price.toLocaleString()}</div>
                                     <div className={`text-xs ${company.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                       {company.price_change > 0 ? '+' : ''}{company.price_change}%
                                     </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500 text-sm">No companies found</div>
                    )}
                </div>
             )}
          </div>

          <div className="flex items-center space-x-6">
             <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-full transition-colors">
               <Bell size={22} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-brand-cyan rounded-full shadow-[0_0_8px_#00E0FF]"></span>
             </button>
             <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                <LogOut size={20} />
             </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 flex-1 overflow-x-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}