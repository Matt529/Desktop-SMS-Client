var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    rimrafGulp = require('gulp-rimraf'),
    electron = require('gulp-electron'),
    documentation = require('gulp-documentation'),
    ignore = require('gulp-ignore');

var rimraf = require('rimraf');
var exec = require('child_process').exec;
var util = require('util');

var jsGlob = './app/scripts/src/**/*.js';
var jsDest = './app/scripts/min';

var cssGlob = './app/css/src/**/*.css';
var cssDest = './app/css/min';

var packageJson = require('./package.json');
var electronVersion = packageJson.devDependencies['electron-prebuilt'];

var cmdTemplate = 'electron-packager . %s --out=releases/%s --platform=%s --arch=%s --version=%s --icon=assets/win/icon.ico --ignore="%s" --prune --overwrite'

// TODO See below, remove ignores generation and focus on keeping
// dependencies we need out of devDependencies (--prune will handle it)
var ignores = [];
for(var k in packageJson.dependencies)
  ignores.push(k);

function execCallback(cb) {
   return function(error, stdOut, stdErr) {
    console.log(stdOut);
    console.log(stdErr);
  };
}

function getIgnoreRegex() {
  // TODO Remove, temporary will stay. --prune worked better
  // return util.format('(node_modules/(?!%s))|(releases)|(packager)|(git)', ignores.join('|'));
  return '(releases)|(packager)|(git)';
}

function getWinBuildCommand(appName, ignoreRegexp) {
  return util.format(cmdTemplate, appName, 'win', 'win32', 'ia32', electronVersion, ignoreRegexp);
}

function getOsxBuildCommand(appName, ignoreRegexp) {
  return util.format(cmdTemplate, appName, 'osx', 'darwin', 'x64', electronVersion, ignoreRegexp);
}

// Start Tasks //

gulp.task('clean', function() {
  return gulp.src(jsDest + '/**/*.min.js', {read: false})
  .pipe(rimrafGulp());
});

gulp.task('clean-dist', function() {
  rimraf.sync('./releases/win', {maxBusyTries: 30});
  rimraf.sync('./releases/osx', {maxBusyTries: 30});
});

gulp.task('hint', function() {
  return gulp.src(jsGlob)
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
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

gulp.task('build', ['minjs', 'styles']);

// Build, Clean Dist and Run Packager Commands
gulp.task('dist', ['build', 'clean-dist'], function(cb) {
  exec(getWinBuildCommand('Desktop-SMS-Client', getIgnoreRegex()), execCallback(cb));
  exec(getOsxBuildCommand('Desktop-SMS-Client', getIgnoreRegex()), execCallback(cb));
});

// Observe globbed files for changes, execute given tasks when modified
gulp.task('watch', function() {
  gulp.watch([cssGlob], ['styles']);
  gulp.watch([jsGlob], ['minjs']);
});

gulp.task('docs', ['hint'], function() {
  gulp.src('./app/scripts/*.js')
  .pipe(ignore.exclude('.min.js'))
  .pipe(documentation({format:'html'}))
  .pipe(gulp.dest('./docs'));
});

// Executed when 'gulp' is executed. Goes into watch.
gulp.task('default', ['minjs', 'styles', 'watch']);
