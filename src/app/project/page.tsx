"use client";

import { useEffect, useState, Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import RelatedProjects from "@/components/RelatedProjects";
import { useCursor } from "@/context/CursorContext";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: string;
    thumbnail: string;
    videoUrl?: string | null;
    credits?: string | { role: string; name: string }[] | null;
    description?: string | null;
    createdAt?: string;
    gallery?: string[] | null;
    published?: boolean;
}

function ProjectViewer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { setCursor } = useCursor();

    useEffect(() => {
        if (slug) {
            fetchProject(slug);
        } else {
            setLoading(false);
        }
    }, [slug]);

    const fetchProject = async (slugToFind: string) => {
        setLoading(true);
        try {
            const q = query(collection(db, "projects"), where("slug", "==", slugToFind));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                notFound();
                return;
            }

            const found = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Project;
            
            if (found.published === false) {
                notFound();
                return;
            }

            setProject(found);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black text-[#637381]">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-20">
                        <div className="h-16 bg-zinc-800 animate-pulse rounded mb-6" />
                        <div className="h-4 w-32 bg-zinc-800 animate-pulse rounded" />
                    </div>
                    <div className="mb-20 aspect-video bg-zinc-800 animate-pulse rounded" />
                </div>
            </main>
        );
    }

    if (!slug || !project) {
        // If loaded without slug, or project not found (and notFound() didn't trigger yet? notFound throws)
        // If notFound throws, we don't reach here. 
        // If no slug, we might want to show "Project not specified" or notFound.
        if (!slug) return null; // or notFound()
        return null;
    }

    const hasMedia = Boolean(project.thumbnail || project.videoUrl || (project.gallery && project.gallery.length > 0));

    if (!hasMedia) {
        return (
            <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black text-[#637381] flex flex-col justify-center">
                <div className="max-w-[1400px] mx-auto w-full">
                    {/* Typographic Hero */}
                    <div className="mb-24 md:mb-32 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-7xl md:text-[10rem] font-reenie mb-8 text-white leading-none tracking-tight"
                        >
                            {project.title}
                        </motion.h1>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-center items-center gap-6 font-sans text-xs md:text-sm text-zinc-500 uppercase tracking-[0.3em]"
                        >
                            <span>{project.category}</span>
                            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                            <span>{project.year}</span>
                        </motion.div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-20">
                        {/* Project Description */}
                        {project.description && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-center"
                            >
                                <h2 className="font-reenie text-2xl text-zinc-600 tracking-widest mb-8">Punto de Vista</h2>
                                <p className="text-xl md:text-3xl font-light leading-relaxed text-zinc-300">
                                    {project.description}
                                </p>
                            </motion.div>
                        )}

                        {/* Credits Section */}
                        {project.credits && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="border-t border-white/10 pt-16"
                            >
                                <h2 className="font-reenie text-2xl text-zinc-600 tracking-widest mb-10 text-center">Créditos</h2>
                                
                                {typeof project.credits === 'string' && (
                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[#637381] font-sans font-light text-base md:text-xl">
                                        {(project.credits as string).split(/·|-/).map((credit, index) => (
                                            <span key={index} className="flex items-center gap-x-6">
                                                {credit.trim()}
                                                {index < (project.credits as string).split(/·|-/).length - 1 && (
                                                    <span className="text-zinc-700 select-none text-sm font-bold">·</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                {Array.isArray(project.credits) && project.credits.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-10 max-w-3xl mx-auto text-center">
                                        {project.credits.map((credit, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <span className="text-[10px] md:text-xs font-sans text-zinc-500 uppercase tracking-[0.2em] mb-2">{credit.role}</span>
                                                <span className="text-base md:text-xl font-sans font-light text-zinc-300">{credit.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-32">
                        {/* Related Projects */}
                        <RelatedProjects currentProjectId={project.id} />
                    </div>
                </div>
            </main>
        );
    }

    // Standard Layout (with Media)
    return (
        <main className="min-h-screen pt-40 pb-20 px-4 md:px-10 bg-black text-[#637381]">
            <div className="max-w-[1400px] mx-auto">
                {/* Project Header */}
                <div className="mb-20">
                    <h1 className="text-5xl md:text-8xl font-reenie mb-6">
                        {project.title}
                    </h1>
                    <div className="flex gap-6 font-reenie text-xl text-gray-500">
                        <span>#{project.category}</span>
                    </div>
                </div>

                {/* Media Section: Video or Thumbnail */}
                {(() => {
                    const getVideoInfo = (url: string) => {
                        // YouTube
                        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                        const ytMatch = url.match(ytRegExp);
                        if (ytMatch && ytMatch[2].length === 11) {
                            return { platform: 'youtube', id: ytMatch[2] };
                        }

                        // Vimeo
                        const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                        const vimeoMatch = url.match(vimeoRegExp);
                        if (vimeoMatch && vimeoMatch[1]) {
                            return { platform: 'vimeo', id: vimeoMatch[1] };
                        }

                        return null;
                    };

                    const videoInfo = project.videoUrl ? getVideoInfo(project.videoUrl) : null;

                    if (videoInfo) {
                        return (
                            <div className="mb-20"
                                onMouseEnter={() => setCursor("hidden")}
                                onMouseLeave={() => setCursor("default")}
                            >
                                <div className="aspect-video bg-zinc-900 rounded-sm overflow-hidden cursor-auto">
                                    {videoInfo.platform === 'youtube' ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoInfo.id}?autoplay=1&mute=1&loop=1&playlist=${videoInfo.id}`}
                                            title={project.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <iframe
                                            src={`https://player.vimeo.com/video/${videoInfo.id}?autoplay=1&loop=1&autopause=0`}
                                            width="100%"
                                            height="100%"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                            title={project.title}
                                            className="w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="mb-20 aspect-video bg-zinc-900 rounded-sm overflow-hidden">
                            <img
                                src={project.thumbnail}
                                alt={project.title || "Project thumbnail"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                })()}

                {/* Project Description */}
                {project.description && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <div className="md:col-span-4">
                            <h2 className="font-reenie text-2xl text-gray-500 tracking-widest">Detalles</h2>
                        </div>
                        <div className="md:col-span-8 md:col-start-5">
                            <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-300">
                                {project.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Credits Section */}
                {project.credits && typeof project.credits === 'string' && (
                    <div className="md:col-span-8 md:col-start-5 mt-10">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#637381] font-sans font-light text-base md:text-lg">
                            {(project.credits as string).split(/·|-/).map((credit, index) => (
                                <span key={index} className="flex items-center gap-x-6">
                                    {credit.trim()}
                                    {index < (project.credits as string).split(/·|-/).length - 1 && (
                                        <span className="text-zinc-700 select-none text-sm font-bold">·</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {project.credits && Array.isArray(project.credits) && project.credits.length > 0 && (
                    <div className="md:col-span-8 md:col-start-5 mt-10">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-10">
                            {project.credits.map((credit, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-[10px] md:text-xs font-sans text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{credit.role}</span>
                                    <span className="text-base md:text-lg font-sans font-light text-[#637381]">{credit.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery Section */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="mt-32 space-y-10">
                        <div className="flex items-center gap-4">
                            <span className="h-px flex-1 bg-zinc-900" />
                            <h3 className="font-reenie text-2xl text-zinc-500 tracking-widest">Galería y Momentos</h3>
                            <span className="h-px flex-1 bg-zinc-900" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.gallery.map((image, index) => (
                                <div
                                    key={index}
                                    className="group relative aspect-video bg-zinc-900 overflow-hidden rounded-sm hover:-translate-y-2 transition-transform duration-500 ease-out cursor-pointer"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={`${project.title} gallery ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lightbox Overlay */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 text-[#637381]/50 hover:text-[#637381] transition-colors"
                            >
                                <X size={32} />
                            </button>
                            <motion.img
                                src={selectedImage}
                                alt="Gallery View"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Related Projects */}
                <RelatedProjects currentProjectId={project.id} />
            </div>
        </main>
    );
}

export default function ProjectPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ProjectViewer />
        </Suspense>
    );
}
