import { apiFetch } from '../mockApi';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PaperCascadingSelector from './PaperCascadingSelector';
import { 
  PaperProfile, 
  PlateProfile,
  InnerPageSection,
  LaminationRate, 
  MiscCost, 
  PrintingBracketsConfig, 
  PrintCategoryConfig,
  Quotation,
  PostPressItem
} from '../types';
import { 
  BookOpen, 
  Layers, 
  Minimize2, 
  Maximize2, 
  IndianRupee, 
  Save, 
  CheckCircle2, 
  CircleAlert, 
  Settings, 
  FileCheck,
  Plus,
  Trash2,
  Download
} from 'lucide-react';

interface CalculatorModeBProps {
  papers: PaperProfile[];
  laminations: LaminationRate[];
  plateProfiles: PlateProfile[];
  miscCosts: MiscCost[];
  brackets: PrintingBracketsConfig;
  token: string;
  onSaveSuccess: (newQuote: Quotation) => void;
  quoteToEdit?: Quotation | null;
  onClearEdit?: () => void;
}

export default function CalculatorModeB({ 
  papers, 
  laminations, 
  plateProfiles,
  miscCosts, 
  brackets, 
  token, 
  onSaveSuccess,
  quoteToEdit,
  onClearEdit
}: CalculatorModeBProps) {
  // Core Job Metadata
  const [customerName, setCustomerName] = useState('');
  const [jobName, setJobName] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [marginPercent, setMarginPercent] = useState<number>(30);

  // Inner Pages (Text Block)
  const [totalPages, setTotalPages] = useState<number>(32);
  const [upsInner, setUpsInner] = useState<number>(4);
  const [wastageInner, setWastageInner] = useState<number>(100);
  const [printType, setPrintType] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');
  const [printTypeWrapper, setPrintTypeWrapper] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');
  const [divisorInner, setDivisorInner] = useState<number>(2);
  const [selectedPaperInnerId, setSelectedPaperInnerId] = useState('');

  // Support multiple paper sections (different GSMs)
  const [useMultiSection, setUseMultiSection] = useState(false);
  const [innerSections, setInnerSections] = useState<InnerPageSection[]>([
    {
      id: 'sec-1',
      name: 'Main Text Section',
      pagesCount: 32,
      selectedPaperId: '',
      ups: 4,
      wastage: 100,
      divisor: 2,
      plateProfileId: '',
      printType: 'multi_color'
    }
  ]);

  const handleAddSection = () => {
    setInnerSections(prev => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        name: `Section ${prev.length + 1}`,
        pagesCount: 8,
        selectedPaperId: papers[0]?.id || '',
        ups: 4,
        wastage: 50,
        divisor: 2,
        plateProfileId: '',
        printType: 'multi_color'
      }
    ]);
  };

  const handleRemoveSection = (id: string) => {
    setInnerSections(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(sec => sec.id !== id);
    });
  };

  const handleUpdateSection = (id: string, updates: Partial<InnerPageSection>) => {
    setInnerSections(prev => prev.map(sec => 
      sec.id === id ? { ...sec, ...updates } : sec
    ));
  };

  // Wrapper (Cover)
  const [totalWrapperPages, setTotalWrapperPages] = useState<number>(2);
  const [upsWrapper, setUpsWrapper] = useState<number>(2);
  const [wastageWrapper, setWastageWrapper] = useState<number>(50);
  const [divisorWrapper, setDivisorWrapper] = useState<number>(2);
  const [selectedPaperWrapperId, setSelectedPaperWrapperId] = useState('');
  const [wrapperPrintBothSides, setWrapperPrintBothSides] = useState<boolean>(false);

  // Lamination & Dimensions
  const [paperHeight, setPaperHeight] = useState<number>(11);
  const [paperWidth, setPaperWidth] = useState<number>(17);
  const [selectedLamId, setSelectedLamId] = useState('');
  const [laminationSides, setLaminationSides] = useState<number>(1);
  const [laminationCustomSheets, setLaminationCustomSheets] = useState<boolean>(false);
  const [laminationSheets, setLaminationSheets] = useState<number>(0);

  // Miscellaneous/Post-Press cost presets customizable per quote
  const [foldingCost, setFoldingCost] = useState<number>(1500);
  const [bindingCost, setBindingCost] = useState<number>(12000);
  const [logisticalCost, setLogisticalCost] = useState<number>(2000);
  const [postPressCosts, setPostPressCosts] = useState<PostPressItem[]>([]);
  const [selectedPlateInnerId, setSelectedPlateInnerId] = useState('');
  const [selectedPlateWrapperId, setSelectedPlateWrapperId] = useState('');

  
  const [isCustomPaperInner, setIsCustomPaperInner] = useState(false);
  const [customPaperNameInner, setCustomPaperNameInner] = useState('Custom Inner Paper');
  const [customPaperPriceInner, setCustomPaperPriceInner] = useState(5.0);

  const [isCustomPlateInner, setIsCustomPlateInner] = useState(false);
  const [customPlateNameInner, setCustomPlateNameInner] = useState('Custom Inner Plate');
  const [customPlateCostInner, setCustomPlateCostInner] = useState(400);

  const [isCustomPaperWrapper, setIsCustomPaperWrapper] = useState(false);
  const [customPaperNameWrapper, setCustomPaperNameWrapper] = useState('Custom Cover Paper');
  const [customPaperPriceWrapper, setCustomPaperPriceWrapper] = useState(15.0);

  const [isCustomPlateWrapper, setIsCustomPlateWrapper] = useState(false);
  const [customPlateNameWrapper, setCustomPlateNameWrapper] = useState('Custom Cover Plate');
  const [customPlateCostWrapper, setCustomPlateCostWrapper] = useState(400);


  // Manual overrides for Inner Paper
  const [manualPaperInnerName, setManualPaperInnerName] = useState('Custom Inner Paper');
  const [manualPaperInnerPrice, setManualPaperInnerPrice] = useState(6.50);
  const [manualPaperInnerGsm, setManualPaperInnerGsm] = useState(80);
  const [manualPaperInnerType, setManualPaperInnerType] = useState('Maplitho');

  // Manual overrides for Wrapper Paper
  const [manualPaperWrapperName, setManualPaperWrapperName] = useState('Custom Wrapper Paper');
  const [manualPaperWrapperPrice, setManualPaperWrapperPrice] = useState(15.00);
  const [manualPaperWrapperGsm, setManualPaperWrapperGsm] = useState(300);
  const [manualPaperWrapperType, setManualPaperWrapperType] = useState('Art Matte');

  // Lamination
  const [isCustomLamination, setIsCustomLamination] = useState(false);
  // Manual overrides for Lamination Polish
  const [manualLamName, setManualLamName] = useState('Custom Lamination');
  const [manualLamRate, setManualLamRate] = useState(0.15);

  // Manual overrides for Plate Inner
  const [manualPlateInnerName, setManualPlateInnerName] = useState('Custom Inner Plate');
  const [manualPlateInnerCost, setManualPlateInnerCost] = useState(400);

  // Manual overrides for Plate Wrapper
  const [manualPlateWrapperName, setManualPlateWrapperName] = useState('Custom Wrapper Plate');
  const [manualPlateWrapperCost, setManualPlateWrapperCost] = useState(400);

  // Status flags
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set default papers and values on load
  useEffect(() => {
    if (quoteToEdit && quoteToEdit.mode === 'B') {
      const inputs = quoteToEdit.inputs;
      setCustomerName(quoteToEdit.customerName);
      setJobName(quoteToEdit.jobName);
      setQuantity(inputs.quantity);
      setMarginPercent(inputs.marginPercent);

      const mB = inputs.modeB;
      if (mB) {
        setTotalPages(mB.totalPages);
        setPrintType(mB.printType || 'multi_color');
        setPrintTypeWrapper(mB.printTypeWrapper || mB.printType || 'multi_color');
        setUpsInner(mB.upsInner);
        setWastageInner(mB.wastageInner);
        setDivisorInner(mB.divisorInner);
        setSelectedPaperInnerId(mB.paperProfileIdInner);
        if (mB.innerSections) {
          setUseMultiSection(true);
          setInnerSections(mB.innerSections);
        } else {
          setUseMultiSection(false);
        }

        if (mB.totalWrapperPages !== undefined) setTotalWrapperPages(mB.totalWrapperPages);
        setUpsWrapper(mB.upsWrapper);
        setWastageWrapper(mB.wastageWrapper);
        setDivisorWrapper(mB.divisorWrapper);
        setSelectedPaperWrapperId(mB.paperProfileIdWrapper);
        if (mB.wrapperPrintBothSides !== undefined) setWrapperPrintBothSides(mB.wrapperPrintBothSides);

        setPaperHeight(mB.paperHeight);
        setPaperWidth(mB.paperWidth);
        setSelectedLamId(mB.laminationRateId || 'none');
        if (mB.isCustomLamination !== undefined) setIsCustomLamination(mB.isCustomLamination);
        if (mB.manualLamName !== undefined) setManualLamName(mB.manualLamName);
        if (mB.manualLamRate !== undefined) setManualLamRate(mB.manualLamRate);
        setLaminationSides(mB.laminationSides || 1);
        setLaminationCustomSheets(mB.laminationCustomSheets || false);
        setLaminationSheets(mB.laminationSheets || 0);

        setFoldingCost(mB.foldingCost || 0);
        setBindingCost(mB.bindingCost || 0);
        setLogisticalCost(mB.logisticalCost || 0);

        if (mB.postPressCosts && mB.postPressCosts.length > 0) {
          setPostPressCosts(mB.postPressCosts);
        } else {
          const legacyItems: PostPressItem[] = [];
          if (mB.foldingCost) legacyItems.push({ id: Date.now().toString() + '1', name: 'Folding', cost: mB.foldingCost });
          if (mB.bindingCost) legacyItems.push({ id: Date.now().toString() + '2', name: 'Binding', cost: mB.bindingCost });
          if (mB.logisticalCost) legacyItems.push({ id: Date.now().toString() + '3', name: 'Logistics', cost: mB.logisticalCost });
          setPostPressCosts(legacyItems);
        }

        setSelectedPlateInnerId(mB.plateProfileIdInner || '');
        setSelectedPlateWrapperId(mB.plateProfileIdWrapper || '');

        if (mB.isCustomPaperInner !== undefined) setIsCustomPaperInner(mB.isCustomPaperInner);
        if (mB.customPaperNameInner !== undefined) setCustomPaperNameInner(mB.customPaperNameInner);
        if (mB.customPaperPriceInner !== undefined) setCustomPaperPriceInner(mB.customPaperPriceInner);

        if (mB.isCustomPlateInner !== undefined) setIsCustomPlateInner(mB.isCustomPlateInner);
        if (mB.customPlateNameInner !== undefined) setCustomPlateNameInner(mB.customPlateNameInner);
        if (mB.customPlateCostInner !== undefined) setCustomPlateCostInner(mB.customPlateCostInner);

        if (mB.isCustomPaperWrapper !== undefined) setIsCustomPaperWrapper(mB.isCustomPaperWrapper);
        if (mB.customPaperNameWrapper !== undefined) setCustomPaperNameWrapper(mB.customPaperNameWrapper);
        if (mB.customPaperPriceWrapper !== undefined) setCustomPaperPriceWrapper(mB.customPaperPriceWrapper);

        if (mB.isCustomPlateWrapper !== undefined) setIsCustomPlateWrapper(mB.isCustomPlateWrapper);
        if (mB.customPlateNameWrapper !== undefined) setCustomPlateNameWrapper(mB.customPlateNameWrapper);
        if (mB.customPlateCostWrapper !== undefined) setCustomPlateCostWrapper(mB.customPlateCostWrapper);
      }
      return;
    }
    
    if (papers.length > 0) {
      if (!selectedPaperInnerId) setSelectedPaperInnerId(papers[0].id);
      if (!selectedPaperWrapperId) setSelectedPaperWrapperId(papers[Math.min(2, papers.length - 1)].id);
      
      setInnerSections(prev => prev.map(sec => 
        !sec.selectedPaperId ? { ...sec, selectedPaperId: papers[0].id } : sec
      ));
    }
    if (laminations.length > 0 && !selectedLamId) {
      setSelectedLamId(laminations[0].id);
    }
    if (plateProfiles && plateProfiles.length > 0) {
      if (!selectedPlateInnerId) setSelectedPlateInnerId(plateProfiles[0].id);
      if (!selectedPlateWrapperId) setSelectedPlateWrapperId(plateProfiles[Math.min(1, plateProfiles.length - 1)].id);
    }
  }, [papers, laminations, plateProfiles]);

  const actualInnerPages = useMultiSection 
    ? innerSections.reduce((sum, sec) => sum + sec.pagesCount, 0)
    : totalPages;

  const platesCountInner = Math.ceil(totalPages / upsInner);
  const actualPlatesCountInner = useMultiSection
    ? innerSections.reduce((sum, sec) => sum + Math.ceil(sec.pagesCount / sec.ups), 0)
    : platesCountInner;

  const platesCountWrapper = Math.ceil(totalWrapperPages / upsWrapper);

  const selectedPlateInner = plateProfiles?.find(p => p.id === selectedPlateInnerId);

  const selectedPlateWrapper = plateProfiles?.find(p => p.id === selectedPlateWrapperId);

  const paperWrapper = papers.find(p => p.id === selectedPaperWrapperId);

  const lamination = laminations.find(l => l.id === selectedLamId);

  const plateCostInner = isCustomPlateInner ? (customPlateCostInner * platesCountInner) : (selectedPlateInner ? (selectedPlateInner.cost * platesCountInner) : 0);
  const actualPlateCostInner = useMultiSection 
    ? innerSections.reduce((sum, sec) => {
        const profileId = sec.plateProfileId || selectedPlateInnerId;
        const profile = plateProfiles?.find(p => p.id === profileId);
        const secPlates = Math.ceil(sec.pagesCount / sec.ups);
        if (sec.isCustomPlate) {
          return sum + ((sec.manualPlateCost || 0) * secPlates);
        }
        return sum + (profile ? (profile.cost * secPlates) : 0);
      }, 0)
    : plateCostInner;

  const plateCostWrapper = isCustomPlateWrapper ? (customPlateCostWrapper * platesCountWrapper) : (selectedPlateWrapper ? (selectedPlateWrapper.cost * platesCountWrapper) : 0);
  const plateCost = actualPlateCostInner + plateCostWrapper;

  // Handle dynamic loading of miscellaneous cost defaults based on preset quantities
  useEffect(() => {
    if (quoteToEdit) return; // Don't override if editing
    
    const newItems: PostPressItem[] = [];
    
    // Folding cost default from preset if available
    const foldPreset = miscCosts.find(c => c.name.toLowerCase().includes('fold'));
    if (foldPreset) {
      newItems.push({ id: 'preset-fold', name: 'Folding', cost: foldPreset.type === 'per_unit' ? foldPreset.cost * quantity : foldPreset.cost });
    }

    // Perfect Binding cost default from preset
    const bindPreset = miscCosts.find(c => c.name.toLowerCase().includes('bind') || c.name.toLowerCase().includes('pin'));
    if (bindPreset) {
      newItems.push({ id: 'preset-bind', name: 'Binding', cost: bindPreset.type === 'per_unit' ? bindPreset.cost * quantity : bindPreset.cost });
    }

    // Logistics cost default
    const logisticsPreset = miscCosts.find(c => c.name.toLowerCase().includes('transport') || c.name.toLowerCase().includes('logistics'));
    if (logisticsPreset) {
      newItems.push({ id: 'preset-logistics', name: 'Logistics', cost: logisticsPreset.type === 'per_unit' ? logisticsPreset.cost * quantity : logisticsPreset.cost });
    }
    
    if (newItems.length > 0) {
      setPostPressCosts(newItems);
    }
  }, [quantity, miscCosts, quoteToEdit]);

  // Core Math Engine matching our Mode B requirements
  
  const handleExportCsv = () => {
    if (!liveResult) return;
    
    const rows = [
      ['Book Quotation Detail', 'Value'],
      ['Job Name', jobName || 'Untitled'],
      ['Customer Name', customerName || 'N/A'],
      ['Quantity', quantity.toString()],
      ['Total Pages', totalPages.toString()],
      ['Margin %', marginPercent.toString()],
      ['', ''],
      ['Production Math', ''],
      ['Forms Count', liveResult.formsCount.toString()],
      ['Total Plates', (liveResult.platesCountInner + liveResult.platesCountWrapper).toFixed(1)],
      ['Inner Full Sheets', liveResult.fullSheetsInner.toFixed(1)],
      ['Wrapper Full Sheets', liveResult.fullSheetsWrapper.toFixed(1)],
      ['Total Impressions', liveResult.impressions.toString()],
      ['Lamination Area (sq-in)', liveResult.laminationAreaSqIn.toFixed(2)],
      ['', ''],
      ['Cost Breakdown (INR)', ''],
      ['Inner Paper Cost', liveResult.innerPaperCost.toFixed(2)],
      ['Wrapper Paper Cost', liveResult.wrapperPaperCost.toFixed(2)],
      ['Cover Lamination Cost', liveResult.laminationCost.toFixed(2)],
      ['Plates / Setup Cost', (liveResult.plateCostInner + liveResult.plateCostWrapper).toFixed(2)],
      ['Printing Cost', liveResult.printingCost.toFixed(2)],
      ...postPressCosts.map(item => [`Post-Press: ${item.name}`, item.cost.toFixed(2)]),
      ['Total Production Cost', liveResult.totalProductionCost.toFixed(2)],
      ['', ''],
      ['Final Quote', ''],
      ['Margin Amount', (liveResult.finalTotalPrice - liveResult.totalProductionCost).toFixed(2)],
      ['Total Price (with margin)', liveResult.finalTotalPrice.toFixed(2)],
      ['Price Per Book', liveResult.perPieceCost.toFixed(2)]
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

    let platesCountInnerVal = 0;
    let formsCountVal = 0;
    let feedingSheetsInnerVal = 0;
    let fullSheetsInnerVal = 0;
    let innerPaperCostVal = 0;
    let plateCostInnerVal = 0;

    if (useMultiSection) {
      for (const sec of innerSections) {
        const paperSec = papers.find(p => p.id === sec.selectedPaperId);
        const activePaperSec = sec.isCustomPaper ? { pricePerFullSheet: sec.manualPaperPrice || 0 } : (paperSec || { pricePerFullSheet: 0 });

        const secPlates = Math.ceil(sec.pagesCount / sec.ups);
        const secForms = (sec.pagesCount / sec.ups) / 2;
        const secTotalWastage = secPlates * sec.wastage;
        const secFeeding = (secForms * quantity) + secTotalWastage;
        const secFull = secFeeding / sec.divisor;
        const secCost = secFull * activePaperSec.pricePerFullSheet;

        platesCountInnerVal += secPlates;
        formsCountVal += secForms;
        feedingSheetsInnerVal += secFeeding;
        fullSheetsInnerVal += secFull;
        innerPaperCostVal += secCost;

        // Plate cost for this section
        if (sec.isCustomPlate) {
          plateCostInnerVal += (sec.manualPlateCost || 0) * secPlates;
        } else {
          const secPlateProfileId = sec.plateProfileId || selectedPlateInnerId;
          const secPlateProfile = plateProfiles?.find(p => p.id === secPlateProfileId);
          if (secPlateProfile) {
            plateCostInnerVal += secPlateProfile.cost * secPlates;
          }
        }
      }
    } else {
      const paperInner = papers.find(p => p.id === selectedPaperInnerId);
      const activePaperInner = isCustomPaperInner ? { pricePerFullSheet: customPaperPriceInner } : (paperInner || { pricePerFullSheet: 0 });

      platesCountInnerVal = Math.ceil(totalPages / upsInner);
      formsCountVal = (totalPages / upsInner) / 2;
      const innerTotalWastage = platesCountInnerVal * wastageInner;
      feedingSheetsInnerVal = (formsCountVal * quantity) + innerTotalWastage;
      fullSheetsInnerVal = feedingSheetsInnerVal / divisorInner;
      innerPaperCostVal = fullSheetsInnerVal * activePaperInner.pricePerFullSheet;

      plateCostInnerVal = plateCostInner; // Uses the active logic above
    }

    // Step 3: Paper Calculations (Wrapper)
    const activePaperWrapper = isCustomPaperWrapper ? { pricePerFullSheet: customPaperPriceWrapper } : (paperWrapper || { pricePerFullSheet: 0 });
    const wrapperFormsCount = platesCountWrapper / 2;
    const wrapperTotalWastage = platesCountWrapper * wastageWrapper;
    const feedingSheetsWrapper = Math.ceil(wrapperFormsCount * quantity) + wrapperTotalWastage;
    const fullSheetsWrapper = feedingSheetsWrapper / divisorWrapper;
    const wrapperPaperCost = fullSheetsWrapper * activePaperWrapper.pricePerFullSheet;

    // Step 4: Lamination Cost
    const lamRate = isCustomLamination ? manualLamRate : (lamination ? lamination.ratePerSqInch : 0);
    const laminationAreaSqIn = paperHeight * paperWidth;
    const baseLaminationCost = (laminationAreaSqIn * lamRate) / 100;
    const lamSheetsUsed = laminationCustomSheets ? laminationSheets : (quantity * (platesCountWrapper / 2));
    const laminationCost = baseLaminationCost * laminationSides * lamSheetsUsed;

    // Step 5: Printing Cost Match (via Quantity)
    // Front + Back for inner, Wrapper based on toggle
    const innerImpressions = feedingSheetsInnerVal * 2;
    const wrapperImpressions = wrapperPrintBothSides ? (feedingSheetsWrapper * 2) : feedingSheetsWrapper;
    const totalImpressions = innerImpressions + wrapperImpressions;

    
    let printingCost = 0;
    const getBasePrintingCost = (pType: string) => {
      if (quantity <= 0) return 0;
      let targetBrackets: PrintCategoryConfig = brackets;
      if (pType === 'single_color') {
        targetBrackets = brackets.singleColor || {
          bracket1: { maxImpressions: 1100, cost: 300 },
          excessStepImpressions: 1000,
          excessStepCost: 100
        };
      } else if (pType === 'single_color_double_dummy') {
        targetBrackets = brackets.singleColorDoubleDummy || {
          bracket1: { maxImpressions: 1100, cost: 400 },
          excessStepImpressions: 1000,
          excessStepCost: 150
        };
      }
      const isSingle = (pType === 'single_color' || pType === 'single_color_double_dummy');
      const b1 = targetBrackets.bracket1;
      const b2 = isSingle ? undefined : targetBrackets.bracket2;
      const b3 = isSingle ? undefined : targetBrackets.bracket3;
      let baseCost = 0;
      if (quantity <= b1.maxImpressions) {
        baseCost = b1.cost;
      } else if (b2 && quantity <= b2.maxImpressions) {
        baseCost = b2.cost;
      } else if (b3 && quantity <= b3.maxImpressions) {
        baseCost = b3.cost;
      } else {
        const lastBracket = b3 || b2 || b1;
        const excess = quantity - lastBracket.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        baseCost = lastBracket.cost + (steps * targetBrackets.excessStepCost);
      }
      return baseCost;
    };

    if (quantity > 0) {
      if (useMultiSection) {
        for (const sec of innerSections) {
          const secPlates = Math.ceil(sec.pagesCount / sec.ups);
          const secBaseCost = getBasePrintingCost(sec.printType || printType || 'multi_color');
          printingCost += secBaseCost * secPlates;
        }
      } else {
        const baseCost = getBasePrintingCost(printType || 'multi_color');
        printingCost += baseCost * platesCountInnerVal;
      }
      
      const wrapperBaseCost = getBasePrintingCost(printTypeWrapper || 'multi_color');
      printingCost += wrapperBaseCost * platesCountWrapper;
    }

    // cost aggregates
    const totalMaterialCost = innerPaperCostVal + wrapperPaperCost + laminationCost;
    const totalMiscCosts = postPressCosts.reduce((sum, item) => sum + item.cost, 0);
    const totalProductionCost = totalMaterialCost + totalMiscCosts + (plateCostInnerVal + plateCostWrapper) + printingCost;
    const finalTotalPrice = totalProductionCost * (1 + marginPercent / 100);
    const perPieceCost = finalTotalPrice / quantity;

    return {
      feedingSheets: feedingSheetsInnerVal + feedingSheetsWrapper,
      fullSheets: fullSheetsInnerVal + fullSheetsWrapper,
      impressions: totalImpressions,
      platesCount: platesCountInnerVal + platesCountWrapper,
      platesCountInner: platesCountInnerVal,
      platesCountWrapper,
      plateCost: plateCostInnerVal + plateCostWrapper,
      plateCostInner: plateCostInnerVal,
      plateCostWrapper,
      formsCount: formsCountVal,
      feedingSheetsInner: feedingSheetsInnerVal,
      fullSheetsInner: fullSheetsInnerVal,
      paperCost: innerPaperCostVal + wrapperPaperCost,
      innerPaperCost: innerPaperCostVal,
      feedingSheetsWrapper,
      fullSheetsWrapper,
      wrapperPaperCost,
      laminationAreaSqIn,
      laminationCost,
      printingCost,
      miscCost: totalMiscCosts,
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
          mode: 'B',
          results: liveResult,
          inputs: {
            quantity,
            marginPercent,
            modeB: {
              totalPages: actualInnerPages,
              upsInner,
              wastageInner,
              divisorInner,
              paperProfileIdInner: selectedPaperInnerId,
              innerSections: useMultiSection ? innerSections.map(sec => ({
                ...sec,
              })) : undefined,
              totalWrapperPages,
              upsWrapper,
              wastageWrapper,
              divisorWrapper,
              wrapperPrintBothSides,
              paperProfileIdWrapper: selectedPaperWrapperId,
              isCustomPaperInner,
              customPaperNameInner,
              customPaperPriceInner,
              isCustomPlateInner,
              customPlateNameInner,
              customPlateCostInner,
              isCustomPaperWrapper,
              customPaperNameWrapper,
              customPaperPriceWrapper,
              isCustomPlateWrapper,
              customPlateNameWrapper,
              customPlateCostWrapper,
              paperHeight,
              paperWidth,
              laminationRateId: selectedLamId,
              laminationSides,
              laminationCustomSheets,
              isCustomLamination,
              manualLamName,
              manualLamRate,
              laminationSheets: laminationCustomSheets ? laminationSheets : 0,
              foldingCost,
              bindingCost,
              logisticalCost,
              postPressCosts,
              plateCost,
              plateProfileIdInner: selectedPlateInnerId,
              plateProfileIdWrapper: selectedPlateWrapperId,
              platesCountInner: actualPlatesCountInner,
              platesCountWrapper,
              plateCostInner: actualPlateCostInner,
              plateCostWrapper
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
      {/* Input Parameters panel */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-sm border border-slate-100 dark:border-slate-700 shadow-sm space-y-1">
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
            <BookOpen className="w-5 h-5 text-blue-600" />
            Multiple-Page Booklet & Catalog Estimator (Mode B)
          </h2>
          
        </div>

        <form onSubmit={handleSaveQuotation} className="space-y-4">
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            <div className="flex-1 w-full space-y-2">
          {/* Section 1: Customer Metadata */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 space-y-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Phoenix Publications"
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Book Title / Job Name *</label>
                <input
                  type="text"
                  required
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="32-Page Annual Report"
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>


            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Total Books (Quantity)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Profit Margin (%)</label>
                <input
                  type="number"
                  min="0"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(e.target.value === "" ? ("" as any) : parseFloat(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-blue-600 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Total Inner Pages</label>
                <input
                  type="number"
                  min="1"                  
                  value={actualInnerPages}
                  disabled={useMultiSection}
                  onChange={(e) => setTotalPages(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  className={`w-full px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-bold ${
                    useMultiSection ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800'
                  }`}
                />
                
              </div>
            </div>
          </div>

          {/* Section 2: Inner Pages (Text block) */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-150 gap-2">
              
              <label className="flex items-center space-x-2 text-xs font-semibold text-blue-600 cursor-pointer bg-blue-50 hover:bg-blue-100/70 px-1 py-0.5 rounded-sm border border-violet-100 transition">
                <input
                  type="checkbox"
                  checked={useMultiSection}
                  onChange={(e) => setUseMultiSection(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 w-4 h-4 cursor-pointer"
                />
                <span>Multiple Paper GSM Sections</span>
              </label>
            </div>

            {!useMultiSection ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Paper Stock</label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                        <input type="checkbox" checked={isCustomPaperInner} onChange={e => setIsCustomPaperInner(e.target.checked)} className="rounded" /> Custom
                      </label>
                    </div>
                    {isCustomPaperInner ? (
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={customPaperNameInner} onChange={e => setCustomPaperNameInner(e.target.value)} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-sm focus:border-blue-500 focus:outline-none" />
                        <input type="number" step="0.01" value={customPaperPriceInner} onChange={e => setCustomPaperPriceInner(parseFloat(e.target.value) || 0)} placeholder="Price/fs" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-sm font-mono focus:border-blue-500 focus:outline-none" />
                      </div>
                    ) : (
                      <PaperCascadingSelector
                        papers={papers}
                        selectedPaperId={selectedPaperInnerId}
                        onChange={(id) => setSelectedPaperInnerId(id)}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 items-center gap-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Number of Ups (Inner)</label>
                    <input
                      type="number"
                      min="1"
                      value={upsInner}
                      onChange={(e) => setUpsInner(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                    />
                    
                  </div>
                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div className="grid grid-cols-2 items-center gap-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Wastage (Inner Sheets)</label>
                    <input
                      type="number"
                      min="0"
                      value={wastageInner}
                      onChange={(e) => setWastageInner(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Full Sheet Divisor (Inner)</label>
                    <input
                      type="number"
                      min="1"
                      value={divisorInner}
                      onChange={(e) => setDivisorInner(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                  <div className="grid grid-cols-2 items-center gap-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Print Type</label>
                    <select
                      value={printType}
                      onChange={(e) => setPrintType(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-mono"
                    >
                      <option value="multi_color">Multi-Color</option>
                      <option value="single_color">Single Color</option>
                      <option value="single_color_double_dummy">Single Color (Double Dummy)</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                {innerSections.map((sec, idx) => (
                  <div key={sec.id} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 shadow-sm space-y-1 relative">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold font-mono">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={sec.name}
                          onChange={(e) => handleUpdateSection(sec.id, { name: e.target.value })}
                          className="font-bold text-sm text-slate-700 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:outline-none transition py-0.5 px-1 w-56 sm:w-72"
                          placeholder={`Section ${idx + 1} Name`}
                        />
                      </div>
                      {innerSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sec.id)}
                          className="text-slate-500 dark:text-slate-400 hover:text-red-500 transition p-1.5 rounded-sm hover:bg-slate-50 dark:bg-slate-800/50"
                          title="Delete Paper Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      <div>
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Paper Stock / GSM
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                            <input type="checkbox" checked={sec.isCustomPaper || false} onChange={e => handleUpdateSection(sec.id, { isCustomPaper: e.target.checked })} className="rounded" /> Custom
                          </label>
                        </div>
                        {sec.isCustomPaper ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={sec.manualPaperName || ''} onChange={e => handleUpdateSection(sec.id, { manualPaperName: e.target.value })} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:border-blue-500 focus:outline-none" />
                            <input type="number" step="0.01" value={sec.manualPaperPrice || ''} onChange={e => handleUpdateSection(sec.id, { manualPaperPrice: parseFloat(e.target.value) || 0 })} placeholder="Price/fs" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs font-mono focus:border-blue-500 focus:outline-none" />
                          </div>
                        ) : (
                          <PaperCascadingSelector
                            papers={papers}
                            selectedPaperId={sec.selectedPaperId}
                            onChange={(id) => handleUpdateSection(sec.id, { selectedPaperId: id })}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid grid-cols-2 items-center gap-1">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Pages Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            
                            value={sec.pagesCount}
                            onChange={(e) => handleUpdateSection(sec.id, { pagesCount: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                            className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono font-bold"
                          />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-1">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Ups
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={sec.ups}
                            onChange={(e) => handleUpdateSection(sec.id, { ups: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                            className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                      <div className="grid grid-cols-2 items-center gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Wastage (Sheets)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={sec.wastage}
                          onChange={(e) => handleUpdateSection(sec.id, { wastage: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                          className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 items-center gap-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Full Sheet Cut Divisor
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sec.divisor}
                          onChange={(e) => handleUpdateSection(sec.id, { divisor: e.target.value === "" ? ("" as any) : parseInt(e.target.value) })}
                          className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Plate Override (Optional)
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                            <input type="checkbox" checked={sec.isCustomPlate || false} onChange={e => handleUpdateSection(sec.id, { isCustomPlate: e.target.checked })} className="rounded" /> Custom
                          </label>
                        </div>
                        {sec.isCustomPlate ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={sec.manualPlateName || ''} onChange={e => handleUpdateSection(sec.id, { manualPlateName: e.target.value })} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:border-blue-500 focus:outline-none" />
                            <input type="number" step="0.01" value={sec.manualPlateCost || ''} onChange={e => handleUpdateSection(sec.id, { manualPlateCost: parseFloat(e.target.value) || 0 })} placeholder="Cost/pl" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs font-mono focus:border-blue-500 focus:outline-none" />
                          </div>
                        ) : (
                          <select
                            value={sec.plateProfileId || ''}
                            onChange={(e) => handleUpdateSection(sec.id, { plateProfileId: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-medium"
                          >
                            <option value="">Use Default Inner Profile</option>
                            {plateProfiles.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (₹{p.cost}/pl)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full flex items-center justify-center gap-1.5 py-0.5 rounded-sm border border-dashed border-violet-300 text-blue-600 bg-blue-50/30 hover:bg-blue-50 transition text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Inside Paper Section (Different GSM)
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Wrapper (Cover page) */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 space-y-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Paper Stock</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                    <input type="checkbox" checked={isCustomPaperWrapper} onChange={e => setIsCustomPaperWrapper(e.target.checked)} className="rounded" /> Custom
                  </label>
                </div>
                {isCustomPaperWrapper ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={customPaperNameWrapper} onChange={e => setCustomPaperNameWrapper(e.target.value)} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm focus:border-blue-500 focus:outline-none" />
                    <input type="number" step="0.01" value={customPaperPriceWrapper} onChange={e => setCustomPaperPriceWrapper(parseFloat(e.target.value) || 0)} placeholder="Price/fs" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm font-mono focus:border-blue-500 focus:outline-none" />
                  </div>
                ) : (
                  <PaperCascadingSelector
                    papers={papers}
                    selectedPaperId={selectedPaperWrapperId}
                    onChange={(id) => setSelectedPaperWrapperId(id)}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Print Both Sides (Wrapper)</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={wrapperPrintBothSides} onChange={e => setWrapperPrintBothSides(e.target.checked)} className="rounded" /> Yes
                </label>
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Number of Ups (Wrapper)</label>
                <input
                  type="number"
                  min="1"
                  value={upsWrapper}
                  onChange={(e) => setUpsWrapper(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                />
                
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Wastage (Wrapper Sheets)</label>
                <input
                  type="number"
                  min="0"
                  value={wastageWrapper}
                  onChange={(e) => setWastageWrapper(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Full Sheet Divisor (Wrapper)</label>
                <input
                  type="number"
                  min="1"
                  value={divisorWrapper}
                  onChange={(e) => setDivisorWrapper(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
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
          </div>

          {/* Section 3.5: Plate Settings & Profiles */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 space-y-1">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {/* Inner Plates */}
              <div className="bg-white dark:bg-slate-800 p-1 rounded-sm border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-indigo-600 block">Inner Pages Plate Profile</span>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Profile</label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                      <input type="checkbox" checked={isCustomPlateInner} onChange={e => setIsCustomPlateInner(e.target.checked)} className="rounded" /> Custom
                    </label>
                  </div>
                  {isCustomPlateInner ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={customPlateNameInner} onChange={e => setCustomPlateNameInner(e.target.value)} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:border-blue-500 focus:outline-none" />
                      <input type="number" step="0.01" value={customPlateCostInner} onChange={e => setCustomPlateCostInner(parseFloat(e.target.value) || 0)} placeholder="Cost/pl" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs font-mono focus:border-blue-500 focus:outline-none" />
                    </div>
                  ) : (
                    <select
                      value={selectedPlateInnerId}
                      onChange={(e) => setSelectedPlateInnerId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {plateProfiles && plateProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.cost.toFixed(2)}/plate)
                        </option>
                      ))}
                    </select>
                  )}
                </div>


                <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm">
                  <span>Plates Required (Auto):</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{actualPlatesCountInner} Plates</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-white font-semibold bg-slate-900 p-2 rounded-sm shadow-sm">
                  <span>Inner Plates Cost:</span>
                  <span>₹{actualPlateCostInner.toFixed(2)}</span>
                </div>
              </div>

              {/* Wrapper Plates */}
              <div className="bg-white dark:bg-slate-800 p-1 rounded-sm border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-purple-600 block">Wrapper (Cover) Plate Profile</span>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Profile</label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                      <input type="checkbox" checked={isCustomPlateWrapper} onChange={e => setIsCustomPlateWrapper(e.target.checked)} className="rounded" /> Custom
                    </label>
                  </div>
                  {isCustomPlateWrapper ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={customPlateNameWrapper} onChange={e => setCustomPlateNameWrapper(e.target.value)} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:border-blue-500 focus:outline-none" />
                      <input type="number" step="0.01" value={customPlateCostWrapper} onChange={e => setCustomPlateCostWrapper(parseFloat(e.target.value) || 0)} placeholder="Cost/pl" className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-xs font-mono focus:border-blue-500 focus:outline-none" />
                    </div>
                  ) : (
                    <select
                      value={selectedPlateWrapperId}
                      onChange={(e) => setSelectedPlateWrapperId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {plateProfiles && plateProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.cost.toFixed(2)}/plate)
                        </option>
                      ))}
                    </select>
                  )}
                </div>


                <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm">
                  <span>Plates Required (Auto):</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{platesCountWrapper} Plates</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-white font-semibold bg-slate-900 p-2 rounded-sm shadow-sm">
                  <span>Wrapper Plates Cost:</span>
                  <span>₹{plateCostWrapper.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs font-mono text-white font-bold bg-slate-900 p-2.5 rounded-sm shadow-sm flex justify-between items-center">
              <span>Total Plates Setup Cost:</span>
              <span>₹{plateCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Section 4: Lamination & Post Press Details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm border border-slate-300 dark:border-slate-600 space-y-1">
            
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Lamination Film</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                    <input type="checkbox" checked={isCustomLamination} onChange={e => setIsCustomLamination(e.target.checked)} className="rounded" /> Custom
                  </label>
                </div>
                {isCustomLamination ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={manualLamName} onChange={e => setManualLamName(e.target.value)} placeholder="Name" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm focus:border-blue-500 focus:outline-none" />
                    <input type="number" step="0.001" value={manualLamRate} onChange={e => setManualLamRate(parseFloat(e.target.value) || 0)} placeholder="Rate/sq-in" className="w-full bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-sm font-mono focus:border-blue-500 focus:outline-none" />
                  </div>
                ) : (
                  <select
                    value={selectedLamId}
                    onChange={(e) => setSelectedLamId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="">None / No Lamination</option>
                    {laminations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 items-center gap-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Lamination Sides</label>
                <select
                  value={laminationSides}
                  onChange={(e) => setLaminationSides(parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-sm text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value={1}>1 Side (Front)</option>
                  <option value={2}>2 Sides (Front & Back)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Area size (H x W)</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    value={paperHeight}
                    onChange={(e) => setPaperHeight(e.target.value === "" ? ("" as any) : parseFloat(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-center text-xs font-mono"
                    placeholder="H"
                  />
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">x</span>
                  <input
                    type="number"
                    value={paperWidth}
                    onChange={(e) => setPaperWidth(e.target.value === "" ? ("" as any) : parseFloat(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-center text-xs font-mono"
                    placeholder="W"
                  />
                </div>
              </div>

              {(selectedLamId !== '' || isCustomLamination) && (
                <div className="sm:col-span-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Lamination Sheets Quantity</label>
                  <div className="flex gap-2">
                    <select
                      value={laminationCustomSheets ? 'custom' : 'default'}
                      onChange={(e) => {
                        const isCustom = e.target.value === 'custom';
                        setLaminationCustomSheets(isCustom);
                        if (isCustom && laminationSheets === 0) {
                          setLaminationSheets(Math.ceil(quantity / upsWrapper));
                        }
                      }}
                      className="w-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <option value="default">Default (Auto)</option>
                      <option value="custom">Custom Sheets...</option>
                    </select>
                    
                    {laminationCustomSheets ? (
                      <input
                        type="number"
                        min="1"
                        value={laminationSheets}
                        onChange={(e) => setLaminationSheets(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                        className="w-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs font-mono text-slate-800 dark:text-slate-200 font-medium"
                        placeholder="No. of sheets"
                      />
                    ) : (
                      <div className="w-1/2 bg-slate-100 dark:bg-slate-700/50/70 px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-center select-none">
                        {Math.ceil((liveResult?.feedingSheetsWrapper || 0) - wastageWrapper)} Sheets
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Plates Cost (Auto)</label>
                <div className="w-full bg-slate-100 dark:bg-slate-700/50/80 px-1 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 font-mono font-bold select-none h-[38px] flex items-center">
                  ₹{plateCost.toFixed(2)}
                </div>
              </div>
            </div>



            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Post-Press & Logistics
                </label>
                <button
                  type="button"
                  onClick={() => setPostPressCosts([...postPressCosts, { id: Date.now().toString(), name: '', cost: 0 }])}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-violet-700 cursor-pointer bg-blue-50 px-2 py-1 rounded-md"
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
                          className="flex-1 min-w-[80px] w-auto px-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
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
                            className="w-16 px-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
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
                            className="w-full pl-4 pr-1.5 py-1 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-mono"
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
          </div>

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
            className="w-full bg-blue-600 hover:bg-violet-700 text-slate-900 dark:text-slate-100 font-medium py-3 rounded-sm transition shadow active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer mt-1"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Book Quotation...' : 'Calculate and Save Mode B Quotation'}
          </button>
        </form>
      </div>

      {/* Right summary panel */}
      <div className="lg:col-span-4 space-y-1 lg:sticky lg:top-6">
        <div id="estimation-preview-b" className="bg-white dark:bg-slate-800 p-2 rounded-sm border border-slate-300 dark:border-slate-600 shadow-sm relative overflow-hidden">
          
          
          <div className="flex justify-between items-start relative z-10">
            <span className="bg-blue-600/15 text-slate-800 dark:text-slate-200 border border-blue-500/30 text-[10px] font-mono uppercase px-1 py-0.5 rounded-sm font-bold tracking-wider">
              Live Quotation Breakdown (B)
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
            <div className="mt-1 space-y-1">
              {/* Grand price totals */}
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">TOTAL BOOK QUOTE PRICE</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                    ₹{liveResult.finalTotalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-blue-600 font-mono">
                    (+{marginPercent}% margin: ₹{(liveResult.finalTotalPrice - liveResult.totalProductionCost).toLocaleString('en-IN', { maximumFractionDigits: 2 })})
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Price per Booklet:</span>
                  <span className="font-mono text-blue-600 font-bold">
                    ₹{liveResult.perPieceCost.toFixed(2)} / book
                  </span>
                </div>
              </div>

              {/* Step calculations metrics */}
              <div className="space-y-1 font-mono text-[11px]">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Plates & Forms Math
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">TOTAL PLATES</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{liveResult.platesCount.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">FORMS COUNT</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{liveResult.formsCount}</span>
                  </div>
                </div>

                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pt-2">
                  Paper Sheets Required
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">INNER FULL SHEETS</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{liveResult.fullSheetsInner.toFixed(1)} fs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">COVER FULL SHEETS</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{liveResult.fullSheetsWrapper.toFixed(1)} fs</span>
                  </div>
                </div>

                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pt-2">
                  Impressions & Lamination
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-sm border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">TOTAL IMPRESSIONS</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{liveResult.impressions} imps</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[9px]">LAM. ESTIMATE (₹)</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">₹{liveResult.laminationCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Detailed items cost list */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Quoted Components (INR)
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Inner Pages Paper:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{liveResult.innerPaperCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Cover Wrapper Paper:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{liveResult.wrapperPaperCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Cover Lamination:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{liveResult.laminationCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Plates / Form Setup:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{plateCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Press Run (Printing):</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{liveResult.printingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <span>Post-Press & Finishes:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">₹{liveResult.miscCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-800 dark:text-slate-200 font-bold border-t border-slate-200 dark:border-slate-700 mt-1">
                    <span>Total Cost of Production:</span>
                    <span className="font-mono">₹{liveResult.totalProductionCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-800 dark:text-slate-200 font-bold">
                    <span>Margin Amount:</span>
                    <span className="font-mono text-green-600 dark:text-green-500">₹{(liveResult.finalTotalPrice - liveResult.totalProductionCost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please check values to preview calculations.
            </p>
          )}
        </div>

        {/* Dynamic visual representation card */}
        
      </div>
    </div>
  );
}
