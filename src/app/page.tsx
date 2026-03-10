"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";

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
  published?: boolean;
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
      
      // Filter out drafts from the public view
      const publishedProjects = projectsData.filter(p => p.published !== false);
      
      setProjects(publishedProjects);
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

  // Filter projects by active category and prioritize video projects on full view
  const filteredProjects = useMemo(() => {
    let result = projects;

    if (activeCategory === "Todos") {
      // Prioritize projects that have a valid videoUrl loop
      result = [...projects].sort((a, b) => {
        const aHasVideo = !!(a.videoUrl && a.videoUrl.trim() !== "");
        const bHasVideo = !!(b.videoUrl && b.videoUrl.trim() !== "");
        
        if (aHasVideo && !bHasVideo) return -1;
        if (!aHasVideo && bHasVideo) return 1;
        return 0;
      });
    } else {
      result = projects.filter(p => p.category === activeCategory);
    }
    
    return result;
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

        {/* Contact Section at bottom */}
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-32 border-t border-white/10 pt-20 text-[#D5E8D4]"
        >
            <div className="md:col-span-3">
                <h2 className="font-mono text-xs uppercase text-zinc-500 tracking-widest">Contacto</h2>
            </div>
            <div className="md:col-span-8 md:col-start-5 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-mono text-xs text-zinc-500 mb-3 uppercase tracking-wider">Email</h3>
                        <a href="mailto:yannambeatom24@gmail.com" className="font-sans text-lg hover:text-[#D5E8D4] transition-colors text-zinc-300">
                            yannambeatom24@gmail.com
                        </a>
                    </div>
                    <div>
                        <h3 className="font-mono text-xs text-zinc-500 mb-3 uppercase tracking-wider">Instagram</h3>
                        <a href="https://instagram.com/myvisual.experience" target="_blank" rel="noopener noreferrer" className="font-sans text-lg hover:text-[#D5E8D4] transition-colors text-zinc-300">
                            @myvisual.experience
                        </a>
                    </div>
                    <div>
                        <h3 className="font-mono text-xs text-zinc-500 mb-3 uppercase tracking-wider">Teléfono</h3>
                        <a href="tel:+18098583747" className="font-sans text-lg hover:text-[#D5E8D4] transition-colors text-zinc-300">
                            809-858-3747
                        </a>
                    </div>
                </div>

                {/* Contact Form Component */}
                <ContactForm />
            </div>
        </motion.section>

      </div>
    </main>
  );
}
