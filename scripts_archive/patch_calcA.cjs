const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeA.tsx', 'utf8');

const targetA = `      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;

      if (impressions <= b1.maxImpressions) {
        printingCost = b1.cost;
      } else if (impressions <= b2.maxImpressions) {
        printingCost = b2.cost;
      } else if (impressions <= b3.maxImpressions) {
        printingCost = b3.cost;
      } else {
        const excess = impressions - b3.maxImpressions;
        const steps = Math.ceil(excess / targetBrackets.excessStepImpressions);
        printingCost = b3.cost + (steps * targetBrackets.excessStepCost);
      }`;

const replacementA = `      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;

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
      }`;

code = code.replace(targetA, replacementA);
fs.writeFileSync('src/components/CalculatorModeA.tsx', code);
