const fs = require('fs');
let content = fs.readFileSync('src/mockApi.ts', 'utf8');

content = content.replace(
  `let url = typeof input === 'string' ? input : input.toString();`,
  `let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
      url = (input as any).url;
    } else {
      url = input.toString();
    }`
);

fs.writeFileSync('src/mockApi.ts', content);
