const TextToSVG = require('text-to-svg');
const fs = require('fs');

const textToSVG = TextToSVG.loadSync('./reenie.ttf');

const text = "Yanna Beato";
const options = { x: 0, y: 0, fontSize: 100, anchor: 'top' };

const charData = [];
let cursorX = 0;

for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
        cursorX += 30; // space width
        continue;
    }
    
    // Get path for the character
    const pathD = textToSVG.getD(char, { ...options, x: cursorX });
    const metrics = textToSVG.getMetrics(char, options);
    
    charData.push({
        char,
        d: pathD,
        width: metrics.width
    });
    
    cursorX += metrics.width + 2; // kerning
}

console.log(JSON.stringify(charData, null, 2));
