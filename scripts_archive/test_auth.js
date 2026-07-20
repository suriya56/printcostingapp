import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAT1GDllz8HHACgZfJpGLIYFn36yiHy2v8",
  authDomain: "dreamcost.firebaseapp.com",
  projectId: "dreamcost",
  storageBucket: "dreamcost.firebasestorage.app",
  messagingSenderId: "751887805431",
  appId: "1:751887805431:web:fbe624def503a85ffbdcf2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInAnonymously(auth).then(() => {
  console.log("Success");
  process.exit(0);
}).catch(e => {
  console.error("Error", e.message);
  process.exit(1);
});
