const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpoint = `
app.get('/api/pricing/paper', async (req, res) => {
  try {
    const { material, gsm, size } = req.query;
    if (!material || !gsm || !size) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    
    const papersSnap = await getDocs(collection(db, 'papers'));
    const papers = papersSnap.docs.map(d => ({ id: d.id, ...d.data() } as PaperProfile));
    
    const paper = papers.find(p => 
      p.paperType === material && 
      p.gsm === Number(gsm) && 
      p.size === size
    );
    
    if (paper) {
      res.json({ success: true, price_per_sheet: paper.pricePerFullSheet, paperId: paper.id });
    } else {
      res.status(404).json({ error: 'Paper not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
`;

if (!code.includes('/api/pricing/paper')) {
  code = code.replace("app.get('*', async (req, res) => {", endpoint + "\n      app.get('*', async (req, res) => {");
  fs.writeFileSync('server.ts', code);
}
