"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ProjectGrid from "./ProjectGrid";
import { Project } from "@/lib/data";

interface CategoryAccordionProps {
    title: string;
    projects: Project[];
    initialOpen?: boolean;
}

export default function CategoryAccordion({ title, projects, initialOpen = false }: CategoryAccordionProps) {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-8 md:py-12 group transition-colors"
            >
                {/* Left Spacer */}
                <span className="w-full text-left" />
                
                {/* Centered Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-reenie text-[#637381] group-hover:text-amber-100 transition-colors uppercase text-center max-w-[60vw] md:max-w-[70vw]">
                    {title}
                </h2>
                
                {/* Right Arrow (aligned to the end) */}
                <div className="flex justify-end w-full">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-[#637381] group-hover:text-amber-100"
                    >
                        <ChevronDown size={40} className="md:w-16 md:h-16" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-12 md:pb-20 pt-4">
                            <ProjectGrid projects={projects} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
