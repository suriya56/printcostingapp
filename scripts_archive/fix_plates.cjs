const fs = require('fs');

let code = fs.readFileSync('src/components/CalculatorModeB.tsx', 'utf8');

code = code.replace(
  'const platesCountInner = totalPages / upsInner;',
  'const platesCountInner = Math.ceil(totalPages / upsInner);'
);

code = code.replace(
  '    ? innerSections.reduce((sum, sec) => sum + (sec.pagesCount / sec.ups), 0)',
  '    ? innerSections.reduce((sum, sec) => sum + Math.ceil(sec.pagesCount / sec.ups), 0)'
);

code = code.replace(
  'const platesCountWrapper = totalWrapperPages / upsWrapper;',
  'const platesCountWrapper = Math.ceil(totalWrapperPages / upsWrapper);'
);

code = code.replace(
  '        const secPlates = sec.pagesCount / sec.ups;',
  '        const secPlates = Math.ceil(sec.pagesCount / sec.ups);'
);
// replace multiple occurrences if they exist inside calculateLive loop
code = code.replace(
  '        const secPlates = sec.pagesCount / sec.ups;',
  '        const secPlates = Math.ceil(sec.pagesCount / sec.ups);'
);
// note: there are two places for secPlates in calculateLive: one in paper calculation, one in printingCost calculation
code = code.replaceAll(
  'const secPlates = sec.pagesCount / sec.ups;',
  'const secPlates = Math.ceil(sec.pagesCount / sec.ups);'
);

code = code.replace(
  'platesCountInnerVal = totalPages / upsInner;',
  'platesCountInnerVal = Math.ceil(totalPages / upsInner);'
);

fs.writeFileSync('src/components/CalculatorModeB.tsx', code);
