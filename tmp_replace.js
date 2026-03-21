const fs = require('fs');
const path = require('path');

const directory = 'c:\\vs code\\medisimp-hackerstreet\\medisimp\\client\\src';

const replacements = [
  { search: /bg-darkBg/g, replace: 'bg-slate-50' },
  { search: /bg-cardBg/g, replace: 'bg-white' },
  { search: /border-slate-700/g, replace: 'border-slate-200' },
  { search: /text-slate-200/g, replace: 'text-slate-800' },
  { search: /text-slate-300/g, replace: 'text-slate-700' },
  { search: /text-slate-400/g, replace: 'text-slate-500' },
  { search: /text-slate-500/g, replace: 'text-slate-400' },
  { search: /bg-slate-900\/80/g, replace: 'bg-white/80' },
  { search: /bg-slate-900/g, replace: 'bg-slate-100' },
  { search: /bg-slate-800/g, replace: 'bg-white' },
  { search: /hover:bg-slate-800/g, replace: 'hover:bg-slate-50' },
  { search: /bg-slate-700/g, replace: 'bg-slate-100' },
  { search: /hover:bg-slate-700/g, replace: 'hover:bg-slate-200' },
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /hover:text-white/g, replace: 'hover:text-slate-900' },
  { search: /border-slate-600/g, replace: 'border-slate-300' },
  { search: /border-slate-800/g, replace: 'border-slate-200' },
  { search: /file:text-slate-300/g, replace: 'file:text-slate-700' },
  { search: /file:bg-slate-800/g, replace: 'file:bg-slate-100' },
  { search: /hover:file:bg-slate-700/g, replace: 'hover:file:bg-slate-200' },
  { search: /shadow-lg/g, replace: 'shadow-md' },
  { search: /shadow-xl/g, replace: 'shadow-lg' },
  // specific danger replacements
  { search: /danger\/10/g, replace: 'red-100' },
  { search: /danger\/20/g, replace: 'red-200' },
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      replacements.forEach(({ search, replace }) => {
        content = content.replace(search, replace);
      });
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${fullPath}`);
    }
  }
}

walkDir(directory);
console.log("Done upgrading tailwind classes.");
