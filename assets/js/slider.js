window.swiper = new Swiper(".mySwiper", {
  loop: true,
  slidesPerView: 1,
  autoplay: { delay: 3000 },
  speed: 1500,
  effect: "slide",
});

window.swiperMobile = new Swiper(".mySwiper-mobile", {
  loop: true,
  slidesPerView: 1,
  autoplay: { delay: 3000 },

  speed: 1500,
  effect: "slide",
});


window.projectSwiper = new Swiper(".project-swiper", {
  slidesPerView: 3,
  speed: 1500,
  spaceBetween: 30,
  autoplay: { delay: 3000 },
  loop: true,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    320: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1200: { slidesPerView: 2 },
  },
});