const fs = require('fs');

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
code = code.replace(
  /const updateBracketField = \(field, subfield, value\) => \{[\s\S]*?return next;\n\s*\}\);\n\s*\};/,
  `const updateBracketField = (field, subfield, value) => {
    setBracketsForm(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      
      if (bracketTab === 'multi_color') {
        if (subfield) next[field][subfield] = value;
        else next[field] = value;
      } else if (bracketTab === 'single_color') {
        if (!next.singleColor) {
          next.singleColor = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            bracket2: next.bracket2,
            bracket3: next.bracket3,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }
        if (subfield) next.singleColor[field][subfield] = value;
        else next.singleColor[field] = value;
      } else {
        if (!next.singleColorDoubleDummy) {
          next.singleColorDoubleDummy = JSON.parse(JSON.stringify({
            bracket1: next.bracket1,
            bracket2: next.bracket2,
            bracket3: next.bracket3,
            excessStepImpressions: next.excessStepImpressions,
            excessStepCost: next.excessStepCost
          }));
        }
        if (subfield) next.singleColorDoubleDummy[field][subfield] = value;
        else next.singleColorDoubleDummy[field] = value;
      }
      return next;
    });
  };`
);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
