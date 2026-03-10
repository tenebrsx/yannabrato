import fs from 'fs';
import path from 'path';

async function fetchProjects() {
    console.log("Fetching projects for static build...");
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.log("No NEXT_PUBLIC_API_URL provided. Skipping fetch and using empty template data.");
            const dataDir = path.join(process.cwd(), 'src', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(path.join(dataDir, 'projects-build.json'), '[]');
            return;
        }

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const projects = await res.json();

        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(dataDir, 'projects-build.json'),
            JSON.stringify(projects, null, 2)
        );
        console.log(`Successfully saved ${projects.length} projects to src/data/projects-build.json`);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Ensure file exists even if empty to avoid build error
        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(path.join(dataDir, 'projects-build.json'), '[]');
        process.exit(0); // Changed to 0 so the build doesn't fail for templates
    }
}

fetchProjects();
