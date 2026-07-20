const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetInit1 = `        if (!next.singleColor) {
          next.singleColor = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            bracket2: next.bracket2,
            bracket3: next.bracket3,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }`;

const replaceInit1 = `        if (!next.singleColor) {
          next.singleColor = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }`;

code = code.replace(targetInit1, replaceInit1);

const targetInit2 = `        if (!next.singleColorDoubleDummy) {
          next.singleColorDoubleDummy = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            bracket2: next.bracket2,
            bracket3: next.bracket3,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }`;

const replaceInit2 = `        if (!next.singleColorDoubleDummy) {
          next.singleColorDoubleDummy = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }`;

code = code.replace(targetInit2, replaceInit2);

const targetInit3 = `    if (!b.singleColor) b.singleColor = { bracket1: {...b.bracket1}, bracket2: {...b.bracket2}, bracket3: {...b.bracket3}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: {...b.bracket1}, bracket2: {...b.bracket2}, bracket3: {...b.bracket3}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };`;

const replaceInit3 = `    if (!b.singleColor) b.singleColor = { bracket1: {...b.bracket1}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };
    if (!b.singleColorDoubleDummy) b.singleColorDoubleDummy = { bracket1: {...b.bracket1}, excessStepImpressions: b.excessStepImpressions, excessStepCost: b.excessStepCost };`;

code = code.replace(targetInit3, replaceInit3);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
