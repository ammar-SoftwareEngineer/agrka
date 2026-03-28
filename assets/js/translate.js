let btnLang = document.querySelectorAll(".btn-lang");
let currentTranslations = null;
window.currentTranslations = null;
window.siteData = window.siteData || null;

// ==============================
// Content data (services / projects / articles) — one file, all locales
// ==============================
async function loadSiteDataOnce() {
  if (window.siteData) return window.siteData;
  try {
    const res = await fetch("./assets/data/site-data.json");
    window.siteData = await res.json();
  } catch (e) {
    console.error("site-data load failed", e);
    window.siteData = { locales: { ar: {}, en: {} } };
  }
  return window.siteData;
}

// ==============================
// 1) Load UI strings + ensure content data is available
// ==============================
async function loadLanguage(lang) {
  await loadSiteDataOnce();
  const response = await fetch(`./assets/locales/${lang}.json`);
  const translations = await response.json();
  currentTranslations = translations;
  window.currentTranslations = translations;
  applyTranslations(translations);
  window.dispatchEvent(new Event("translationsready"));
  localStorage.setItem("lang", lang);
  // Re-apply for dynamically loaded content (hero, sections)
  setTimeout(function () {
    if (currentTranslations) {
      applyTranslations(currentTranslations);
      window.dispatchEvent(new Event("translationsready"));
    }
  }, 2200);
}
// ==============================
// 2) Apply translation to HTML elements
// ==============================
function applyTranslations(dictionary) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = getValueByPath(dictionary, key);
    if (text) el.innerHTML = text;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = getValueByPath(dictionary, key);
    if (text) el.setAttribute("placeholder", text);
  });
}
window.applyTranslations = applyTranslations;

// ==============================
// 3) Function to access nested values key.key2.key3
// ==============================
function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// ==============================
// 4) Change language when user clicks a button
// ==============================
btnLang.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    loadLanguage(newLang);
    if (newLang === "ar") {
      document.body.dir = "rtl";
      btnLang.forEach((btn) => (btn.innerHTML = "EN"));
    } else {
      document.body.dir = "ltr";
      btnLang.forEach((btn) => (btn.innerHTML = "AR"));
    }
  });
});

// ==============================
// 5) Load previously saved language when the site opens
// ==============================
const savedLang = localStorage.getItem("lang") || "ar";
if (savedLang === "ar") {
  document.body.dir = "rtl";
  btnLang.forEach((btn) => (btn.innerHTML = "EN"));
} else {
  document.body.dir = "ltr";
  btnLang.forEach((btn) => (btn.innerHTML = "AR"));
}
loadLanguage(savedLang);
