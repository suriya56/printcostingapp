const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// add onAuthStateChanged import
app = app.replace(
  "import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';",
  "import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';\nimport { onAuthStateChanged } from 'firebase/auth';"
);

// modify states
app = app.replace(
  "  const [token, setToken] = useState<string>(() => {\n    return localStorage.getItem('press_token') || '';\n  });\n  const [currentUser, setCurrentUser] = useState<any>(() => {\n    const userStr = localStorage.getItem('press_user');\n    return userStr ? JSON.parse(userStr) : null;\n  });",
  "  const [token, setToken] = useState<string>('');\n  const [currentUser, setCurrentUser] = useState<any>(null);\n  const [authInitialized, setAuthInitialized] = useState(false);\n\n  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (user) => {\n      if (user) {\n        setToken(user.uid);\n        const userStr = localStorage.getItem('press_user');\n        setCurrentUser(userStr ? JSON.parse(userStr) : { id: user.uid, name: user.displayName || 'Unknown', role: 'admin' });\n      } else {\n        setToken('');\n        setCurrentUser(null);\n      }\n      setAuthInitialized(true);\n    });\n    return () => unsubscribe();\n  }, []);"
);

// modify Auth check
app = app.replace(
  "  if (!token) {\n    return <Auth onLogin={handleLoginSuccess} />;\n  }",
  "  if (!authInitialized) {\n    return <div className=\"min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900\"><div className=\"animate-pulse text-indigo-600\">Loading session...</div></div>;\n  }\n  if (!token) {\n    return <Auth onLogin={handleLoginSuccess} />;\n  }"
);

fs.writeFileSync('src/App.tsx', app);
