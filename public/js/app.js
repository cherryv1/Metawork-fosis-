// Configuración del canvas y contexto
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Clase para las partículas
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.color = `rgba(0, 255, 0, ${this.opacity})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
            this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        // Parpadeo suave
        this.opacity += (Math.random() - 0.5) * 0.05;
        this.opacity = Math.max(0.3, Math.min(1, this.opacity));
        this.color = `rgba(0, 255, 0, ${this.opacity})`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = `rgba(0, 255, 0, ${this.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

// Crear 50 partículas
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Función para dibujar líneas de conexión entre partículas cercanas
function drawConnections() {
    const maxDistance = 150;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.3;
                ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Función de animación principal
function animate() {
    // Limpiar canvas con fondo oscuro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Dibujar conexiones
    drawConnections();

    // Continuar animación
    requestAnimationFrame(animate);
}

// Iniciar animación
animate();

// Interactividad: crear partículas en el mouse
document.addEventListener('mousemove', (e) => {
    // Opcional: agregar partículas en la posición del mouse
    // Descomenta si deseas esta funcionalidad
    /*
    if (Math.random() > 0.95) {
        const particle = new Particle();
        particle.x = e.clientX;
        particle.y = e.clientY;
        particles.push(particle);
        if (particles.length > 100) {
            particles.shift();
        }
    }
    */
});

// Efectos de hover en los botones de órbita
const orbitButtons = document.querySelectorAll('.orbit-button');
orbitButtons.forEach((button, index) => {
    button.addEventListener('mouseenter', () => {
        // Agregar efecto visual
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = '';
        }, 10);
    });
});

// Efecto de clic en los botones
orbitButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Crear efecto de ripple
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(0, 255, 0, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Agregar animación de ripple al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Log de inicialización
console.log('🎨 METAWORK-FOSIS initialized');
console.log('📊 Particles: 50');
console.log('🌐 Baxto Style Tattoo');
