"use strict"

const tabs = document.querySelectorAll(".catalog__tab"),
      catalog = document.querySelectorAll(".catalog__grid"),
      linksCardTo = document.querySelectorAll(".card__link_forward"),
      linksCardBack = document.querySelectorAll(".card__link_back"),
      cardsImg = document.querySelectorAll(".card__promo"),
      cardsInfo = document.querySelectorAll(".card__info");




function catalogTabs() {
   tabs.forEach(function(item, i) {
      item.addEventListener("click", (e) => {
         e.preventDefault();
         if (!item.classList.contains("catalog__tab_active")){
            tabs.forEach((item, i) => {
               if (item.classList.contains("catalog__tab_active")) {
                  item.classList.toggle("catalog__tab_active");
                  catalog[i].classList.toggle("catalog__grid_active");
               }
            })
            item.classList.toggle("catalog__tab_active");
            catalog[i].classList.toggle("catalog__grid_active");
         };
      });
   });
};

function linksCards() {
   linksCardTo.forEach(function(item, i) {
      item.addEventListener("click", (e) => {
         e.preventDefault();
         cardsImg[i].classList.toggle("card_active");
         cardsInfo[i].classList.toggle("card_active");
      });
   });
   linksCardBack.forEach(function(item, i) {
      item.addEventListener("click", (e) => {
         e.preventDefault();
         cardsImg[i].classList.toggle("card_active");
         cardsInfo[i].classList.toggle("card_active");
      });
   });
};



catalogTabs();
linksCards();
