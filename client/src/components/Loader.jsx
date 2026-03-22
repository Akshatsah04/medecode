import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

export default function Loader({ language = 'English' }) {
  const t = translations[language];
  const steps = [
    t.uploading,
    t.extracting,
    t.analyzing,
    t.finalizing
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const [isRenderColdStart, setIsRenderColdStart] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000); // 4s interval to map Render cold-boot sequence elegantly
    
    // Explicit UX warning for Render's 50s free-tier delays
    const coldStartWarning = setTimeout(() => {
      setIsRenderColdStart(true);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(coldStartWarning);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-12">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-slate-300 font-medium text-center px-4"
      >
        {steps[currentStep]}
      </motion.p>
      
      {isRenderColdStart && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-slate-500 max-w-sm text-center pt-4"
        >
          Connecting to secure server... <br className="hidden sm:block" /> (Server may take ~50s to wake up if inactive)
        </motion.p>
      )}
    </div>
  );
}
