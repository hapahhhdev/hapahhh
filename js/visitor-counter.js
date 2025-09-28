document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('visitor-count');
    
    // Clés pour le stockage local
    const VISIT_COUNT_KEY = 'hapahhh-visit-count';
    const LAST_VISIT_KEY = 'hapahhh-last-visit';
    
    // Fonction pour formater le nombre avec des points comme séparateur de milliers
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Fonction pour mettre à jour le compteur
    function updateCounter() {
        // Récupérer le compteur actuel
        let currentCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
        
        // Incrémenter le compteur à CHAQUE chargement de page
        currentCount++;
        
        // Sauvegarder le nouveau compteur
        localStorage.setItem(VISIT_COUNT_KEY, currentCount.toString());
        
        // Ajouter une classe pour l'animation
        counterElement.classList.add('updated');
        
        // Retirer la classe après l'animation
        setTimeout(() => {
            counterElement.classList.remove('updated');
        }, 1000);
        
        // Mettre à jour l'affichage avec le nombre formaté
        counterElement.textContent = formatNumber(currentCount);
    }
    
    // Mettre à jour le compteur au chargement de la page
    updateCounter();
});
