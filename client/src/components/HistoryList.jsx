import { useState, useMemo, useEffect } from 'react';
import { Clock, ChevronRight, Search, Trash2 } from 'lucide-react';
import { translations } from '../utils/translations';

export default function HistoryList({ history, onSelectReport, onDeleteReport, language = 'English' }) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 300ms debounce for History Filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredHistory = useMemo(() => {
    if (!debouncedQuery.trim()) return history;
    
    const lowerQ = debouncedQuery.toLowerCase();
    return history.filter(report => {
      const summaryMatch = report.summary?.toLowerCase().includes(lowerQ);
      const explMatch = report.simplifiedExplanation?.toLowerCase().includes(lowerQ);
      const valuesMatch = report.abnormalValues?.some(v => 
        v.name?.toLowerCase().includes(lowerQ) || v.value?.toLowerCase().includes(lowerQ)
      );
      return summaryMatch || explMatch || valuesMatch;
    });
  }, [history, searchQuery]);

  if (!history || history.length === 0) {
    return (
      <div className="text-center p-8 bg-cardBg rounded-xl border border-slate-700">
        <p className="text-slate-500">{t.noPastReports}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search history by conditions or metrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-sm"
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-500">No results found for "{searchQuery}"</p>
        </div>
      ) : (
        filteredHistory.map((report) => (
          <div 
            key={report._id} 
            onClick={() => onSelectReport(report)}
            className="bg-cardBg hover:bg-cardBg p-5 rounded-xl border border-slate-700 cursor-pointer transition-colors duration-200 flex justify-between items-center group"
          >
            <div className="flex-1 min-w-0 pr-12">
              <div className="flex items-center text-xs text-slate-500 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
              </div>
              <p className="text-slate-200 text-sm font-medium truncate">
                {report.summary || t.fallbackAnalysis}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to permanently delete this report?")) {
                    if (onDeleteReport) onDeleteReport(report._id);
                  }
                }}
                className="text-slate-500 hover:text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Delete Report"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
