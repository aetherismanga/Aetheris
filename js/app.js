document.addEventListener("DOMContentLoaded", () => {
    // --- GESTION DU LOADER ---
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.remove("active");
        }, 500);
    }

    // --- NAVIGATION SPA & MOBILE ---
    const navLinks = document.querySelectorAll(".nav-links a, .nav-brand, [data-target]");
    const views = document.querySelectorAll(".view");
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    function switchView(targetId) {
        views.forEach(view => {
            if (view.id === targetId) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        });
        
        document.querySelectorAll(".nav-links a").forEach(link => {
            if (link.getAttribute("data-target") === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        if (navMenu) navMenu.classList.remove("active");
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        const target = link.getAttribute("data-target");
        if (target) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                switchView(target);
            });
        }
    });

    // --- GESTION AUDIO & BOUTON MUTE ---
    const audio = document.getElementById("bg-audio");
    const muteBtn = document.getElementById("mute-btn");
    
    if (audio) {
        audio.volume = 0.5; // Volume à 50%
    }

    if (muteBtn) {
        muteBtn.addEventListener("click", () => {
            if (audio.muted) {
                audio.muted = false;
                muteBtn.textContent = "🔊 Musique : ON";
            } else {
                audio.muted = true;
                muteBtn.textContent = "🔇 Musique : OFF";
            }
        });
    }

    // Lancer la musique lorsqu'on clique sur un bouton menant au lecteur
    const triggerElements = document.querySelectorAll('[data-target="reader"]');
    triggerElements.forEach(element => {
        element.addEventListener("click", () => {
            if (audio && audio.paused) {
                audio.play().catch(error => {
                    console.log("Lecture audio bloquée par le navigateur : ", error);
                });
            }
        });
    });

    // --- LECTEUR MANGA PAGE PAR PAGE (Avec Clic et Boutons Suivant/Précédent) ---
    const mangaContainer = document.getElementById("manga-container");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageIndicator = document.getElementById("page-indicator");

    let currentPage = 1;
    const totalPages = 63;

    function renderPage(page) {
        if (!mangaContainer) return;
        mangaContainer.innerHTML = "";
        
        const pageNum = String(page).padStart(2, '0');
        const img = document.createElement("img");
        img.src = `chapters/chapitre-01/${pageNum}.jpg`;
        img.alt = `Page ${page}`;
        img.style.cursor = "pointer";
        
        // Clic ou appui sur l'image pour passer à la page suivante
        img.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
                window.scrollTo(0, 0);
            } else {
                currentPage = 1; // Retour au début à la fin du chapitre
                renderPage(currentPage);
                window.scrollTo(0, 0);
            }
        });

        mangaContainer.appendChild(img);

        // Mettre à jour l'indicateur de page (ex: 1 / 63)
        if (pageIndicator) {
            pageIndicator.textContent = `${currentPage} / ${totalPages}`;
        }
    }

    if (mangaContainer) {
        renderPage(currentPage);

        if (prevPageBtn) {
            prevPageBtn.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                }
            });
        }
    }
});
