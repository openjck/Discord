'use strict';

var child_process = require('child_process');

var gulp = require('gulp');
var beautify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var models;

var config = require('./lib/config');

var js = ['**/*.js', '!node_modules/**/*.js'];
var json = ['**/*.json', '!node_modules/**/*.json', '!tests/fixtures/**/*.json'];

gulp.task('beautify', ['beautify:javascript']);

gulp.task('beautify:javascript', function() {
    gulp.src(js.concat(json), {
            base: './'
        })
        .pipe(beautify({
            indentSize: 4,
            keepFunctionIndentation: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('test', ['test:jshint', 'test:mocha']);

gulp.task('test:jshint', function() {
    return gulp.src(js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Make the Mocha task depend on the JSHint task. Otherwise, the tasks will be
// run in parallel and will print to console simultaneously.
gulp.task('test:mocha', ['test:jshint'], function() {
    process.env.NODE_ENV = 'test';

    // Create a test database from scratch. The database needs to be created
    // before models are loaded.
    child_process.execSync('dropdb --if-exists ' + config('database'));
    child_process.execSync('createdb ' + config('database'));

    // Create the database tables and start the tests
    models = require('./models');
    models.sequelize.sync().then(function() {
        gulp.src('tests/tests.js')
            .pipe(mocha())
            .once('end', function() {
                process.exit();
            });
    });
});
