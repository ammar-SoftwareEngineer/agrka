// ============================================================
// Escape HTML special characters to prevent XSS
// ============================================================
const esc = (str) =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// ============================================================
// Validate and return a safe Font Awesome class string
// ============================================================
const safeIcon = (icon) => {
  const s = (icon || "fa-solid fa-leaf").trim();
  return /^fa[\w\-\s]+$/i.test(s) ? s : "fa-solid fa-leaf";
};

// ============================================================
// Get a section array from the current translations
// ============================================================
const getItems = (key) => {
  const t = window.currentTranslations;
  return t && Array.isArray(t[key]) ? t[key] : [];
};

// ============================================================
// Re-apply i18n translations after dynamic rendering
// ============================================================
const applyI18n = () => {
  if (typeof window.applyTranslations === "function" && window.currentTranslations)
    window.applyTranslations(window.currentTranslations);
};

// ============================================================
// Get current HTML filename from URL (e.g. "service-details.html")
// ============================================================
const currentFile = () => (location.pathname.split("/").pop() || "").split("?")[0];

// ============================================================
// Toggle visibility of empty state vs main article
// ============================================================
const toggleArticle = (show, emptyId, articleId) => {
  document.getElementById(emptyId)?.classList.toggle("d-none", show);
  document.getElementById(articleId)?.classList.toggle("d-none", !show);
};

// ============================================================
// Fill shared detail fields (image, title, description, body)
// ============================================================
const fillFields = (item) => {
  const set = (id, prop, html = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    html ? (el.innerHTML = item[prop] || "") : (el.textContent = item[prop] || "");
  };
  const img = document.getElementById("detail-image");
  if (img) { img.src = item.image || ""; img.alt = item.title || ""; }
  set("detail-title",       "title");
  set("detail-description", "description", true);
  set("detail-body",        "details",     true);
};

// ============================================================
// Show or hide an optional block (highlights / scope)
// ============================================================
const fillOptionalBlock = (wrapId, bodyId, content) => {
  const wrap = document.getElementById(wrapId);
  const body = document.getElementById(bodyId);
  if (!wrap || !body) return;
  wrap.classList.toggle("d-none", !content);
  body.innerHTML = content || "";
};

// ============================================================
// Render service cards: image + icon bar + title
// ============================================================
function renderServiceCards(containerId) {
  const root = document.getElementById(containerId);
  const items = getItems("services");
  if (!root || !items.length) return;

  root.innerHTML =
    '<div class="row g-3 g-md-4">' +
    items.map((item) => `
      <div class="col-6 col-md-4 col-lg-3">
        <a href="service-details.html?id=${encodeURIComponent(item.id)}"
           class="service-card d-block text-decoration-none text-reset h-100">
          <div class="service-card__media">
            <img src="${esc(item.image)}" alt="" loading="lazy" />
          </div>
          <div class="service-card__bar d-flex align-items-stretch">
            <div class="service-card__icon" aria-hidden="true">
              <i class="${safeIcon(item.icon)}"></i>
            </div>
            <div class="service-card__title">${esc(item.title)}</div>
          </div>
        </a>
      </div>`).join("") +
    "</div>";

  applyI18n();
}

// ============================================================
// Render project cards inside a Swiper slider
// ============================================================
let _swiper = null;

function renderProjectCards(containerId) {
  const root = document.getElementById(containerId);
  const items = getItems("projects");
  if (!root || !items.length) return;

  if (_swiper) { _swiper.destroy(true, true); _swiper = null; }

  root.innerHTML =
    '<div class="swiper projects-swiper"><div class="swiper-wrapper" dir="ltr">' +
    items.map((item) => `
      <div class="swiper-slide">
        <div class="project-card card border-0 rounded-0 overflow-hidden h-100 bg-dark text-white">
          <div class="project-card__media">
            <img src="${esc(item.image)}" alt="" loading="lazy" />
          </div>
          <div class="card-body">
            <h5 class="card-title">${esc(item.title)}</h5>
            <p class="card-text small opacity-90 mb-3">${esc(item.description)}</p>
            <a href="project-details.html?id=${encodeURIComponent(item.id)}"
               class="btn btn-sm" data-i18n="projectsPage.viewAll"></a>
          </div>
        </div>
      </div>`).join("") +
    "</div></div>";

  if (typeof Swiper !== "undefined") {
    _swiper = new Swiper(root.querySelector(".projects-swiper"), {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        576: { slidesPerView: 1.1 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 2.4, spaceBetween: 28 },
      },
    });
  }

  applyI18n();
}

