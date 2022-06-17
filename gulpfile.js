let project_folder = "dist";
let source_folder = "#src";

let path = {
   build: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      fonts: project_folder + "/fonts/"
   },
   src: {
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
      css: source_folder + "/sass/style.sass",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,ico,gif,webp}",
      fonts: source_folder + "/fonts/*.ttf",
   },
   watch: {
      html: source_folder + "/**/*.html",
      css: source_folder + "/**/*.sass",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,ico,gif,webp}",
   },
   clean: "./" + project_folder + "/"
}

const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync");
const fileinclude = require("gulp-file-include");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

function browserSync() {
   browsersync.init({
      server: {
         baseDir: "./" + project_folder + "/"
      },
      port: 3000,
      notify: false
   })
}

function html() {
   return src(path.src.html)
      .pipe(fileinclude())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function css() {
   return src(path.src.css)
      .pipe(
         sass({
            outputStyle: "expanded"
         })
      )
      .pipe(
         group_media()
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
         })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(
         uglify()
      )
      .pipe(
         rename({
            extname: ".min.js"
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function images() {
   return src(path.src.img)
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}

function fonts() {
   src(path.src.fonts)
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts));
   return src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts));
}

function svgsprite() {
   return gulp.src([source_folder + '/img/iconsprite/*.svg'])
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: "../icons/icons.svg",
               example: true
            }
         },
      }))
      .pipe(dest(path.build.img))
}

function watchFiles() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
}

function clean() {
   return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, svgsprite));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.svgsprite = svgsprite;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;