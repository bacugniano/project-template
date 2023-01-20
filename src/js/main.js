'use script';

const burger = document.querySelector('.nav__burger');
const nav = document.querySelector('.nav');
const menu = document.querySelector('.nav__list');
const links = document.querySelectorAll('.nav__link');
const body = document.querySelector('body');

// открытие/закрытие меню
burger.onclick = () => {
  menu.classList.toggle('nav__list--active');
  burger.classList.toggle('is-active');  
  body.classList.toggle('active');  
}

// закрытие меню при клике на ссылку
links.forEach((el) => el.addEventListener('click', function() {
  if (el.classList.contains('nav__link')) {
    menu.classList.remove('nav__list--active');
    burger.classList.remove('is-active'); 
    body.classList.remove('active');
  }
}));

// закрытие меню при клике на пустой области
document.addEventListener('click', (e) => {
  if (! nav.contains(e.target)) {
    menu.classList.remove('nav__list--active');
    burger.classList.remove('is-active'); 
    body.classList.remove('active');
  }
});