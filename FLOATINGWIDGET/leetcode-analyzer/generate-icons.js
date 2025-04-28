const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);
    
    // Code brackets
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = size / 8;
    
    // Left bracket
    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.2);
    ctx.lineTo(size * 0.2, size * 0.5);
    ctx.lineTo(size * 0.3, size * 0.8);
    ctx.stroke();
    
    // Right bracket
    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.2);
    ctx.lineTo(size * 0.8, size * 0.5);
    ctx.lineTo(size * 0.7, size * 0.8);
    ctx.stroke();
    
    // Center dot
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas;
}

// Generate and save icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, `icon${size}.png`), buffer);
    console.log(`Generated icon${size}.png`);
}); 