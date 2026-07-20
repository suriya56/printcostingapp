export interface PaperProfile {
  id: string;
  name: string;
  size: string;
  gsm: number;
  paperType: string;
  pricePerFullSheet: number;
}

export interface PlateProfile {
  id: string;
  name: string;
  cost: number;
}

export interface InnerPageSection {
  id: string;
  name: string;
  pagesCount: number;
  selectedPaperId: string;
  ups: number;
  wastage: number;
  divisor: number;
  plateProfileId?: string;
  manualPaperName?: string;
  manualPaperPrice?: number;
  manualPaperGsm?: number;
  manualPaperType?: string;
  manualPlateName?: string;
  manualPlateCost?: number;
  isCustomDivisor?: boolean;
  isCustomPaper?: boolean;
  isCustomPlate?: boolean;
  printType?: 'multi_color' | 'single_color' | 'single_color_double_dummy';
}

export interface LaminationRate {
  id: string;
  name: string;
  ratePerSqInch: number;
}

export interface MiscCost {
  id: string;
  name: string;
  type: 'fixed' | 'per_unit';
  cost: number;
}

export interface PrintingBracket {
  maxImpressions: number;
  cost: number;
}

export interface PostPressItem {
  id: string;
  name: string;
  cost: number;
  otherName?: string;
}

export interface PrintCategoryConfig {
  bracket1: PrintingBracket;
  bracket2?: PrintingBracket;
  bracket3?: PrintingBracket;
  excessStepImpressions: number;
  excessStepCost: number;
}

export interface PrintingBracketsConfig {
  bracket1: PrintingBracket; // Default: 1100, ₹1200
  bracket2: PrintingBracket; // Default: 2100, ₹1400
  bracket3: PrintingBracket; // Default: 3100, ₹1600
  excessStepImpressions: number; // Default: 1000
  excessStepCost: number; // Default: 400
  singleColor?: PrintCategoryConfig;
  singleColorDoubleDummy?: PrintCategoryConfig;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface Quotation {
  id: string;
  customerName: string;
  jobName: string;
  date: string;
  mode: 'A' | 'B';
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  
  // Input parameters (common + mode-specific)
  inputs: {
    quantity: number;
    marginPercent: number;
    modeA?: {
      printType?: 'multi_color' | 'single_color' | 'single_color_double_dummy';
      paperProfileId: string;
      printSides: 'front' | 'both';
      wastage: number;
      plateCost: number;
      postPressCost: number;
      postPressCosts?: PostPressItem[];
      plateProfileId?: string;
      platesCount?: number;
      isCustomPaper?: boolean;
      customPaperName?: string;
      customPaperPrice?: number;
      customPaperGsm?: number;
      isCustomPlate?: boolean;
      customPlateName?: string;
      customPlateCost?: number;
    };
    modeB?: {
      printType?: 'multi_color' | 'single_color' | 'single_color_double_dummy';
      printTypeWrapper?: 'multi_color' | 'single_color' | 'single_color_double_dummy';
      totalPages: number;
      upsInner: number;
      wastageInner: number;
      divisorInner: number;
      paperProfileIdInner: string;
      innerSections?: InnerPageSection[];
      
      totalWrapperPages?: number;
      upsWrapper: number;
      wastageWrapper: number;
      divisorWrapper: number;
      wrapperPrintBothSides?: boolean;
      paperProfileIdWrapper: string;
      
      paperHeight: number;
      paperWidth: number;
      laminationRateId: string;
      laminationSides: number;
      laminationCustomSheets?: boolean;
      isCustomLamination?: boolean;
      manualLamName?: string;
      manualLamRate?: number;
      laminationSheets?: number;
      
      foldingCost: number;
      bindingCost: number;
      logisticalCost: number;
      postPressCosts?: PostPressItem[];
      plateCost: number;
      
      plateProfileIdInner?: string;
      plateProfileIdWrapper?: string;
      platesCountInner?: number;
      platesCountWrapper?: number;
      plateCostInner?: number;
      plateCostWrapper?: number;
      isCustomPaperInner?: boolean;
      customPaperNameInner?: string;
      customPaperPriceInner?: number;
      isCustomPlateInner?: boolean;
      customPlateNameInner?: string;
      customPlateCostInner?: number;
      isCustomPaperWrapper?: boolean;
      customPaperNameWrapper?: string;
      customPaperPriceWrapper?: number;
      customPaperGsmWrapper?: number;
      isCustomPlateWrapper?: boolean;
      customPlateNameWrapper?: string;
      customPlateCostWrapper?: number;
    };
  };

  // Detailed calculation breakdown
  results: {
    paperCost: number;
    innerPaperCost?: number;
    wrapperPaperCost?: number;
    laminationCost?: number;
    printingCost: number;
    plateCost: number;
    plateCostInner?: number;
    plateCostWrapper?: number;
    miscCost: number;
    totalProductionCost: number;
    finalTotalPrice: number;
    perPieceCost: number;
    
    // Intermediate mathematical parameters for verification
    feedingSheets: number;
    feedingSheetsInner?: number;
    feedingSheetsWrapper?: number;
    fullSheets: number;
    fullSheetsInner?: number;
    fullSheetsWrapper?: number;
    impressions: number;
    platesCount?: number;
    platesCountInner?: number;
    platesCountWrapper?: number;
    formsCount?: number;
    laminationAreaSqIn?: number;
  };
}
