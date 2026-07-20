const fs = require('fs');
let code = fs.readFileSync('src/seedData.ts', 'utf8');

const targetBrackets = `  singleColor: {
    bracket1: { maxImpressions: 1000, cost: 300 },
    bracket2: { maxImpressions: 2000, cost: 500 },
    bracket3: { maxImpressions: 3000, cost: 700 },
    excessStepImpressions: 1000,
    excessStepCost: 200
  },
  singleColorDoubleDummy: {
    bracket1: { maxImpressions: 1000, cost: 350 },
    bracket2: { maxImpressions: 2000, cost: 650 },
    bracket3: { maxImpressions: 3000, cost: 950 },
    excessStepImpressions: 1000,
    excessStepCost: 300
  }`;

const replacementBrackets = `  singleColor: {
    bracket1: { maxImpressions: 1000, cost: 300 },
    excessStepImpressions: 1000,
    excessStepCost: 200
  },
  singleColorDoubleDummy: {
    bracket1: { maxImpressions: 1000, cost: 350 },
    excessStepImpressions: 1000,
    excessStepCost: 300
  }`;

code = code.replace(targetBrackets, replacementBrackets);
fs.writeFileSync('src/seedData.ts', code);
