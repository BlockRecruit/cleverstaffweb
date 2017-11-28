var requireDir = require('require-dir');
requireDir('./gulp/', { recurse: true });

var gulp = require('gulp-help')(require('gulp')),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css');

gulp.task('js', function() {
    gulp.src([
            './external/js/script-animations.js',
            './external/js/script.js',
            './external/js/main.js',
            './external/js/g.js'
        ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./external/js/'));
});
gulp.task('css', function () {
    return gulp.src([
            './external/css/main.css',
            './external/css/form.css'
        ])
        .pipe(concatCss("main.min.css"))
        .pipe(cssnano())
        .pipe(gulp.dest('./external/css/'));
});