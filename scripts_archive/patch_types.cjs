const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace("  bracket2: PrintingBracket;\n  bracket3: PrintingBracket;", "  bracket2?: PrintingBracket;\n  bracket3?: PrintingBracket;");
fs.writeFileSync('src/types.ts', code);
