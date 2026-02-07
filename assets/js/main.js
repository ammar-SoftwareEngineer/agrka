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
  });

})(jQuery);
