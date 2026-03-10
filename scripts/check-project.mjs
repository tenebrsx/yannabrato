import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkProject() {
    console.log("Fetching projects...");
    const snap = await getDocs(collection(db, "projects"));
    const projects = snap.docs.map(d => ({id: d.id, ...d.data()}));
    const target = projects.find(p => p.title && p.title.toLowerCase().includes("where she goes"));
    if (target) {
        console.log("Found project:", target);
    } else {
        console.log("Project not found!");
    }
    process.exit(0);
}

checkProject().catch(console.error);
