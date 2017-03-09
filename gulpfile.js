// == Constants ==
const paths = {
  root: './',
  source: './src/',
  artifact: './dist/'
};
const annasalt = 'whatamidoing';

// == Plugins ==
const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const bower = require('gulp-bower');
const replace = require('gulp-replace');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const sha512 = require('crypto-js/sha512');
const aes = require('crypto-js/aes');

// == Global vars ==
let annalytics = '{}';
var annalytics_scripts = '';

// == Tasks ==
gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: paths.artifact
  });
  gulp.watch(paths.root + '/bower.json', ['bower-watch']);
  gulp.watch(paths.root + '/private/answers.json', ['annalytics', 'js']);
  gulp.watch(paths.source + '/style/*.scss', ['css']);
  gulp.watch(paths.source + '/scripts/*.js', ['js']);
  gulp.watch(paths.source + '/*.html', ['html']);
  gulp.watch(paths.source + '/images/*', ['images']);
});

gulp.task('build', ['html', 'css', 'js', 'images', 'bower']);
gulp.task('default', ['build']);

gulp.task('bower', () => {
  return bower();
});

gulp.task('bower-watch', ['bower'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('css', () => {
  return gulp.src(paths.source + '/style/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.artifact + '/style'))
    .pipe(browserSync.stream());
});

gulp.task('js', ['annalytics'], () => {
  return gulp.src(paths.source + '/scripts/*.js')
    .pipe(replace('__ANNALYTICS__', annalytics))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(paths.artifact + '/scripts'))
    .pipe(browserSync.stream());
});

gulp.task('html', ['annalytics'], () => {
  return gulp.src(paths.source + '/*.html')
    .pipe(replace('<!-- vim: set et ts=2 sw=2: -->', annalytics_scripts))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.artifact))
    .pipe(browserSync.stream())
});

gulp.task('images', () => {
  return gulp.src(paths.source + '/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.artifact + '/images'))
    .pipe(browserSync.stream());
});

gulp.task('annalytics', (done) => {
  fs.readFile('private/answers.json', 'utf8', (err, data) => {
    if (err) {
      annalytics = '{}';
      annalytics_scripts = '';
    } else {
      let clear = JSON.parse(data);
      let encoded = {};
      for (let key in clear) {
        if (key.startsWith('=')) {
          continue;
        }
        let encodedKey = sha512(key + annasalt).toString();
        let encodedAnswer = aes.encrypt(clear[key], key).toString();
        encoded[encodedKey] = encodedAnswer;
      }
      annalytics = JSON.stringify(encoded);
      annalytics_scripts = `
        <script defer src="components/crypto-js/crypto-js.js"></script>
        <script defer src="scripts/annalytics.js"></script>
      `;
    }
    done();
  });
});

// vim: set et ts=2 sw=2: 
