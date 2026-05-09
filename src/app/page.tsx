"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CategoryAccordion from "@/components/CategoryAccordion";
import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";
import AboutAccordion from "@/components/AboutAccordion";
import ContactAccordion from "@/components/ContactAccordion";
import HeroVideo from "@/components/HeroVideo";
import { sortCategories } from "@/lib/utils";

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
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  useEffect(() => {
    fetchData();
    fetchSettings();
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

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeroVideoUrl(docSnap.data().heroVideoUrl || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // Extract unique categories from projects (excluding "Todos")
  const categoriesList = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort(sortCategories);
  }, [projects]);

  return (
    <main className="min-h-screen bg-black">
      {/* Branding Hero Section with Video Background */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Video Background */}
        <HeroVideo videoUrl={heroVideoUrl} />
        
        {/* Branding Overlay */}
        <div className="relative z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-reenie leading-none text-[#637381]">
              Yanna Beato
            </h1>
            <div className="mt-8 space-y-4">
              <h2 className="font-sans text-xs md:text-sm text-[#637381] uppercase tracking-[0.3em] font-medium opacity-90">
                Coreógrafa y directora de movimiento para audiovisual
              </h2>
              <p className="font-sans text-[10px] md:text-xs text-[#637381] uppercase tracking-[0.4em] opacity-70">
                Narrativa · Cuerpo · Cámara
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto px-4 md:px-10">
        {/* Project Accordions */}
        {loading ? (
          <div className="space-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-white/5 py-12">
                <div className="h-20 bg-zinc-900 animate-pulse rounded w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-video bg-zinc-900 animate-pulse rounded" />
                    <div className="aspect-video bg-zinc-900 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : categoriesList.length > 0 ? (
          <div className="mt-10">
            {categoriesList.map((cat, index) => (
              <CategoryAccordion
                key={cat}
                title={cat}
                projects={projects.filter(p => p.category === cat)}
                initialOpen={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="font-reenie text-3xl text-zinc-500 tracking-widest">
              No hay proyectos todavía
            </p>
          </div>
        )}

        <div id="sobre-mi">
          <AboutAccordion />
        </div>

        <div id="contacto">
          <ContactAccordion />
        </div>

      </div>
    </main>
  );
}
