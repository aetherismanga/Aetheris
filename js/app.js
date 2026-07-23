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
                muteBtn.textContent = "🔊";
            } else {
                audio.muted = true;
                muteBtn.textContent = "🔇";
            }
        });
    }

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

    // --- MODE PLEIN ÉCRAN IMMERSIF ---
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const floatingExitBtn = document.getElementById("floating-exit-fullscreen");

    function toggleFullscreen() {
        document.body.classList.toggle("fullscreen-mode");
        
        if (document.body.classList.contains("fullscreen-mode")) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            }
            if (fullscreenBtn) fullscreenBtn.textContent = "🗗";
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.log(err));
            }
            if (fullscreenBtn) fullscreenBtn.textContent = "⛶";
        }
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", toggleFullscreen);
    }
    if (floatingExitBtn) {
        floatingExitBtn.addEventListener("click", toggleFullscreen);
    }

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            document.body.classList.remove("fullscreen-mode");
            if (fullscreenBtn) fullscreenBtn.textContent = "⛶";
        }
    });

    // --- LECTEUR MANGA : MODE PAGE PAR PAGE & MODE WEBTOON ---
    const mangaContainer = document.getElementById("manga-container");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageIndicator = document.getElementById("page-indicator");
    const modeToggleBtn = document.getElementById("mode-toggle-btn");

    let currentPage = 1;
    const totalPages = 63;
    let isWebtoonMode = false;

    function renderPage(page) {
        if (!mangaContainer) return;
        mangaContainer.innerHTML = "";
        
        const pageNum = String(page).padStart(2, '0');
        const img = document.createElement("img");
        img.src = `chapters/chapitre-01/${pageNum}.jpg`;
        img.alt = `Page ${page}`;
        img.style.cursor = "pointer";
        
        img.addEventListener("click", () => {
            if (!isWebtoonMode) {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                } else {
                    currentPage = 1;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                }
            }
        });

        mangaContainer.appendChild(img);

        if (pageIndicator) {
            pageIndicator.textContent = `${currentPage} / ${totalPages}`;
        }
    }

    function updateReaderMode() {
        if (!mangaContainer) return;
        mangaContainer.innerHTML = "";

        if (isWebtoonMode) {
            if (prevPageBtn) prevPageBtn.style.display = "none";
            if (nextPageBtn) nextPageBtn.style.display = "none";
            if (pageIndicator) pageIndicator.style.display = "none";
            if (modeToggleBtn) modeToggleBtn.textContent = "📜 Webtoon";

            for (let i = 1; i <= totalPages; i++) {
                const pageNum = String(i).padStart(2, '0');
                const img = document.createElement("img");
                img.src = `chapters/chapitre-01/${pageNum}.jpg`;
                img.alt = `Page ${i}`;
                img.loading = "lazy";
                mangaContainer.appendChild(img);
            }
        } else {
            if (prevPageBtn) prevPageBtn.style.display = "inline-block";
            if (nextPageBtn) prevPageBtn.style.display = "inline-block";
            if (pageIndicator) pageIndicator.style.display = "inline-block";
            if (modeToggleBtn) modeToggleBtn.textContent = "📄 Page";

            renderPage(currentPage);
        }
    }

    if (modeToggleBtn) {
        modeToggleBtn.addEventListener("click", () => {
            isWebtoonMode = !isWebtoonMode;
            updateReaderMode();
            window.scrollTo(0, 0);
        });
    }

    if (mangaContainer) {
        updateReaderMode();

        if (prevPageBtn) {
            prevPageBtn.addEventListener("click", () => {
                if (!isWebtoonMode && currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener("click", () => {
                if (!isWebtoonMode && currentPage < totalPages) {
                    currentPage++;
                    renderPage(currentPage);
                    window.scrollTo(0, 0);
                }
            });
        }
    }
});
