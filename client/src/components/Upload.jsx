import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { translations } from '../utils/translations';

export default function Upload({ onFileSelect, language = 'English' }) {
  const t = translations[language];
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

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
    <div
      {...getRootProps()}
      className={twMerge(
        clsx(
          "w-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
          isDragActive ? "border-primary bg-primary/10" : "border-slate-600 hover:border-slate-400 bg-cardBg",
          isDragReject && "border-danger bg-danger/10"
        )
      )}
    >
      <input {...getInputProps()} />
      <div className="p-4 bg-slate-700/50 rounded-full mb-4">
        <UploadCloud className="w-8 h-8 text-primary" />
      </div>
      <p className="text-xl font-semibold mb-2 text-center text-slate-100">
        {isDragActive ? t.dropFile : t.dragDrop}
      </p>
      <p className="text-slate-400 text-sm text-center">
        {t.supportedFormats}
      </p>
    </div>
  );
}
