const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    const unsubs: any[] = [];
    
    const loadAndSubscribe = async () => {
      setSyncing(true);
      try {
        await seedDatabaseIfNeeded();
        
        if (!isMounted) return;
        
        unsubs.push(onSnapshot(collection(db, 'papers'), (snap) => {
          setPapers(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }, (err: any) => {
          if (err.code === 'permission-denied') handleFirestoreError(err, OperationType.LIST, 'papers');
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
        
        unsubs.push(onSnapshot(collection(db, 'plate-profiles'), (snap) => {
          setPlateProfiles(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }));
        
        unsubs.push(onSnapshot(query(collection(db, 'quotations'), orderBy('date', 'desc'), limit(50)), (snap) => {
          const q = snap.docs.map(d => ({...d.data(), id: d.id} as any));
          q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setQuotations(q);
        }));
        
      } catch (e: any) {
        if (e.code === 'permission-denied' || (e.message && e.message.includes('Missing or insufficient permissions'))) {
          handleFirestoreError(e, OperationType.GET, 'workspace_data');
        }
        console.error(e);
      } finally {
        if (isMounted) setSyncing(false);
      }
    };
    
    loadAndSubscribe();
    
    return () => {
      isMounted = false;
      unsubs.forEach(u => u());
    };
  }, [token]);`;

const replace = `  const loadWorkspaceData = async () => {
    // This is now a dummy function because onSnapshot handles live sync.
    // We keep it for the manual refresh buttons just in case.
    setSyncing(true);
    setTimeout(() => setSyncing(false), 500);
  };

  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    const unsubs: any[] = [];
    
    const loadAndSubscribe = async () => {
      setSyncing(true);
      try {
        await seedDatabaseIfNeeded();
        
        if (!isMounted) return;
        
        unsubs.push(onSnapshot(collection(db, 'papers'), (snap) => {
          setPapers(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }, (err: any) => {
          if (err.code === 'permission-denied') handleFirestoreError(err, OperationType.LIST, 'papers');
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
        
        unsubs.push(onSnapshot(collection(db, 'plate-profiles'), (snap) => {
          setPlateProfiles(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }));
        
        unsubs.push(onSnapshot(query(collection(db, 'quotations'), orderBy('date', 'desc'), limit(50)), (snap) => {
          const q = snap.docs.map(d => ({...d.data(), id: d.id} as any));
          q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setQuotations(q);
        }));
        
      } catch (e: any) {
        if (e.code === 'permission-denied' || (e.message && e.message.includes('Missing or insufficient permissions'))) {
          handleFirestoreError(e, OperationType.GET, 'workspace_data');
        }
        console.error(e);
      } finally {
        if (isMounted) setSyncing(false);
      }
    };
    
    loadAndSubscribe();
    
    return () => {
      isMounted = false;
      unsubs.forEach(u => u());
    };
  }, [token]);`;

code = code.replace(target, replace);

// Remove the extraneous loadWorkspaceData call if any
code = code.replace('      loadWorkspaceData();\\n', '');
fs.writeFileSync('src/App.tsx', code);
