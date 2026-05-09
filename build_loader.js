const TextToSVG = require('text-to-svg');
const fs = require('fs');

const textToSVG = TextToSVG.loadSync('./reenie.ttf');

const text = "Yanna Beato";
const options = { x: 0, y: 0, fontSize: 180, anchor: 'top' };

let cursorX = 0;
let svgPaths = '';
let delayAccumulator = 0.2;

for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
        cursorX += 45; // space width
        delayAccumulator += 0.2;
        continue;
    }
    
    // Get path for the character
    const pathD = textToSVG.getD(char, { ...options, x: cursorX, attributes: { fill: 'transparent' } });
    const metrics = textToSVG.getMetrics(char, options);
    
    // Create motion.path for framer motion.
    svgPaths += `
                            <!-- ${char} -->
                            <motion.path 
                                d="${pathD}"
                                initial={{ pathLength: 0, fill: 'rgba(139, 163, 181, 0)' }}
                                animate={{ pathLength: 1, fill: 'rgba(139, 163, 181, 1)' }}
                                transition={{ 
                                    pathLength: { duration: 1.2, ease: 'easeOut', delay: ${delayAccumulator.toFixed(2)} },
                                    fill: { duration: 0.5, ease: 'easeIn', delay: ${(delayAccumulator + 0.8).toFixed(2)} }
                                }}
                            />`;
    
    cursorX += metrics.width + 10; // kerning
    delayAccumulator += 0.25; // 250ms delay per letter drawing start
}

// Wrap in full React component code
const componentCode = `"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function InitialLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "auto";
        }, 4500);

        return () => {
            document.body.style.overflow = "auto";
            clearTimeout(timer);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative flex items-center justify-center w-full px-4"
                    >
                        <svg 
                            viewBox="0 0 820 200" 
                            className="w-full max-w-4xl text-[#8ba3b5] stroke-current stroke-[2] fill-transparent"
                            xmlns="http://www.w3.org/2000/svg"
                        >${svgPaths}
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
`;

fs.writeFileSync('src/components/InitialLoader.tsx', componentCode);
console.log('Loader successfully created with staggered SVG strokes!');
