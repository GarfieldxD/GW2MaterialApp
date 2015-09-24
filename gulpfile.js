// Include gulp
var gulp = require('gulp');
var wiredep = require('wiredep');
// Define base folders
var src = 'app/';
var dest = 'build/';
// Include plugins
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});


// Concatenate & Minify JS
gulp.task('scripts', function () {
  return gulp.src(src + 'js/**/*.js')
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dest + 'js'));
});

//webserver
gulp.task('webserver', function () {
  gulp.src(src)
    .pipe(plugins.serverLivereload({
      livereload: true,
      open: true
    }));
});

gulp.task('vendor-scripts', function () {
  gulp.src(wiredep().js)
    .pipe(gulp.dest(src + 'vendor'));
});

gulp.task('vendor-css', function () {
  gulp.src(wiredep().css)
    .pipe(gulp.dest(src + 'vendor'));
});

gulp.task('my-files', function () {
  gulp.src(['app/modules/**/*.js', 'app/modules/**/*.html'])
    .pipe(gulp.dest('./build/modules'));
  gulp.src(['app/content/**/*.*'])
    .pipe(gulp.dest('./build/content'));
  gulp.src(['app/layout.html'])
    .pipe(gulp.dest('./build/'));

});

gulp.task('index-dev', function () {
  gulp.src('app/index.html')
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function (filePath) {
              return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function (filePath) {
              return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
            }
          }
        }
      }
    }))
    .pipe(plugins.inject(
      gulp.src([src + 'content/**/*.css'], { read: false }), {
        addRootSlash: false,
        transform: function (filePath, file, i, length) {
          return '<link rel="stylesheet" href="' + filePath.replace('app/', '') + '"/>';
        }
      }))
    .pipe(plugins.inject(
      gulp.src([src + 'modules/**/*.js'], { read: true }).pipe(plugins.angularFilesort()), {
        name:'modules',
        addRootSlash: false,
        transform: function (filePath, file, i, length) {
          return '<script src="' + filePath.replace('app/', '') + '"></script>';
        }
      }))
    .pipe(plugins.inject(
      gulp.src([src + 'js/**/*.js'], { read: false }), {
        name:'main',
        addRootSlash: false,
        transform: function (filePath, file, i, length) {
          return '<script src="' + filePath.replace('app/', '') + '"></script>';
        }
      }))
    .pipe(gulp.dest(src));
});

gulp.task('dev', ['vendor-css','vendor-scripts','index-dev', 'webserver']);
