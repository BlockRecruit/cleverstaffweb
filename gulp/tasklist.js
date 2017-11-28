//
// Gulp & plugins init
var gulp    = require('gulp-help')(require('gulp')),
	plugins = require('gulp-load-plugins')();

plugins.runSequence = require('run-sequence');

var cfg = require('../gulpconfig.js')();

// Init Default gulp task
gulp.task('scripts', 'Run all builds', function (done) {
	plugins.runSequence('styles', 'scripts', function () {
		// console.log('Run something else');
		done();
	});
});
