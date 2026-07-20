const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

const secTarget = `                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Full Sheet Divisor
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sec.divisor}
                          onChange={(e) => handleUpdateSection(sec.id, { divisor: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>`;

const secReplace = `                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Full Sheet Divisor
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sec.divisor}
                          onChange={(e) => handleUpdateSection(sec.id, { divisor: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Print Type
                        </label>
                        <select
                          value={sec.printType || 'multi_color'}
                          onChange={(e) => handleUpdateSection(sec.id, { printType: e.target.value as any })}
                          className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        >
                          <option value="multi_color">Multi-Color</option>
                          <option value="single_color">Single Color</option>
                          <option value="single_color_double_dummy">Single Color (DD)</option>
                        </select>
                      </div>`;

code = code.replace(secTarget, secReplace);
fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
