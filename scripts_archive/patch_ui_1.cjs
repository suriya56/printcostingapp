const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

const printTypeJobDetailsStr = `            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2">
              <div className="grid grid-cols-1 sm:col-span-3 gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Print Type</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
                  <button
                    type="button"
                    onClick={() => setPrintType('multi_color')}
                    className={\`flex-1 text-sm py-1.5 rounded-md font-medium transition \${printType === 'multi_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  >
                    Multi-Color
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintType('single_color')}
                    className={\`flex-1 text-sm py-1.5 rounded-md font-medium transition \${printType === 'single_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  >
                    Single Color
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintType('single_color_double_dummy')}
                    className={\`flex-1 text-sm py-1.5 rounded-md font-medium transition \${printType === 'single_color_double_dummy' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  >
                    Single Color (Double Dummy)
                  </button>
                </div>
              </div>
            </div>`;

code = code.replace(printTypeJobDetailsStr, "");
fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
