const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

const wrapperTarget = `                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Full Sheet Divisor (Wrapper)</label>
                <input
                  type="number"
                  min="1"
                  value={divisorWrapper}
                  onChange={(e) => setDivisorWrapper(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>`;

const wrapperReplace = `                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Full Sheet Divisor (Wrapper)</label>
                <input
                  type="number"
                  min="1"
                  value={divisorWrapper}
                  onChange={(e) => setDivisorWrapper(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Print Type</label>
                <select
                  value={printTypeWrapper}
                  onChange={(e) => setPrintTypeWrapper(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                >
                  <option value="multi_color">Multi-Color</option>
                  <option value="single_color">Single Color</option>
                  <option value="single_color_double_dummy">Single Color (Double Dummy)</option>
                </select>
              </div>
            </div>
          </div>`;

code = code.replace(wrapperTarget, wrapperReplace);
fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
