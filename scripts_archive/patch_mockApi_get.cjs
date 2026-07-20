const fs = require('fs');
const content = `import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof input === 'string' ? input : input.toString();
  const url = urlStr.split('?')[0];
  const method = init?.method || 'GET';
  const body = init?.body ? JSON.parse(init.body as string) : undefined;

  try {
    const match = url.match(/\\/api\\/([^\\/]+)(?:\\/(.+))?/);
    if (!match) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    
    let [, col, id] = match;
    if (col === 'brackets') id = 'main';

    if (method === 'GET') {
      if (id) {
        const snap = await getDoc(doc(db, col, id));
        if (!snap.exists()) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        return new Response(JSON.stringify({ ...snap.data(), id: snap.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        const snap = await getDocs(collection(db, col));
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (method === 'POST') {
      const docId = body.id || id || Date.now().toString();
      await setDoc(doc(db, col, docId), { ...body, id: docId }, { merge: true });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (method === 'PUT') {
      const docId = id || body.id;
      await setDoc(doc(db, col, docId), { ...body, id: docId }, { merge: true });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (method === 'DELETE') {
      await deleteDoc(doc(db, col, id));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
`;
fs.writeFileSync('src/mockApi.ts', content);
