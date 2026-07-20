const fs = require('fs');

let codeA = fs.readFileSync('src/components/CalculatorModeA.tsx', 'utf8');
codeA = codeA.replace(
  `      if (impressions <= b1.maxImpressions) {
        printingCost = b1.cost;
      } else if (impressions <= b2.maxImpressions) {
        printingCost = b2.cost;
      } else if (impressions <= b3.maxImpressions) {
        printingCost = b3.cost;
      } else {
        const excess = impressions - b3.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        printingCost = b3.cost + (steps * targetBrackets.excessStepCost);
      }`,
  `      if (impressions <= b1.maxImpressions) {
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
      }`
);
fs.writeFileSync('src/components/CalculatorModeA.tsx', codeA);

let codeB = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');
codeB = codeB.replace(
  `      if (quantity <= b1.maxImpressions) {
        baseCost = b1.cost;
      } else if (quantity <= b2.maxImpressions) {
        baseCost = b2.cost;
      } else if (quantity <= b3.maxImpressions) {
        baseCost = b3.cost;
      } else {
        const excess = quantity - b3.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        baseCost = b3.cost + (steps * targetBrackets.excessStepCost);
      }`,
  `      if (quantity <= b1.maxImpressions) {
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
      }`
);
fs.writeFileSync('src/components/CalculatorModeB.tsx', codeB);

