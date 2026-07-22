document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

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

    fetch('assets/database.json')
        .then(res => res.json())
        .then(data => {
            const chapter = data.chapters[0];
            const container = document.getElementById('manga-container');
            const title = document.getElementById('current-chapter-title');
            
            if (title) title.textContent = chapter.title;
            if (container) {
                container.innerHTML = '';
                chapter.pages.forEach(page => {
                    const img = document.createElement('img');
                    img.src = `${chapter.path}${page}`;
                    container.appendChild(img);
                });
            }
        })
        .catch(err => console.error("Erreur de chargement :", err));
});
