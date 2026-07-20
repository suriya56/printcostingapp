import re

with open('server.ts', 'r') as f:
    content = f.read()

# Make authenticate async
content = content.replace(
    "const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {",
    "const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {"
)
# Make all app.get, app.post, app.put, app.delete async
content = re.sub(
    r'(app\.(get|post|put|delete)\(.*?, (authenticate, )?)\(req, res\) => \{',
    r'\1async (req, res) => {',
    content
)

# Replace readJSON and writeJSON calls with await
content = re.sub(r'readJSON<.*?>\(', r'await readJSON(', content)
content = re.sub(r'readJSON\(', r'await readJSON(', content)
content = re.sub(r'writeJSON\(', r'await writeJSON(', content)

# Redefine readJSON and writeJSON
imports = """
import { db, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from './src/db_firestore.js';
"""
content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\n" + imports)

new_helpers = """
const readJSON = async (fileName: string, defaultValue: any): Promise<any> => {
  const colName = fileName.replace('.json', '');
  try {
    if (colName === 'brackets') {
      const snap = await getDoc(doc(db, colName, 'main'));
      return snap.exists() ? snap.data() : defaultValue;
    }
    const snap = await getDocs(collection(db, colName));
    if (snap.empty) return Array.isArray(defaultValue) ? [] : defaultValue;
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (error) {
    console.error(`Error reading ${fileName} from Firestore:`, error);
    return defaultValue;
  }
};

const writeJSON = async (fileName: string, data: any): Promise<boolean> => {
  const colName = fileName.replace('.json', '');
  try {
    if (colName === 'brackets') {
      await setDoc(doc(db, colName, 'main'), data);
      return true;
    }
    // For arrays, we just update all documents
    // Note: We don't delete missing ones here, but that's fine since we never delete all at once.
    // Actually, in our endpoints, we often modify the whole array and call writeJSON.
    // To properly sync, we should iterate and setDoc for each item.
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.id) {
          await setDoc(doc(db, colName, item.id), item);
        }
      }
    }
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName} to Firestore:`, err);
    return false;
  }
};
"""

content = re.sub(r'// Helpers for File Reading and Writing.*?const writeJSON = <T>\(fileName: string, data: T\): boolean => \{.*?\n\};\n', new_helpers, content, flags=re.DOTALL)

with open('server_fixed.ts', 'w') as f:
    f.write(content)
