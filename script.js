// Miles Morales Spider-Man Birthday Invitation JavaScript

// Safari/iOS detection for better compatibility
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMobileSafari = isSafari && isIOS;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize music
    initializeMusic();
    
    // Initialize map functionality
    initializeMap();
    
    // Initialize Liverpool app integration
    initializeLiverpoolIntegration();
    
    // Initialize RSVP functionality
    initializeRSVP();
    
    // Add web-slinging animations
    addSpiderEffects();
    
    // Apply Safari-specific fixes
    if (isMobileSafari) {
        applySafariMobileFixes();
    }
});

// Music functionality with Safari/iOS compatibility
function initializeMusic() {
    const music = document.getElementById('background-music');
    const musicButton = document.getElementById('music-toggle');
    let isPlaying = false;

    if (!music || !musicButton) {
        console.error('Audio elements not found');
        return;
    }

    // Update button state
    const updateButtonState = (playing) => {
        isPlaying = playing;
        if (playing) {
            musicButton.textContent = '🔇 Pausar';
            musicButton.style.background = 'linear-gradient(145deg, #FFD700, #FFC700)';
        } else {
            musicButton.textContent = '🎵 Música';
            musicButton.style.background = 'linear-gradient(145deg, #FF6B35, #E5562E)';
        }
    };

    // Handle audio events
    music.addEventListener('loadstart', () => console.log('Audio loading started'));
    music.addEventListener('canplay', () => console.log('Audio can play'));
    music.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        showNotification('Error al cargar la música', 'info');
    });
    
    music.addEventListener('play', () => updateButtonState(true));
    music.addEventListener('pause', () => updateButtonState(false));

    let playAttempts = 0;
    const maxPlayAttempts = 3;
    
    const tryPlayAudio = async () => {
        try {
            await music.play();
            console.log('Music playing successfully');
            playAttempts = 0; // Reset on success
            return true;
        } catch (error) {
            console.error(`Playback attempt ${playAttempts + 1} failed:`, error);
            
            if (error.name === 'AbortError' && playAttempts < maxPlayAttempts) {
                playAttempts++;
                console.log(`Retrying audio playback (attempt ${playAttempts})`);
                // Wait longer between retries
                await new Promise(resolve => setTimeout(resolve, 200 * playAttempts));
                return tryPlayAudio();
            } else {
                playAttempts = 0;
                if (error.name === 'AbortError') {
                    showNotification('Audio interrumpido. Intenta de nuevo.', 'info');
                } else {
                    showNotification('Haz clic para activar la música', 'info');
                }
                return false;
            }
        }
    };

    musicButton.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Music button clicked');
        
        if (isPlaying) {
            music.pause();
        } else {
            await tryPlayAudio();
        }
    });

    // Initialize audio on first music button interaction only
    let audioInitialized = false;
    musicButton.addEventListener('touchstart', function enableAudio() {
        if (!audioInitialized) {
            audioInitialized = true;
            music.volume = 0.7;
            console.log('Audio initialized on music button touch');
        }
    }, { once: true, passive: true });
}

