const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, getDoc, setDoc } = require("firebase/firestore");
const config = require("./firebase-applet-config.json");
const { DEFAULT_PAPERS, DEFAULT_LAMINATION, DEFAULT_BRACKETS, DEFAULT_PLATE_PROFILES, DEFAULT_MISC_COSTS } = require("./dist/server.cjs"); // wait, maybe I can't require it directly

