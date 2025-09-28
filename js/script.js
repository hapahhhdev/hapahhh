// Bouton de retour en haut
const backToTopBtn = document.getElementById('back-to-top');
const separatorIcon = backToTopBtn?.querySelector('.separator-icon i');

// Gestion du survol du bouton de retour en haut
if (backToTopBtn && separatorIcon) {
    backToTopBtn.addEventListener('mouseenter', () => {
        separatorIcon.classList.remove('bx-chevron-up');
        separatorIcon.classList.add('bx-chevrons-up');
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        separatorIcon.classList.remove('bx-chevrons-up');
        separatorIcon.classList.add('bx-chevron-up');
    });

    // Défilement vers le haut au clic
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Gestion du bouton de retour en haut
const backToTopButton = document.getElementById('back-to-top');
const separatorArrow = backToTopButton?.querySelector('.separator-icon i');

if (backToTopButton && separatorArrow) {
    // Changement d'icône au survol
    backToTopButton.addEventListener('mouseenter', () => {
        separatorArrow.classList.remove('bx-chevron-up');
        separatorArrow.classList.add('bx-chevrons-up');
    });

    backToTopButton.addEventListener('mouseleave', () => {
        separatorArrow.classList.remove('bx-chevrons-up');
        separatorArrow.classList.add('bx-chevron-up');
    });

    // Défilement vers le haut au clic
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Gestion de la navigation active
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

// Animation des sections au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Pour les grilles de projets
            if (entry.target.classList.contains('project-grid')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observer chaque section et grille de projets
document.querySelectorAll('section, .project-grid').forEach(section => {
    observer.observe(section);
});

// Mettre à jour le lien actif dans la navigation
function updateActiveLink() {
    let current = 'accueil'; // Par défaut, on considère que 'accueil' est actif
    
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        let sectionTop = section.offsetTop;
        let sectionHeight = section.offsetHeight;
        
        // Ajustement spécifique pour la section services et contact
        if (sectionId === 'services' || sectionId === 'contact') {
            sectionTop = sectionTop - 300; // Activation plus tôt pour ces sections
            sectionHeight = sectionHeight + 300; // Zone plus grande
        } else {
            sectionTop = sectionTop - 200; // Valeur par défaut pour les autres sections
            sectionHeight = sectionHeight + 200;
        }
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Ajout de la condition pour la section projets
        if (link.getAttribute('href') === `#${current}` || 
            (current === 'accueil' && link.getAttribute('href') === '#accueil') ||
            (current === 'projets' && link.getAttribute('href') === '#services')) {
            link.classList.add('active');
        }
    });
}

// Mettre à jour plus fréquemment pendant le défilement
let isScrolling;
window.addEventListener('scroll', function() {
    // Annule le timer précédent
    window.clearTimeout(isScrolling);
    
    // Définit un nouveau timer
    isScrolling = setTimeout(function() {
        updateActiveLink();
    }, 30); // Mise à jour plus fréquente (30ms au lieu de 250ms par défaut)
}, false);

// Défilement fluide pour les ancres
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Ajuste pour la hauteur de la navbar
                behavior: 'smooth'
            });
        }
    });
});

// Mettre à jour le lien actif lors du défilement
window.addEventListener('scroll', updateActiveLink);

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
        <button class="close-btn" aria-label="Fermer">&times;</button>
    `;
    
    // Ajouter la notification au conteneur
    container.appendChild(notification);
    
    // Afficher la notification avec une animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Fermer la notification après 5 secondes
    const timer = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Permettre de fermer la notification manuellement
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timer);
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
            // Désactiver le bouton pendant l'envoi
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            
            // Vérifier si un tag Discord a été fourni et l'ajouter au message
            const discordTag = contactForm.querySelector('input[name="discord"]').value.trim();
            if (discordTag) {
                // Ajouter le tag Discord au message existant
                const message = formData.get('message');
                formData.set('message', `${message}\n\nTag Discord: ${discordTag}`);
            }
            
            // Envoyer les données au serveur Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Afficher une notification de succès
                showNotification('Message envoyé avec succès ! Je vous répondrai dès que possible.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.', 'error');
        } finally {
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Initialiser l'état actif au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Forcer la mise à jour du lien actif au chargement
    const homeLink = document.querySelector('.nav-links a[href="#accueil"]');
    if (homeLink && window.scrollY < 100) {
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        homeLink.classList.add('active');
    } else {
        updateActiveLink();
    }
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    const animateOutline = () => {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOutline);
    };

    animateOutline();

    const interactiveElements = document.querySelectorAll('a, button, .service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseout', () => {
            cursorOutline.classList.remove('hover');
        });
    });

    // Service Carousel Logic
    const servicesContainer = document.querySelector('.services-container');
    const services = document.querySelector('.services');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const serviceCards = document.querySelectorAll('.service-card');

    if (servicesContainer && services && leftArrow && rightArrow && serviceCards.length > 0) {
        let currentIndex = 0;
        const cardsToShow = 2; // Nombre de cartes à afficher à la fois
        const cardWidth = serviceCards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(services).gap) || 24; // Valeur par défaut de 24px si gap n'est pas défini
        const scrollAmount = (cardWidth * cardsToShow) + (gap * (cardsToShow - 1));
        const maxIndex = Math.max(0, serviceCards.length - cardsToShow);

        // Ajuster la largeur du conteneur pour afficher 2 cartes
        servicesContainer.style.width = `${(cardWidth * cardsToShow) + (gap * (cardsToShow - 1))}px`;
        servicesContainer.style.margin = '0 auto';

        const updateArrows = () => {
            leftArrow.style.display = currentIndex > 0 ? 'flex' : 'none';
            rightArrow.style.display = currentIndex < maxIndex ? 'flex' : 'none';
            
            // Masquer complètement les flèches si pas assez de cartes
            if (serviceCards.length <= cardsToShow) {
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
            }
        };

        const moveToIndex = (index) => {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            services.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            updateArrows();
        };

        rightArrow.addEventListener('click', () => moveToIndex(currentIndex + 1));
        leftArrow.addEventListener('click', () => moveToIndex(currentIndex - 1));

        // Gestion du redimensionnement de la fenêtre
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                servicesContainer.style.width = `${(cardWidth * cardsToShow) + (gap * (cardsToShow - 1))}px`;
                moveToIndex(currentIndex); // Réajuster la position après redimensionnement
            }, 250);
        });

        // Initialisation
        updateArrows();
        
        // Masquer les flèches si nécessaire au chargement
        if (serviceCards.length <= cardsToShow) {
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'none';
        }
    }
});