// Map functionality
function initializeMap() {
    const showMapButton = document.getElementById('show-map');
    const closeMapButton = document.getElementById('close-map');
    const mapContainer = document.getElementById('map-container');
    let map = null;

    const handleMapButtonClick = function(e) {
        // Different event handling for mobile Safari
        if (isMobileSafari) {
            e.preventDefault();
        } else {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        console.log('Map button clicked');
        mapContainer.classList.remove('map-hidden');
        
        if (!map) {
            // Calle Federico Baena 215, San Marcos, 37410 León, Guanajuato
            const latitude = 21.1380; // Coordenadas aproximadas de Colonia San Marcos, León
            const longitude = -101.7047;

            map = L.map('map').setView([latitude, longitude], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Custom Spider-Man marker
            const spiderIcon = L.divIcon({
                className: 'spider-marker',
                html: '🕷️',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            L.marker([latitude, longitude], {icon: spiderIcon})
                .addTo(map)
                .bindPopup(`
                    <div style="text-align: center; font-family: 'Bangers', cursive;">
                        <h3 style="color: #FF6B35; margin: 0;">¡Fiesta de Mario!</h3>
                        <p style="margin: 5px 0;"><strong>Salón "El Mundo de Max"</strong></p>
                        <p style="margin: 5px 0;">Calle Federico Baena 215</p>
                        <p style="margin: 5px 0;">San Marcos, 37410</p>
                        <p style="margin: 5px 0;">León, Guanajuato</p>
                        <p style="margin: 5px 0; color: #FFD700;">🕷️ ¡Te esperamos! 🕷️</p>
                    </div>
                `)
                .openPopup();

            // Add some Spider-Man style to the map
            setTimeout(() => {
                const mapElement = document.getElementById('map');
                mapElement.style.border = '3px solid #FF6B35';
                mapElement.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.5)';
            }, 500);
        }

        // Smooth scroll to map
        mapContainer.scrollIntoView({ behavior: 'smooth' });
    };

    // Add event listeners with Safari-specific handling
    showMapButton.addEventListener('click', handleMapButtonClick);
    if (isMobileSafari) {
        showMapButton.addEventListener('touchstart', handleMapButtonClick, { passive: false });
    }

    const handleCloseMapClick = function(e) {
        if (isMobileSafari) {
            e.preventDefault();
        } else {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        console.log('Close map button clicked');
        mapContainer.classList.add('map-hidden');
    };

    closeMapButton.addEventListener('click', handleCloseMapClick);
    if (isMobileSafari) {
        closeMapButton.addEventListener('touchstart', handleCloseMapClick, { passive: false });
    }
}

// Liverpool app integration with fallbacks
function initializeLiverpoolIntegration() {
    const liverpoolButton = document.getElementById('liverpool-link');
    
    const handleLiverpoolClick = function(e) {
        // Different event handling for mobile Safari
        if (isMobileSafari) {
            e.preventDefault();
        } else {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        console.log('Liverpool button clicked');
        
        const liverpoolWebUrl = 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51751987';
        
        // Safari-specific handling
        if (isMobileSafari) {
            // Direct navigation for mobile Safari
            setTimeout(() => {
                window.location.href = liverpoolWebUrl;
            }, 100);
        } else {
            // Try different approaches for other browsers
            try {
                // Modern browsers
                if (window.open) {
                    const newWindow = window.open(liverpoolWebUrl, '_blank', 'noopener,noreferrer');
                    
                    // Fallback if popup blocked
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        window.location.href = liverpoolWebUrl;
                    }
                } else {
                    // Very old browsers fallback
                    window.location.href = liverpoolWebUrl;
                }
            } catch (error) {
                // Ultimate fallback
                window.location.href = liverpoolWebUrl;
            }
        }

        showNotification('Abriendo lista de regalos de Liverpool...', 'success');
        
        // Add visual feedback with better mobile support
        liverpoolButton.style.transform = 'scale(0.95)';
        liverpoolButton.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            liverpoolButton.style.transform = 'scale(1)';
        }, 150);
    };

    // Add event listeners with Safari-specific handling
    liverpoolButton.addEventListener('click', handleLiverpoolClick);
    if (isMobileSafari) {
        liverpoolButton.addEventListener('touchstart', handleLiverpoolClick, { passive: false });
    }
}

// RSVP functionality
function initializeRSVP() {
    const rsvpButton = document.getElementById('rsvp-button');
    
    rsvpButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('RSVP button clicked');
        const message = encodeURIComponent(
            '¡Hola! Confirmo mi asistencia a la fiesta de Mario 🕷️\n\n' +
            '📅 Fecha: Domingo 14 de Septiembre 2025\n' +
            '🕒 Hora: 3:00 PM\n' +
            '📍 Lugar: Salón "El Mundo de Max"\n' +
            'Calle Federico Baena 215\n' +
            'San Marcos, 37410 León, Guanajuato\n\n' +
            '¡No puedo esperar a celebrar con Mario! 🎉'
        );
        
        // Create WhatsApp link
        const phoneNumber = '5214778144224';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        showNotification('¡Gracias por confirmar! 🕷️', 'success');
        
        // Celebration animation
        createSpiderWebEffect(rsvpButton);
    });
}

// Spider effects and animations
function addSpiderEffects() {
    // Add floating web particles
    createFloatingWebs();
    
    // Add hover effects to cards
    addCardHoverEffects();
    
    // Add periodic spider swing animation
    setInterval(createSpiderSwing, 15000);
}

function createFloatingWebs() {
    const container = document.querySelector('.invitation-container');
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const web = document.createElement('div');
            web.innerHTML = '🕸️';
            web.style.position = 'fixed';
            web.style.fontSize = '20px';
            web.style.left = Math.random() * 100 + 'vw';
            web.style.top = '-50px';
            web.style.zIndex = '0';
            web.style.pointerEvents = 'none';
            web.style.animation = 'float-down 10s linear infinite';
            web.style.opacity = '0.6';
            
            document.body.appendChild(web);
            
            setTimeout(() => {
                if (web.parentNode) {
                    web.parentNode.removeChild(web);
                }
            }, 10000);
        }, i * 3000);
    }
}

