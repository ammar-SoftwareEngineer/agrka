if (document.querySelector(".mySwiper")) {
  window.swiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 1,
    autoplay: { delay: 4500, disableOnInteraction: false },
    speed: 1200,
    effect: "fade",
    fadeEffect: { crossFade: true },
  });
}

if (document.querySelector(".mySwiper-mobile")) {
  window.swiperMobile = new Swiper(".mySwiper-mobile", {
    loop: true,
    slidesPerView: 1,
    autoplay: { delay: 3000, disableOnInteraction: false },
    speed: 1500,
    effect: "slide",
  });
}

  window.projectSwiper = new Swiper(".project-swiper", {
    loop: true,
    speed: 800,
    spaceBetween: 0,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".project-swiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".project-swiper .swiper-button-next",
      prevEl: ".project-swiper .swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });

