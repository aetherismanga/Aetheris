document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('active');
    }

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

    // --- SYSTÈME DE LECTURE PAGE PAR PAGE (60 pages) ---
    const totalPages = 63;
    let currentPage = 0; 
    const chapterPath = 'chapters/chapitre-01/'; // Chemin exact sur GitHub

    const container = document.getElementById('manga-container');
    const indicator = document.getElementById('page-indicator');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const title = document.getElementById('current-chapter-title');

    if (title) title.textContent = "Chapitre 1 : L'Aventure";

    function renderPage() {
        if (container) {
            container.innerHTML = '';
            const img = document.createElement('img');
            // Formate automatiquement avec un zéro devant (01.jpg, 02.jpg...)
            const pageNum = String(currentPage + 1).padStart(2, '0');
            img.src = `${chapterPath}${pageNum}.jpg`;
            img.alt = `Page ${currentPage + 1}`;
            container.appendChild(img);
        }
        if (indicator) {
            indicator.textContent = `${currentPage + 1} / ${totalPages}`;
        }
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderPage();
                window.scrollTo(0, 0);
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage();
                window.scrollTo(0, 0);
            }
        });
    }

    // Affiche la première page au chargement
    renderPage();
});
