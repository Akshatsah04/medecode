const fs = require('fs');
const path = require('path');

const directory = 'c:\\vs code\\medisimp-hackerstreet\\medisimp\\client\\src';

const replacements = [
  { search: /bg-slate-50/g, replace: 'bg-darkBg' },
  // Since both cardBg and slate-800 became white, mapping all back to cardBg is semantically identical for dark mode.
  { search: /bg-white\/80/g, replace: 'bg-slate-900/80' },
  { search: /bg-white/g, replace: 'bg-cardBg' },
  { search: /border-slate-200/g, replace: 'border-slate-700' },
  { search: /text-slate-800/g, replace: 'text-slate-200' },
  { search: /text-slate-700/g, replace: 'text-slate-300' },
  // 500 mapped to 400 and vice versa, this requires a temporary dummy string to avoid double swapping
  { search: /text-slate-500/g, replace: '__TEMP_400__' },
  { search: /text-slate-400/g, replace: 'text-slate-500' },
  { search: /__TEMP_400__/g, replace: 'text-slate-400' },
  { search: /bg-slate-100/g, replace: 'bg-slate-900' },
  { search: /hover:bg-slate-50/g, replace: 'hover:bg-slate-800' },
  // Again, temp replacements for the remaining identical swaps
  { search: /bg-slate-200/g, replace: 'bg-slate-700' },
  { search: /hover:bg-slate-200/g, replace: 'hover:bg-slate-700' },
  { search: /text-slate-900/g, replace: 'text-white' },
  { search: /hover:text-slate-900/g, replace: 'hover:text-white' },
  { search: /border-slate-300/g, replace: 'border-slate-600' },
  { search: /file:text-slate-700/g, replace: 'file:text-slate-300' },
  { search: /file:bg-slate-100/g, replace: 'file:bg-slate-800' },
  { search: /hover:file:bg-slate-200/g, replace: 'hover:file:bg-slate-700' },
  // the script earlier took shadow-lg -> shadow-md and shadow-xl -> shadow-lg.
  { search: /shadow-md/g, replace: 'shadow-lg' },
  { search: /shadow-lg/g, replace: 'shadow-xl' },
  // revert danger replacements
  { search: /red-100/g, replace: 'danger/10' },
  { search: /red-200/g, replace: 'danger/20' }
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
      console.log(`Reverted ${fullPath}`);
    }
  }
}

walkDir(directory);
console.log("Done reverting to dark theme tailwind classes.");
