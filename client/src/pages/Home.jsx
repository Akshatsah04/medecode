import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import HighlightedReport from '../components/HighlightedReport';
import HistoryList from '../components/HistoryList';
import { analyzeReport, getHistory, deleteReport as deleteReportAPI } from '../services/api';
import { RefreshCcw, FileText, Settings2, History as HistoryIcon, ArrowLeft, LogOut, LogIn, UserPlus, Download, Search, HeartPulse, Sparkles, UploadCloud } from 'lucide-react';
import { translations } from '../utils/translations';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('Simple'); // 'Simple' | 'Detailed'
  const [language, setLanguage] = useState('English'); // 'English' | 'Hindi'

  const [view, setView] = useState('upload'); // 'upload' | 'history' | 'result'
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [reportSearch, setReportSearch] = useState('');
  const [debouncedReportSearch, setDebouncedReportSearch] = useState('');

  // 300ms debounce for In-Report Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedReportSearch(reportSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [reportSearch]);

  const t = translations[language];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setError(null);
    setResult(null);
    setReportSearch('');
    setView('upload');

    try {
      const data = await analyzeReport(selectedFile, mode, language);
      setResult(data);
      setView('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setView('history');
    if (!userData) {
      return; // Do nothing else; UI handles guest message
    }

    setLoadingHistory(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleHistorySelect = (report) => {
    setResult(report);
    setReportSearch('');
    setView('result');
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReportAPI(reportId);
      setHistoryData(prev => prev.filter(r => r._id !== reportId));
      // Reset view if they delete the currently open report
      if (result && result._id === reportId) {
        setResult(null);
        setView('history');
      }
    } catch (err) {
      setError("Failed to delete report: " + err.message);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setReportSearch('');
    setView('upload');
  };

  const handleDownload = () => {
    if (!result) return;
    
    const lines = [
      `MEDECODE - MEDICAL REPORT ANALYSIS`,
      `Date: ${new Date().toLocaleDateString()}`,
      `=========================================`,
      ``,
      `SUMMARY`,
      `-------`,
      result.summary,
      ``,
      `DETAILED EXPLANATION`,
      `--------------------`,
      result.simplifiedExplanation,
      ``,
      `KEY METRICS`,
      `-----------`
    ];

    if (result.abnormalValues && result.abnormalValues.length > 0) {
      result.abnormalValues.forEach(v => {
        lines.push(`• ${v.name}: ${v.value} (Normal: ${v.normalRange}) - Status: ${v.status.toUpperCase()}`);
      });
    } else {
      lines.push(`No specific metrics highlighted.`);
    }

    lines.push(``);
    lines.push(`SUGGESTIONS`);
    lines.push(`-----------`);
    lines.push(result.suggestions || 'None');
    
    const textData = lines.join('\n');
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medecode_Analysis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-darkBg">
      {/* BIG NAVBAR */}
      <nav className="w-full bg-cardBg border-b border-slate-700/60 shadow-lg px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-50">
        
        {/* LEFT SIDE: Name and Logo */}
        <div className="flex items-center justify-center md:justify-start cursor-pointer group w-full md:w-auto" onClick={reset}>
          <img src="/logo.png" alt="Logo" className="h-14 w-14 object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300" />
          <div className="flex flex-col items-start ml-4">
             <span className="text-3xl font-black text-white leading-none tracking-tight group-hover:text-primary transition-colors duration-300">Mede<span className="text-primary group-hover:text-white transition-colors duration-300">code</span></span>
             <span className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-widest opacity-80">AI Diagnostics</span>
          </div>
        </div>

        {/* RIGHT SIDE: "All the stuff" (Auth, Toggles) */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-end font-medium">
          {userData ? (
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-sm hidden sm:inline-block pr-4 border-r border-slate-700/60">Hi, {userData.name.split(' ')[0]}</span>
              <div className="flex items-center space-x-3 pl-2">
                <Link to="/dashboard" className="text-slate-300 hover:text-white flex items-center text-sm px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all">
                  <HeartPulse className="w-4 h-4 mr-2 text-primary" />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-danger flex items-center text-sm px-3 py-2 rounded-lg hover:bg-danger/10 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-400 hover:text-white flex items-center px-4 py-2 rounded-lg transition-colors text-sm">
                Login
              </Link>
              <div className="w-[1px] h-4 bg-slate-700/60 hidden sm:block"></div>
              <Link to="/register" className="text-white bg-primary hover:bg-blue-600 flex items-center px-5 py-2.5 rounded-xl transition-all hover:scale-105 text-sm shadow-glow font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full flex-grow">

      {/* Hero & Upload */}
      {view === 'upload' && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
            
            {/* Left Side: Hero Text */}
            <div className="flex-1 w-full text-center lg:text-left pt-4 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 shadow-inner">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Medical Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
                Understand Your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">Medical Reports</span> <br className="hidden lg:block"/> Instantly.
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
                Upload your lab results and let our advanced AI decode complex medical jargon into simple, actionable insights. Take control of your health today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                 <label className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-xl transition-all hover:scale-105 w-full sm:w-auto hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                   <UploadCloud className="w-5 h-5 mr-3" />
                   Start Analysis Free
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="application/pdf,image/jpeg,image/jpg,image/png" 
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) handleFileSelect(file);
                     }} 
                   />
                 </label>
                 <button onClick={loadHistory} className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-600 transition-all w-full sm:w-auto flex items-center justify-center shadow-lg hover:shadow-xl backdrop-blur-sm group">
                   <HistoryIcon className="w-5 h-5 mr-3 text-slate-300 group-hover:text-white transition-colors" />
                   {t.viewHistory}
                 </button>
              </div>
            </div>

            {/* Right Side: Upload Box */}
            <div id="upload-zone" className="flex-1 w-full max-w-xl mx-auto lg:max-w-none relative z-10 perspective-1000">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
              
              {/* Embedded Toggles */}
              <div className="bg-cardBg/90 backdrop-blur-xl p-4 border border-slate-700/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 shadow-2xl relative z-20">
                <div className="flex items-center text-slate-300 pl-2">
                  <Settings2 className="w-5 h-5 mr-3 text-primary opacity-80" />
                  <span className="font-semibold">{t.settings}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Mode Toggle */}
                  <div className="flex bg-slate-900/80 rounded-xl p-1 shadow-inner border border-slate-800 w-full sm:w-auto">
                    <button onClick={() => setMode('Simple')} className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'Simple' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{t.simple}</button>
                    <button onClick={() => setMode('Detailed')} className={`flex-1 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'Detailed' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>{t.detailed}</button>
                  </div>
                  {/* Language Toggle */}
                  <div className="relative w-full sm:w-auto">
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="appearance-none bg-slate-900/80 border border-slate-800 text-slate-300 font-semibold text-sm rounded-xl px-5 py-2 w-full sm:w-auto pr-10 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors shadow-inner cursor-pointer hover:border-slate-700">
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                      <option value="Bengali">বাংলা (Bengali)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
                  </div>
                </div>
              </div>

              <div className="relative z-20">
                <Upload onFileSelect={handleFileSelect} language={language} />
              </div>

              {error && (
                <div className="mt-4 bg-danger/10 border border-danger/20 text-danger p-5 rounded-2xl text-center shadow-lg relative z-20 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-md">
                  <span className="font-semibold block mb-1">{t.errorLabel}</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* SECONDARY SECTION: How It Works */}
          <div className="pt-24 border-t border-slate-800/60 pb-12 relative z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-tight">How Medecode Works</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">Three simple steps to decode your health data securely and instantly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
              {/* Card 1 */}
              <div className="bg-cardBg/40 backdrop-blur-md border border-slate-700/40 p-10 rounded-3xl hover:bg-cardBg/80 hover:border-slate-600/80 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:-translate-y-2 cursor-default">
                <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-glow transition-all duration-300">
                  <FileText className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">1. Upload Report</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-base">Securely upload your medical test results as a PDF or image file. Your critical data is processed instantly with enterprise-grade encryption.</p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-cardBg/40 backdrop-blur-md border border-slate-700/40 p-10 rounded-3xl hover:bg-cardBg/80 hover:border-slate-600/80 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:-translate-y-2 cursor-default">
                <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-glow transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">2. AI Analysis</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-base">Our advanced generative AI engine scans your report and automatically translates complex medical terminology into easy-to-read language.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-cardBg/40 backdrop-blur-md border border-slate-700/40 p-10 rounded-3xl hover:bg-cardBg/80 hover:border-slate-600/80 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:-translate-y-2 cursor-default">
                <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-glow transition-all duration-300">
                  <HeartPulse className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">3. Get Insights</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-base">Review your beautifully simplified report, spot critically abnormal values instantly with color-coded alerts, and track your health trends over time.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-cardBg p-4 border border-slate-700 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center">
              <HistoryIcon className="w-5 h-5 mr-3 text-primary" />
              {t.historyTitle}
            </h2>
            <button
              onClick={reset}
              className="flex items-center text-sm text-slate-300 hover:text-white bg-cardBg hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToUpload}
            </button>
          </div>
          
           {!userData ? (
             <div className="bg-cardBg p-8 border border-slate-700 rounded-xl shadow-xl text-center mx-auto space-y-4">
                <HistoryIcon className="w-12 h-12 text-slate-500 mx-auto opacity-50 mb-2" />
                <h3 className="text-xl font-semibold text-white">Guest Mode</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Please login to view your securely saved medical reports.</p>
                <div className="flex justify-center pt-2">
                  <Link to="/login" className="flex items-center justify-center bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-xl">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login Now
                  </Link>
                </div>
             </div>
           ) : loadingHistory ? (
             <div className="py-12"><Loader language={language} /></div>
           ) : (
             <HistoryList history={historyData} onSelectReport={handleHistorySelect} onDeleteReport={handleDeleteReport} language={language} />
           )}

           {error && (
             <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-center shadow-sm">
               <span className="font-medium">{t.errorLabel}</span>{error}
             </div>
           )}
        </div>
      )}

      {loading && view === 'upload' && (
        <div className="my-24">
          <Loader language={language} />
        </div>
      )}

      {view === 'result' && result && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-cardBg p-4 rounded-2xl border border-slate-700 shadow-xl gap-4">
            <h2 className="text-xl font-bold text-white pl-4 text-center sm:text-left">{t.analysisResults}</h2>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="flex items-center text-slate-300 bg-cardBg hover:bg-slate-900 px-5 py-3 rounded-xl transition-all font-medium justify-center flex-1 sm:flex-none border border-slate-700 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={loadHistory}
                className="flex items-center text-slate-300 bg-cardBg hover:bg-slate-900 px-5 py-3 rounded-xl transition-all font-medium justify-center flex-1 sm:flex-none border border-slate-700 shadow-sm"
              >
                <HistoryIcon className="w-4 h-4 mr-2" />
                {t.historyBtn}
              </button>
              <button
                onClick={reset}
                className="flex items-center text-white bg-primary hover:bg-blue-600 px-6 py-3 rounded-xl transition-all font-medium justify-center flex-1 sm:flex-none shadow-xl shadow-primary/20"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                {t.newReportBtn}
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Highlight keywords in this report..."
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
            />
          </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResultCard result={result} language={language} searchQuery={debouncedReportSearch} />
            <HighlightedReport abnormalValues={result.abnormalValues} language={language} searchQuery={debouncedReportSearch} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
