const fs = require('fs');

// A
let codeA = fs.readFileSync('src/components/CalculatorModeA.tsx', 'utf8');
const targetA = `      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;`;
const repA = `      const b1 = targetBrackets.bracket1;
      const b2 = (printType === 'single_color' || printType === 'single_color_double_dummy') ? undefined : targetBrackets.bracket2;
      const b3 = (printType === 'single_color' || printType === 'single_color_double_dummy') ? undefined : targetBrackets.bracket3;`;
codeA = codeA.replace(targetA, repA);
fs.writeFileSync('src/components/CalculatorModeA.tsx', codeA);

// B
let codeB = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');
const targetB = `      const b1 = targetBrackets.bracket1;
      const b2 = targetBrackets.bracket2;
      const b3 = targetBrackets.bracket3;`;
const repB = `      const isSingle = (pType === 'single_color' || pType === 'single_color_double_dummy');
      const b1 = targetBrackets.bracket1;
      const b2 = isSingle ? undefined : targetBrackets.bracket2;
      const b3 = isSingle ? undefined : targetBrackets.bracket3;`;
codeB = codeB.replace(targetB, repB);
fs.writeFileSync('src/components/CalculatorModeB.tsx', codeB);
