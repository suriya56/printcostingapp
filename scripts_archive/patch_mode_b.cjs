const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

// 1. Add printTypeWrapper state
code = code.replace(
  `const [printType, setPrintType] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');`,
  `const [printType, setPrintType] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');
  const [printTypeWrapper, setPrintTypeWrapper] = useState<'multi_color' | 'single_color' | 'single_color_double_dummy'>('multi_color');`
);

// 2. Load from quoteToEdit if available
code = code.replace(
  `setPrintType(mB.printType || 'multi_color');`,
  `setPrintType(mB.printType || 'multi_color');
        setPrintTypeWrapper(mB.printTypeWrapper || mB.printType || 'multi_color');`
);

// 3. Set printType in innerSections initialization
code = code.replace(
  `plateProfileId: ''`,
  `plateProfileId: '',
      printType: 'multi_color'`
);

code = code.replace(
  `plateProfileId: ''
      }`,
  `plateProfileId: '',
        printType: 'multi_color'
      }`
);

// 4. Update handleSaveQuotation body
code = code.replace(
  `printType: printType,`,
  `printType: printType,
              printTypeWrapper: printTypeWrapper,`
);

// 5. Update calculateLive()
const calcLiveOld = `    let printingCost = 0;
    const totalImpressionsForCost = quantity * totalPages;
    const printTypeVal = printType || 'multi_color';
    
    if (quantity > 0) {
      let targetBrackets = brackets;
      if (printTypeVal === 'single_color' && brackets.singleColor) {
        targetBrackets = brackets.singleColor as any;
      } else if (printTypeVal === 'single_color_double_dummy' && brackets.singleColorDoubleDummy) {
        targetBrackets = brackets.singleColorDoubleDummy as any;
      }
      
      // Wait, earlier ModeB multiplied printingCost by plates count.
      // Now the printingCost should be bracket cost multiplied by plates count.
      
      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;
      
      let basePrintingCost = 0;
      if (quantity <= b1.maxImpressions) {
        basePrintingCost = b1.cost;
      } else if (quantity <= b2.maxImpressions) {
        basePrintingCost = b2.cost;
      } else if (quantity <= b3.maxImpressions) {
        basePrintingCost = b3.cost;
      } else {
        const excess = quantity - b3.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        basePrintingCost = b3.cost + (steps * targetBrackets.excessStepCost);
      }
      
      printingCost = basePrintingCost * (platesCountInnerVal + platesCountWrapper);
    }`;

const calcLiveNew = `    let printingCost = 0;
    const getBasePrintingCost = (pType) => {
      if (quantity <= 0) return 0;
      let targetBrackets = brackets;
      if (pType === 'single_color' && brackets.singleColor) {
        targetBrackets = brackets.singleColor;
      } else if (pType === 'single_color_double_dummy' && brackets.singleColorDoubleDummy) {
        targetBrackets = brackets.singleColorDoubleDummy;
      }
      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;
      let baseCost = 0;
      if (quantity <= b1.maxImpressions) {
        baseCost = b1.cost;
      } else if (quantity <= b2.maxImpressions) {
        baseCost = b2.cost;
      } else if (quantity <= b3.maxImpressions) {
        baseCost = b3.cost;
      } else {
        const excess = quantity - b3.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        baseCost = b3.cost + (steps * targetBrackets.excessStepCost);
      }
      return baseCost;
    };

    if (quantity > 0) {
      if (useMultiSection) {
        for (const sec of innerSections) {
          const secPlates = sec.pagesCount / sec.ups;
          const secBaseCost = getBasePrintingCost(sec.printType || printType || 'multi_color');
          printingCost += secBaseCost * secPlates;
        }
      } else {
        const baseCost = getBasePrintingCost(printType || 'multi_color');
        printingCost += baseCost * platesCountInnerVal;
      }
      
      const wrapperBaseCost = getBasePrintingCost(printTypeWrapper || 'multi_color');
      printingCost += wrapperBaseCost * platesCountWrapper;
    }`;

code = code.replace(calcLiveOld, calcLiveNew);

fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
