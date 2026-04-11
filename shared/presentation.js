(() => {
    "use strict";

    const slides = [
        {
            id: "capa",
            index: 1,
            title: "Capa",
            label: "Apresentacao",
            path: "01_capa_v3/code.html",
            icon: "slideshow",
            description: "Abertura editorial e mensagem central do produto."
        },
        {
            id: "contexto",
            index: 2,
            title: "Contexto",
            label: "Dados AI",
            path: "02_contexto_v3/code.html",
            icon: "insights",
            description: "Diagnostico do problema e dos silos de informacao."
        },
        {
            id: "pipeline",
            index: 3,
            title: "Pipeline",
            label: "Arquitetura",
            path: "03_pipeline_v3/code.html",
            icon: "lan",
            description: "Fluxo de captura, indexacao local e RAG com citacao."
        },
        {
            id: "diferenciais",
            index: 4,
            title: "Diferenciais",
            label: "Proof",
            path: "04_diferenciais_v3/code.html",
            icon: "auto_awesome",
            description: "Pontos de confianca, custo e benchmark do sistema."
        },
        {
            id: "conclusao",
            index: 5,
            title: "Conclusao",
            label: "Metadados",
            path: "05_conclus_o_v3/code.html",
            icon: "flag",
            description: "Fechamento da narrativa e publicos atendidos."
        }
    ];

    const homePage = {
        id: "home",
        index: 0,
        title: "Hub",
        label: "Inicio",
        path: "index.html",
        icon: "home",
        description: "Resumo visual, atalhos e a forma mais rapida de entrar na apresentacao."
    };

    const pageId = document.body.dataset.stitchPage || inferPageId();
    if (!pageId) {
        return;
    }

    const pages = [homePage, ...slides].map((page) => ({
        ...page,
        href: withBase(page.path)
    }));

    const home = pages[0];
    const routedSlides = pages.slice(1);
    const current = pages.find((page) => page.id === pageId) || home;
    const currentSlideIndex = routedSlides.findIndex((slide) => slide.id === current.id);

    const originalSidebar = document.querySelector("aside");
    if (originalSidebar) {
        originalSidebar.setAttribute("data-stitch-original-sidebar", "");
        originalSidebar.setAttribute("aria-hidden", "true");
    }

    const originalTopbar = document.querySelector("body > nav, body > header");
    if (originalTopbar) {
        originalTopbar.setAttribute("data-stitch-original-topbar", "");
    }

    document.body.classList.add("stitch-app-ready");
    if (current.id === "home") {
        document.body.classList.add("stitch-home");
    }
    if (current.id !== "home") {
        document.body.classList.add("stitch-standard-topbar");
    }
    if (window.innerHeight <= 700) {
        document.body.classList.add("stitch-compact-height");
    }

    const help = injectHelp(pages, current);

    const openHelp = () => {
        help.hidden = false;
        document.body.classList.add("stitch-help-open");
    };

    const closeHelp = () => {
        help.hidden = true;
        document.body.classList.remove("stitch-help-open");
    };

    help.addEventListener("click", (event) => {
        if (event.target === help || event.target.closest("[data-stitch-close-help]")) {
            closeHelp();
        }
    });

    injectSidebar(pages, current, openHelp);
    if (current.id !== "home") {
        injectTopbar(routedSlides, current, home, openHelp);
    }

    if (current.id !== "home") {
        injectPager(routedSlides, currentSlideIndex, home);
    }

    replaceBrokenBrandIcon();
    enhanceLinks(home, routedSlides, currentSlideIndex, openHelp);
    wireUtilityIcons(openHelp);
    bindHotkeys(routedSlides, currentSlideIndex, home, openHelp, closeHelp);

    function withBase(path) {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const prefix = segments.length > 1 ? "../" : "./";
        return prefix + path;
    }

    function inferPageId() {
        const path = window.location.pathname;
        if (path.includes("/01_capa_v3/")) {
            return "capa";
        }
        if (path.includes("/02_contexto_v3/")) {
            return "contexto";
        }
        if (path.includes("/03_pipeline_v3/")) {
            return "pipeline";
        }
        if (path.includes("/04_diferenciais_v3/")) {
            return "diferenciais";
        }
        if (path.includes("/05_conclus_o_v3/")) {
            return "conclusao";
        }
        if (path.endsWith("/") || path.endsWith("/index.html")) {
            return "home";
        }
        return "";
    }

    function injectSidebar(allPages, activePage, onHelp) {
        const sidebar = document.createElement("aside");
        sidebar.className = "stitch-shell";
        sidebar.setAttribute("aria-label", "Navegacao principal da apresentacao");
        const toggleSidebarState = (isOpen) => {
            document.body.classList.toggle("stitch-shell-open", isOpen);
        };
        const syncSidebarState = () => {
            const isOpen = sidebar.matches(":hover") || sidebar.matches(":focus-within");
            toggleSidebarState(isOpen);
        };
        const syncTopbarOffset = () => {
            const topbar = document.querySelector(".stitch-topbar");
            const originalTopbar = document.querySelector("[data-stitch-original-topbar]");
            if (!topbar && !originalTopbar) {
                return;
            }
            const isCompact = window.matchMedia("(max-width: 720px)").matches;
            if (isCompact) {
                if (topbar) {
                    topbar.style.removeProperty("left");
                }
                if (originalTopbar) {
                    originalTopbar.style.removeProperty("left");
                }
                return;
            }
            const rootStyles = getComputedStyle(document.documentElement);
            const gutterValue = parseFloat(rootStyles.getPropertyValue("--stitch-shell-gutter")) || 28;
            const sidebarWidth = Math.round(sidebar.getBoundingClientRect().width);
            const leftValue = `${sidebarWidth + gutterValue}px`;
            if (topbar) {
                topbar.style.left = leftValue;
            }
            if (originalTopbar) {
                originalTopbar.style.left = leftValue;
            }
        };

        const routes = allPages.map((page) => {
            const indexText = page.index === 0 ? "00" : String(page.index).padStart(2, "0");
            const activeClass = page.id === activePage.id ? " is-active" : "";

            return `
                <a class="stitch-shell__link${activeClass}" href="${page.href}" data-stitch-route="${page.id}">
                    <span class="material-symbols-outlined stitch-shell__icon">${page.icon}</span>
                    <span class="stitch-shell__index">${indexText}</span>
                    <span class="stitch-shell__text">
                        <span class="stitch-shell__title">${page.title}</span>
                        <span class="stitch-shell__meta">${page.label}</span>
                    </span>
                </a>
            `;
        }).join("");

        const summaryEyebrow = activePage.index === 0
            ? "App estatico"
            : `Slide ${String(activePage.index).padStart(2, "0")} de 05`;
        const summaryTitle = activePage.index === 0 ? "Tudo pronto para navegar" : activePage.title;

        sidebar.innerHTML = `
            <a class="stitch-shell__brand" href="${home.href}">
                <span class="stitch-shell__brand-mark stitch-brand-sigil" aria-hidden="true"><span class="stitch-brand-sigil__dot"></span></span>
                <span class="stitch-shell__brand-copy">
                    <span class="stitch-shell__eyebrow">Stitch Project</span>
                    <span class="stitch-shell__brand-name">Presentation Hub</span>
                </span>
            </a>
            <nav class="stitch-shell__nav">
                ${routes}
            </nav>
            <div class="stitch-shell__summary-card">
                <span class="stitch-shell__summary-eyebrow">${summaryEyebrow}</span>
                <span class="stitch-shell__summary">${summaryTitle}</span>
                <span class="stitch-shell__summary-copy">${activePage.description}</span>
                <button class="stitch-shell__shortcut" type="button" data-stitch-open-help>
                    <span class="stitch-kbd">?</span>
                    Abrir atalhos e mapa
                </button>
            </div>
        `;

        const helpButton = sidebar.querySelector("[data-stitch-open-help]");
        helpButton.addEventListener("click", onHelp);
        sidebar.addEventListener("mouseenter", syncSidebarState);
        sidebar.addEventListener("mouseleave", syncSidebarState);
        sidebar.addEventListener("focusin", syncSidebarState);
        sidebar.addEventListener("focusout", () => {
            window.setTimeout(syncSidebarState, 0);
        });
        sidebar.addEventListener("mouseenter", syncTopbarOffset);
        sidebar.addEventListener("mouseleave", syncTopbarOffset);
        sidebar.addEventListener("focusin", syncTopbarOffset);
        sidebar.addEventListener("focusout", () => {
            window.setTimeout(syncTopbarOffset, 0);
        });
        if ("ResizeObserver" in window) {
            const resizeObserver = new ResizeObserver(() => syncTopbarOffset());
            resizeObserver.observe(sidebar);
        }
        window.addEventListener("resize", syncTopbarOffset);
        window.__stitchSyncTopbarOffset = syncTopbarOffset;

        document.body.appendChild(sidebar);
        window.setTimeout(syncTopbarOffset, 0);
    }

    function injectTopbar(allSlides, activePage, hub, onHelp) {
        const header = document.createElement("header");
        header.className = "stitch-topbar";
        header.setAttribute("aria-label", "Navbar principal dos slides");

        const routeLinks = allSlides.map((slide) => {
            const activeClass = slide.id === activePage.id ? " is-active" : "";
            return `<a class="stitch-topbar__link${activeClass}" href="${slide.href}">${slide.title}</a>`;
        }).join("");

        header.innerHTML = `
            <a class="stitch-topbar__brand" href="${hub.href}">
                <span class="stitch-topbar__sigil stitch-brand-sigil" aria-hidden="true"><span class="stitch-brand-sigil__dot"></span></span>
                <span class="stitch-topbar__brand-copy">
                    <span class="stitch-topbar__label">Free Plaud</span>
                    <span class="stitch-topbar__sub">Editorial Intelligence</span>
                </span>
            </a>
            <nav class="stitch-topbar__nav">
                ${routeLinks}
            </nav>
            <div class="stitch-topbar__actions">
                <a class="stitch-topbar__hub" href="${hub.href}">Hub</a>
                <span class="stitch-topbar__badge">Slide ${String(activePage.index).padStart(2, "0")}</span>
                <button class="stitch-topbar__icon material-symbols-outlined" type="button" data-stitch-topbar-help>help</button>
                <button class="stitch-topbar__icon material-symbols-outlined" type="button" data-stitch-topbar-fullscreen>fullscreen</button>
            </div>
        `;

        header.querySelector("[data-stitch-topbar-help]").addEventListener("click", onHelp);
        header.querySelector("[data-stitch-topbar-fullscreen]").addEventListener("click", toggleFullscreen);
        document.body.appendChild(header);
        if (typeof window.__stitchSyncTopbarOffset === "function") {
            window.__stitchSyncTopbarOffset();
        }
    }

    function replaceBrokenBrandIcon() {
        const broken = document.querySelector('[data-icon="circuit"]');
        if (!broken) {
            return;
        }

        const sigil = document.createElement("span");
        sigil.className = "stitch-brand-sigil";
        sigil.setAttribute("aria-hidden", "true");
        sigil.innerHTML = '<span class="stitch-brand-sigil__dot"></span>';
        broken.replaceWith(sigil);
    }

    function injectPager(allSlides, activeIndex, hub) {
        const previous = allSlides[activeIndex - 1] || hub;
        const next = allSlides[activeIndex + 1] || hub;
        const pager = document.createElement("nav");
        pager.className = "stitch-pager";
        pager.setAttribute("aria-label", "Navegacao rapida entre telas");
        pager.innerHTML = `
            <a class="stitch-pager__button" href="${previous.href}">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>${previous.index ? previous.title : "Hub"}</span>
            </a>
            <a class="stitch-pager__button" href="${next.href}">
                <span>${next.index ? next.title : "Hub"}</span>
                <span class="material-symbols-outlined">arrow_forward</span>
            </a>
        `;
        document.body.appendChild(pager);
    }

    function injectHelp(allPages, activePage) {
        const overlay = document.createElement("div");
        overlay.className = "stitch-help";
        overlay.hidden = true;
        const routes = allPages.map((page) => {
            const routeClass = page.id === activePage.id ? "stitch-help__route is-active" : "stitch-help__route";
            const indexText = page.index === 0 ? "00" : String(page.index).padStart(2, "0");
            return `
                <a class="${routeClass}" href="${page.href}">
                    <div class="stitch-help__route-line">
                        <span class="material-symbols-outlined">${page.icon}</span>
                        <span class="stitch-help__route-index">${indexText}</span>
                        <span class="stitch-help__route-title">${page.title}</span>
                    </div>
                    <p class="stitch-help__route-copy">${page.description}</p>
                </a>
            `;
        }).join("");

        overlay.innerHTML = `
            <div class="stitch-help__panel" role="dialog" aria-modal="true" aria-labelledby="stitch-help-title">
                <div class="stitch-help__header">
                    <div>
                        <div class="stitch-help__eyebrow">Mapa da experiencia</div>
                        <h2 class="stitch-help__title" id="stitch-help-title">Navegue como app, nao como pasta solta.</h2>
                        <p class="stitch-help__copy">
                            O menu lateral leva para qualquer tela. O controle flutuante anda para frente e para tras.
                            Os icones de fullscreen e settings agora funcionam.
                        </p>
                    </div>
                    <button class="stitch-help__close" type="button" data-stitch-close-help>
                        <span class="material-symbols-outlined">close</span>
                        Fechar
                    </button>
                </div>
                <div class="stitch-help__grid">
                    ${routes}
                </div>
                <div class="stitch-help__keys">
                    <span class="stitch-help__chip"><span class="stitch-kbd">1-5</span> Ir direto para uma tela</span>
                    <span class="stitch-help__chip"><span class="stitch-kbd">H</span> Voltar para o hub</span>
                    <span class="stitch-help__chip"><span class="stitch-kbd">?</span> Abrir esta ajuda</span>
                    <span class="stitch-help__chip"><span class="stitch-kbd">F</span> Alternar fullscreen</span>
                    <span class="stitch-help__chip"><span class="stitch-kbd">&#8592;</span><span class="stitch-kbd">&#8594;</span> Anterior e proxima</span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    function enhanceLinks(hub, allSlides, activeIndex, onHelp) {
        const targets = new Map([
            ["visao geral", allSlides[0].href],
            ["tecnologia", allSlides[2].href],
            ["filosofia", allSlides[3].href],
            ["encerramento", allSlides[4].href],
            ["documentacao", hub.href],
            ["privacidade", allSlides[1].href]
        ]);

        document.querySelectorAll("a").forEach((anchor) => {
            const text = normalize(anchor.textContent);
            if (targets.has(text)) {
                anchor.href = targets.get(text);
            }
            if (text === "suporte") {
                anchor.href = "#";
                anchor.addEventListener("click", (event) => {
                    event.preventDefault();
                    onHelp();
                });
                anchor.title = "Abrir ajuda e atalhos";
            }
        });

        document.querySelectorAll("button").forEach((button) => {
            const text = normalize(button.textContent);
            if (text.startsWith("iniciar apresentacao")) {
                const target = allSlides[Math.min(activeIndex + 1, allSlides.length - 1)] || allSlides[0];
                button.addEventListener("click", () => {
                    window.location.href = target.href;
                });
                button.title = "Ir para a proxima tela";
            }
            if (text.startsWith("perguntas")) {
                button.addEventListener("click", onHelp);
                button.title = "Abrir ajuda e atalhos";
            }
        });
    }

    function wireUtilityIcons(onHelp) {
        const bound = new WeakSet();

        document.querySelectorAll(".material-symbols-outlined").forEach((icon) => {
            const iconName = (icon.dataset.icon || icon.textContent || "").trim();
            if (!iconName) {
                return;
            }

            if (iconName === "fullscreen") {
                bindUtilityTarget(icon, "Tela cheia (F)", toggleFullscreen, bound);
            }

            if (iconName === "settings") {
                bindUtilityTarget(icon, "Abrir ajuda (?)", onHelp, bound);
            }
        });
    }

    function bindUtilityTarget(icon, title, action, bound) {
        const target = icon.closest("button") || icon;
        if (bound.has(target)) {
            return;
        }
        bound.add(target);

        target.title = title;
        target.addEventListener("click", (event) => {
            event.preventDefault();
            action();
        });

        if (target.tagName !== "BUTTON") {
            target.setAttribute("role", "button");
            target.tabIndex = 0;
            target.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    action();
                }
            });
        }
    }

    function bindHotkeys(allSlides, activeIndex, hub, onHelp, onCloseHelp) {
        document.addEventListener("keydown", (event) => {
            if (isEditableTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            if (event.key === "Escape" && !help.hidden) {
                onCloseHelp();
                return;
            }

            if (!help.hidden) {
                return;
            }

            if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
                event.preventDefault();
                onHelp();
                return;
            }

            if (event.key === "h" || event.key === "H") {
                event.preventDefault();
                window.location.href = hub.href;
                return;
            }

            if (event.key === "f" || event.key === "F") {
                event.preventDefault();
                toggleFullscreen();
                return;
            }

            if (/^[1-5]$/.test(event.key)) {
                event.preventDefault();
                const target = allSlides[Number(event.key) - 1];
                if (target) {
                    window.location.href = target.href;
                }
                return;
            }

            if (activeIndex === -1) {
                return;
            }

            if (event.key === "ArrowRight" || event.key === "PageDown") {
                event.preventDefault();
                const next = allSlides[activeIndex + 1] || hub;
                window.location.href = next.href;
            }

            if (event.key === "ArrowLeft" || event.key === "PageUp") {
                event.preventDefault();
                const previous = allSlides[activeIndex - 1] || hub;
                window.location.href = previous.href;
            }
        });
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
            return;
        }
        document.documentElement.requestFullscreen().catch(() => {});
    }

    function normalize(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function isEditableTarget(target) {
        if (!target) {
            return false;
        }
        const tag = target.tagName;
        return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
    }
})();
