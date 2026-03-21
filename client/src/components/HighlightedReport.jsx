import { Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from '../utils/translations';
import HighlightText from './HighlightText';

export default function HighlightedReport({ abnormalValues, language = 'English', searchQuery = '' }) {
  const t = translations[language];

  if (!abnormalValues || abnormalValues.length === 0) return null;

  return (
    <div className="bg-cardBg p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center mb-4">
        <Activity className="w-5 h-5 mr-2" />
        {t.extractedValues}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {abnormalValues.map((item, index) => {
          let statusColor = "bg-slate-700 text-slate-300 border-slate-600"; // fallback
          
          const statusLower = item.status?.toLowerCase() || '';

          if (statusLower.includes('borderline')) {
            statusColor = "bg-orange-500/10 text-orange-500 border-orange-500/20";
          } else if (statusLower.includes('high') || statusLower.includes('low') || statusLower.includes('out') || statusLower.includes('abnormal')) {
            statusColor = "bg-danger/10 text-danger border-danger/20";
          } else if (statusLower.includes('normal') || statusLower.includes('in range')) {
            statusColor = "bg-success/10 text-success border-success/20";
          }
          
          return (
            <div key={index} className={twMerge(clsx("p-4 rounded-xl border", statusColor))}>
              <div className="flex justify-between items-start mb-2 gap-2">
                <span className="font-semibold break-words">
                  <HighlightText text={item.name} query={searchQuery} />
                </span>
                <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-black/20 whitespace-nowrap">
                  {item.status}
                </span>
              </div>
              <div className="flex flex-col text-sm opacity-90 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.value}</span>
                  <span className="font-medium text-white">
                    <HighlightText text={item.value} query={searchQuery} />
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">{t.normalRange}</span>
                  <span className="font-medium">
                    <HighlightText text={item.normalRange} query={searchQuery} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
