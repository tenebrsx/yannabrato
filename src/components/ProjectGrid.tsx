import { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    // Sort projects: those with thumbnails first, then those without
    const sortedProjects = [...projects].sort((a, b) => {
        const aHasMedia = Boolean(a.thumbnail);
        const bHasMedia = Boolean(b.thumbnail);
        if (aHasMedia && !bHasMedia) return -1;
        if (!aHasMedia && bHasMedia) return 1;
        return 0; // maintain relative order otherwise
    });

    return (
        <div className="flex flex-col gap-y-20 md:gap-y-40 w-full max-w-4xl mx-auto px-4 md:px-0">
            {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
