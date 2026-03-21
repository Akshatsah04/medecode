import { Clock, ChevronRight } from 'lucide-react';
import { translations } from '../utils/translations';

export default function HistoryList({ history, onSelectReport, language = 'English' }) {
  const t = translations[language];

  if (!history || history.length === 0) {
    return (
      <div className="text-center p-8 bg-cardBg rounded-xl border border-slate-700">
        <p className="text-slate-400">{t.noPastReports}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((report) => (
        <div 
          key={report._id} 
          onClick={() => onSelectReport(report)}
          className="bg-cardBg hover:bg-slate-800 p-5 rounded-xl border border-slate-700 cursor-pointer transition-colors duration-200 flex justify-between items-center group"
        >
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center text-xs text-slate-400 mb-2">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
            </div>
            <p className="text-slate-200 text-sm font-medium truncate">
              {report.summary || t.fallbackAnalysis}
            </p>
          </div>
          <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
