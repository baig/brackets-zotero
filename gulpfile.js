/*jslint vars: true */
/*global require */

var gulp = require('gulp');
var noop = function () {
    "use strict";
};

gulp.task('lint', function () {
    "use strict";
    /* style and lint errors */
    var jscs = require('gulp-jscs');
    var jshint = require('gulp-jshint');
    var stylish = require('gulp-jscs-stylish');

    gulp.src(['./main.js', 'src/**/*.js', '!src/thirdparty/**/*.js'])
        .pipe(jshint()) // hint
        .pipe(jscs()) // enforce style guide
        .on('error', noop) // don't stop on error
        .pipe(stylish.combineWithHintResults()) // combine with jshint results
        .pipe(jshint.reporter('jshint-stylish')); // use any jshint reporter to log hint and style guide errors
});

gulp.task('default', ['lint']);
