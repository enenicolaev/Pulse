let  projectFolder = require("path").basename(__dirname);
let  sourceFolder = "#src";

let fs = require("fs");

//! Прописанные пути

const path = {
   build: {
      html: projectFolder + "/",
      css: projectFolder + "/css/",
      js: projectFolder + "/js/",
      img: projectFolder + "/img/",
      fonts: projectFolder + "/fonts/",
      mailer: projectFolder + "/mailer/",
   },
   src: {
      html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
      css: sourceFolder + "/scss/style.scss",
      js: sourceFolder + "/js/script.js",
      img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: sourceFolder + "/fonts/*.ttf",
      iconsfont: sourceFolder + "/fonts/iconsfont/*.{eot,ttf,woff,woff2,svg}",
      mailer: sourceFolder + "/mailer/**/**",
   },
   watch: {
      html: sourceFolder + "/**/*.html",
      css: sourceFolder + "/scss/**/*.scss",
      js: sourceFolder + "/js/**/*.js",
      img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
   },
   clean:  "./" + projectFolder + "/"
};



const {src,dest} = require("gulp"),
      gulp = require("gulp"),
      browsersync = require("browser-sync").create(),
      fileinclude = require("gulp-file-include"),
      del = require("del"),
      scss = require("gulp-sass"),
      autoprefixer = require("gulp-autoprefixer"),
      groupMedia = require("gulp-group-css-media-queries"),
      cleanCss = require("gulp-clean-css"),
      rename = require("gulp-rename"),
      uglify = require("gulp-uglify-es").default,
      imagemin = require("gulp-imagemin"),
      webp = require("gulp-webp"),
      webphtml = require("gulp-webp-html"),
      webpcss = require("gulp-webpcss"),
      ttf2woff = require("gulp-ttf2woff"),
      ttf2woff2 = require("gulp-ttf2woff2"),
      fonter = require("gulp-fonter"),
      htmlmin = require("gulp-htmlmin");


      


//! Функция для обновления браузера
function browserSync() {
   browsersync.init({
      server: {
         baseDir: "./" + projectFolder + "/"
      },
      port: 3000,
      notify: false
   });
};




//! Функция для работы с HTML
function html() {
   return src(path.src.html)
      .pipe(fileinclude())
      .pipe(webphtml())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
};



//! Функция для работы с CSS
function css() {
   return src(path.src.css)
      .pipe(
         scss({
            outputStyle: "expanded"
         })
      )
      .pipe(
         groupMedia()
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
         })
      )
      .pipe(webpcss())
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream());
};






//! Функции для подключения шрифтов

function fontsStyle() {
   let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
   if (file_content == '') {
      fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
      return fs.readdir(path.build.fonts, function (err, items) {
         if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
               let fontname = items[i].split('.');
               fontname = fontname[0];
               if (c_fontname != fontname) {
                  fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
               }
               c_fontname = fontname;
            }
         }
      })
   }
}
   
function cb() { }





//! Функция для работы с JS

function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(
         rename({
            extname: ".min.js"
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
};




//! Функция для обработки картинок
function images() {
   return src(path.src.img)
      .pipe(
         webp({
            quality: 70
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPluggins: [{ removeViewBox: false }],
            interlaced: true,
            optimizaionLevel: 3
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
};





//! Функция для работы с шрифтами
function fonts() {
   src(path.src.fonts)
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts));
   src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts));
   src(path.src.iconsfont)
      .pipe(dest(path.build.fonts));
};



//! Функция Mailre PHP
function mailerPhp() {
   src(path.src.mailer)
      .pipe(dest(path.build.mailer));
}



//! Функция для удаления папки dist

function clean() {
   return del(path.clean)
};



//! Функция для слежки за файлами для обновления онлайн

function watchFiles() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
};

let build = gulp.series(clean, gulp.parallel(css, html, js, images, fonts, mailerPhp), fontsStyle);
let watch = gulp.parallel(browserSync, build, watchFiles);




//! Подружить gulp c новыми переменными путем экспорта ()
exports.mailerPhp = mailerPhp;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.default = watch;


//! Созданная задача для конвертации otf шрифтов в ttf

gulp.task("otf2ttf", function() {
   return src(sourceFolder + "/fonts/*.otf")
   .pipe(fonter({
      formats: ['ttf']
   }))
   .pipe(dest(sourceFolder + "/fonts/"));
});

