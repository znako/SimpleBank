'use strict';

///////////////////////////////////////

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const dotsContainer = document.querySelector('.dots');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');

// Modal window
const openModalWindow = function (e) {
  e.preventDefault();

  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(btn =>
  btn.addEventListener('click', openModalWindow)
);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// Sticky nav
//// Intersection Observer API
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observerCallback = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(
  observerCallback,
  observerOptions
);
headerObserver.observe(header);

// Анимация потускнения
const navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('.nav__logo');
    const navText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(link => {
      if (link !== linkOver) link.style.opacity = this;
    });
    logo.style.opacity = this;
    navText.style.opacity = this;
  }
};
nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

// Scroll Узнать больше

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// smooth Scroll услуги/операции/отзывы
// диллегирование событий
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains('nav__link')) {
    const section = document.querySelector(target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Translating sections
const appearanceSections = function (entries, observe) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};
const sectionsOptions = {
  root: null,
  threshold: 0.1,
};

const sectionObserver = new IntersectionObserver(
  appearanceSections,
  sectionsOptions
);
sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Tabs operations
tabContainer.addEventListener('click', function (e) {
  const clickedBtn = e.target.closest('.operations__tab');
  // Guard clause
  if (!clickedBtn) return;
  document
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  clickedBtn.classList.add('operations__tab--active');

  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Lazy loading
const lazyImages = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observe) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observe.unobserve(entry.target);
};
const imageOptions = {
  root: null,
  threshold: 0.7,
};
const lazyImagesObserver = new IntersectionObserver(loadImages, imageOptions);
lazyImages.forEach(lazyImage => lazyImagesObserver.observe(lazyImage));

// Slider
let currentSlide = 0;

const slides = document.querySelectorAll('.slide');
const slidesNumber = slides.length;

const creatingDots = function () {
  slides.forEach(function (_, index) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="dots__dot" data-slide="${index}"></div>`
    );
  });
};
creatingDots();

const activatingDot = function (currentDot) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${currentDot}"]`)
    .classList.add('dots__dot--active');
};

const slideTranslate = function (slide = 0) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
  activatingDot(slide);
};
slideTranslate();

const sliderRight = function () {
  currentSlide === slidesNumber - 1 ? (currentSlide = 0) : currentSlide++;

  slideTranslate(currentSlide);
};
const sliderLeft = function () {
  currentSlide === 0 ? (currentSlide = slidesNumber - 1) : currentSlide--;

  slideTranslate(currentSlide);
};

sliderBtnRight.addEventListener('click', sliderRight);
sliderBtnLeft.addEventListener('click', sliderLeft);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') sliderRight();
  if (e.key === 'ArrowLeft') sliderLeft();
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slideNumber = e.target.dataset.slide;
    slideTranslate(slideNumber);
    activatingDot(slideNumber);
  }
});