function createSpiderSwing() {
    const spider = document.createElement('div');
    spider.innerHTML = '🕷️';
    spider.style.position = 'fixed';
    spider.style.fontSize = '30px';
    spider.style.left = '-50px';
    spider.style.top = '20px';
    spider.style.zIndex = '1000';
    spider.style.pointerEvents = 'none';
    spider.style.animation = 'spider-swing 3s ease-in-out forwards';
    
    document.body.appendChild(spider);
    
    setTimeout(() => {
        if (spider.parentNode) {
            spider.parentNode.removeChild(spider);
        }
    }, 3000);
}

function createSpiderWebEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const web = document.createElement('div');
        web.innerHTML = '🕸️';
        web.style.position = 'fixed';
        web.style.left = (rect.left + rect.width / 2) + 'px';
        web.style.top = (rect.top + rect.height / 2) + 'px';
        web.style.fontSize = '20px';
        web.style.zIndex = '1000';
        web.style.pointerEvents = 'none';
        web.style.animation = `web-burst 1s ease-out forwards`;
        web.style.transform = `rotate(${i * 45}deg)`;
        
        document.body.appendChild(web);
        
        setTimeout(() => {
            if (web.parentNode) {
                web.parentNode.removeChild(web);
            }
        }, 1000);
    }
}

function addCardHoverEffects() {
    const cards = document.querySelectorAll('.detail-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        animation: 'slide-in 0.5s ease-out',
        background: type === 'success' ? 
            'linear-gradient(145deg, #4CAF50, #45a049)' : 
            'linear-gradient(145deg, #FF6B35, #E5562E)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.5s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes float-down {
        from { transform: translateY(-50px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes spider-swing {
        0% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(25vw) translateY(50px) rotate(90deg); }
        50% { transform: translateX(50vw) translateY(0) rotate(180deg); }
        75% { transform: translateX(75vw) translateY(30px) rotate(270deg); }
        100% { transform: translateX(100vw) rotate(360deg); }
    }
    
    @keyframes web-burst {
        from { transform: scale(1) translateX(0); opacity: 1; }
        to { transform: scale(0.5) translateX(100px); opacity: 0; }
    }
    
    @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .spider-marker {
        animation: bounce 1s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Safari Mobile specific fixes
function applySafariMobileFixes() {
    console.log('Applying Safari mobile fixes');
    
    // Fix for layer blocking issue - ensure ALL buttons have same z-index
    const allButtons = ['show-map', 'liverpool-link', 'rsvp-button', 'music-toggle'];
    
    allButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            // All buttons at same level - no blocking
            button.style.position = 'relative';
            button.style.zIndex = '50'; // Same level for all
            button.style.pointerEvents = 'auto';
            
            // Remove any blocking pseudo-elements from parent
            const parent = button.closest('.detail-card');
            if (parent) {
                parent.style.position = 'relative';
                // Temporarily disable shimmer effect that might block clicks
                parent.style.overflow = 'visible';
            }
            
            console.log(`${buttonId} enhanced for Safari with equal z-index`);
        }
    });
    
    // Add additional touch handling for all interactive elements
    const interactiveElements = document.querySelectorAll('button, [onclick], .clickable');
    
    interactiveElements.forEach(element => {
        // Ensure elements are focusable and clickable
        if (!element.tabIndex) {
            element.tabIndex = 0;
        }
        
        // Force layer positioning - same level for all buttons
        if (element.tagName === 'BUTTON') {
            element.style.position = 'relative';
            element.style.zIndex = '50'; // Same level, no blocking
            element.style.pointerEvents = 'auto';
        }
        
        // Add touch-action for better touch handling
        element.style.touchAction = 'manipulation';
        
        // Add visual feedback for touch
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
            console.log(`Touch started on: ${this.id || this.className}`);
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
            console.log(`Touch ended on: ${this.id || this.className}`);
        }, { passive: true });
    });
    
    // Prevent double-tap zoom on buttons
    document.addEventListener('touchend', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add debugging for click events
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            console.log(`Button clicked in Safari: ${e.target.id || e.target.className}`);
            console.log('Event target:', e.target);
            console.log('Current target:', e.currentTarget);
        }
    }, true);
}