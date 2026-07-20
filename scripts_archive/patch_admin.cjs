const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetBracketsUI = `              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Bracket Tier 2
                </label>
                <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket2?.maxImpressions || 0}
                      onChange={(e) => updateBracketField('bracket2', 'maxImpressions', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                    />
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket2?.cost || 0}
                      onChange={(e) => updateBracketField('bracket2', 'cost', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Bracket Tier 3
                </label>
                <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket3?.maxImpressions || 0}
                      onChange={(e) => updateBracketField('bracket3', 'maxImpressions', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                    />
                  </div>
                  <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                    <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                    <input
                      type="number"
                      required
                      value={currentBracketFields?.bracket3?.cost || 0}
                      onChange={(e) => updateBracketField('bracket3', 'cost', parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                    />
                  </div>
                </div>
              </div>`;

const replaceBracketsUI = `              {bracketTab === 'multi_color' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Bracket Tier 2
                    </label>
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket2?.maxImpressions || 0}
                          onChange={(e) => updateBracketField('bracket2', 'maxImpressions', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                        />
                      </div>
                      <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket2?.cost || 0}
                          onChange={(e) => updateBracketField('bracket2', 'cost', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Bracket Tier 3
                    </label>
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Max Impressions</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket3?.maxImpressions || 0}
                          onChange={(e) => updateBracketField('bracket3', 'maxImpressions', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none pt-0.5"
                        />
                      </div>
                      <div className="flex-1 border-l border-slate-100 dark:border-slate-700 pl-2">
                        <span className="text-[9px] text-slate-400 font-mono uppercase">Flat Price Cost (₹)</span>
                        <input
                          type="number"
                          required
                          value={currentBracketFields?.bracket3?.cost || 0}
                          onChange={(e) => updateBracketField('bracket3', 'cost', parseInt(e.target.value) || 0)}
                          className="w-full text-sm font-mono font-bold text-indigo-600 focus:outline-none pt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}`;

code = code.replace(targetBracketsUI, replaceBracketsUI);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
