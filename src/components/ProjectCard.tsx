"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCursor } from "@/context/CursorContext";

interface ProjectCardProps {
    project: Project;
    layoutId?: string;
    className?: string;
}

export default function ProjectCard({ project, layoutId, className }: ProjectCardProps) {
    const { setCursor } = useCursor();

    return (
        <motion.div
            layoutId={layoutId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("relative group block w-full", className)}
            onMouseEnter={() => setCursor("text", "VER")}
            onMouseLeave={() => setCursor("default")}
        >
            <Link href={`/project?slug=${project.slug}`} className="block w-full">
                {/* Aspect Ratio Container */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-900 video-container">
                    {/* Thumbnail: Video or Image */}
                    {project.thumbnail ? (
                        (project.thumbnail.includes(".mp4") || project.thumbnail.includes(".webm")) ? (
                            <video
                                src={project.thumbnail}
                                poster={project.thumbnailPoster}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
                                muted={true}
                                autoPlay={true}
                                loop={true}
                                playsInline={true}
                                preload="none"
                                ref={(el) => {
                                    if (!el) return;
                                    // Safari strict autoplay bypass
                                    el.defaultMuted = true;
                                    el.muted = true;

                                    const preloadObserver = new IntersectionObserver(
                                        (entries) => {
                                            entries.forEach((entry) => {
                                                if (entry.isIntersecting && el.preload === "none") {
                                                    el.preload = "auto";
                                                    preloadObserver.unobserve(el);
                                                }
                                            });
                                        },
                                        { rootMargin: "200px" }
                                    );
                                    preloadObserver.observe(el);

                                    const playObserver = new IntersectionObserver(
                                        (entries) => {
                                            entries.forEach((entry) => {
                                                if (entry.isIntersecting) {
                                                    el.play().catch(() => {});
                                                } else {
                                                    el.pause();
                                                }
                                            });
                                        },
                                        { threshold: 0.1 } // lowered threshold to ensure it triggers early
                                    );
                                    playObserver.observe(el);
                                }}
                            />
                        ) : (
                            <motion.img
                                src={project.thumbnail}
                                alt={project.title || "Project Thumbnail"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
                                loading="lazy"
                                decoding="async"
                            />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 group-hover:scale-105 transition-all duration-1000 ease-out">
                            <span className="font-mono text-xs uppercase text-zinc-600 tracking-widest">Sin Medio</span>
                        </div>
                    )}

                    {/* Overlay (Optional: can be used for playing video on hover) */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Info label below (Desktop style) */}
                <div className="mt-4 flex justify-between items-start text-xs font-mono uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                        <h3 className="text-[#D5E8D4] group-hover:text-accent transition-colors min-h-[1.2em]">
                            {project.title || "\u00A0"}
                        </h3>
                        <span className="text-gray-500">{project.category}</span>
                    </div>
                    <span className="text-gray-500">{project.year}</span>
                </div>
            </Link>
        </motion.div>
    );
}
