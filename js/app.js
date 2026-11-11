document.addEventListener("DOMContentLoaded", () => {
    // --- GESTION DU LOADER ---
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.remove("active");
        }, 500);
    }

    // --- GÉNÉRATION DES PARTICULES MAGIQUES (ACCUEIL) ---
    const particlesContainer = document.getElementById("particles");
    if (particlesContainer) {
        for (let i = 0; i < 35; i++) {
            const p = document.createElement("div");
            p.classList.add("particle");
            const size = Math.random() * 3 + 1;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            const duration = Math.random() * 6 + 4;
            const delay = Math.random() * 5;
            p.style.animationDuration = `${duration}s`;
            p.style.animationDelay = `${delay}s`;
            particlesContainer.appendChild(p);
        }
    }

    // --- NAVIGATION SPA & MOBILE BURGER ---
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
        audio.volume = 0.5;
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

    // --- LECTEUR MANGA : MODE PAGE PAR PAGE & WEBTOON + REPRISE AUTO ---
    const readerView = document.getElementById("reader");
    const mangaContainer = document.getElementById("manga-container");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const fullscreenPrevBtn = document.getElementById("fullscreen-prev-page");
    const fullscreenNextBtn = document.getElementById("fullscreen-next-page");
    const fullscreenPosition = document.getElementById("fullscreen-page-position");
    const pageSelector = document.getElementById("page-selector");
    const totalPagesLabel = document.getElementById("total-pages");
    const modeToggleBtn = document.getElementById("mode-toggle-btn");
    const configuredPages = Number(readerView?.dataset.totalPages);
    const totalPages = Number.isInteger(configuredPages) && configuredPages > 0 ? configuredPages : 156;
    let isWebtoonMode = false;
    let pageObserver;

    function validPage(value) {
        if (!/^\d+$/.test(String(value ?? ""))) return null;
        const page = Number(value);
        return Number.isInteger(page) && page >= 1 && page <= totalPages ? page : null;
    }

    const requestedPage = validPage(new URLSearchParams(window.location.search).get("page"));

    function getSavedPage() {
        try {
            return validPage(localStorage.getItem("aetheris_ch1_page")) || 1;
        } catch {
            return 1;
        }
    }

    function saveCurrentPage(page) {
        try {
            localStorage.setItem("aetheris_ch1_page", String(page));
        } catch {
            // La lecture reste disponible quand le stockage du navigateur est bloqué.
        }
        if (readerView?.classList.contains("active")) {
            const url = new URL(window.location.href);
            url.searchParams.set("page", String(page));
            window.history.replaceState(null, "", url);
        }
    }

    let currentPage = requestedPage || getSavedPage();

    if (totalPagesLabel) totalPagesLabel.textContent = `/ ${totalPages}`;
    if (pageSelector) {
        pageSelector.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = i;
            pageSelector.appendChild(opt);
        }
        pageSelector.addEventListener("change", (e) => {
            if (!isWebtoonMode) goToPage(validPage(e.target.value) || currentPage);
        });
    }

    function getFilenameForPage(page) {
        const revision = page === 126 ? "?v=45" : page === 107 || page === 115 ? "?v=43" : "";
        return `chapters/chapitre-01/${String(page).padStart(2, "0")}.jpg${revision}`;
    }

    function updatePageControls() {
        if (pageSelector) pageSelector.value = String(currentPage);
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
        if (fullscreenPrevBtn) fullscreenPrevBtn.disabled = currentPage === 1;
        if (fullscreenNextBtn) fullscreenNextBtn.disabled = currentPage === totalPages;
        if (fullscreenPosition) fullscreenPosition.textContent = `${currentPage} / ${totalPages}`;
    }

    function makePageImage(page, eager = false) {
        const img = document.createElement("img");
        img.src = getFilenameForPage(page);
        img.alt = `Chapitre 1 — Page ${page}`;
        img.dataset.page = String(page);
        img.loading = eager ? "eager" : "lazy";
        img.decoding = "async";
        if (eager) img.fetchPriority = "high";
        return img;
    }

    function appendChapterEnd() {
        const end = document.createElement("div");
        end.className = "chapter-end";
        const message = document.createElement("p");
        message.textContent = "Fin du chapitre 1 — Merci d’avoir lu Le Commencement.";
        const restart = document.createElement("button");
        restart.className = "btn-icon";
        restart.textContent = "Relire le chapitre";
        restart.addEventListener("click", () => {
            isWebtoonMode = false;
            currentPage = 1;
            updateReaderMode();
            window.scrollTo(0, 0);
        });
        end.append(message, restart);
        mangaContainer.appendChild(end);
    }

    function renderPage(page) {
        if (!mangaContainer) return;
        pageObserver?.disconnect();
        mangaContainer.innerHTML = "";
        currentPage = page;
        saveCurrentPage(page);
        const img = makePageImage(page, true);
        img.style.cursor = page < totalPages ? "pointer" : "default";
        img.addEventListener("click", (event) => {
            if (isWebtoonMode) return;
            const bounds = img.getBoundingClientRect();
            const tapOnLeft = document.body.classList.contains("fullscreen-mode") &&
                event.clientX - bounds.left < bounds.width / 3;
            if (tapOnLeft) {
                if (currentPage > 1) goToPage(currentPage - 1);
            } else if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
        mangaContainer.appendChild(img);
        if (page === totalPages) appendChapterEnd();
        updatePageControls();
    }

    function goToPage(page) {
        currentPage = page;
        renderPage(page);
        window.scrollTo(0, 0);
    }

    function updateReaderMode() {
        if (!mangaContainer) return;
        pageObserver?.disconnect();
        mangaContainer.innerHTML = "";
        [prevPageBtn, nextPageBtn, pageSelector, totalPagesLabel].forEach(control => {
            if (control) control.style.display = isWebtoonMode ? "none" : "inline-block";
        });
        if (modeToggleBtn) modeToggleBtn.textContent = isWebtoonMode ? "📜 Webtoon" : "📄 Page";
        if (!isWebtoonMode) {
            renderPage(currentPage);
            return;
        }

        // Ne pas démarrer le suivi avant d’avoir rejoint la page déjà en cours de lecture.
        const resumePage = currentPage;
        for (let i = 1; i <= totalPages; i++) {
            const img = makePageImage(i, i === resumePage);
            img.width = 1080;
            img.height = 1620;
            img.style.scrollMarginTop = "130px";
            mangaContainer.appendChild(img);
        }
        appendChapterEnd();
        requestAnimationFrame(() => {
            mangaContainer.querySelector(`[data-page="${resumePage}"]`)?.scrollIntoView({ block: "start" });
            if (!("IntersectionObserver" in window)) return;
            pageObserver = new IntersectionObserver(entries => {
                const visible = entries.filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) {
                    currentPage = Number(visible.target.dataset.page);
                    saveCurrentPage(currentPage);
                    updatePageControls();
                }
            }, { rootMargin: "-120px 0px -35% 0px", threshold: [0, 0.1, 0.3, 0.6] });
            mangaContainer.querySelectorAll("img[data-page]").forEach(img => pageObserver.observe(img));
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!readerView?.classList.contains("active") || isWebtoonMode) return;
        if (e.target.matches("input, select, textarea, [contenteditable]")) return;
        if (e.key === "ArrowLeft" && currentPage > 1) {
            e.preventDefault();
            goToPage(currentPage - 1);
        } else if (e.key === "ArrowRight" && currentPage < totalPages) {
            e.preventDefault();
            goToPage(currentPage + 1);
        }
    });

    document.querySelectorAll('[data-target="reader"]').forEach(element => {
        element.addEventListener("click", () => {
            currentPage = getSavedPage();
            updateReaderMode();
            if (audio && audio.paused) {
                audio.play().catch(error => console.log("Lecture audio bloquée par le navigateur : ", error));
            }
        });
    });

    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const floatingExitBtn = document.getElementById("floating-exit-fullscreen");

    function toggleFullscreen() {
        document.body.classList.toggle("fullscreen-mode");
        
        if (document.body.classList.contains("fullscreen-mode")) {
            // Une page à la fois en immersion, avec des commandes toujours accessibles.
            if (isWebtoonMode) {
                isWebtoonMode = false;
                updateReaderMode();
            }
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

    if (modeToggleBtn) {
        modeToggleBtn.addEventListener("click", () => {
            isWebtoonMode = !isWebtoonMode;
            updateReaderMode();
            if (!isWebtoonMode) window.scrollTo(0, 0);
        });
    }

    [prevPageBtn, fullscreenPrevBtn].forEach(button => {
        button?.addEventListener("click", () => {
            if (!isWebtoonMode && currentPage > 1) goToPage(currentPage - 1);
        });
    });
    [nextPageBtn, fullscreenNextBtn].forEach(button => {
        button?.addEventListener("click", () => {
            if (!isWebtoonMode && currentPage < totalPages) goToPage(currentPage + 1);
        });
    });

    // Un lien ?page=101 ouvre directement la suite ; l’accueil ne charge pas le manga caché.
    if (requestedPage && mangaContainer) {
        switchView("reader");
        updateReaderMode();
    } else if (new URLSearchParams(window.location.search).get("personnage") === "graam") {
        switchView("characters");
        const characterView = document.getElementById("characters");
        const graam = document.getElementById("graam");
        const portraits = Array.from(characterView.querySelectorAll("img"));
        Promise.all(portraits.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
            .then(() => {
                if (characterView.classList.contains("active")) graam?.scrollIntoView({ block: "start" });
            });
    }
});
