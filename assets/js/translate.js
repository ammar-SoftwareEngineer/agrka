let btnLang = document.querySelectorAll(".btn-lang");
let currentTranslations = null;

// ==============================
// 1) Load language from JSON file
// ==============================
async function loadLanguage(lang) {
  const response = await fetch(`./assets/locales/${lang}.json`);
  const translations = await response.json();
  currentTranslations = translations;
  applyTranslations(translations);
  localStorage.setItem("lang", lang);
  // Re-apply for dynamically loaded content (hero, sections)
  setTimeout(function () {
    if (currentTranslations) applyTranslations(currentTranslations);
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
}

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
