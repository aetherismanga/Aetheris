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
        
        // Mettre à jour les liens actifs dans la nav
        document.querySelectorAll(".nav-links a").forEach(link => {
            if (link.getAttribute("data-target") === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Fermer le menu mobile si ouvert
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

    // --- CHARGEMENT DU CHAPITRE DE MANGA ---
    const mangaContainer = document.getElementById("manga-container");
    if (mangaContainer) {
        mangaContainer.innerHTML = "";
        // Génération automatique des 63 pages du chapitre 1
        for (let i = 1; i <= 63; i++) {
            const pageNum = String(i).padStart(2, '0');
            const img = document.createElement("img");
            img.src = `chapitres/chapitre-01/page_${pageNum}.jpg`;
            img.alt = `Page ${i}`;
            img.loading = "lazy";
            mangaContainer.appendChild(img);
        }
    }
});
