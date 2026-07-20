import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PaperProfile, PrintingBracketsConfig } from '../types';
import { Scale, HelpCircle, Layers, FileText, CheckCircle2 } from 'lucide-react';

interface ComparePanelProps {
  papers: PaperProfile[];
  brackets: PrintingBracketsConfig;
}

export default function ComparePanel({ papers, brackets }: ComparePanelProps) {
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [plateCost, setPlateCost] = useState<number>(800);
  const [postPressCost, setPostPressCost] = useState<number>(1000);
  const [printSides, setPrintSides] = useState<'front' | 'both'>('front');
  const [itemSize, setItemSize] = useState<'A3' | 'A4' | 'A5'>('A4');
  const [marginPercent, setMarginPercent] = useState<number>(25);

  const [qty1, setQty1] = useState<number>(500);
  const [qty2, setQty2] = useState<number>(1000);
  const [qty3, setQty3] = useState<number>(2500);
  const [qty4, setQty4] = useState<number>(5000);

  useEffect(() => {
    if (papers.length > 0 && !selectedPaperId) {
      setSelectedPaperId(papers[0].id);
    }
  }, [papers]);

  const selectedPaper = papers.find(p => p.id === selectedPaperId);

  const calculateForQty = (quantity: number) => {
    if (!selectedPaper) return null;

    const divisor = itemSize === 'A3' ? 2 : itemSize === 'A4' ? 4 : 8;
    const feedingSheets = Math.ceil(quantity / divisor) + 50; // standard 50 sheet waste assumption for simulation
    const fullSheets = feedingSheets / 2;
    
    const impressions = printSides === 'both' ? feedingSheets * 2 : feedingSheets;

    let printingCost = 0;
    if (impressions > 0) {
      const b1 = brackets.bracket1;
      const b2 = brackets.bracket2;
      const b3 = brackets.bracket3;

      if (impressions <= b1.maxImpressions) {
        printingCost = b1.cost;
      } else if (impressions <= b2.maxImpressions) {
        printingCost = b2.cost;
      } else if (impressions <= b3.maxImpressions) {
        printingCost = b3.cost;
      } else {
        const excess = impressions - b3.maxImpressions;
        const steps = Math.ceil(excess / brackets.excessStepImpressions);
        printingCost = b3.cost + (steps * brackets.excessStepCost);
      }
    }

    const totalPaperCost = fullSheets * selectedPaper.pricePerFullSheet;
    const totalProductionCost = totalPaperCost + plateCost + postPressCost + printingCost;
    const finalTotalPrice = totalProductionCost * (1 + marginPercent / 100);
    const perPieceCost = finalTotalPrice / quantity;

    return {
      quantity,
      feedingSheets,
      fullSheets,
      totalPaperCost,
      printingCost,
      totalProductionCost,
      finalTotalPrice,
      perPieceCost
    };
  };

  const results = [
    calculateForQty(qty1),
    calculateForQty(qty2),
    calculateForQty(qty3),
    calculateForQty(qty4),
  ].filter(Boolean) as Array<NonNullable<ReturnType<typeof calculateForQty>>>;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          Volume Economies of Scale Simulator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simulate how fixed prepress charges (like plate charges and transport setups) are distributed across different print volumes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left configurations */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400 font-mono">
            Setup Variables
          </span>

          <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <label className="block font-semibold mb-1">Paper Grade</label>
              <select
                value={selectedPaperId}
                onChange={(e) => setSelectedPaperId(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              >
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Item Size</label>
              <select
                value={itemSize}
                onChange={(e) => setItemSize(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="A3">A3 Size (2-Up)</option>
                <option value="A4">A4 Size (4-Up)</option>
                <option value="A5">A5 Size (8-Up)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold mb-1">Plate Charge (₹)</label>
                <input
                  type="number"
                  value={plateCost}
                  onChange={(e) => setPlateCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Logistics & Post (₹)</label>
                <input
                  type="number"
                  value={postPressCost}
                  onChange={(e) => setPostPressCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold mb-1">Print Sides</label>
                <select
                  value={printSides}
                  onChange={(e) => setPrintSides(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="front">Front Only</option>
                  <option value="both">Both Sides</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Profit Margin %</label>
                <input
                  type="number"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400 font-mono">
              Compare Quantities
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[10px] uppercase font-normal mb-0.5">Tier 1 Qty</label>
                <input
                  type="number"
                  value={qty1}
                  onChange={(e) => setQty1(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[10px] uppercase font-normal mb-0.5">Tier 2 Qty</label>
                <input
                  type="number"
                  value={qty2}
                  onChange={(e) => setQty2(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[10px] uppercase font-normal mb-0.5">Tier 3 Qty</label>
                <input
                  type="number"
                  value={qty3}
                  onChange={(e) => setQty3(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[10px] uppercase font-normal mb-0.5">Tier 4 Qty</label>
                <input
                  type="number"
                  value={qty4}
                  onChange={(e) => setQty4(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right graphical comparison layout */}
        <div className="lg:col-span-8 space-y-6">
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Quantity (Volume)</th>
                  <th className="py-3 px-4 text-right">Paper Cost</th>
                  <th className="py-3 px-4 text-right">Press Cost</th>
                  <th className="py-3 px-4 text-right">Grand Total (Quote)</th>
                  <th className="py-3 px-4 text-right bg-indigo-50 text-indigo-900">Per Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs text-slate-700 dark:text-slate-300">
                {results.map((res, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-800/50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{res.quantity.toLocaleString()} pcs</td>
                    <td className="py-3.5 px-4 text-right">₹{res.totalPaperCost.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">₹{res.printingCost.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-900 dark:text-slate-100 font-bold">₹{res.finalTotalPrice.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</td>
                    <td className="py-3.5 px-4 text-right bg-indigo-50/30 text-indigo-700 font-bold text-sm">
                      ₹{res.perPieceCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Economies of scale visual bar graph bars */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Economies of Scale Curve (Visual Cost Drops)
            </span>

            <div className="space-y-4 pt-2">
              {results.map((res, idx) => {
                // Find maximum perPieceCost to scale bars
                const maxCost = Math.max(...results.map(r => r.perPieceCost));
                const percentageOfMax = maxCost > 0 ? (res.perPieceCost / maxCost) * 100 : 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{res.quantity.toLocaleString()} items</span>
                      <span className="font-extrabold text-indigo-600">₹{res.perPieceCost.toFixed(2)} / item</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-900/60 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageOfMax}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="bg-indigo-600 h-full rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-2">
              * Bars scale relative to the highest per-piece price tier. Notice how prepress preparation setups render low-volume printing disproportionately expensive, and how high volumes absorb fixed setups to offer optimal profit margins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
