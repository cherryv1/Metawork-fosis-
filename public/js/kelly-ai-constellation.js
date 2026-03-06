// KELLY AI CONSTELLATION - INTERACTIVE CHERRY WITH ELECTRIC FLOW
// Minimal, functional, optimized for Android 11

const GEMS = {
    JADE: { color: '#00C957', glow: '#00FF7F', brightness: 0.8 },
    RUBY: { color: '#E0115F', glow: '#FF1493', brightness: 0.9 },
    SAPPHIRE: { color: '#0F52BA', glow: '#1E90FF', brightness: 0.85 },
    EMERALD: { color: '#50C878', glow: '#00FF00', brightness: 0.8 },
    AMBER: { color: '#FFBF00', glow: '#FFD700', brightness: 0.95 },
    DIAMOND: { color: '#FFFFFF', glow: '#E0FFFF', brightness: 1.0 }
};

// Osa Mayor coordinates
const URSA_MAJOR = [
    { x: 0.2, y: 0.2, gem: 'JADE' },
    { x: 0.35, y: 0.25, gem: 'RUBY' },
    { x: 0.5, y: 0.3, gem: 'SAPPHIRE' },
    { x: 0.65, y: 0.28, gem: 'EMERALD' },
    { x: 0.75, y: 0.35, gem: 'AMBER' },
    { x: 0.85, y: 0.4, gem: 'DIAMOND' },
    { x: 0.9, y: 0.5, gem: 'JADE' }
];

class CherryAvatar {
    constructor(x, y, size = 50) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.rotation = 0;
        this.pulse = 0;
        this.electricFlow = 0;
        this.isHovered = false;
    }

    update() {
        this.rotation += 0.02;
        this.pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
        this.electricFlow = (Date.now() * 0.003) % (Math.PI * 2);
    }

    drawElectricFlow(ctx) {
        const segments = 12;
        const radius = this.size * 1.5;
        
        for (let i = 0; i < segments; i++) {
            const angle = (Math.PI * 2 / segments) * i + this.electricFlow;
            const nextAngle = (Math.PI * 2 / segments) * (i + 1) + this.electricFlow;
            
            const x1 = this.x + Math.cos(angle) * radius;
            const y1 = this.y + Math.sin(angle) * radius;
            const x2 = this.x + Math.cos(nextAngle) * radius;
            const y2 = this.y + Math.sin(nextAngle) * radius;
            
            const brightness = Math.sin(this.electricFlow + i) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(0, 255, 200, ${brightness * 0.6})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Electric spark
            ctx.fillStyle = `rgba(100, 255, 255, ${brightness * 0.8})`;
            ctx.beginPath();
            ctx.arc(x1, y1, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Cherry body (main sphere)
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#FF4D7D');
        gradient.addColorStop(0.7, '#E0115F');
        gradient.addColorStop(1, '#8B0A3D');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Cherry stem
        ctx.strokeStyle = '#2D5016';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(-8, -this.size - 15);
        ctx.lineTo(8, -this.size - 15);
        ctx.stroke();

        // Glow
        ctx.fillStyle = `rgba(255, 77, 125, ${this.pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw electric flow around cherry
        this.drawElectricFlow(ctx);
    }

    setHovered(hovered) {
        this.isHovered = hovered;
    }
}

class GemStar {
    constructor(x, y, gemType, canvasWidth, canvasHeight) {
        this.x = x * canvasWidth;
        this.y = y * canvasHeight;
        this.gem = GEMS[gemType];
        this.size = 8 + Math.random() * 4;
        this.twinkle = 0;
        this.twinkelSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
        this.twinkle += this.twinkelSpeed;
        if (this.twinkle > 1) this.twinkle = 0;
    }

    draw(ctx) {
        const brightness = this.gem.brightness * (0.5 + Math.abs(Math.sin(this.twinkle * Math.PI)) * 0.5);
        
        // Star glow
        const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        glowGradient.addColorStop(0, this.gem.glow + Math.floor(brightness * 255).toString(16).padStart(2, '0'));
        glowGradient.addColorStop(1, this.gem.glow + '00');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = this.gem.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * brightness, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AIConstellationSystem {
    constructor(canvasId = 'particles') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.cherry = null;
        this.stars = [];
        this.lineOpacity = 0;
        this.cherryLink = 'https://tr.ee/Y7Xv9N';
        
        this.resizeCanvas();
        this.init();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Cherry avatar in center with electric aura
        this.cherry = new CherryAvatar(
            this.canvas.width / 2,
            this.canvas.height / 2,
            40
        );

        // Create constellation stars
        this.stars = URSA_MAJOR.map(star => 
            new GemStar(star.x, star.y, star.gem, this.canvas.width, this.canvas.height)
        );

        // Interactivity
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.cherry) {
                const dx = e.clientX - this.cherry.x;
                const dy = e.clientY - this.cherry.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.lineOpacity = Math.max(0, 1 - dist / 300);
                
                if (dist < 100) {
                    this.cherry.setHovered(true);
                    this.canvas.style.cursor = 'pointer';
                } else {
                    this.cherry.setHovered(false);
                    this.canvas.style.cursor = 'default';
                }
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.cherry) {
                const dx = e.clientX - this.cherry.x;
                const dy = e.clientY - this.cherry.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    window.open(this.cherryLink, '_blank');
                }
            }
        });
    }

    drawConstellation() {
        if (this.stars.length < 2) return;

        this.ctx.strokeStyle = `rgba(100, 200, 255, ${this.lineOpacity * 0.3})`;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.stars.length - 1; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
            this.ctx.lineTo(this.stars[i + 1].x, this.stars[i + 1].y);
            this.ctx.stroke();
        }
    }

    animate() {
        // Space background
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Distant stars
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % this.canvas.width;
            const y = (i * 73.3) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }

        // Update and draw constellation
        this.stars.forEach(star => {
            star.update();
            star.draw(this.ctx);
        });

        this.drawConstellation();

        // Update and draw cherry with electric flow
        if (this.cherry) {
            this.cherry.update();
            this.cherry.draw(this.ctx);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiConstellation = new AIConstellationSystem('particles');
    });
} else {
    window.aiConstellation = new AIConstellationSystem('particles');
}

console.log('🍒 Kelly AI Constellation System Ready');
