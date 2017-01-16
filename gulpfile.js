var _           = require('lodash');
var del         = require('del');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var runSequence   = require('run-sequence');
var webpackConfig = require('./webpack.config.js');

var paths = {
  src:   __dirname + '/src',
  dist:  __dirname + '/dist',
  bower: __dirname + '/bower_components'
};

var patterns = {
  js          : paths.src + '/app/**/*.@(js|jsx)',
  bower       : paths.bower + '/**/*.@(css|png|jpg|jpeg|tiff|gif|woff|woff2|ttf|otf|svg)',
  sass        : paths.src + '/app/**/*.scss',
  ngtemplates : paths.src + '/app/**/*.html',
  json        : paths.src + '/@(data|app)/**/*.json',
  data        : paths.src + '/data/**/*.!(json)',
  images      : paths.src + '/@(images|app)/**/*.@(png|gif|jpg|jpeg|tiff|svg)',
  fonts       : paths.src + '/fonts/**/*',
  html        : paths.src + '/*.html'
};

gulp.task('clean', function () {
  return del([paths.dist + '/**/*']);
});

gulp.task('json', function(){
  var dest = paths.dist;
  return gulp.src(patterns.json)
    .pipe($.newer(dest))
    // .pipe($.jsonminify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('data', function(){
  var dest = paths.dist + '/data';
  return gulp.src(patterns.data)
    .pipe($.newer(dest))
    .pipe(gulp.dest(dest));
});

gulp.task('fonts', function(){
  var dest = paths.dist + '/fonts';
  return gulp.src(patterns.fonts)
    .pipe($.newer(dest))
    .pipe(gulp.dest(dest));
});

gulp.task('html', function(){
  var dest = paths.dist;
  return gulp.src(patterns.html)
    .pipe($.newer(dest))
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('bower', function(){
  var dest = paths.dist + '/bower_components';
  return gulp.src(patterns.bower)
    .pipe($.newer(dest))
    .pipe(gulp.dest(dest));
});

gulp.task('images', function(){
  var dest = paths.dist;
  return gulp.src(patterns.images)
    .pipe($.newer(dest))
    .pipe($.imagemin())
    .pipe(gulp.dest(dest));
});

gulp.task('sass', function () {
  return gulp.src(patterns.sass)
    .pipe($.newer(paths.dist + '/app/main.css'))
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe(gulp.dest(paths.dist + '/app'));
});

gulp.task('ngtemplates', function () {
  return gulp.src(patterns.ngtemplates)
    .pipe($.newer(paths.dist + '/app/bundle.ngtemplates.js'))
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe($.ngTemplates({
      filename: 'bundle.ngtemplates.js',
      module: 'pulseTools',
      standalone: false
    }))
    .pipe(gulp.dest(paths.dist + '/app'));
});

var buildTasks = [
  'bower',
  'sass',
  'ngtemplates',
  'json',
  'data',
  'images',
  'fonts',
  'html'
];

gulp.task('build', function(done){
  runSequence('clean', buildTasks, done);
});

gulp.task('watch', ['build'], function(){
  buildTasks.forEach(function(task){
    gulp.watch(patterns[task], [task]);
  });
});

gulp.task('default', ['watch']);
