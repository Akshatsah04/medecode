import { Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import { translations } from '../utils/translations';
import HighlightText from './HighlightText';

export default function ResultCard({ result, language = 'English', searchQuery = '' }) {
  const t = translations[language];

  if (!result) return null;

  return (
    <div className="bg-cardBg p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
      
      {/* Summary Section */}
      <div>
        <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
          <CheckCircle className="w-5 h-5 mr-2" />
          {t.summary}
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm">
          <HighlightText text={result.summary} query={searchQuery} />
        </p>
      </div>

      <hr className="border-slate-700" />

      {/* Simplified Explanation Section */}
      <div>
        <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
          <Stethoscope className="w-5 h-5 mr-2" />
          {t.simplifiedExplanation}
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
          <HighlightText text={result.simplifiedExplanation} query={searchQuery} />
        </p>
      </div>

      {result.suggestions && (
        <>
          <hr className="border-slate-700" />
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="text-md font-semibold text-primary flex items-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              {t.doctorsSuggestions}
            </h3>
            <p className="text-slate-200 text-sm">
              {result.suggestions}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
