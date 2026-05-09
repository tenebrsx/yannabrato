"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

const CATEGORY_RENAMES: Record<string, string> = {
    "Videoclips conceptuales": "Dirección creativa & coreografía",
    "Casting": "Producción y gestión de proyectos audiovisuales",
};

const PROJECT_UPDATES: Record<string, { credits?: string; description?: string; year?: string; category?: string }> = {
    "revês": {
        credits: "Directora de Casting",
        description: "Diseño del proceso de selección de actores. Evaluación de perfiles acorde a la narrativa del proyecto. Acompañamiento en construcción de personajes.",
    },
    // Adding the missing specific descriptions or ensuring exact match
    "documental behind the scenes": {
        credits: "Dirección · Filmación · Montaje",
        description: "Dirección, filmación y montaje de pieza documental behind the scenes sobre el proceso creativo de un video conceptual coreográfico.",
    }
};

const MISSING_PROJECTS = [
    {
        title: "Desarrollo de montaje en proyectos personales",
        slug: "desarrollo-montaje",
        category: "Postproducción",
        year: "",
        credits: "Edición y Montaje",
        description: "Acompañamiento del proceso de edición de videoclips conceptuales dirigidos y coreografiados por mí, colaborando en decisiones de ritmo, estructura narrativa y relación entre movimiento, música y cámara.",
        thumbnail: "",
        thumbnailPoster: "",
        videoUrl: "",
        published: true, // Auto publish so it's visible to user on the panel easily 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export default function MigratePage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [authed, setAuthed] = useState(false);

    const log = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setAuthed(true);
            log("✅ Authenticated successfully!");
        } catch (err: any) {
            log(`❌ Auth failed: ${err.message}`);
        }
    };

    const runMigration = async () => {
        setRunning(true);
        setLogs([]);
        log("🎬 Starting migration...");

        try {
            const snap = await getDocs(collection(db, "projects"));
            const projects = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
            log(`Found ${projects.length} existing projects.`);

            let updatedCount = 0;

            for (const project of projects) {
                const updates: Record<string, string> = {};
                const titleLower = (project.title || "").toLowerCase();

                // 1. Rename Categories to strictly match PDF
                if (project.category && CATEGORY_RENAMES[project.category]) {
                    updates.category = CATEGORY_RENAMES[project.category];
                }

                // 2. Exact metadata matching
                for (const [key, data] of Object.entries(PROJECT_UPDATES)) {
                    if (titleLower.includes(key)) {
                        if (data.credits && project.credits !== data.credits) updates.credits = data.credits;
                        if (data.description && project.description !== data.description) updates.description = data.description;
                        if (data.year && project.year !== data.year) updates.year = data.year;
                        if (data.category && project.category !== data.category) updates.category = data.category;
                        break;
                    }
                }

                if (Object.keys(updates).length > 0) {
                    updates.updatedAt = new Date().toISOString();
                    await updateDoc(doc(db, "projects", project.id), updates);
                    updatedCount++;
                    log(`✅ Updated "${project.title}": ${Object.keys(updates).join(", ")}`);
                }
            }

            // 3. Add missing projects
            for (const missing of MISSING_PROJECTS) {
                const existing = projects.find(p => (p.title || "").toLowerCase().includes(missing.title.toLowerCase()));
                if (!existing) {
                    const docRef = await addDoc(collection(db, "projects"), missing);
                    log(`🆕 Added missing project: "${missing.title}" (${docRef.id})`);
                } else {
                    log(`⏭️ "${missing.title}" already exists.`);
                }
            }

            log(`\n🎉 Migration complete! Updated ${updatedCount} projects and added missing ones.`);
        } catch (err: any) {
            log(`❌ Error: ${err.message}`);
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
            <h1 className="text-3xl mb-6 text-[#637381]">🎬 Database Migration Tool</h1>
            <p className="mb-4 text-zinc-400">This strictly enforces the categories and roles from the PDF.</p>
            
            {!authed ? (
                <button onClick={handleLogin} className="px-6 py-3 bg-[#637381] text-black rounded-lg hover:bg-[#90A4AE] transition-colors">
                    Sign in with Google
                </button>
            ) : (
                <button 
                    onClick={runMigration} 
                    disabled={running}
                    className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {running ? "Running..." : "Run Migration"}
                </button>
            )}

            <div className="mt-8 bg-zinc-900 rounded-lg p-6 max-h-[70vh] overflow-y-auto">
                {logs.length === 0 ? (
                    <p className="text-zinc-500">Logs will appear here...</p>
                ) : (
                    logs.map((line, i) => (
                        <p key={i} className="text-sm py-1 border-b border-zinc-800">{line}</p>
                    ))
                )}
            </div>
        </div>
    );
}
