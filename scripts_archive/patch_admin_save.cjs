const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetSave = `  const handleSaveBracketsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/brackets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify(bracketsForm)
      });`;

const replacementSave = `  const handleSaveBracketsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(bracketsForm));
      if (payload.singleColor) {
        delete payload.singleColor.bracket2;
        delete payload.singleColor.bracket3;
      }
      if (payload.singleColorDoubleDummy) {
        delete payload.singleColorDoubleDummy.bracket2;
        delete payload.singleColorDoubleDummy.bracket3;
      }
      const res = await apiFetch('/api/brackets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify(payload)
      });`;

code = code.replace(targetSave, replacementSave);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
