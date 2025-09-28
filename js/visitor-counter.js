document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('visitor-count');
    
    // Créer un identifiant unique pour ce site (vous pouvez le personnaliser)
    const SITE_ID = 'hapahhh-portfolio';
    
    // URL de l'API CountAPI
    const COUNT_API = `https://api.countapi.xyz/hit/${SITE_ID}/visits`;
    
    // Fonction pour formater le nombre avec des espaces comme séparateur de milliers
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    
    // Fonction pour mettre à jour le compteur
    async function updateCounter() {
        try {
            // Incrémenter le compteur et récupérer la nouvelle valeur
            const response = await fetch(COUNT_API);
            const data = await response.json();
            
            if (data && data.value) {
                // Mettre à jour l'affichage avec le nombre formaté
                counterElement.textContent = formatNumber(data.value);
                
                // Ajouter une classe pour l'animation
                counterElement.classList.add('updated');
                
                // Retirer la classe après l'animation
                setTimeout(() => {
                    counterElement.classList.remove('updated');
                }, 1000);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compteur :', error);
            counterElement.textContent = '1';
        }
    }
    
    // Mettre à jour le compteur au chargement de la page
    updateCounter();
    
    // Mettre à jour le compteur toutes les 5 minutes (optionnel)
    setInterval(updateCounter, 5 * 60 * 1000);
});
