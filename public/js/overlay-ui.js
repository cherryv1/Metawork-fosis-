// Overlay UI - Sistema de Menu Radial Interactivo

class OverlayUIMenu {
    constructor() {
        this.centralButton = document.getElementById('centralButton');
        this.floatingButtonsContainer = document.getElementById('floatingButtonsContainer');
        this.floatingButtons = document.querySelectorAll('.floating-button');
        
        this.isMenuOpen = false;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        // Event listeners
        this.centralButton.addEventListener('click', () => this.toggleMenu());
        this.centralButton.addEventListener('touchstart', () => this.toggleMenu());
        
        // Cerrar menu al hacer click en botones flotantes
        this.floatingButtons.forEach(button => {
            button.addEventListener('click', () => this.closeMenu());
            button.addEventListener('touchstart', () => this.closeMenu());
        });

        // Cerrar menu al hacer click fuera
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.centralButton.contains(e.target) && 
                !this.floatingButtonsContainer.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Cerrar menu con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        console.log('✅ Overlay UI Menu initialized');
    }

    toggleMenu() {
        if (this.isAnimating) return;
        
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (this.isAnimating || this.isMenuOpen) return;
        
        this.isAnimating = true;
        this.isMenuOpen = true;

        // Mostrar botones con animacion radial
        this.floatingButtons.forEach((button, index) => {
            // Remover clase hiding si existe
            button.classList.remove('hiding');
            
            // Agregar clase visible
            setTimeout(() => {
                button.classList.add('visible');
            }, 10);
        });

        // Animar boton central
        this.centralButton.style.transform = 'scale(1.1) rotate(45deg)';

        // Dar feedback visual
        this.centralButton.style.boxShadow = `
            0 0 50px rgba(57, 255, 20, 0.8),
            0 0 100px rgba(0, 229, 255, 0.4),
            inset 0 0 30px rgba(57, 255, 20, 0.2)
        `;

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);

        console.log('📂 Menu abierto');
    }

    closeMenu() {
        if (this.isAnimating || !this.isMenuOpen) return;
        
        this.isAnimating = true;
        this.isMenuOpen = false;

        // Animar cierre de botones
        this.floatingButtons.forEach((button, index) => {
            button.classList.add('hiding');
            
            setTimeout(() => {
                button.classList.remove('visible');
                button.classList.remove('hiding');
            }, 400);
        });

        // Animar boton central
        this.centralButton.style.transform = 'scale(1) rotate(0deg)';
        this.centralButton.style.boxShadow = `
            0 0 30px rgba(57, 255, 20, 0.4),
            inset 0 0 20px rgba(57, 255, 20, 0.1)
        `;

        setTimeout(() => {
            this.isAnimating = false;
        }, 400);

        console.log('📁 Menu cerrado');
    }

    // Metodo para cerrar menu programaticamente
    close() {
        this.closeMenu();
    }

    // Metodo para abrir menu programaticamente
    open() {
        this.openMenu();
    }

    // Metodo para obtener estado del menu
    getState() {
        return {
            isOpen: this.isMenuOpen,
            isAnimating: this.isAnimating
        };
    }
}

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    window.overlayUIMenu = new OverlayUIMenu();
});

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OverlayUIMenu;
}
