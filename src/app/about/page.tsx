"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import ContactAccordion from "@/components/ContactAccordion";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-[#637381]">
            <div className="max-w-[1920px] mx-auto">

                {/* Hero Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 md:mb-32"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-reenie leading-[0.9] tracking-tight">
                        Yanna<br />Beato
                    </h1>
                    <p className="mt-6 font-sans text-xs md:text-sm text-zinc-500 uppercase tracking-[0.25em]">
                        Coreógrafa · Directora de Movimiento · Producción Audiovisual
                    </p>
                </motion.div>

                {/* Bio Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/10 pb-20 max-w-6xl mx-auto"
                >
                    <div className="md:col-span-3">
                        <h2 className="font-sans text-[10px] md:text-xs text-[#637381] uppercase tracking-[0.2em] sticky top-32">Sobre Mí</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5 space-y-8">
                        <p className="text-xl md:text-2xl font-sans font-medium leading-relaxed text-zinc-200">
                            Soy Yanna Beato, una artista del movimiento y profesional audiovisual interesada en la relación entre cuerpo, cámara y narrativa visual.
                        </p>
                        <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                            Mi trabajo combina coreografía, dirección de movimiento y procesos de producción audiovisual, explorando el movimiento como lenguaje cinematográfico en videoclips conceptuales, fotografía y proyectos escénicos.
                        </p>
                        <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                            Paralelamente he desarrollado experiencia en producción de eventos cinematográficos, televisión y festivales de cine.
                        </p>

                        {/* CV Download */}
                        <div className="pt-4">
                            <a
                                href="/Yanna_Beato_CV.pdf"
                                download="Yanna_Beato_CV.pdf"
                                className="inline-flex items-center gap-3 px-6 py-3 border border-zinc-700 rounded-full font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] text-zinc-300 hover:bg-[#637381] hover:text-black hover:border-[#637381] transition-all duration-300 group"
                            >
                                <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                Descargar CV Completo
                            </a>
                        </div>
                    </div>
                </motion.section>

                {/* Narrative Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/10 pb-20 max-w-6xl mx-auto"
                >
                    <div className="md:col-span-3">
                        <h2 className="font-sans text-[10px] md:text-xs text-[#637381] uppercase tracking-[0.2em] sticky top-32">Narrativa · Cuerpo · Cámara</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5">
                        <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                            Formación en cine y experiencia en producción audiovisual. Mi enfoque une la dirección creativa con la coreografía para crear piezas donde el movimiento cuenta la historia — desde la conceptualización hasta la postproducción.
                        </p>
                    </div>
                </motion.section>

                <ContactAccordion />

            </div>
        </main>
    );
}
