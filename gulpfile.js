var requireDir = require('require-dir');
requireDir('./gulp/', { recurse: true });

var gulp = require('gulp-help')(require('gulp')),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    uncss = require('gulp-uncss');

gulp.task('js', function() {
    gulp.src([
            './external/js/wow.min.js',
            './external/js/script-animations.js',
            './external/js/script.js',
            './external/js/main.js',
            './external/js/g.js',
            './external/js/bootstrap.js',
            './external/js/style_func.js',
            './external/js/cookie-policy.js'
        ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./external/js/'));
});

gulp.task('css', function () {
    return gulp.src([
            './external/css/normalize.css',
            './external/css/form.css',
            './external/css/animate.min.css',
            './external/css/font-awesome.min.css',
            './external/css/carousel.css',
            './external/css/main.css',
    ])
        .pipe(concatCss("main.min.css"))
        .pipe(cssnano())
        .pipe(gulp.dest('./external/css/'));
});

gulp.task('amp-js', function() {
    gulp.src([
        './lib/jquery/jquery-2.0.3.min.js',
        './external/js/bootstrap.js',
        './external/js/jquery.jcarousellite.min.js',
        './external/js/wow.min.js',
        './js/ApiKey.js',
        './external/js/main.js',
        './external/js/style_func.js',
        './external/js/script.js',
        './external/js/script-animations.js'
    ])
        .pipe(concat('amp-script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./external/js/'));
});

gulp.task('amp-css', function () {
    return gulp.src([
        './external/css/amp/main.css',
        './external/css/normalize.css',
        './external/css/amp/form.css',
        './external/css/amp/bootstrap-amp.css'
    ])
        .pipe(concatCss("main.min.css"))
        .pipe(cssnano())
        .pipe(gulp.dest('./external/css/amp/'));
});

gulp.task('uncss', function () { // removes unused css classes (if there is no DOM node with a certain class, this css class will be removed)
    return gulp.src([
        './external/css/amp/form.css'
    ])
        .pipe(uncss({
            html: ['amp.html', './external/ru/amp.html', 'http://127.0.0.1/ru/amp.html']
        }))
        .pipe(concatCss("form.css"))
        .pipe(gulp.dest('./external/css/amp/'));
});
