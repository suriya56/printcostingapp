const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/onChange=\{\(e\) => set([a-zA-Z]+)\(Math\.max\([^,]+,\s*(parse(?:Int|Float)\(e\.target\.value\)(?:\s*\|\|\s*0)?)\)\)\}/g, "onChange={(e) => set$1(e.target.value === '' ? ('' as any) : $2)}");
  content = content.replace(/onChange=\{\(e\) => handleUpdateSection\(sec\.id, \{ ([a-zA-Z]+): Math\.max\([^,]+,\s*(parse(?:Int|Float)\(e\.target\.value\)(?:\s*\|\|\s*0)?)\) \}\)\}/g, "onChange={(e) => handleUpdateSection(sec.id, { $1: e.target.value === '' ? ('' as any) : $2 })}");
  content = content.replace(/newCosts\[index\]\.cost = Math\.max\([^,]+,\s*(parseInt\(e\.target\.value\)(?:\s*\|\|\s*0)?)\);/g, "newCosts[index].cost = e.target.value === '' ? ('' as any) : $1;");
  
  // also fix || 1 for handleUpdateSection
  content = content.replace(/onChange=\{\(e\) => handleUpdateSection\(sec\.id, \{ ([a-zA-Z]+): Math\.max\([^,]+,\s*(parseInt\(e\.target\.value\)(?:\s*\|\|\s*1)?)\) \}\)\}/g, "onChange={(e) => handleUpdateSection(sec.id, { $1: e.target.value === '' ? ('' as any) : $2 })}");
  
  // also fix setDivisorInner(Math.max(1, parseInt(e.target.value) || 1))
  content = content.replace(/onChange=\{\(e\) => set([a-zA-Z]+)\(Math\.max\([^,]+,\s*(parse(?:Int|Float)\(e\.target\.value\)(?:\s*\|\|\s*1)?)\)\)\}/g, "onChange={(e) => set$1(e.target.value === '' ? ('' as any) : $2)}");

  fs.writeFileSync(file, content);
}

fixFile('src/components/CalculatorModeA.tsx');
fixFile('src/components/CalculatorModeB.tsx');
