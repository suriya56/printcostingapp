const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The string wasn't replaced properly. I'll just insert loadWorkspaceData above useEffect
const target = `  useEffect(() => {
    if (!token) return;`;

const replace = `  const loadWorkspaceData = async () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 500);
  };

  useEffect(() => {
    if (!token) return;`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
