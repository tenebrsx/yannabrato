import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

// ============================================================
// 1. CATEGORY RENAMES (PDF canonical names)
// ============================================================
const CATEGORY_RENAMES: Record<string, string> = {
    "Dirección Creativa": "Dirección creativa & coreografía",
    "Coreografía": "Dirección creativa & coreografía",
    "Music Video": "Videoclips conceptuales",
    "Videoclips Conceptuales": "Videoclips conceptuales",
    "Producción": "Producción y gestión de proyectos audiovisuales",
};

// ============================================================
// 2. DESCRIPTIONS & ROLES (keyed by lowercase title match)
// ============================================================
const PROJECT_UPDATES: Record<string, { credits?: string; description?: string; year?: string; category?: string }> = {
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
        description: "Participación en premieres de las películas: Books & Drinks, La Bachata de Biónico, Carlota La Más Barrial, La Güira y La Tambora, El Beso de Dios. Coordinación y acompañamiento de talento durante eventos de estreno.",
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
        description: "Formación práctica en procesos profesionales de montaje de largometrajes dominicanos junto al editor José Delio. Proyectos trabajados: De Tal Palo, Medias Hermanas.",
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

export async function POST() {
    try {
        const snapshot = await db.collection("projects").get();
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        const results: string[] = [];
        let updatedCount = 0;

        for (const project of projects) {
            const updates: Record<string, string> = {};
            const titleLower = ((project as any).title || "").toLowerCase();
            const currentCategory = (project as any).category || "";

            // Category rename
            if (currentCategory && CATEGORY_RENAMES[currentCategory]) {
                updates.category = CATEGORY_RENAMES[currentCategory];
            }

            // Description & credits updates
            for (const [key, data] of Object.entries(PROJECT_UPDATES)) {
                if (titleLower.includes(key)) {
                    if (data.credits) updates.credits = data.credits;
                    if (data.description) updates.description = data.description;
                    if (data.year) updates.year = data.year;
                    if (data.category) updates.category = data.category;
                    break;
                }
            }

            if (Object.keys(updates).length > 0) {
                updates.updatedAt = new Date().toISOString();
                await db.collection("projects").doc(project.id).update(updates);
                updatedCount++;
                results.push(`✅ Updated "${(project as any).title}": ${Object.keys(updates).join(", ")}`);
            }
        }

        // Add missing project
        const existing = projects.find(p => ((p as any).title || "").toLowerCase().includes("la combi versace"));
        if (!existing) {
            const docRef = await db.collection("projects").add(MISSING_PROJECT);
            results.push(`🆕 Added "La Combi Versace — Rosalía & Tokischa" (${docRef.id})`);
        } else {
            results.push(`⏭️ "La Combi Versace" already exists, skipped.`);
        }

        return NextResponse.json({
            success: true,
            updated: updatedCount,
            total: projects.length,
            details: results,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
