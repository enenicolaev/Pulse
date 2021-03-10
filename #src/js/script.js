"use strict"

@@include("webpdetection.js");
@@include("jquery-3.5.1.min.js");
@@include("jquery.validate.min.js");
@@include("jquery.maskedinput.min.js");
@@include("wow.min.js");



$(document).ready(function() {

   new WOW().init();

   @@include("tabs.js");


   const newSwiper = new Swiper('.swiper-container', {
      // Optional parameters
      loop: true,
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.goods-swiper__next',
        prevEl: '.goods-swiper__prev',
      },
    
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
   
   
   
   
    // footer
   
   
   const footerInfo = document.querySelector(".footer__info"),
         map = document.querySelector("iframe"),
         footerBtn = document.querySelector(".footer__btn"),
         footerImg = document.querySelector(".footer__img");
   
   function footerHide() {
      footerBtn.addEventListener("click", () => {
         footerInfo.classList.toggle("footer__info_disable");
         footerBtn.classList.toggle("footer__btn_active");
         footerImg.classList.toggle("footer__img_active")
      })
   }
   
   footerHide();


   //Modal

   $(".promo__button, .header__button").on("click", function() {
      $(".overlay, [data-modal=consulting]").fadeIn();
   });

   $(".card__btn").each(function(i) {
      $(this).on("click", function() {
         $("[data-modal=order] .modal__descr").text($(".card__title").eq(i).text())
         $(".overlay, [data-modal=order]").fadeIn();
      })
   });

   document.querySelector(".overlay").addEventListener("click", (event) => {
      if (event.target.matches(".overlay")) {
         $(".overlay, [data-modal=order], [data-modal=consulting], [data-modal=thanks]").fadeOut("slow");
      }
   });

   $(".modal__close").on("click", function() {
      $(".overlay, [data-modal=order], [data-modal=consulting], [data-modal=thanks]").fadeOut("slow");
   });

   if($(document).width() < 575) {
      $(".modal__close").fadeOut();
   };


   // validation forms

   function validateForms(form) {
      $(form).validate({
         rules: {
            name: "required",
            phone: "required",
            email: {
               required: true,
               email: true,
            }
         },
         messages: {
            name: "Пожалуйста введите имя",
            phone: "Введите мобильный телефон",
            email: {
              required: "Для обратной связи введите ваш email",
              email: "Формат email: name@domain.com"
            }
          },
          submitHandler: function (form) {
            $.ajax({
               type: "POST", // тип формы получение или отправка
               url: "mailer/smart.php", // Куда отправлять (Обработчик)
               data: $(form).serialize(), // Какие данные отправляются
               success: function () {
                  $(form).find ("input").val(""); //Очистка полей отправленной формы
   
                  $("[data-modal=consulting], [data-modal=order]").fadeOut();  //скрытие модальных окон
                  $(".overlay, [data-modal=thanks]").fadeIn("slow");
   
                  $("form").trigger("reset"); // Очистка всех оставшихся форм
               },
            });
            return false; // required to block normal submit since you used ajax
         },
      });
   }


   validateForms("#consulting");
   validateForms("#order");
   validateForms(".consult .consult__form");


   // Mask form несовместимо с type="number"

   $("input[name=phone]").mask("+7 (999) 999-99-99");

   // Отправка формы на почту

   // $("#order, #consulting").submit(function(e) {
   //    e.preventDefault();
   //    $.ajax({
   //       type: "POST", // тип формы получение или отправка
   //       url: "mailer/smart.php", // Куда отправлять (Обработчик)
   //       data: $(this).serialize(), // Какие данные отправляются
   //    }).done(function() {  //Выполнение функции в случае, когда сервер принял данные
   //       $(this).find ("input").val(""); //Очистка полей отправленной формы

   //       $("[data-modal=consulting], [data-modal=order]").fadeOut();  //скрытие модальных окон
   //       $("[data-modal=thanks]").fadeIn("slow");

   //       $("form").trigger("reset"); // Очистка всех оставшихся форм
   //    });
   //    return false;
   // });

   // Плавный скролл

   $(window).scroll(function() {
      if ($(this).scrollTop() > 1600) {

         if ($(document).width() > 575) {
            $(".pageup").fadeIn();
         }

      } else {
         $(".pageup").fadeOut();
      };
   });

   $("a[href='#top'], a[href='#catalog']").click(function(){
      const _href = $(this).attr("href");
      $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
      return false;
   });
      

   // Animation

   $("[data-promo=timer]").hover(function() {
      $(this).toggleClass("animate__slow animate__animated animate__infinite animate__shakeX");
   })
   $("[data-promo=cart]").hover(function() {
      $(this).toggleClass("animate__slow animate__animated animate__infinite animate__fadeOutRight");
   })
   $("[data-promo=messages]").hover(function() {
      $(this).toggleClass("animate__slow animate__animated animate__infinite animate__flash");
   })

})


