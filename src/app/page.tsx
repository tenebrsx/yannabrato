"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  thumbnail: string;
  thumbnailPoster?: string;
  videoUrl?: string | null;
  credits?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsData = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from projects
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ["Todos", ...Array.from(cats).sort()];
  }, [projects]);

  // Filter projects by active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "Todos") return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black">
      <div className="max-w-[1920px] mx-auto">

        {/* Category Filter Chips */}
        {!loading && categories.length > 1 && (
          <div className="mb-12 md:mb-16">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest
                    border transition-all duration-300 cursor-pointer
                    ${activeCategory === cat
                      ? "bg-[#D5E8D4] text-black border-[#D5E8D4]"
                      : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
                    }
                  `}
                >
                  {cat}
                  {activeCategory !== cat && (
                    <span className="ml-2 text-zinc-600">
                      {cat === "Todos" ? projects.length : projects.filter(p => p.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectGrid projects={filteredProjects} />
          </motion.div>
        ) : (
          <div className="text-center py-32">
            <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
              No hay proyectos en esta categoría todavía
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
