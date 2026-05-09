
"use client";

import { useState, useMemo } from "react";
import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchInterfaceProps {
    initialProjects: any[]; // Using any[] to match prisma result quickly, or define interface
}

export default function SearchInterface({ initialProjects }: SearchInterfaceProps) {
    const [query, setQuery] = useState("");

    const filteredProjects = useMemo(() => {
        if (!query) return initialProjects;

        return initialProjects.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.year.includes(query)
        );
    }, [query, initialProjects]);

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-[#637381]">
            <div className="max-w-[1920px] mx-auto">

                {/* Search Input */}
                <div className="mb-20">
                    <motion.input
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        type="text"
                        placeholder="BUSCAR PROYECTOS..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 text-5xl md:text-8xl font-reenie placeholder:text-gray-700 text-[#637381] focus:outline-none focus:border-accent transition-colors pb-4"
                        autoFocus
                    />
                </div>

                {/* Results Grid */}
                <div className="relative z-10">
                    {filteredProjects.length > 0 ? (
                        <ProjectGrid projects={filteredProjects} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 font-reenie text-2xl text-gray-500 tracking-widest"
                        >
                            No se encontraron proyectos para "{query}"
                        </motion.div>
                    )}
                </div>

            </div>
        </main>
    );
}
