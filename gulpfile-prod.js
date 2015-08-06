'use strict';

var gulp = require('gulp');
var marked = require('gulp-marked');

var models = require('./models');

gulp.task('start', ['build'], function() {
    // Create the database tables and start the server
    models.sequelize.sync().then(function() {
        require('bin/www').exec();
    });
});

gulp.task('build', ['build:readme-html']);

gulp.task('build:readme-html', function() {
    return gulp.src('README.md')
        .pipe(marked())
        .pipe(gulp.dest('views/includes'));
});
