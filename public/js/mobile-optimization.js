// Mobile Optimization - Experiencia Premium en Dispositivos

class MobileOptimization {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupported = this.detectTouchSupport();
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }

    detectTouchSupport() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    init() {
        if (this.isMobile || this.touchSupported) {
            this.setupTouchOptimization();
            this.setupHapticFeedback();
            this.setupViewportOptimization();
            this.setupPerformanceOptimization();
        }

        console.log('📱 Mobile Optimization initialized');
        console.log('  - Mobile:', this.isMobile);
        console.log('  - Tablet:', this.isTablet);
        console.log('  - Touch:', this.touchSupported);
    }

    setupTouchOptimization() {
        // Agregar clase touch-enabled al body
        document.body.classList.add('touch-enabled');

        // Optimizar areas de toque
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                .central-button,
                .floating-button,
                .orbit-button {
                    min-width: 60px;
                    min-height: 60px;
                    min-height: 60px;
                }

                .central-button:active,
                .floating-button:active {
                    transform: scale(0.95);
                }

                /* Mejorar feedback visual en toque */
                .floating-button:active {
                    box-shadow: 
                        0 0 40px rgba(57, 255, 20, 0.7),
                        0 0 80px rgba(0, 229, 255, 0.4),
                        inset 0 0 25px rgba(57, 255, 20, 0.2);
                }
            }
        `;
        document.head.appendChild(style);

        // Mejorar respuesta tactil
        this.setupTouchFeedback();
    }

    setupTouchFeedback() {
        const buttons = document.querySelectorAll('.central-button, .floating-button');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                button.style.transform = 'scale(0.95)';
                button.style.boxShadow = `
                    0 0 40px rgba(57, 255, 20, 0.7),
                    0 0 80px rgba(0, 229, 255, 0.4),
                    inset 0 0 25px rgba(57, 255, 20, 0.2)
                `;
            });

            button.addEventListener('touchend', (e) => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });

            button.addEventListener('touchcancel', (e) => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
        });
    }

    setupHapticFeedback() {
        // Usar Vibration API si esta disponible
        if ('vibrate' in navigator) {
            const buttons = document.querySelectorAll('.central-button, .floating-button');
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Vibrar: 10ms
                    navigator.vibrate(10);
                });

                button.addEventListener('touchstart', () => {
                    // Vibrar suave: 5ms
                    navigator.vibrate(5);
                });
            });

            console.log('✨ Haptic feedback enabled');
        }
    }

    setupViewportOptimization() {
        // Optimizar viewport para mejor experiencia
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
            );
        }

        // Prevenir zoom en inputs
        const style = document.createElement('style');
        style.textContent = `
            input, textarea, select {
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    setupPerformanceOptimization() {
        // Reducir animaciones en conexiones lentas
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;

            if (effectiveType === '3g' || effectiveType === '4g') {
                const style = document.createElement('style');
                style.textContent = `
                    .central-button,
                    .floating-button {
                        transition-duration: 0.2s;
                    }

                    @keyframes centralButtonAppear {
                        from {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `;
                document.head.appendChild(style);

                console.log('⚡ Rendimiento optimizado para conexion lenta');
            }
        }

        // Usar requestIdleCallback para tareas no criticas
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                console.log('🔄 Tareas de fondo ejecutadas');
            });
        }
    }

    // Metodos utiles
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: this.isLandscape() ? 'landscape' : 'portrait'
        };
    }

    // Detectar cambios de orientacion
    onOrientationChange(callback) {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                callback({
                    orientation: this.isLandscape() ? 'landscape' : 'portrait',
                    size: this.getScreenSize()
                });
            }, 100);
        });
    }

    // Detectar cambios de conexion
    onConnectionChange(callback) {
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                callback({
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                });
            });
        }
    }

    // Obtener informacion del dispositivo
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            touchSupported: this.touchSupported,
            orientation: this.isLandscape() ? 'landscape' : 'portrait',
            screenSize: this.getScreenSize(),
            userAgent: navigator.userAgent,
            connection: 'connection' in navigator ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }
}

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimization = new MobileOptimization();

    // Escuchar cambios de orientacion
    window.mobileOptimization.onOrientationChange((info) => {
        console.log('📐 Orientacion cambiada:', info);
    });

    // Escuchar cambios de conexion
    window.mobileOptimization.onConnectionChange((info) => {
        console.log('📡 Conexion cambiada:', info);
    });
});

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileOptimization;
}
