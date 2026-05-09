"use client";

import Link from "next/link";
import { useCursor } from "@/context/CursorContext";

export default function Footer() {
    const { setCursor } = useCursor();
    const handleMouseEnter = () => setCursor("link");
    const handleMouseLeave = () => setCursor("default");

    return (
        <footer className="px-4 md:px-10 py-10 bg-black text-[#637381] mix-blend-difference border-t border-white/10 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#637381] opacity-70">
                    &copy; {new Date().getFullYear()} Yana Beato
                </div>

                <div className="flex gap-6 font-reenie text-xl">
                    <a
                        href="https://instagram.com/myvisual.experience"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Instagram
                    </a>
                    <a
                        href="mailto:yannambeatom24@gmail.com"
                        className="hover:text-accent transition-colors"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Email
                    </a>
                    <Link
                        href="/about"
                        className="hover:text-accent transition-colors"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Contacto
                    </Link>
                </div>

                <div className="font-sans text-[8px] uppercase tracking-[0.3em] text-[#637381] opacity-40 text-right">
                    creado por ti
                </div>
            </div>
        </footer>
    );
}
