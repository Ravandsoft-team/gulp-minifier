const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


gulp.task('dev', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});
gulp.task('prod', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js'));
});

gulp.task('default', () => {
    gulp.src('src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));

    gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js'));
});
