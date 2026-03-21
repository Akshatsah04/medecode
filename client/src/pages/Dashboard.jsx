import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, ShieldAlert, TrendingUp, Cpu, HeartPulse, ShieldCheck, ArrowLeft, Loader2, FileText, FileSearch } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem('user'));

  // Currently hardcoded to English dashboard MVP, easily updatable via URL states
  const language = 'English'; 

  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const payload = await getDashboardData(language);
        setData(payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Crunching your health data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-danger/10 border border-danger/20 text-danger p-6 rounded-2xl max-w-md text-center">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-sm opacity-90 mb-6">{error}</p>
          <Link to="/" className="bg-cardBg hover:bg-slate-900 text-white px-6 py-2 rounded-lg transition-colors font-medium">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const { healthScore, riskLevel, trends, abnormalSummary, insights, totalReports, recentReports } = data;

  const riskColors = {
    Low: "bg-success/20 text-success border-success/30",
    Moderate: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    High: "bg-danger/20 text-danger border-danger/30"
  };

  const RiskIcon = riskLevel === 'Low' ? ShieldCheck : (riskLevel === 'Moderate' ? Activity : ShieldAlert);

  const formatPrognosis = (text) => {
    if (!text) return null;
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold tracking-wide">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-slate-200 font-medium">$1</em>');
    formatted = formatted.replace(/\b(abnormality|abnormalities|abnormal|critical|high risk|attention|warning|issue)\b/gi, '<span class="text-danger font-bold bg-danger/10 px-1.5 py-0.5 rounded-md">$1</span>');
    formatted = formatted.replace(/\b(balanced lifestyle|healthy|normal|stable|good|excellent|optimal|low risk)\b/gi, '<span class="text-success font-bold bg-success/10 px-1.5 py-0.5 rounded-md">$1</span>');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 animate-in fade-in duration-700">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-slate-800/60 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white flex items-center mb-3 tracking-tight">
            <HeartPulse className="w-10 h-10 mr-4 text-primary" />
            Health Analytics
          </h1>
          <p className="text-slate-400 text-lg font-medium">Discover insights, track trends, and actively manage your wellbeing with AI.</p>
        </div>
        <Link to="/" className="flex items-center text-sm font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Uploads
        </Link>
      </div>

      {totalReports === 0 ? (
        <div className="bg-cardBg/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-16 text-center shadow-2xl">
           <FileSearch className="w-20 h-20 text-slate-500 mx-auto opacity-50 mb-6 group-hover:scale-110 transition-transform" />
           <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">No Reports Yet</h2>
           <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10 font-medium">Your dashboard is waiting! Upload your first medical report to initialize your health tracking algorithms.</p>
           <Link to="/" className="inline-flex items-center bg-primary hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-glow hover:shadow-super-glow">
             Analyze First Report
           </Link>
        </div>
      ) : (
        <div className="space-y-10 pb-16">

          {/* Top Row: Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Score Card */}
            <div className="bg-gradient-to-br from-cardBg/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <HeartPulse className="w-32 h-32 text-primary" />
              </div>
              <div className="flex items-center text-slate-400 font-bold mb-6 tracking-wider text-sm uppercase">
                 <Activity className="w-5 h-5 mr-2 text-primary" />
                 Latest Health Score
              </div>
              <div className="flex items-baseline gap-2 mt-2 relative z-10">
                <span className="text-6xl md:text-7xl font-black text-white drop-shadow-md tracking-tighter">{healthScore}</span>
                <span className="text-slate-500 text-2xl font-bold">/100</span>
              </div>
            </div>

            {/* Risk Card */}
            <div className="bg-gradient-to-br from-cardBg/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <ShieldAlert className="w-32 h-32 text-slate-400" />
              </div>
              <div className="flex items-center text-slate-400 font-bold mb-6 tracking-wider text-sm uppercase">
                 <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
                 Current Risk Status
              </div>
              <div className={`mt-2 inline-flex items-center px-6 py-3 rounded-2xl border ${riskColors[riskLevel] || riskColors.Moderate} font-extrabold text-2xl w-fit shadow-lg backdrop-blur-md relative z-10`}>
                <RiskIcon className="w-6 h-6 mr-3" />
                {riskLevel} 
              </div>
            </div>

            {/* Scanned Reports Card */}
            <div className="bg-gradient-to-br from-cardBg/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <FileText className="w-32 h-32 text-primary" />
              </div>
              <div className="flex items-center text-slate-400 font-bold mb-6 tracking-wider text-sm uppercase">
                 <FileSearch className="w-5 h-5 mr-2 text-primary" />
                 Total Scanned Reports
              </div>
              <div className="flex items-center mt-2 relative z-10">
                <span className="text-6xl md:text-7xl font-black text-white drop-shadow-md tracking-tighter">{totalReports}</span>
              </div>
            </div>
            
          </div>

          {/* Full Width AI Prognosis */}
          <div className="relative bg-[#1E293B]/60 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden group hover:shadow-primary/10 transition-all duration-500">
             {/* Left Accent Bar */}
             <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-primary to-blue-400"></div>
             
             {/* Subtle Background Glow */}
             <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none transition-all duration-700 group-hover:bg-primary/20"></div>

             <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
               <div className="shrink-0 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/50 shadow-inner max-w-max hidden md:block">
                 <Cpu className="w-10 h-10 text-primary animate-pulse" />
               </div>
               
               <div className="flex-1">
                 <h3 className="text-3xl font-extrabold text-white flex items-center mb-6 tracking-tight">
                   Insights & Prognosis
                   <span className="ml-5 text-xs font-bold px-3 py-1.5 bg-primary/20 text-blue-400 border border-primary/30 rounded-full uppercase tracking-widest shadow-sm">Auto-Generated</span>
                 </h3>
                 <div className="text-slate-300 leading-relaxed text-lg font-medium max-w-5xl prose prose-invert">
                   {formatPrognosis(insights)}
                 </div>
               </div>
             </div>
          </div>

          {/* Bottom Row Layout 70/30 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 70%: Trends */}
            <div className="lg:col-span-2 bg-gradient-to-b from-cardBg/80 to-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-colors duration-300">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-primary" />
                  Health Score Trends
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700 uppercase tracking-widest shadow-inner">All Time History</span>
              </div>
              <div className="w-full h-[350px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748B" tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} dy={15} />
                    <YAxis stroke="#64748B" tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '16px', color: '#F8FAFC', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', padding: '12px 20px' }}
                      itemStyle={{ color: '#60A5FA', fontWeight: 'bold', fontSize: '16px' }}
                      cursor={{ stroke: '#475569', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="score" name="Health Score" stroke="#3B82F6" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, strokeWidth: 0, fill: '#60A5FA', stroke: '#0F172A', strokeWidth: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right 30%: Abnormalities */}
            <div className="lg:col-span-1 bg-gradient-to-b from-cardBg/80 to-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-xl group hover:border-slate-600 transition-colors duration-300 flex flex-col">
              <h3 className="text-2xl font-extrabold text-white flex items-center mb-8 tracking-tight">
                <Activity className="w-6 h-6 mr-3 text-orange-400" />
                Recurring Issues
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[400px]">
                {abnormalSummary.length > 0 ? (
                  abnormalSummary.map((item, i) => (
                    <div key={i} className={`flex items-start justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.03] shadow-md group/item cursor-default ${item.count > 2 ? 'bg-danger/10 border-danger/30 hover:border-danger/50 hover:bg-danger/20 hover:shadow-danger/10' : 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/20 hover:shadow-orange-500/10'}`}>
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`p-2.5 rounded-xl shrink-0 ${item.count > 2 ? 'bg-danger/20 text-danger' : 'bg-orange-500/20 text-orange-400'}`}>
                           <ShieldAlert className="w-5 h-5" />
                        </div>
                        <span className="text-slate-200 font-bold truncate text-base">{item.name}</span>
                      </div>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap ml-3 shadow-md ${item.count > 2 ? 'bg-danger text-white' : 'bg-orange-500 text-white'}`}>
                        {item.count}x
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-70 mt-10">
                     <ShieldCheck className="w-20 h-20 text-success mb-6 opacity-60" />
                     <p className="text-slate-300 font-bold text-xl mb-2">No recurring issues.</p>
                     <p className="text-slate-500 text-base font-medium max-w-[200px] mx-auto">You are perfectly healthy across your scanned history.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
