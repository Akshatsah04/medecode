import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import HighlightedReport from '../components/HighlightedReport';
import HistoryList from '../components/HistoryList';
import { analyzeReport, getHistory } from '../services/api';
import { RefreshCcw, FileText, Settings2, History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('Simple'); // 'Simple' | 'Detailed'
  const [language, setLanguage] = useState('English'); // 'English' | 'Hindi'

  const [view, setView] = useState('upload'); // 'upload' | 'history' | 'result'
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const t = translations[language];

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setError(null);
    setResult(null);
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
    setLoadingHistory(true);
    setView('history');
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
    setView('result');
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setView('upload');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 flex justify-center items-center">
          <div className="p-3 bg-primary/10 rounded-2xl mr-4">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          {t.title}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {view === 'upload' && !loading && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-end mb-4">
            <button
               onClick={loadHistory}
               className="flex items-center text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700 shadow-sm"
            >
              <HistoryIcon className="w-4 h-4 mr-2" />
              {t.viewHistory}
            </button>
          </div>
          
          <div className="bg-cardBg p-4 border border-slate-700 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-slate-300">
              <Settings2 className="w-5 h-5 mr-2 text-primary whitespace-nowrap" />
              <span className="font-medium">{t.settings}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Mode Toggle */}
              <div className="flex bg-slate-900 rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setMode('Simple')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === 'Simple' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t.simple}
                </button>
                <button
                  onClick={() => setMode('Detailed')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === 'Detailed' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t.detailed}
                </button>
              </div>

              {/* Language Toggle */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 font-medium text-sm rounded-lg px-4 py-2 w-full sm:w-auto pr-8 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-colors shadow-md"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Upload onFileSelect={handleFileSelect} language={language} />

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-center shadow-sm">
              <span className="font-medium">{t.errorLabel}</span>{error}
            </div>
          )}
        </div>
      )}

      {view === 'history' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-cardBg p-4 border border-slate-700 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white flex items-center">
              <HistoryIcon className="w-5 h-5 mr-3 text-primary" />
              {t.historyTitle}
            </h2>
            <button
              onClick={reset}
              className="flex items-center text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToUpload}
            </button>
          </div>
          
           {loadingHistory ? (
             <div className="py-12"><Loader language={language} /></div>
           ) : (
             <HistoryList history={historyData} onSelectReport={handleHistorySelect} language={language} />
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
                onClick={loadHistory}
                className="flex items-center text-slate-300 bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl transition-all font-medium justify-center flex-1 sm:flex-none border border-slate-700 shadow-sm"
              >
                <HistoryIcon className="w-4 h-4 mr-2" />
                {t.historyBtn}
              </button>
              <button
                onClick={reset}
                className="flex items-center text-white bg-primary hover:bg-blue-600 px-6 py-3 rounded-xl transition-all font-medium justify-center flex-1 sm:flex-none shadow-lg shadow-primary/20"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                {t.newReportBtn}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResultCard result={result} language={language} />
            <HighlightedReport abnormalValues={result.abnormalValues} language={language} />
          </div>
        </div>
      )}
    </div>
  );
}
