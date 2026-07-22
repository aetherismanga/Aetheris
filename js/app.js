document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GESTION DU LOADER (Écran de chargement)
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.remove('active');
    }, 800); // Faux délai pour l'effet d'application qui s'ouvre

    // 2. NAVIGATION SPA (Single Page Application)
    const navLinks = document.querySelectorAll('[data-target]');
    const views = document.querySelectorAll('.view');

    function navigateTo(targetId) {
        // Cache toutes les vues
        views.forEach(view => view.classList.remove('active'));
        // Désactive tous les liens
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        
        // Affiche la bonne vue
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo(0, 0); // Remonte en haut
        }

        // Active le lien correspondant dans le menu
        const activeLink = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // 3. EFFET PARALLAX SUR L'ACCUEIL (Style Jeu Vidéo)
    const heroBg = document.querySelector('.hero-bg');
    const homeSection = document.getElementById('home');

    if (heroBg && homeSection) {
        homeSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroBg.style.transform = `translate(${xAxis}px, ${yAxis}px) scale(1.1)`;
        });
        // Reset quand la souris quitte
        homeSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = `translate(0px, 0px) scale(1.1)`;
        });
    }

    // 4. INITIALISATION DE LA PWA (Service Worker)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('AETHERIS: ServiceWorker enregistré avec succès.', registration.scope);
                })
                .catch(err => {
                    console.log('AETHERIS: Échec de l\'enregistrement du ServiceWorker.', err);
                });
        });
    }
});
