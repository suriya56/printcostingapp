const fs = require('fs');

let typesCode = fs.readFileSync('src/types.ts', 'utf8');
typesCode = typesCode.replace(
  '      divisorWrapper: number;',
  '      divisorWrapper: number;\n      wrapperPrintBothSides?: boolean;'
);
fs.writeFileSync('src/types.ts', typesCode);

let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

// State
code = code.replace(
  '  const [selectedPaperWrapperId, setSelectedPaperWrapperId] = useState(\'\');',
  '  const [selectedPaperWrapperId, setSelectedPaperWrapperId] = useState(\'\');\n  const [wrapperPrintBothSides, setWrapperPrintBothSides] = useState<boolean>(false);'
);

// Load state
code = code.replace(
  '        setSelectedPaperWrapperId(mB.paperProfileIdWrapper);',
  '        setSelectedPaperWrapperId(mB.paperProfileIdWrapper);\n        if (mB.wrapperPrintBothSides !== undefined) setWrapperPrintBothSides(mB.wrapperPrintBothSides);'
);

// Calculation
code = code.replace(
  '    const wrapperImpressions = feedingSheetsWrapper * 2;',
  '    const wrapperImpressions = wrapperPrintBothSides ? (feedingSheetsWrapper * 2) : feedingSheetsWrapper;'
);
code = code.replace(
  '    // Front + Back for inner, Front + Back for wrapper',
  '    // Front + Back for inner, Wrapper based on toggle'
);

// Save state
code = code.replace(
  '              divisorWrapper,',
  '              divisorWrapper,\n              wrapperPrintBothSides,'
);

// UI
code = code.replace(
  `              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Number of Ups (Wrapper)</label>`,
  `              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Print Both Sides (Wrapper)</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={wrapperPrintBothSides} onChange={e => setWrapperPrintBothSides(e.target.checked)} className="rounded" /> Yes
                </label>
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Number of Ups (Wrapper)</label>`
);

fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
