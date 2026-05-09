"use client";

import Link from "next/link";
import { useCursor } from "@/context/CursorContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    categories?: { label: string; href: string }[];
}

export default function Header({ categories = [] }: HeaderProps) {
    const { setCursor } = useCursor();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => setCursor("link");
    const handleMouseLeave = () => setCursor("default");

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuVariants = {
        initial: { y: "-100%" },
        animate: { y: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
        exit: { y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } }
    }

    // Combine dynamic categories with static links
    const staticLinks = [
        { href: "/#sobre-mi", label: "SOBRE MÍ" },
        { href: "/#contacto", label: "CONTACTO" },
    ];

    const navLinks = [...categories, ...staticLinks];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-6 flex justify-between items-start mix-blend-difference text-[#637381]">
                {/* Left: Branding */}
                <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="text-4xl font-reenie tracking-wider hover:text-accent transition-colors"
                >
                    Yanna Beato
                </Link>

                {/* Right: Menu Trigger */}
                <button
                    className="font-reenie text-3xl md:text-4xl z-50 relative tracking-widest hover:text-accent transition-colors pt-1"
                    onClick={toggleMenu}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {isMenuOpen ? "CERRAR" : "MENÚ"}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center text-[#637381]"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="font-reenie text-6xl hover:text-accent transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
