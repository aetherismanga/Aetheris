document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GESTION DU LOADER
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.remove('active');
    }, 800);

    // 2. NAVIGATION SPA
    const navLinks = document.querySelectorAll('[data-target]');
    const views = document.querySelectorAll('.view');

    function navigateTo(targetId) {
        views.forEach(view => view.classList.remove('active'));
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo(0, 0);
        }

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

    // 3. EFFET PARALLAX
    const heroBg = document.querySelector('.hero-bg');
    const homeSection = document.getElementById('home');

    if (heroBg && homeSection) {
        homeSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroBg.style.transform = `translate(${xAxis}px, ${yAxis}px) scale(1.1)`;
        });
        homeSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = `translate(0px, 0px) scale(1.1)`;
        });
    }

    // 4. LECTEUR DE MANGA (NOUVEAU)
    const mangaContainer = document.getElementById('manga-container');
    const chapterTitle = document.getElementById('current-chapter-title');
    let mangaData = null;

    // Charger la base de données
    fetch('assets/data/database.json')
        .then(response => response.json())
        .then(data => {
            mangaData = data;
            // Charge automatiquement le premier chapitre
            if (mangaData.chapters.length > 0) {
                loadChapter(0);
            }
        })
        .catch(error => console.error("Erreur de lecture de la base de données :", error));

    // Fonction pour créer les images du chapitre
    function loadChapter(chapterIndex) {
        if (!mangaData || !mangaData.chapters[chapterIndex]) return;
        
        const chapter = mangaData.chapters[chapterIndex];
        chapterTitle.textContent = chapter.title;
        mangaContainer.innerHTML = ''; // On vide le lecteur
        
        // On génère les images une par une
        for (let i = 1; i <= chapter.pages; i++) {
            // Transforme le numéro "1" en "01"
            const pageNumber = i < 10 ? '0' + i : i;
            
            const img = document.createElement('img');
            img.src = `${chapter.path}${pageNumber}.jpg`;
            img.className = 'manga-page';
            img.loading = 'lazy'; // Fait charger les images plus vite
            
            mangaContainer.appendChild(img);
        }
    }

    // 5. SERVICE WORKER (PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js');
        });
    }
});
