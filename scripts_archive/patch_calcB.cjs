const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

const targetB = `      const b1 = targetBrackets.bracket1;
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
      }`;

const replacementB = `      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;

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
      }`;

code = code.replace(targetB, replacementB);
fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