// ============================================================
// Render article cards: image + title + description + read more
// ============================================================
function renderArticleCards(containerId) {
  const root = document.getElementById(containerId);
  const items = getItems("articles");
  if (!root || !items.length) return;

  root.innerHTML =
    '<div class="row g-4">' +
    items.map((item) => `
      <div class="col-md-6 col-lg-4">
        <a href="article-details.html?id=${encodeURIComponent(item.id)}"
           class="article-card card border-0 rounded-0 overflow-hidden h-100 text-decoration-none text-reset">
          <div class="article-card__media">
            <img src="${esc(item.image)}" alt="" loading="lazy" />
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${esc(item.title)}</h5>
            <p class="card-text small text-secondary flex-grow-1">${esc(item.description)}</p>
            <span class="small fw-semibold mt-1" data-i18n="blogs.readMore"></span>
          </div>
        </a>
      </div>`).join("") +
    "</div>";

  applyI18n();
}

// ============================================================
// Render sidebar list of all services (highlights active item)
// ============================================================
function renderServiceSidebar(activeId) {
  const ul = document.getElementById("service-sidebar-list");
  if (!ul) return;

  ul.innerHTML = getItems("services").map((s) => `
    <li>
      <a href="service-details.html?id=${encodeURIComponent(s.id)}"
         class="sd-nav__link d-flex align-items-center gap-2 text-decoration-none
                ${String(s.id) === String(activeId) ? "is-active" : ""}">
        <span class="sd-nav__icon" aria-hidden="true"><i class="${safeIcon(s.icon)}"></i></span>
        <span class="sd-nav__label">${esc(s.title)}</span>
      </a>
    </li>`).join("");
}

// ============================================================
// Hero image + title for service-details (Pinterest-style band)
// ============================================================
function setupServiceDetailHero(item) {
  const hero = document.getElementById("service-detail-hero");
  const titleEl = document.getElementById("service-hero-title");
  if (!hero) return;

  const dict = window.currentTranslations;
  const fallbackTitle =
    (dict && dict.hero && dict.hero.breadcrumbServiceDetails) || "";

  if (item && item.image) {
    hero.classList.add("hero-pages--has-bg");
    const src = String(item.image).replace(/\\/g, "/").replace(/"/g, "%22");
    hero.style.setProperty("--hero-bg-image", `url("${src}")`);
  } else {
    hero.classList.remove("hero-pages--has-bg");
    hero.style.removeProperty("--hero-bg-image");
  }

  if (titleEl) {
    titleEl.textContent = (item && item.title) || fallbackTitle;
  }
}

// ============================================================
// Hero image + title for project/article/blog detail pages
// ============================================================
function setupGenericDetailHero(item, fallbackTitlePath) {
  const hero = document.querySelector("section.hero-pages");
  if (!hero) return;

  const titleEl = hero.querySelector(".sd-hero__title");
  const dict = window.currentTranslations || {};
  const fallbackTitle = String(fallbackTitlePath || "")
    .split(".")
    .reduce((acc, key) => (acc && acc[key] != null ? acc[key] : ""), dict) || "";

  if (item && item.image) {
    hero.classList.add("hero-pages--has-bg");
    const src = String(item.image).replace(/\\/g, "/").replace(/"/g, "%22");
    hero.style.setProperty("--hero-bg-image", `url("${src}")`);
  } else {
    hero.classList.remove("hero-pages--has-bg");
    hero.style.removeProperty("--hero-bg-image");
  }

  if (titleEl) {
    titleEl.textContent = (item && item.title) || fallbackTitle;
  }
}

// ============================================================
// Render detail page — works for service / project / article
// ============================================================
function renderDetails() {
  const file = currentFile();
  const id   = new URLSearchParams(location.search).get("id");

  // — Service details (has sidebar + optional blocks)
  if (file === "service-details.html") {
    renderServiceSidebar(id);
    const item = getItems("services").find((s) => String(s.id) === String(id));
    setupServiceDetailHero(item || null);
    toggleArticle(!!item, "service-detail-empty", "service-detail-article");
    if (item) {
      fillFields(item);
      fillOptionalBlock("detail-highlights-wrap", "detail-highlights-body", item.highlights);
      fillOptionalBlock("detail-scope-wrap",      "detail-scope-body",      item.scope);
    }
    applyI18n();
    return;
  }

  // — Project / Article details (simple layout — HTML template in page)
  const pages = {
    "project-details.html": {
      key: "projects",
      emptyId: "project-detail-empty",
      articleId: "project-detail-article",
      heroFallback: "hero.breadcrumbProjectDetails",
    },
    "article-details.html": {
      key: "articles",
      emptyId: "article-detail-empty",
      articleId: "article-detail-article",
      heroFallback: "hero.breadcrumbArticles",
    },
    "blog-details.html": {
      key: "articles",
      emptyId: "article-detail-empty",
      articleId: "article-detail-article",
      heroFallback: "blogDetails.title",
    },
  };

  const cfg = pages[file];
  if (!cfg) return;

  const item = getItems(cfg.key).find((r) => String(r.id) === String(id));
  setupGenericDetailHero(item || null, cfg.heroFallback);
  toggleArticle(!!item, cfg.emptyId, cfg.articleId);
  if (item) fillFields(item);
  applyI18n();
}