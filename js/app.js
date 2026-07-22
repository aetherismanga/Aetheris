document.addEventListener('DOMContentLoaded', () => {
    // Menu Burger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navigation entre les pages (Accueil, Manga, Personnages...)
    const triggers = document.querySelectorAll('[data-target]');
    const views = document.querySelectorAll('.view');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetId) {
                    view.classList.add('active');
                }
            });

            if (navLinks) {
                navLinks.classList.remove('active');
            }

            window.scrollTo(0, 0);
        });
    });

    // Chargement sécurisé du manga
    fetch('assets/database.json')
        .then(res => res.json())
        .then(data => {
            if (data && data.chapters && data.chapters.length > 0) {
                const chapter = data.chapters[0];
                const container = document.getElementById('manga-container');
                const title = document.getElementById('current-chapter-title');
                
                if (title) title.textContent = chapter.title;
                if (container && chapter.pages) {
                    container.innerHTML = '';
                    chapter.pages.forEach(page => {
                        const img = document.createElement('img');
                        img.src = `${chapter.path}${page}`;
                        container.appendChild(img);
                    });
                }
            }
        })
        .catch(err => console.error("Erreur de chargement :", err));
});
