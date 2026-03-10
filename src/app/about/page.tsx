"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-black text-[#D5E8D4]">
            <div className="max-w-[1920px] mx-auto">

                {/* Hero Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 md:mb-32"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold uppercase leading-[0.9] tracking-tight">
                        Yanna<br />Beato
                    </h1>
                    <p className="mt-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
                        Coreógrafa · Directora de Movimiento · Producción Audiovisual
                    </p>
                </motion.div>

                {/* Bio Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/10 pb-20"
                >
                    <div className="md:col-span-3">
                        <h2 className="font-mono text-xs uppercase text-zinc-500 tracking-widest sticky top-32">Sobre Mí</h2>
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
                                className="inline-flex items-center gap-3 px-6 py-3 border border-zinc-700 rounded-full font-mono text-xs uppercase tracking-widest text-zinc-300 hover:bg-[#D5E8D4] hover:text-black hover:border-[#D5E8D4] transition-all duration-300 group"
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
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/10 pb-20"
                >
                    <div className="md:col-span-3">
                        <h2 className="font-mono text-xs uppercase text-zinc-500 tracking-widest sticky top-32">Narrativa · Cuerpo · Cámara</h2>
                    </div>
                    <div className="md:col-span-8 md:col-start-5">
                        <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-400">
                            Formación en cine y experiencia en producción audiovisual. Mi enfoque une la dirección creativa con la coreografía para crear piezas donde el movimiento cuenta la historia — desde la conceptualización hasta la postproducción.
                        </p>
                    </div>
                </motion.section>

                {/* Contact Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-32 border-b border-white/10 pb-20"
                >
                    <div className="md:col-span-3">
                        <h2 className="font-mono text-xs uppercase text-zinc-500 tracking-widest sticky top-32">Contacto</h2>
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

                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
