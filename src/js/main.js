'use script';

let burger = document.querySelector('.nav__burger');
let menu = document.querySelector('.nav__list');

burger.onclick = () => {

  menu.classList.toggle('nav__list--active');
  burger.classList.toggle('is-active');   

}

// $('.nav__link').click(function(){
//   $('.nav__burger').removeClass("is-active");
//   $('.nav__list').removeClass('nav__list--active');
//   $('body').removeClass('body--active');
// });