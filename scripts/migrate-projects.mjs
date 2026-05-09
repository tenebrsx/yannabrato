import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// 1. CATEGORY RENAMES (PDF canonical names)
// ============================================================
const CATEGORY_RENAMES = {
    "Dirección Creativa": "Dirección creativa & coreografía",
    "Coreografía": "Dirección creativa & coreografía",
    "Music Video": "Videoclips conceptuales",
    "Videoclips Conceptuales": "Videoclips conceptuales",
    "Producción": "Producción y gestión de proyectos audiovisuales",
};

// ============================================================
// 2. DESCRIPTIONS & ROLES (keyed by lowercase title match)
// ============================================================
const PROJECT_UPDATES = {
    "ego lovers rd": {
        credits: "Directora Creativa · Dirección de Movimiento",
        description: "Desarrollo del concepto visual de la campaña, desde la creación de moodboards y diseño de set y vestuario hasta la dirección de poses y lenguaje corporal durante la sesión fotográfica.",
        year: "2024",
    },
    "issade": {
        credits: "Coreografía",
        description: "Coreografía para la presentación en vivo de la artista Issade.",
        year: "2023",
    },
    "how do you sleep": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Desarrollo de videoclip conceptual de autoría propia, integrando narrativa cinematográfica y composición coreográfica con liderazgo del proceso de producción y postproducción.",
        category: "Videoclips conceptuales",
    },
    "baile inolvidable": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Videoclip conceptual de autoría propia, basado en la canción completa, integrando narrativa cinematográfica y composición coreográfica.",
    },
    "where she goes": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Videoclip conceptual de autoría propia, integrando narrativa cinematográfica y composición coreográfica.",
    },
    "bokete": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Videoclip conceptual de autoría propia, integrando narrativa cinematográfica y composición coreográfica.",
    },
    "tití me preguntó": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Videoclip conceptual de autoría propia, integrando narrativa cinematográfica y composición coreográfica.",
    },
    "popstar": {
        credits: "Dirección General · Producción · Coreografía",
        description: "Videoclip conceptual de autoría propia, integrando narrativa cinematográfica y composición coreográfica.",
    },
    "dominican film festival": {
        credits: "Asistente de Producción",
        description: "Gestión de talento y cineastas invitados. Coordinación y ejecución de contenido digital durante el evento. Edición y publicación de piezas audiovisuales en tiempo real.",
        year: "2025",
    },
    "dominicanas got talent": {
        credits: "Pasante de Producción",
        description: "Apoyo en logística y coordinación de talentos. Designada como responsable de supervisar y gestionar necesidades de talentos del grupo de baile DNI, conformado por 85 bailarines.",
        year: "2026",
    },
    "premieres cinematográficas": {
        credits: "Asistente de Producción · Coordinación de Talento",
        description: "Participación en premieres de las películas: Books & Drinks, La Bachata de Biónico, Carlota La Más Barrial, La Güira y La Tambora, El Beso de Dios. Coordinación y acompañamiento de talento durante eventos de estreno, enlace entre artistas, invitados especiales y producción.",
        year: "2023–2025",
    },
    "premios adopresci": {
        credits: "Asistente de Producción · Coordinación de Talento",
        description: "Coordinación y acompañamiento de nominados e invitados. Enlace entre talento y producción en backstage. Apoyo en ejecución logística durante premiación en vivo.",
        year: "2025",
    },
    "festival del minuto del agua": {
        credits: "Coordinación de Participantes",
        description: "Supervisión de participantes durante el reto. Control de tiempos y cumplimiento de lineamientos. Apoyo operativo a producción.",
        year: "2025",
    },
    "revês": {
        credits: "Directora de Casting",
        description: "Diseño del proceso de selección de actores. Evaluación de perfiles acorde a la narrativa del proyecto. Acompañamiento en construcción de personajes.",
        year: "2025–2026",
    },
    "caribbean cinemas": {
        credits: "Asistente en Procesos de Postproducción",
        description: "Formación práctica en procesos profesionales de montaje de largometrajes dominicanos junto al editor José Delio. Organización y clasificación de material audiovisual, sincronización de material de rodaje, estructuración de archivos bajo estándares de postproducción. Proyectos trabajados: De Tal Palo, Medias Hermanas.",
        year: "2025",
    },
    "documental behind the scenes": {
        credits: "Dirección · Filmación · Montaje",
        description: "Dirección, filmación y montaje de pieza documental behind the scenes sobre el proceso creativo de un video conceptual coreográfico.",
    },
};

// ============================================================
// 3. MISSING PROJECT
// ============================================================
const MISSING_PROJECT = {
    title: "La Combi Versace — Rosalía & Tokischa",
    slug: "la-combi-versace",
    category: "Videoclips conceptuales",
    year: "2022",
    credits: "Dirección General · Producción · Coreografía",
    description: "Videoclip conceptual de autoría propia, basado en la canción completa de Rosalía & Tokischa, integrando narrativa cinematográfica y composición coreográfica.",
    thumbnail: "",
    thumbnailPoster: "",
    videoUrl: null,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// ============================================================
// RUN MIGRATION
// ============================================================
async function migrate() {
    console.log("🎬 Starting project migration...\n");

    // Fetch all existing projects
    const snap = await getDocs(collection(db, "projects"));
    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log(`Found ${projects.length} projects in Firestore.\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
        const updates = {};
        const titleLower = (project.title || "").toLowerCase();

        // --- Category rename ---
        if (project.category && CATEGORY_RENAMES[project.category]) {
            updates.category = CATEGORY_RENAMES[project.category];
            console.log(`  📁 Category: "${project.category}" → "${updates.category}" (${project.title})`);
        }

        // --- Description & credits updates ---
        for (const [key, data] of Object.entries(PROJECT_UPDATES)) {
            if (titleLower.includes(key)) {
                if (data.credits) updates.credits = data.credits;
                if (data.description) updates.description = data.description;
                if (data.year) updates.year = data.year;
                if (data.category) updates.category = data.category;
                console.log(`  📝 Updates for "${project.title}": credits, description${data.year ? ', year' : ''}`);
                break;
            }
        }

        if (Object.keys(updates).length > 0) {
            updates.updatedAt = new Date().toISOString();
            await updateDoc(doc(db, "projects", project.id), updates);
            updatedCount++;
            console.log(`  ✅ Updated "${project.title}" (${project.id})\n`);
        } else {
            skippedCount++;
        }
    }

    // --- Add missing project ---
    const existing = projects.find(p => (p.title || "").toLowerCase().includes("la combi versace"));
    if (!existing) {
        console.log(`\n🆕 Adding missing project: "${MISSING_PROJECT.title}"`);
        const docRef = await addDoc(collection(db, "projects"), MISSING_PROJECT);
        console.log(`  ✅ Created with ID: ${docRef.id}\n`);
    } else {
        console.log(`\n⏭️ "La Combi Versace" already exists, skipping.\n`);
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   Updated: ${updatedCount} projects`);
    console.log(`   Skipped: ${skippedCount} projects (no changes needed)`);
    console.log(`   Added: ${existing ? 0 : 1} new project(s)`);

    process.exit(0);
}

migrate().catch(err => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
