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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // changes every 2.5s
    return () => clearInterval(interval);
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
    </div>
  );
}
