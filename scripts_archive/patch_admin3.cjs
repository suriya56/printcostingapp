const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetInit4 = `    if (!b.singleColor) b.singleColor = { bracket1: {...b.bracket1}, bracket2: {...b.bracket2}, bracket3: {...b.bracket3}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: {...b.bracket1}, bracket2: {...b.bracket2}, bracket3: {...b.bracket3}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };`;

const replaceInit4 = `    if (!b.singleColor) b.singleColor = { bracket1: {...b.bracket1}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: {...b.bracket1}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };`;

code = code.replace(targetInit4, replaceInit4);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
