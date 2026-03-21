import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { translations } from '../utils/translations';

export default function Upload({ onFileSelect, language = 'English' }) {
  const t = translations[language];
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const handleAnalyze = (e) => {
    e.stopPropagation();
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  return (
    <div className="w-full relative group perspective-1000 mt-4 mb-8">
      {/* Outer Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>

      <div
        {...getRootProps()}
        className={twMerge(
          clsx(
            "relative w-full p-10 md:p-14 border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] bg-[#1E293B]/80 backdrop-blur-xl shadow-2xl",
            isDragActive ? "border-primary bg-primary/10 shadow-glow" : "border-slate-700/60 hover:border-primary/50 hover:shadow-glow",
            isDragReject && "border-danger bg-danger/10"
          )
        )}
      >
        <input {...getInputProps()} />
        
        {!selectedFile ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="p-6 bg-slate-900/60 rounded-full mb-6 border border-slate-700/50 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors duration-500 shadow-inner group-hover:shadow-glow">
              <UploadCloud className="w-14 h-14 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-white tracking-tight">
              {isDragActive ? "Drop reports here..." : "Upload your medical report"}
            </h3>
            <p className="text-slate-400 text-base font-medium text-center max-w-sm leading-relaxed mb-8">
              Drag and drop your PDF or image files securely to instantly decode complex terminology.
            </p>
            <div className="text-xs text-slate-500 font-bold tracking-widest uppercase bg-slate-900/50 px-5 py-2.5 rounded-full border border-slate-700/40 shadow-sm">
              PDF, JPG, PNG UP TO 10MB
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="relative p-6 bg-slate-900 rounded-2xl w-full max-w-sm border border-slate-700/50 shadow-xl flex items-center mb-8 transform transition-all group-hover:border-primary/30">
              <div className="bg-primary/20 p-4 rounded-xl mr-5">
                <File className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-semibold truncate text-lg pr-4">{selectedFile.name}</p>
                <p className="text-slate-400 text-sm mt-1.5 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-slate-800 hover:bg-danger/90 text-slate-300 hover:text-white rounded-full p-2.5 border border-slate-600 hover:border-danger transition-all shadow-lg hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAnalyze}
              className="group/btn flex items-center justify-center w-full max-w-sm bg-primary hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-glow hover:shadow-super-glow relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
              <Sparkles className="w-5 h-5 mr-3 relative z-10" />
              <span className="relative z-10">Analyze Report Instantly</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
