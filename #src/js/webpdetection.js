let hasWebP = false;
(function() {
     let img = new Image();
     img.onload = function() {
       hasWebP = !!(img.height > 0 && img.width > 0);
       if (hasWebP == true) {
         document.querySelector("body").classList.add("webp");
      }
     };
     img.onerror = function() {
       hasWebP = false;
     };
     img.src = 'http://www.gstatic.com/webp/gallery/1.webp';
})();

