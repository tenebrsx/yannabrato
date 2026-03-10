"use client";

import Link from "next/link";
import { useCursor } from "@/context/CursorContext";

export default function Footer() {
    const { setCursor } = useCursor();
    const handleMouseEnter = () => setCursor("link");
    const handleMouseLeave = () => setCursor("default");

    return (
        <footer className="px-4 md:px-10 py-10 bg-black text-[#D5E8D4] mix-blend-difference border-t border-white/10 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="font-mono text-xs uppercase opacity-50">
                    &copy; {new Date().getFullYear()} Yana Beato
                </div>

                <div className="flex gap-6 font-mono text-xs uppercase">
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

                <div className="font-mono text-[10px] uppercase opacity-30 text-right">
                    creado por ti
                </div>
            </div>
        </footer>
    );
}
