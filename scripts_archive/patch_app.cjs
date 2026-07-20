const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    unsubs.push(onSnapshot(collection(db, 'brackets'), (snap) => {
      if (!snap.empty) setBrackets(snap.docs[0].data() as any);
    }));`;

const replacement = `    unsubs.push(onSnapshot(doc(db, 'brackets', 'main'), (snap) => {
      if (snap.exists()) setBrackets(snap.data() as any);
    }));`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
