const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  /const { bracket1, bracket2, bracket3, excessStepImpressions, excessStepCost } = req\.body;[\s\S]*?await setDoc\(doc\(db, 'brackets', 'main'\), config\);/m,
  `const { bracket1, bracket2, bracket3, excessStepImpressions, excessStepCost, singleColor, singleColorDoubleDummy } = req.body;
  if (!bracket1 || !bracket2 || !bracket3 || excessStepImpressions === undefined || excessStepCost === undefined) {
    res.status(400).json({ error: 'All fields for brackets configuration are required.' });
    return;
  }

  const config: PrintingBracketsConfig = {
    bracket1: { maxImpressions: Number(bracket1.maxImpressions), cost: Number(bracket1.cost) },
    bracket2: { maxImpressions: Number(bracket2.maxImpressions), cost: Number(bracket2.cost) },
    bracket3: { maxImpressions: Number(bracket3.maxImpressions), cost: Number(bracket3.cost) },
    excessStepImpressions: Number(excessStepImpressions),
    excessStepCost: Number(excessStepCost)
  };
  
  if (singleColor) {
    config.singleColor = {
      bracket1: { maxImpressions: Number(singleColor.bracket1.maxImpressions), cost: Number(singleColor.bracket1.cost) },
      bracket2: { maxImpressions: Number(singleColor.bracket2.maxImpressions), cost: Number(singleColor.bracket2.cost) },
      bracket3: { maxImpressions: Number(singleColor.bracket3.maxImpressions), cost: Number(singleColor.bracket3.cost) },
      excessStepImpressions: Number(singleColor.excessStepImpressions),
      excessStepCost: Number(singleColor.excessStepCost)
    };
  }
  
  if (singleColorDoubleDummy) {
    config.singleColorDoubleDummy = {
      bracket1: { maxImpressions: Number(singleColorDoubleDummy.bracket1.maxImpressions), cost: Number(singleColorDoubleDummy.bracket1.cost) },
      bracket2: { maxImpressions: Number(singleColorDoubleDummy.bracket2.maxImpressions), cost: Number(singleColorDoubleDummy.bracket2.cost) },
      bracket3: { maxImpressions: Number(singleColorDoubleDummy.bracket3.maxImpressions), cost: Number(singleColorDoubleDummy.bracket3.cost) },
      excessStepImpressions: Number(singleColorDoubleDummy.excessStepImpressions),
      excessStepCost: Number(singleColorDoubleDummy.excessStepCost)
    };
  }

  await setDoc(doc(db, 'brackets', 'main'), config);`
);
fs.writeFileSync('server.ts', code);
