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
// Active UI language (must match translate.js localStorage key)
// ============================================================
const getContentLocale = () =>
  (typeof localStorage !== "undefined" && localStorage.getItem("lang")) || "ar";

// ============================================================
// Content arrays from site-data.json (not locale UI files)
// ============================================================
const getItems = (key) => {
  const sd = window.siteData;
  const branch = sd && sd.locales && sd.locales[getContentLocale()];
  return branch && Array.isArray(branch[key]) ? branch[key] : [];
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
// Project detail: Swiper slider + Fancybox (same image group)
// ============================================================
const fillProjectGallery = (item) => {
  const wrapper = document.getElementById("project-detail-swiper-wrapper");
  const root = document.querySelector(".project-detail-swiper");
  if (!wrapper || !root || !item) return;

  const urls =
    item.gallery && Array.isArray(item.gallery) && item.gallery.length
      ? item.gallery
      : item.image
        ? [item.image]
        : [];

  if (!urls.length) return;

  if (_projectDetailSwiper) {
    _projectDetailSwiper.destroy(true, true);
    _projectDetailSwiper = null;
  }

  const group = `project-${item.id}`;
  const cap = esc(item.title || "");
  const alt = esc(item.title || "");

  wrapper.innerHTML = urls
    .map(
      (url) => `
    <div class="swiper-slide">
      <a href="${esc(url)}" class="project-detail-slide-link d-block w-100 h-100 overflow-hidden" data-fancybox="${group}" data-caption="${cap}">
        <img src="${esc(url)}" alt="${alt}" class="project-detail-slide-img w-100 d-block" loading="lazy" />
      </a>
    </div>`
    )
    .join("");

  if (typeof Swiper !== "undefined") {
    _projectDetailSwiper = new Swiper(root, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      grabCursor: true,
      loop: urls.length > 2,
      watchOverflow: true,
      pagination: {
        el: root.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: root.querySelector(".swiper-button-next"),
        prevEl: root.querySelector(".swiper-button-prev"),
      },
    });
  }

  if (typeof window.Fancybox !== "undefined") {
    window.Fancybox.bind("#project-detail-article a[data-fancybox]", {
      Hash: false,
    });
  }
};

// ============================================================
// Render service cards — variant "division" (home / services page) or "card" (grid)
// ============================================================
function renderServiceCards(containerId, opts) {
  const options = opts || {};
  const root = document.getElementById(containerId);
  if (!root) return;

  let items = getItems("services");
  if (typeof options.limit === "number") items = items.slice(0, options.limit);
  if (!items.length) return;

  const variant = options.variant || "card";
  const delayStep = typeof options.delayStep === "number" ? options.delayStep : 80;

  if (variant === "division") {
    root.innerHTML = items
      .map(
        (item, idx) => `
      <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-duration="900" data-aos-anchor-placement="top-bottom" data-aos-delay="${idx * delayStep}">
        <div class="card service-division-card border-0 text-white h-100">
          <a href="service-details.html?id=${encodeURIComponent(item.id)}" class="text-decoration-none text-reset d-block h-100">
            <img src="${esc(item.image)}" class="card-img-top" alt="" loading="lazy" />
            <div class="card-body p-4 d-flex flex-column">
              <div class="service-division-icon mb-3" aria-hidden="true">
                <i class="${safeIcon(item.icon)} fa-xl"></i>
              </div>
              <h5 class="card-title mb-3 text-white">${esc(item.title)}</h5>
            </div>
          </a>
        </div>
      </div>`
      )
      .join("");
  } else {
    root.innerHTML =
      '<div class="row g-3 g-md-4">' +
      items
        .map(
          (item) => `
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
      </div>`
        )
        .join("") +
      "</div>";
  }

  applyI18n();
  if (typeof window.AOS !== "undefined") window.AOS.refresh();
}

// ============================================================
// Render project cards inside a Swiper slider
// ============================================================
let _swiper = null;
let _projectDetailSwiper = null;
let _indexHomeProjectSwiper = null;

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
    '<div class="row g-4 g-lg-4 blogs-page__row " data-aos="fade-up">' +
    items
      .map(
        (item, i) => `
      <div class="col-md-6 col-lg-4">
        <a href="blog-details.html?id=${encodeURIComponent(item.id)}"
           class="article-card card border-0 rounded-0 overflow-hidden h-100 text-decoration-none text-reset">
          <div class="article-card__media">
            <img src="${esc(item.image)}" alt="" loading="lazy" />
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${esc(item.title)}</h5>
            <p class="card-text small text-secondary flex-grow-1">${esc(item.description)}</p>
            <span class="blog-read-more mt-1 align-self-start"><span data-i18n="blogs.readMore"></span><i class="fa-solid fa-arrow-right-long blog-read-more__icon" aria-hidden="true"></i></span>
          </div>
        </a>
      </div>`
      )
      .join("") +
    "</div>";

  applyI18n();

}

// ============================================================
// Home: first N services (division cards)
// ============================================================
function renderIndexServiceCards() {
  renderServiceCards("index-services-cards", { variant: "division", limit: 4, delayStep: 80 });
}

