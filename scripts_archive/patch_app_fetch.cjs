const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    if (!token) return;
    setSyncing(true);
    
    const unsubs: any[] = [];
    seedDatabaseIfNeeded().then(() => {
    
    unsubs.push(onSnapshot(collection(db, 'papers'), (snap) => {
      setPapers(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
    }));
    unsubs.push(onSnapshot(collection(db, 'lamination'), (snap) => {
      setLaminations(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
    }));
    unsubs.push(onSnapshot(collection(db, 'misc-costs'), (snap) => {
      setMiscCosts(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
    }));
    unsubs.push(onSnapshot(doc(db, 'brackets', 'main'), (snap) => {
      if (snap.exists()) setBrackets(snap.data() as any);
    }));
    
    // Optimization: Only listen to the latest 50 quotations to minimize reads
    unsubs.push(onSnapshot(query(collection(db, 'quotations'), orderBy('date', 'desc'), limit(50)), (snap) => {
      const q = snap.docs.map(d => ({...d.data(), id: d.id} as any));
      q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setQuotations(q);
    }));
    unsubs.push(onSnapshot(collection(db, 'plate-profiles'), (snap) => {
      setPlateProfiles(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
    }));
    
    setSyncing(false);
    });

    return () => unsubs.forEach(u => u());
  }, [token]);

  const loadWorkspaceData = async () => { 
     // Now handled by onSnapshot
  };`;

const replaceEffect = `  useEffect(() => {
    if (!token) return;
    loadWorkspaceData();
  }, [token]);

  const loadWorkspaceData = async () => { 
    setSyncing(true);
    try {
      await seedDatabaseIfNeeded();
      
      const papersSnap = await getDocs(collection(db, 'papers'));
      setPapers(papersSnap.docs.map(d => ({...d.data(), id: d.id} as any)));
      
      const lamSnap = await getDocs(collection(db, 'lamination'));
      setLaminations(lamSnap.docs.map(d => ({...d.data(), id: d.id} as any)));
      
      const miscSnap = await getDocs(collection(db, 'misc-costs'));
      setMiscCosts(miscSnap.docs.map(d => ({...d.data(), id: d.id} as any)));
      
      const bracketSnap = await getDocs(collection(db, 'brackets'));
      if (!bracketSnap.empty) {
        const doc = bracketSnap.docs.find(d => d.id === 'main');
        if (doc) setBrackets(doc.data() as any);
      }
      
      const plateSnap = await getDocs(collection(db, 'plate-profiles'));
      setPlateProfiles(plateSnap.docs.map(d => ({...d.data(), id: d.id} as any)));
      
      const quoteSnap = await getDocs(query(collection(db, 'quotations'), orderBy('date', 'desc'), limit(50)));
      const q = quoteSnap.docs.map(d => ({...d.data(), id: d.id} as any));
      q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setQuotations(q);
      
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };`;

code = code.replace(targetEffect, replaceEffect);
fs.writeFileSync('src/App.tsx', code);
