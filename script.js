// Miles Morales Spider-Man Birthday Invitation JavaScript

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
});

// Music functionality with Safari/iOS compatibility
function initializeMusic() {
    const music = document.getElementById('background-music');
    const musicButton = document.getElementById('music-toggle');
    let isPlaying = false;

    // Safari/iOS requires user interaction first
    const enableAudio = () => {
        if (music) {
            music.load(); // Reload audio for iOS Safari
        }
    };

    musicButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isPlaying) {
            music.pause();
            musicButton.textContent = '🎵 Música';
            musicButton.style.background = 'linear-gradient(145deg, #FF6B35, #E5562E)';
        } else {
            // iOS Safari audio play with Promise handling
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicButton.textContent = '🔇 Pausar';
                    musicButton.style.background = 'linear-gradient(145deg, #FFD700, #FFC700)';
                    isPlaying = true;
                }).catch(error => {
                    console.log('Audio play failed:', error);
                    showNotification('Activa el audio manualmente', 'info');
                    // Try to load the audio again for iOS
                    music.load();
                });
            }
        }
        
        if (isPlaying && !music.paused) {
            isPlaying = false;
        } else if (!isPlaying && !music.paused) {
            isPlaying = true;
        }
    });

    // Enable audio on first user interaction (iOS Safari requirement)
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });

    // Don't auto-play on mobile devices
    if (!(/Mobi|Android/i.test(navigator.userAgent))) {
        setTimeout(() => {
            music.play().catch(e => {
                console.log('Auto-play blocked');
            });
        }, 1500);
    }
}

// Map functionality
function initializeMap() {
    const showMapButton = document.getElementById('show-map');
    const closeMapButton = document.getElementById('close-map');
    const mapContainer = document.getElementById('map-container');
    let map = null;

    showMapButton.addEventListener('click', function() {
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
    });

    closeMapButton.addEventListener('click', function() {
        mapContainer.classList.add('map-hidden');
    });
}

// Liverpool app integration with fallbacks
function initializeLiverpoolIntegration() {
    const liverpoolButton = document.getElementById('liverpool-link');
    
    liverpoolButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const liverpoolWebUrl = 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51751987';
        
        // Try different approaches for different browsers
        try {
            // Modern browsers
            if (window.open) {
                const newWindow = window.open(liverpoolWebUrl, '_blank', 'noopener,noreferrer');
                
                // Fallback if popup blocked
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // iOS Safari fallback
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

        showNotification('Abriendo lista de regalos de Liverpool...', 'success');
        
        // Add visual feedback with better mobile support
        liverpoolButton.style.transform = 'scale(0.95)';
        liverpoolButton.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            liverpoolButton.style.transform = 'scale(1)';
        }, 150);
    });
}

// RSVP functionality
function initializeRSVP() {
    const rsvpButton = document.getElementById('rsvp-button');
    
    rsvpButton.addEventListener('click', function() {
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