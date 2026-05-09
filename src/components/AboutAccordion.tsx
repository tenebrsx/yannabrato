"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function AboutAccordion() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t border-white/10 mt-10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-8 md:py-12 group transition-colors"
            >
                {/* Left Spacer */}
                <span className="w-full text-left" />
                
                {/* Centered Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-reenie text-[#637381] group-hover:text-amber-100 transition-colors uppercase text-center max-w-[60vw] md:max-w-[70vw]">
                    Sobre mí
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
                        <div className="pb-12 md:pb-20 pt-4 grid grid-cols-1 md:grid-cols-12 gap-10 text-[#637381] max-w-6xl mx-auto">
                            <div className="md:col-span-12 space-y-8 font-sans text-xl md:text-2xl text-zinc-300 leading-relaxed max-w-4xl mx-auto text-center">
                                <p>
                                    Yanna Beato es una coreógrafa y directora de movimiento para proyectos audiovisuales. 
                                    Su enfoque interseca la narrativa, el cuerpo y la cámara.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
