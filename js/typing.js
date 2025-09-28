document.addEventListener('DOMContentLoaded', function() {
    const codeContainer = document.querySelector('.code-editor-container');
    const codeElement = codeContainer.querySelector('code');
    const filenameElement = codeContainer.querySelector('.code-filename');
    
    // Liste des exemples de code avec leurs noms de fichier
    const codeSnippets = [
        {
            filename: 'script.js',
            code: '// Code d\'exemple\nfunction helloWorld() {\n    const message = "Bonjour, je suis un éditeur de code interactif !";\n    console.log(message);\n    return message;\n}\n\n// L\'animation de frappe commencera automatiquement\nhelloWorld();'
        },
        {
            filename: 'app.js',
            code: '// Configuration de l\'application\nconst express = require(\'express\');\nconst app = express();\n\napp.get(\'/\', (req, res) => {\n    res.send(\'Bienvenue sur mon portfolio !\');\n});\n\nconst PORT = 3000;\napp.listen(PORT, () => {\n    console.log(`Serveur démarré sur le port ${PORT}`);\n});'
        },
        {
            filename: 'index.html',
            code: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mon Portfolio</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n    <h1>Bienvenue sur mon portfolio</h1>\n    <p>Découvrez mes projets et compétences en développement web.</p>\n</body>\n</html>'
        },
        {
            filename: 'styles.css',
            code: '/* Styles principaux */\nbody {\n    font-family: \'Arial\', sans-serif;\n    margin: 0;\n    padding: 0;\n    background-color: #1a1a1a;\n    color: #ffffff;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 20px;\n}'
        }
    ];
    
    let currentSnippetIndex = 0;
    let typingInterval;
    let isTyping = false;
    let currentCode = '';
    let cursor;
    
    function initCursor() {
        // Supprimer l'ancien curseur s'il existe
        const oldCursor = codeElement.querySelector('.typing-cursor');
        if (oldCursor) {
            oldCursor.remove();
        }
        
        // Créer un nouveau curseur
        cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        codeElement.appendChild(cursor);
    }
    
    function typeWriter() {
        const snippet = codeSnippets[currentSnippetIndex];
        filenameElement.textContent = snippet.filename;
        currentCode = '';
        codeElement.textContent = '';
        
        initCursor();
        
        let i = 0;
        isTyping = true;
        
        function type() {
            if (i < snippet.code.length) {
                currentCode += snippet.code.charAt(i);
                codeElement.textContent = currentCode;
                Prism.highlightElement(codeElement);
                codeElement.appendChild(cursor);
                i++;
                typingInterval = setTimeout(type, 20);
                codeElement.scrollTop = codeElement.scrollHeight;
            } else {
                isTyping = false;
                cursor.style.display = 'none';
                
                // Après 10 secondes, passer au snippet suivant
                setTimeout(backspaceCode, 10000);
            }
        }
        
        type();
    }
    
    function backspaceCode() {
        isTyping = true;
        cursor.style.display = 'inline';
        
        function backspace() {
            if (currentCode.length > 0) {
                currentCode = currentCode.substring(0, currentCode.length - 1);
                codeElement.textContent = currentCode;
                Prism.highlightElement(codeElement);
                codeElement.appendChild(cursor);
                typingInterval = setTimeout(backspace, 10);
            } else {
                isTyping = false;
                // Passer au snippet suivant
                currentSnippetIndex = (currentSnippetIndex + 1) % codeSnippets.length;
                setTimeout(typeWriter, 500);
            }
        }
        
        backspace();
    }
    
    // Démarrer l'animation quand l'utilisateur est proche de l'élément
    function startAnimationIfNeeded() {
        const rect = codeContainer.getBoundingClientRect();
        const isInView = (
            rect.top >= -200 &&
            rect.bottom <= (window.innerHeight + 200)
        );

        if (isInView && !isTyping) {
            typeWriter();
            window.removeEventListener('scroll', startAnimationIfNeeded);
        }
    }

    // Vérifier si l'élément est déjà visible au chargement
    startAnimationIfNeeded();
    
    // Ajouter l'écouteur de défilement uniquement si l'animation n'a pas encore commencé
    if (!isTyping) {
        window.addEventListener('scroll', startAnimationIfNeeded, { passive: true });
    }
    
    // Animation du curseur
    setInterval(() => {
        if (isTyping && cursor) {
            cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }
    }, 500);
    
    // Nettoyer les intervalles si la page est quittée
    window.addEventListener('beforeunload', () => {
        clearTimeout(typingInterval);
    });
});
