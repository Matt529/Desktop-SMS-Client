var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore');

var jsGlob = './app/scripts/src/**/*.js';
var jsDest = './app/scripts/min';

var cssGlob = './app/css/src/**/*.css';
var cssDest = './app/css/min';

gulp.task('clean', function() {
  return gulp.src(jsDest + '/**/*.min.js', {read: false})
  .pipe(rimraf());
});

gulp.task('hint', function() {
  return gulp.src(jsGlob)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('minjs', ['hint'], function() {
    gulp.src(jsGlob)
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(jsDest));
});

gulp.task('styles', ['clean'], function() {
  gulp.src(cssGlob)
  .pipe(minifycss())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(cssDest));
});

gulp.task('build', ['minjs', 'styles'])

gulp.task('watch', function() {
  gulp.watch([cssGlob], ['styles']);
  gulp.watch([jsGlob], ['minjs']);
});

gulp.task('default', ['minjs', 'styles', 'watch']);