// ============================================================
// Home: projects Swiper (same layout as former static block)
// ============================================================
function renderIndexProjectsSwiper() {
  const mount = document.getElementById("index-projects-mount");
  if (!mount) return;

  const items = getItems("projects");
  if (!items.length) return;

  if (_indexHomeProjectSwiper) {
    _indexHomeProjectSwiper.destroy(true, true);
    _indexHomeProjectSwiper = null;
  }

  const aosDelays = [0, 60, 120, 180, 300, 360, 420];
  const slides = items
    .map(
      (item, i) => `
    <div class="swiper-slide" data-aos="fade-up" data-aos-delay="${aosDelays[i] != null ? aosDelays[i] : i * 60}">
      <div class="card border-0 rounded-0 overflow-hidden shadow-sm h-100">
        <div class="project-img-wrapper overflow-hidden">
          <img src="${esc(item.image)}" class="card-img-top rounded-0" alt="" loading="lazy" />
        </div>
        <div class="card-body d-flex justify-content-between align-items-center">
          <h5 class="card-title">${esc(item.title)}</h5>
          <a href="project-details.html?id=${encodeURIComponent(item.id)}" class="btn btn-link" aria-label=""><i class="fa-solid fa-chevron-right"></i></a>
        </div>
      </div>
    </div>`
    )
    .join("");

  mount.innerHTML = `
    <div class="swiper project-swiper position-relative">
      <div class="swiper-wrapper">${slides}</div>
      <div class="swiper-pagination mt-4"></div>
      <div class="swiper-button-prev"><i class="fa-solid fa-chevron-left"></i></div>
      <div class="swiper-button-next"><i class="fa-solid fa-chevron-right"></i></div>
    </div>`;

  const el = mount.querySelector(".project-swiper");
  if (el && typeof Swiper !== "undefined") {
    _indexHomeProjectSwiper = new Swiper(el, {
      loop: items.length > 2,
      speed: 800,
      spaceBetween: 0,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev"),
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 4 },
      },
    });
  }

  applyI18n();
  if (typeof window.AOS !== "undefined") window.AOS.refresh();
}

// ============================================================
// Projects listing page — grid
// ============================================================
function renderProjectsPageGrid(containerId) {
  const root = document.getElementById(containerId);
  const items = getItems("projects");
  if (!root || !items.length) return;

  const aosDelays = [0, 60, 120, 180, 300, 360, 420];
  root.innerHTML = items
    .map(
      (item, i) => `
    <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${aosDelays[i] != null ? aosDelays[i] : i * 60}">
      <div class="card border-0 rounded-0 overflow-hidden shadow-sm h-100">
        <div class="project-img-wrapper overflow-hidden">
          <img src="${esc(item.image)}" class="card-img-top rounded-0" alt="" loading="lazy" />
        </div>
        <div class="card-body d-flex justify-content-between align-items-center">
          <h5 class="card-title">${esc(item.title)}</h5>
          <a href="project-details.html?id=${encodeURIComponent(item.id)}" class="btn btn-link"><i class="fa-solid fa-chevron-right"></i></a>
        </div>
      </div>
    </div>`
    )
    .join("");

  applyI18n();
  if (typeof window.AOS !== "undefined") window.AOS.refresh();
}

// ============================================================
// Project detail — sidebar list
// ============================================================
function renderProjectSidebar(activeId) {
  const ul = document.getElementById("project-sidebar-list");
  if (!ul) return;

  ul.innerHTML = getItems("projects")
    .map(
      (p) => `
    <li>
      <a href="project-details.html?id=${encodeURIComponent(p.id)}"
         class="sd-nav__link d-flex align-items-center gap-2 text-decoration-none ${String(p.id) === String(activeId) ? "is-active" : ""}">
        <span class="sd-nav__label text-truncate">${esc(p.title)}</span>
      </a>
    </li>`
    )
    .join("");
}

// ============================================================
// Blog / article detail — sidebar list
// ============================================================
function renderArticleSidebar(activeId) {
  const ul = document.getElementById("article-sidebar-list");
  if (!ul) return;

  ul.innerHTML = getItems("articles")
    .map(
      (a) => `
    <li>
      <a href="blog-details.html?id=${encodeURIComponent(a.id)}"
         class="sd-nav__link d-flex align-items-center gap-2 text-decoration-none ${String(a.id) === String(activeId) ? "is-active" : ""}">
        <span class="sd-nav__label text-truncate">${esc(a.title)}</span>
      </a>
    </li>`
    )
    .join("");
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

  const crumb = hero.querySelector(".breadcrumb-item.active");
  if (crumb) {
    crumb.textContent = (item && item.title) || fallbackTitle;
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
  if (file === "project-details.html") renderProjectSidebar(id);
  if (file === "blog-details.html") renderArticleSidebar(id);
  if (item) {
    fillFields(item);
    if (file === "project-details.html") fillProjectGallery(item);
  }
  applyI18n();
}