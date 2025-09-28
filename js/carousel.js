document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.features-carousel');
    const container = carousel.querySelector('.features-container');
    const items = container.querySelectorAll('.feature-box');
    const prevBtn = carousel.querySelector('.prev-arrow');
    const nextBtn = carousel.querySelector('.next-arrow');
    
    let currentIndex = 0;
    const totalItems = items.length;

    // Afficher l'élément actif
    function showItem(index) {
        // Cacher tous les éléments
        items.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('active');
        });
        
        // Afficher l'élément actif
        items[index].style.display = 'block';
        // Ajouter une petite pause pour permettre au navigateur de traiter le display: block
        setTimeout(() => {
            items[index].classList.add('active');
        }, 10);
        
        // Mettre à jour l'état des boutons
        updateButtons();
    }

    // Mettre à jour l'état des boutons de navigation
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalItems - 1;
    }

    // Aller à l'élément précédent
    function prevItem() {
        if (currentIndex > 0) {
            currentIndex--;
            showItem(currentIndex);
        }
    }

    // Aller à l'élément suivant
    function nextItem() {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            showItem(currentIndex);
        }
    }

    // Écouteurs d'événements
    prevBtn.addEventListener('click', prevItem);
    nextBtn.addEventListener('click', nextItem);

    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevItem();
        } else if (e.key === 'ArrowRight') {
            nextItem();
        }
    });

    // Initialisation
    showItem(currentIndex);
});
