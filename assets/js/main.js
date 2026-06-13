(function ($) {
  "use strict";

  /*=============================
      Loader
  =============================*/
  const loader = () => {
    $(window).on("load", () => {
      $(".loading").addClass("loaded").delay(600).fadeOut();
    });
  };
  loader();

  $(function () {
    /*=============================
        Cached Selectors
    =============================*/
    const $window = $(window);
    const $document = $(document);
    const $backTopDiv = $(".back-to-top");
    const $backTopLink = $("#back-top");
    const $nav = $(".header");
    const navHeight = $nav.outerHeight();
    const $hero = $("#hero-pages");
    const $navLinks = $(".navbar-nav .nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    /*=============================
        Back To Top Button
    =============================*/
    $window.on("scroll", () => {
      $backTopDiv.toggleClass("show", $window.scrollTop() > 100);
      $nav.toggleClass("fixed", $window.scrollTop() > navHeight);
    });

    $backTopLink.on("click", (e) => {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 400);
    });


    /*=============================
        Active Navigation Link
    =============================*/
    $navLinks.each(function () {
      const linkPage = $(this).attr("href").replace("./", "");
      $(this).toggleClass("active", linkPage === currentPage);
    });


    /*=============================
        Hero Title + Breadcrumb
    =============================*/
    if ($hero.length) {
      const title = $hero.data("title");
      const breadcrumb = $hero.data("breadcrumb");

      if (title) $hero.find("h1").text(title);
      if (breadcrumb) $hero.find(".breadcrumb-item.active").text(breadcrumb);
    }

    /*=============================
        Book Promo Modal
    =============================*/
  });

  initBookPromoModal();

  function initBookPromoModal() {
    if (document.getElementById("bookPromoModal")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="modal fade book-promo-modal" id="bookPromoModal" tabindex="-1" aria-labelledby="bookPromoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered book-promo-modal__dialog">
          <div class="modal-content p-0 border-0 rounded-0">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center  pt-0">
              <img src="./assets/images/book/modal.jpeg" alt="غلاف الكتاب — أجريكا" class="book-promo-modal__img w-100 mb-4" data-i18n-alt="bookModal.imageAlt" />
              <a href="https://wa.me/201123734611?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%B4%D8%B1%D8%A7%D8%A1%20%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8" target="_blank" rel="noopener noreferrer" class="btn hero-cta-btn btn-lg w-100 book-promo-modal__cta" data-i18n="bookModal.buyNow">اشتري الكتاب الآن</a>
            </div>
          </div>
        </div>
      </div>`
    );

    const modalEl = document.getElementById("bookPromoModal");
    if (modalEl) {
      modalEl.addEventListener("shown.bs.modal", () => document.body.classList.add("book-promo-open"));
      modalEl.addEventListener("hidden.bs.modal", () => document.body.classList.remove("book-promo-open"));
    }

    const showBookModal = () => {
      const modalEl = document.getElementById("bookPromoModal");
      if (!modalEl || typeof bootstrap === "undefined") return;

      if (typeof window.applyTranslations === "function" && window.currentTranslations) {
        window.applyTranslations(window.currentTranslations);
      }

      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    };

    const scheduleBookModal = () => {
      setTimeout(showBookModal, 1500);
    };

    if (document.readyState === "complete") {
      scheduleBookModal();
    } else {
      window.addEventListener("load", scheduleBookModal, { once: true });
    }
  }

})(jQuery);
