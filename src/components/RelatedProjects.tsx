"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/data";

interface RelatedProjectsProps {
    currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: RelatedProjectsProps) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "projects"));
                const allProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];

                // Filter out current project, drafts, and random shuffle
                const others = allProjects.filter(p => p.id !== currentProjectId && p.published !== false);
                const shuffled = others.sort(() => 0.5 - Math.random());

                // Take top 3
                setProjects(shuffled.slice(0, 3));
            } catch (error) {
                console.error("Error fetching related projects:", error);
            }
        };

        fetchProjects();
    }, [currentProjectId]);

    if (projects.length === 0) return null;

    return (
        <div className="mt-32 space-y-10">
            <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-zinc-900" />
                <h3 className="font-mono text-xs uppercase text-zinc-500 tracking-widest">Más Proyectos</h3>
                <span className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}
