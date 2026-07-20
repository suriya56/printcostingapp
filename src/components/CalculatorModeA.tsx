import { apiFetch } from '../mockApi';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PaperCascadingSelector from './PaperCascadingSelector';
import { 
  PaperProfile, 
  PlateProfile,
  PrintingBracketsConfig, 
  Quotation,
  PostPressItem
} from '../types';
import { 
  FileText, 
  Layers, 
  TrendingUp, 
  Calculator, 
  CircleAlert, 
  IndianRupee, 
  CheckCircle2, 
  Save,
  Plus,
  Trash2,
  Download
} from 'lucide-react';

interface CalculatorModeAProps {
  papers: PaperProfile[];
  plateProfiles: PlateProfile[];
  brackets: PrintingBracketsConfig;
  token: string;
  onSaveSuccess: (newQuote: Quotation) => void;
  quoteToEdit?: Quotation | null;
  onClearEdit?: () => void;
}

export default function CalculatorModeA({ papers, plateProfiles, brackets, token, onSaveSuccess, quoteToEdit, onClearEdit }: CalculatorModeAProps) {
  // Quotation fields
  const [customerName, setCustomerName] = useState('');
  const [jobName, setJobName] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [marginPercent, setMarginPercent] = useState<number>(25);
  
  // Mode A specific fields
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [printSides, setPrintSides] = useState<'front' | 'both'>('front');
  const [divisor, setDivisor] = useState<number>(4);
  const [wastage, setWastage] = useState<number>(50);
  const [printType, setPrintType] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');
  const [selectedPlateProfileId, setSelectedPlateProfileId] = useState('');
  const [platesCount, setPlatesCount] = useState<number>(1);
  const [postPressCosts, setPostPressCosts] = useState<PostPressItem[]>([]);
  
  const [isCustomPaper, setIsCustomPaper] = useState(false);
  const [isCustomPlate, setIsCustomPlate] = useState(false);

  // Status flags
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default to first paper if loaded
  useEffect(() => {
    if (quoteToEdit && quoteToEdit.mode === 'A') {
      const inputs = quoteToEdit.inputs;
      setCustomerName(quoteToEdit.customerName);
      setJobName(quoteToEdit.jobName);
      setQuantity(inputs.quantity);
      setMarginPercent(inputs.marginPercent);

      const mA = inputs.modeA;
      if (mA) {
        setSelectedPaperId(mA.paperProfileId);
        setPrintType(mA.printType || 'multi_color');
        setPrintSides(mA.printSides);
        setWastage(mA.wastage);
        
        if (mA.postPressCosts && mA.postPressCosts.length > 0) {
          setPostPressCosts(mA.postPressCosts);
        } else if (mA.postPressCost && mA.postPressCost > 0) {
          setPostPressCosts([{ id: Date.now().toString(), name: 'Legacy Post-Press', cost: mA.postPressCost }]);
        } else {
          setPostPressCosts([]);
        }

        setSelectedPlateProfileId(mA.plateProfileId || '');
        setPlatesCount(mA.platesCount || 4);
        
        setIsCustomPaper(mA.isCustomPaper || false);
        if (mA.customPaperName) setManualPaperName(mA.customPaperName);
        if (mA.customPaperPrice) setManualPaperPrice(mA.customPaperPrice);
        
        setIsCustomPlate(mA.isCustomPlate || false);
        if (mA.customPlateName) setManualPlateName(mA.customPlateName);
        if (mA.customPlateCost) setManualPlateCost(mA.customPlateCost);
      }
      return;
    }

    if (papers.length > 0 && !selectedPaperId) {
      setSelectedPaperId(papers[0].id);
    }
  }, [papers]);

  // Default to first plate profile if loaded
  useEffect(() => {
    if (plateProfiles && plateProfiles.length > 0 && !selectedPlateProfileId) {
      setSelectedPlateProfileId(plateProfiles[0].id);
    }
  }, [plateProfiles]);

  // Manual overrides for paper
  const [manualPaperName, setManualPaperName] = useState('Custom Paper');
  const [manualPaperPrice, setManualPaperPrice] = useState(7.50);
  const [manualPaperGsm, setManualPaperGsm] = useState(130);
  const [manualPaperType, setManualPaperType] = useState('Art Matte');

  // Manual overrides for plate profile
  const [manualPlateName, setManualPlateName] = useState('Custom Plate');
  const [manualPlateCost, setManualPlateCost] = useState(400);

  const selectedPaper = papers.find(p => p.id === selectedPaperId);

  const selectedPlateProfile = plateProfiles?.find(p => p.id === selectedPlateProfileId);

  const plateCost = isCustomPlate 
    ? (manualPlateCost * platesCount) 
    : (selectedPlateProfile ? (selectedPlateProfile.cost * platesCount) : 0);

  const activePaper = isCustomPaper
    ? { pricePerFullSheet: manualPaperPrice, name: manualPaperName }
    : selectedPaper;

  // Client-side calculations for instant preview
  
  const handleExportCsv = () => {
    if (!liveResult) return;
    
    const rows = [
      ['Quotation Detail', 'Value'],
      ['Job Name', jobName || 'Untitled'],
      ['Customer Name', customerName || 'N/A'],
      ['Quantity', quantity.toString()],
      ['Margin %', marginPercent.toString()],
      ['', ''],
      ['Production Math', ''],
      ['Total Plates', platesCount.toString()],
      ['Feeding Sheets Required', liveResult.feedingSheets.toFixed(1)],
      ['Full Sheets Required', liveResult.fullSheets.toFixed(1)],
      ['Total Impressions', liveResult.impressions.toString()],
      ['', ''],
      ['Cost Breakdown (INR)', ''],
      ['Paper Cost', liveResult.paperCost.toFixed(2)],
      ['Plates / Setup Cost', plateCost.toFixed(2)],
      ['Printing Cost', liveResult.printingCost.toFixed(2)],
      ...postPressCosts.map(item => [`Post-Press: ${item.name}`, item.cost.toFixed(2)]),
      ['Total Production Cost', liveResult.totalProductionCost.toFixed(2)],
      ['', ''],
      ['Final Quote', ''],
      ['Margin Amount', (liveResult.finalTotalPrice - liveResult.totalProductionCost).toFixed(2)],
      ['Total Price (with margin)', liveResult.finalTotalPrice.toFixed(2)],
      ['Price Per Piece', liveResult.perPieceCost.toFixed(2)]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Quotation_${jobName || 'Draft'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateLive = () => {
    const safeActivePaper = activePaper || { pricePerFullSheet: 0 };

    const totalWastage = platesCount * wastage;
    const feedingSheets = (quantity / divisor) + totalWastage;
    const fullSheets = feedingSheets / 2;
    
    const impressions = printSides === 'both' ? feedingSheets * 2 : feedingSheets;

    // Bracket Calculation
    let printingCost = 0;
    if (impressions > 0) {
      let targetBrackets = brackets;
      if (printType === 'single_color') {
        targetBrackets = brackets.singleColor || {
          bracket1: { maxImpressions: 1100, cost: 300 },
          excessStepImpressions: 1000,
          excessStepCost: 100
        } as any;
      } else if (printType === 'single_color_double_dummy') {
        targetBrackets = brackets.singleColorDoubleDummy || {
          bracket1: { maxImpressions: 1100, cost: 400 },
          excessStepImpressions: 1000,
          excessStepCost: 150
        } as any;
      }
      
      const b1 = targetBrackets.bracket1;
      const b2 = (printType === 'single_color' || printType === 'single_color_double_dummy') ? undefined : targetBrackets.bracket2;
      const b3 = (printType === 'single_color' || printType === 'single_color_double_dummy') ? undefined : targetBrackets.bracket3;
      if (impressions <= b1.maxImpressions) {
        printingCost = b1.cost;
      } else if (b2 && impressions <= b2.maxImpressions) {
        printingCost = b2.cost;
      } else if (b3 && impressions <= b3.maxImpressions) {
        printingCost = b3.cost;
      } else {
        const lastBracket = b3 || b2 || b1;
        const excess = impressions - lastBracket.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        printingCost = lastBracket.cost + (steps * targetBrackets.excessStepCost);
      }
    }
    const totalPostPressCost = postPressCosts.reduce((sum, item) => sum + item.cost, 0);

    const totalPaperCost = fullSheets * safeActivePaper.pricePerFullSheet;
    const totalProductionCost = totalPaperCost + plateCost + totalPostPressCost + printingCost;
    const finalTotalPrice = totalProductionCost * (1 + marginPercent / 100);
    const perPieceCost = finalTotalPrice / quantity;

    return {
      feedingSheets,
      fullSheets,
      impressions,
      paperCost: totalPaperCost,
      printingCost,
      miscCost: totalPostPressCost,
      plateCost,
      platesCount,
      totalProductionCost,
      finalTotalPrice,
      perPieceCost
    };
  };

  const liveResult = calculateLive();

  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !jobName) {
      setError('Please provide Customer Name and Job Name to save.');
      return;
    }
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const url = quoteToEdit ? `/api/quotations/${quoteToEdit.id}` : '/api/quotations';
      const method = quoteToEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName,
          jobName,
          mode: 'A',
          results: liveResult,
          inputs: {
            quantity,
            marginPercent,
            modeA: {
              paperProfileId: selectedPaperId,
              printSides,
              wastage,
              plateCost,
              postPressCosts,
              plateProfileId: selectedPlateProfileId,
              platesCount,
              divisor,
              isCustomPaper,
              customPaperName: manualPaperName,
              customPaperPrice: manualPaperPrice,
              customPaperGsm: manualPaperGsm,
              printType,
              isCustomPlate,
              customPlateName: manualPlateName,
              customPlateCost: manualPlateCost
            }
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save quotation');
      }

      setSuccess('Quotation calculated and saved to logs successfully!');
      onSaveSuccess(data);
      // Reset basic descriptive inputs but keep configuration values
      setCustomerName('');
      setJobName('');
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving quotation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Inputs Form */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-sm border border-slate-100 dark:border-slate-700 shadow-sm space-y-1">
        {quoteToEdit && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 flex items-center justify-between">
            <div className="text-amber-800 text-sm font-medium">
              Editing Quotation: <span className="font-bold">{quoteToEdit.jobName}</span>
            </div>
            {onClearEdit && (
              <button 
                onClick={onClearEdit}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-1 py-0.5 rounded-md transition font-medium cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            Single-Page Flyer & Poster Estimator
          </h2>
          
        </div>

        <form onSubmit={handleSaveQuotation} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ABC Logistics"
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Job Name / Description *
              </label>
              <input
                type="text"
                required
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="A4 Promo Flyer Front & Back"
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-1">
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Product Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-1 sm:col-span-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Print Type
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full">
                <button
                  type="button"
                  onClick={() => setPrintType('multi_color')}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition ${printType === 'multi_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Multi-Color
                </button>
                <button
                  type="button"
                  onClick={() => setPrintType('single_color')}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition ${printType === 'single_color' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Single Color
                </button>
                <button
                  type="button"
                  onClick={() => setPrintType('single_color_double_dummy')}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition ${printType === 'single_color_double_dummy' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Single Color (Double Dummy)
                </button>
              </div>
            </div>
             <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Sheet Divisor (Ups)
              </label>
              <input
                type="number"
                min="1"
                value={divisor}
                onChange={(e) => setDivisor(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200 font-medium font-mono"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Printing Sides
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPrintSides('front')}
                  className={`py-0.5 rounded-sm text-xs font-semibold transition cursor-pointer ${
                    printSides === 'front' ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                  }`}
                >
                  Front Only
                </button>
                <button
                  type="button"
                  onClick={() => setPrintSides('both')}
                  className={`py-0.5 rounded-sm text-xs font-semibold transition cursor-pointer ${
                    printSides === 'both' ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                  }`}
                >
                  Both Sides
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Select Paper Profile
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                  <input type="checkbox" checked={isCustomPaper} onChange={e => setIsCustomPaper(e.target.checked)} className="rounded text-blue-600" />
                  Custom Paper
                </label>
              </div>
              {isCustomPaper ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={manualPaperName} onChange={e => setManualPaperName(e.target.value)} placeholder="Paper Name" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm focus:border-slate-900 focus:outline-none" />
                  <input type="number" step="0.01" value={manualPaperPrice} onChange={e => setManualPaperPrice(parseFloat(e.target.value) || 0)} placeholder="Price/fs" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm font-mono focus:border-slate-900 focus:outline-none" />
                </div>
              ) : (
                <PaperCascadingSelector
                  papers={papers}
                  selectedPaperId={selectedPaperId}
                  onChange={(id) => setSelectedPaperId(id)}
                />
              )}
            </div>

          </div>

          <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Plate Settings & Profiles</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Select Plate Profile
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                    <input type="checkbox" checked={isCustomPlate} onChange={e => setIsCustomPlate(e.target.checked)} className="rounded text-blue-600" />
                    Custom Plate
                  </label>
                </div>
                {isCustomPlate ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <input type="text" value={manualPlateName} onChange={e => setManualPlateName(e.target.value)} placeholder="Plate Name" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm focus:border-slate-900 focus:outline-none" />
                     <input type="number" step="0.01" value={manualPlateCost} onChange={e => setManualPlateCost(parseFloat(e.target.value) || 0)} placeholder="Cost/plate" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm font-mono focus:border-slate-900 focus:outline-none" />
                   </div>
                ) : (
                  <select
                    value={selectedPlateProfileId}
                    onChange={(e) => setSelectedPlateProfileId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {plateProfiles && plateProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.cost.toFixed(2)}/plate)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Number of Plates
                </label>
                <input
                  type="number"
                  min="1"
                  value={platesCount}
                  onChange={(e) => setPlatesCount(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
            </div>
            <div className="text-xs font-mono text-white font-semibold bg-slate-900 p-2.5 rounded-sm shadow-sm flex justify-between items-center">
              <span>Total Plates Charge:</span>
              <span>₹{plateCost.toFixed(2)} ({platesCount} Plates @ ₹{isCustomPlate ? manualPlateCost : (selectedPlateProfile ? selectedPlateProfile.cost : 0)})</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Post-Press & Logistics
              </label>
              <button
                type="button"
                onClick={() => setPostPressCosts([...postPressCosts, { id: Date.now().toString(), name: '', cost: 0 }])}
                className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700 cursor-pointer bg-blue-50 px-2 py-1 rounded-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            
            {postPressCosts.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 italic py-1">No post-press costs added.</div>
            ) : (
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {postPressCosts.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-sm">
                    <div className="flex items-center gap-1.5 w-full mr-2">
                      <select
                        value={item.name}
                        onChange={(e) => {
                          const newCosts = [...postPressCosts];
                          newCosts[index].name = e.target.value;
                          setPostPressCosts(newCosts);
                        }}
                        className="flex-1 min-w-[80px] w-auto px-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
                      >
                        <option value="" disabled>Select option...</option>
                        <optgroup label="Binding & Assembly">
                          <option value="Folding">Folding</option>
                          <option value="Pinning">Pinning</option>
                          <option value="Perfect binding">Perfect binding</option>
                          <option value="Cover Making">Cover Making</option>
                          <option value="Box making">Box making</option>
                          <option value="Gumming">Gumming</option>
                        </optgroup>
                        <optgroup label="Cutting & Shaping">
                          <option value="DIE Making">DIE Making</option>
                          <option value="Punching">Punching</option>
                          <option value="Cutting/finishing charges">Cutting/finishing charges</option>
                        </optgroup>
                        <optgroup label="Embellishments & Coatings">
                          <option value="Spot UV/Foiling">Spot UV/Foiling</option>
                          <option value="Knurling">Knurling</option>
                          <option value="UV/Varnish">UV/Varnish</option>
                        </optgroup>
                        <optgroup label="Logistics & Miscellaneous">
                          <option value="Paper/board transport">Paper/board transport</option>
                          <option value="Packing & Delivery charges">Packing & Delivery charges</option>
                          <option value="Others">Others</option>
                        </optgroup>
                      </select>
                      {item.name === 'Others' && (
                        <input
                          type="text"
                          placeholder="Specify..."
                          value={(item as any).otherName || ''}
                          onChange={(e) => {
                            const newCosts = [...postPressCosts];
                            (newCosts[index] as any).otherName = e.target.value;
                            setPostPressCosts(newCosts);
                          }}
                          className="w-16 px-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-slate-900"
                        />
                      )}
                      <div className="relative w-20 flex-shrink-0">
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xs font-medium">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={item.cost || ''}
                          onChange={(e) => {
                            const newCosts = [...postPressCosts];
                            newCosts[index].cost = e.target.value === "" ? ("" as any) : parseInt(e.target.value);
                            setPostPressCosts(newCosts);
                          }}
                          className="w-full pl-4 pr-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostPressCosts(postPressCosts.filter(c => c.id !== item.id))}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Wastage Allowance (Sheets)
              </label>
              <input
                type="number"
                min="0"
                value={wastage}
                onChange={(e) => setWastage(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Profit Margin (%)
              </label>
              <input
                type="number"
                min="0"
                value={marginPercent}
                onChange={(e) => setMarginPercent(e.target.value === "" ? ("" as any) : parseFloat(e.target.value))}
                className="w-full px-4 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-slate-900 transition text-sm text-slate-800 dark:text-slate-200 font-bold text-blue-600"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm text-rose-700 text-xs flex gap-2 items-center">
              <CircleAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-sm text-emerald-800 text-xs flex gap-2 items-center">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-slate-100 font-medium py-3 rounded-sm transition shadow active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer mt-1"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Quotation...' : 'Calculate and Save Quotation'}
          </button>
        </form>
      </div>

      {/* Live Breakdown Preview */}
      <div className="lg:col-span-5 space-y-1 lg:sticky lg:top-6">
        <div id="estimation-preview-a" className="bg-white dark:bg-slate-800 p-2 rounded-sm border border-slate-300 dark:border-slate-600 shadow-sm relative overflow-hidden">
          {/* Accent decoration */}
          
          
          <div className="flex justify-between items-start relative z-10">
            <span className="bg-blue-500/15 text-slate-800 dark:text-slate-200 border border-blue-500/30 text-[10px] font-mono uppercase px-1 py-0.5 rounded-sm font-bold tracking-wider">
              Live Quotation Preview
            </span>
            {liveResult && (
              <button
                type="button"
                onClick={handleExportCsv}
                data-export-ignore="true"
                className="text-xs bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:border-slate-600 px-1 py-0.5 rounded-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            )}
          </div>

          {liveResult ? (
            <div className="mt-2 space-y-1">
              {/* Grand totals display */}
              <div className="border-b border-slate-200 dark:border-slate-700 pb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">TOTAL ESTIMATED PRICE (INR)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                    ₹{liveResult.finalTotalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-blue-600 font-mono">
                    (+{marginPercent}% margin: ₹{(liveResult.finalTotalPrice - liveResult.totalProductionCost).toLocaleString('en-IN', { maximumFractionDigits: 2 })})
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Price per Item:</span>
                  <span className="font-mono text-blue-600 font-bold">
                    ₹{liveResult.perPieceCost.toFixed(2)} / piece
                  </span>
                </div>
              </div>

              {/* Technical Breakdown */}
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                  Production Sheets Math
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-sm border border-slate-200 dark:border-slate-700 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">FEEDING SHEETS</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{liveResult.feedingSheets}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">FULL SHEETS (23X36)</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{liveResult.fullSheets.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-sm border border-slate-200 dark:border-slate-700 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">IMPRESSIONS</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{liveResult.impressions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">PAPER SPEC</span>
                    <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                      {selectedPaper?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Component Breakdown */}
              <div className="space-y-1 pt-2">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                  Cost Breakdown
                </h4>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Paper Cost:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      ₹{liveResult.paperCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Plate Charge:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      ₹{plateCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Printing Charge (Tier Match):</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      ₹{liveResult.printingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Post-Press & Logistics:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      ₹{liveResult.miscCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 font-bold">
                    <span>Base Production Cost:</span>
                    <span className="font-mono">
                      ₹{liveResult.totalProductionCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 font-bold">
                    <span>Margin Amount:</span>
                    <span className="font-mono text-green-600 dark:text-green-500">
                      ₹{(liveResult.finalTotalPrice - liveResult.totalProductionCost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Please enter quantity and choose a paper to preview live pricing calculations.
            </p>
          )}
        </div>

        {/* Informational Widget about printing tier bracket */}
        
      </div>
    </div>
  );
}
