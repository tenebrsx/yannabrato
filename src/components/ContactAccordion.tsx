"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContactAccordion() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t border-white/10 mt-20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-8 md:py-12 group transition-colors"
            >
                {/* Left Spacer */}
                <span className="w-full text-left" />
                
                {/* Centered Title */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-reenie text-[#637381] group-hover:text-amber-100 transition-colors uppercase text-center max-w-[60vw] md:max-w-[70vw]">
                    Contacto
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
                            <div className="md:col-span-4 space-y-8">
                                <div>
                                    <h3 className="font-sans text-[10px] md:text-xs text-zinc-500 mb-2 uppercase tracking-[0.2em]">Email</h3>
                                    <a href="mailto:yannambeatom24@gmail.com" className="font-sans text-xl hover:text-accent transition-colors text-zinc-300">
                                        yannambeatom24@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="font-sans text-[10px] md:text-xs text-zinc-500 mb-2 uppercase tracking-[0.2em]">Instagram</h3>
                                    <a href="https://instagram.com/myvisual.experience" target="_blank" rel="noopener noreferrer" className="font-sans text-xl hover:text-accent transition-colors text-zinc-300">
                                        @myvisual.experience
                                    </a>
                                </div>
                                <div>
                                    <h3 className="font-sans text-[10px] md:text-xs text-zinc-500 mb-2 uppercase tracking-[0.2em]">Teléfono</h3>
                                    <a href="tel:+18098583747" className="font-sans text-xl hover:text-accent transition-colors text-zinc-300">
                                        809-858-3747
                                    </a>
                                </div>
                            </div>
                            
                            <div className="md:col-span-8">
                                <ContactForm />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
