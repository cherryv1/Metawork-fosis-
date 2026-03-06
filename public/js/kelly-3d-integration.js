// ============================================
// KELLY 3D INTERACTIVE INTEGRATION
// Avatar Kelly + Partículas Dinámicas (35% azul, 35% verde, 30% rojo)
// ============================================

// Configuración de partículas dinámicas con colores especificados
const PARTICLE_CONFIG = {
    BLUE: { ratio: 0.35, color: 'rgba(0, 150, 255, ' },
    GREEN: { ratio: 0.35, color: 'rgba(0, 255, 100, ' },
    RED: { ratio: 0.30, color: 'rgba(255, 50, 50, ' },
    SPEED_MULTIPLIER: 0.5 // Mitad de velocidad
};

// Extender la clase Particle existente
class KellyParticle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 3 + 1;
        
        // Velocidad a mitad de la velocidad normal
        this.speedX = (Math.random() - 0.5) * 2 * PARTICLE_CONFIG.SPEED_MULTIPLIER;
        this.speedY = (Math.random() - 0.5) * 2 * PARTICLE_CONFIG.SPEED_MULTIPLIER;
        
        this.opacity = Math.random() * 0.6 + 0.4;
        
        // Asignar color según distribución
        const rand = Math.random();
        if (rand < PARTICLE_CONFIG.BLUE.ratio) {
            this.colorType = 'blue';
            this.baseColor = PARTICLE_CONFIG.BLUE.color;
        } else if (rand < PARTICLE_CONFIG.BLUE.ratio + PARTICLE_CONFIG.GREEN.ratio) {
            this.colorType = 'green';
            this.baseColor = PARTICLE_CONFIG.GREEN.color;
        } else {
            this.colorType = 'red';
            this.baseColor = PARTICLE_CONFIG.RED.color;
        }
        
        this.color = this.baseColor + this.opacity + ')';
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en bordes
        if (this.x < 0 || this.x > window.innerWidth) {
            this.speedX *= -1;
            this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.speedY *= -1;
            this.y = Math.max(0, Math.min(window.innerHeight, this.y));
        }

        // Parpadeo suave
        this.opacity += (Math.random() - 0.5) * 0.03;
        this.opacity = Math.max(0.2, Math.min(1, this.opacity));
        this.color = this.baseColor + this.opacity + ')';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect según color
        ctx.strokeStyle = this.baseColor + (this.opacity * 0.3) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

// Avatar Kelly 3D
class KellyAvatar {
    constructor(x, y, size = 100) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.rotation = 0;
        this.scale = 1;
        this.glowIntensity = 0;
        this.isHovered = false;
    }

    update() {
        this.rotation += 0.005;
        this.glowIntensity = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;
        
        if (this.isHovered) {
            this.scale = Math.min(1.2, this.scale + 0.02);
        } else {
            this.scale = Math.max(1, this.scale - 0.02);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // Glow externo
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.2);
        glowGradient.addColorStop(0, `rgba(0, 200, 255, ${this.glowIntensity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Avatar circular con gradiente
        const avatarGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        avatarGradient.addColorStop(0, 'rgba(100, 200, 255, 1)');
        avatarGradient.addColorStop(0.5, 'rgba(50, 150, 255, 0.8)');
        avatarGradient.addColorStop(1, 'rgba(0, 100, 200, 0.6)');
        
        ctx.fillStyle = avatarGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Borde brillante
        ctx.strokeStyle = `rgba(0, 255, 200, ${0.5 + this.glowIntensity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Símbolo K en el centro (Kelly)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `bold ${this.size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('K', 0, 0);

        ctx.restore();
    }

    setHovered(hovered) {
        this.isHovered = hovered;
    }
}

// Sistema de partículas dinámicas mejorado
class DynamicParticleSystem {
    constructor(canvasId = 'particles') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.kelly = null;
        this.particleCount = 100;
        
        this.resizeCanvas();
        this.initializeParticles();
        this.initializeKelly();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new KellyParticle());
        }
    }

    initializeKelly() {
        this.kelly = new KellyAvatar(
            window.innerWidth / 2,
            window.innerHeight / 2,
            60
        );

        // Interactividad con Kelly
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.kelly) {
                const dx = e.clientX - this.kelly.x;
                const dy = e.clientY - this.kelly.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.kelly.setHovered(true);
                } else {
                    this.kelly.setHovered(false);
                }
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.kelly) {
                const dx = e.clientX - this.kelly.x;
                const dy = e.clientY - this.kelly.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.createExplosion(this.kelly.x, this.kelly.y);
                }
            }
        });
    }

    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            const particle = new KellyParticle();
            particle.x = x;
            particle.y = y;
            particle.speedX = (Math.random() - 0.5) * 4;
            particle.speedY = (Math.random() - 0.5) * 4;
            this.particles.push(particle);
        }
    }

    drawConnections() {
        const maxDistance = 200;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    
                    // Color de línea según partículas
                    const color1 = this.particles[i].colorType;
                    const color2 = this.particles[j].colorType;
                    
                    let lineColor = 'rgba(100, 200, 255, ' + opacity + ')';
                    if (color1 === 'red' || color2 === 'red') {
                        lineColor = 'rgba(255, 100, 100, ' + opacity + ')';
                    }
                    
                    this.ctx.strokeStyle = lineColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        // Fondo con gradiente dinámico
        const bgGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        bgGradient.addColorStop(0, 'rgba(5, 15, 35, 0.95)');
        bgGradient.addColorStop(0.5, 'rgba(10, 25, 50, 0.95)');
        bgGradient.addColorStop(1, 'rgba(5, 15, 35, 0.95)');
        
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Actualizar y dibujar partículas
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        // Dibujar conexiones
        this.drawConnections();

        // Actualizar y dibujar Kelly
        if (this.kelly) {
            this.kelly.update();
            this.kelly.draw(this.ctx);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.kellySystem = new DynamicParticleSystem('particles');
    });
} else {
    window.kellySystem = new DynamicParticleSystem('particles');
}

console.log('✨ Kelly 3D Interactive System Initialized');
console.log('📊 Particle Distribution: 35% Blue, 35% Green, 30% Red');
console.log('⚡ Speed: 50% of normal (Half Speed)');
