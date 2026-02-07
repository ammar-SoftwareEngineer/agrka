// ===== Lenis Smooth Scroll =====
window.lenis = new Lenis({
  duration: 1.5,
  easing: (t) => t,
  smoothWheel: true,
  smoothTouch: true,
  touchMultiplier: 1.2,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== GSAP & ScrollTrigger =====
gsap.registerPlugin(ScrollTrigger);

// ===== Animate generic sections =====
function animateAllSections() {
  const sections = document.querySelectorAll(".animate-section");

  sections.forEach((section) => {
    // Fade + Slide-in headers
    const items = section.querySelectorAll(
      ".header-section,li,p,h2,h3,.btn-send ,.btn,.project-card ,.project-card img h5 .btn-send,.about,.mission p li ,.vision p li"
    );

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: index * 0.01,
          scrollTrigger: {
            trigger: item,
            start: "top 100%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Parallax Image
   section.querySelectorAll(".about-image img").forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  });

  // =========================================================
  // ==== Smart Scroll Slider (Images + Text Sync on Scroll) ===
  // =========================================================

  const sliderSection = document.querySelector(".services-scroll-slider");

  if (sliderSection) {
    const images = gsap.utils.toArray(".images-panel .image-slide");
    const texts = gsap.utils.toArray(".content-panel .content-slide");

    // Initial state
    gsap.set(images[0], { opacity: 1 });
    gsap.set(texts[0], { opacity: 1, y: 0 });

    texts.forEach((slide, i) => {
      ScrollTrigger.create({
        trigger: slide,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onEnter: () => showSlide(i),
        onEnterBack: () => showSlide(i),
      });
    });

    function showSlide(index) {
      // Images fade + zoom
      images.forEach((img, i) => {
        gsap.to(img, {
          opacity: i === index ? 1 : 0,
          duration: 1,
          ease: "power2.out",
        });

        gsap.to(img.querySelector("img"), {
          duration: 1.5,
          ease: "power3.out",
        });
      });

      // Text animation
      texts.forEach((txt, i) => {
        gsap.to(txt, {
          opacity: i === index ? 1 : 0,
          y: i === index ? 0 : 40,
          duration: 1,
          ease: "power3.out",
        });
      });
    }
  }
}
function mobileHorizontalSlider() {
  if (window.innerWidth >= 1200) return;

  const section = document.querySelector(".services-parallax");
  const wrapper = document.querySelector(".horizontal-wrapper");
  const slides = gsap.utils.toArray(".services-parallax .service-item");

  if (!wrapper || slides.length === 0) return;

  const totalWidth = wrapper.scrollWidth;
  const viewport = window.innerWidth;

  let horizontalScroll = gsap.to(wrapper, {
    x: () => -(totalWidth - viewport),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top 10%",
      end: () => "+=" + (totalWidth - viewport),
      scrub: true,
      pin: true,
      anticipatePin: 1,
      id: "mobileHorizontal",
    },
  });

  slides.forEach((slide, index) => {
    ScrollTrigger.create({
      trigger: slide,
      containerAnimation: horizontalScroll,
      start: () => (index === 0 ? "left 60%" : "left center"),
      end: "right center",
      onEnter: () => animateSlide(index),
      onEnterBack: () => animateSlide(index),
    });
  });

  function animateSlide(activeIndex) {
    slides.forEach((sl, i) => {
      gsap.to(sl, {
        opacity: i === activeIndex ? 1 : 0.25,
        x: i === activeIndex ? 0 : 80,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }

  gsap.to(slides[0], {
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power2.out",
  });
}

mobileHorizontalSlider();
animateAllSections();

ScrollTrigger.refresh();
