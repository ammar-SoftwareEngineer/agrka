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
