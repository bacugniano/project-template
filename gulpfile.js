const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const minCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const autoprefix = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create()
const svgSprite = require('gulp-svg-sprite')
const woff = require('gulp-ttf2woff')
const woff2 = require('gulp-ttf2woff2')

//пути к файлам
const path = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/styles/scss/**/*.scss',
    dest: 'dist/css/'
  },
  js: {
    src: 'src/js/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  svg: {
    src: 'src/img/svg/*.svg',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/*.ttf',
    dest: 'dist/fonts/'
  }
}

//очистка папки dist
const clean = () => del(['dist/*', '!dist/img', '!dist/fonts'])

//таск для sass
const styles = () => {
  return gulp.src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix({
      cascade: false
    }))
    .pipe(minCSS())
    .pipe(rename({
      basename: 'style',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browserSync.stream())
}

//таск для скриптов
const scripts = () => {
  return gulp.src(path.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.js.dest))
    .pipe(browserSync.stream())
}

//таск для сжатия изображений
const img = () => {
  return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin([
      imagemin.mozjpeg({
        quality: 80,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 2
      }),
    ]))
    .pipe(gulp.dest(path.images.dest))
}

//таск для сжатия html
const html = () => {
  return gulp.src(path.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path.html.dest))
    .pipe(browserSync.stream())
}

//svg sprite
const svg = () => {
  return gulp.src(path.svg.src)
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'sprite.svg'
        },
      },
      shape: {
        transform: [
          {svgo: {
            plugins: [
              {
                name: "removeAttrs",
                params: {
                  attrs: "(fill|stroke)"
                }
              }
            ]
          }}
        ],
      },
    }))
    .pipe(gulp.dest(path.svg.dest))
}


//конвертирование шрифтов
// to woff

const toWoff = () => {
  return gulp.src(path.fonts.src)
    .pipe(newer(path.fonts.dest))
    .pipe(woff())
    .pipe(gulp.dest(path.fonts.dest))
}

//to woff2
const toWoff2 = () => {
  return gulp.src(path.fonts.src)
    .pipe(newer(path.fonts.dest))
    .pipe(woff2())
    .pipe(gulp.dest(path.fonts.dest))
}

//вотчер
const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  })

  gulp.watch(path.html.dest).on('change', browserSync.reload)
  gulp.watch(path.html.src, html)
  gulp.watch(path.styles.src, styles)
  gulp.watch(path.js.src, scripts)
  gulp.watch(path.images.src, img)
  gulp.watch(path.svg.src, gulp.parallel(svg))
  gulp.watch(path.fonts.src, gulp.parallel(toWoff, toWoff2))
}

exports.svg = svg

exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img, svg, toWoff, toWoff2), watch)