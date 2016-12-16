'use strict';

var del = require('del');
var gulp = require('gulp');
var yargs = require('yargs');
var stylish = require('jshint-stylish');
var plugins = require('gulp-load-plugins')();
var tasklist = require('gulp-task-listing');
var autoprefixer = require('autoprefixer');

// read package.json
var pkg = require('./package.json');

var gconf = {
  src: {
    root: 'src/',
    index: 'src/index.html',
    styles: 'src/sass/**/*.scss',
    scripts: {
      all: 'src/**/*.js',
      main: 'src/app.js'
    },
    templates: 'src/**/*.html'
  },
  dist: {
    all: 'dist/**/*',
    root: 'dist/',
    index: 'index.html',
    styles: {
      root: 'dist/styles/',
      app: 'app.min.css',
      lib: 'lib.min.css'
    },
    scripts: {
      root: 'dist/scripts/',
      app: 'app.min.js',
      lib: 'lib.min.js'
    }
  }
};

gulp.task('clean', function () {
  return del([gconf.dist.all]);
});

gulp.task('copy:html', function () {
  gulp.src([gconf.src.templates, gconf.src.index]).pipe(gulp.dest(gconf.dist.root));
});

gulp.task('css:libs', function () {
  gulp.src([])
      .pipe(plugins.concat(gconf.dist.styles.lib))
      .pipe(gulp.dest(gconf.dist.styles.root));
});

gulp.task('css:dist', function () {
 return gulp.src([gconf.src.styles])
            .pipe(plugins.sass({outputStyle: 'compressed'}))
            .pipe(plugins.postcss([
              autoprefixer({browsers: ['last 2 version']})]
            ))
            .pipe(plugins.concat(gconf.dist.styles.app))
            .pipe(gulp.dest(gconf.dist.styles.root));
});


gulp.task('jshint', function () {
  return gulp.src([gconf.src.scripts.all])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('js:libs', function () {
  return gulp.src([],
                   {cwd: 'bower_components'})
    .pipe(plugins.concat(gconf.dist.scripts.lib))
    .pipe(gulp.dest(gconf.dist.scripts.root));
});

gulp.task('js:dist', function () {
  return gulp.src([gconf.src.scripts.main])
    .pipe(plugins.concat(gconf.dist.scripts.app))
    .pipe(plugins.uglify({compress: true, mangle: true}))
    .pipe(gulp.dest(gconf.dist.scripts.root));
});

gulp.task('webserver', function () {
  gulp.src(gconf.dist.root)
      .pipe(plugins.webserver({
        port: 9000,
        livereload: true
      }));
});

gulp.task('watch', function () {
  gulp.watch([gconf.src.index], ['copy:html']);
  gulp.watch([gconf.src.styles], ['css:dist']);
  gulp.watch([gconf.src.scripts.all], ['jshint', 'js:dist']);
  gulp.watch([gconf.src.templates], ['copy:html']);
  gulp.watch(['Gulpfile.js'], ['build']);
});

gulp.task('js', ['jshint', 'js:dist']);
gulp.task('css', ['css:dist']);
gulp.task('html', ['copy:html']);
gulp.task('build', ['js', 'css', 'html']);
gulp.task('serve', ['build', 'webserver', 'watch']);
gulp.task('default', ['build']);
gulp.task('help', tasklist);
