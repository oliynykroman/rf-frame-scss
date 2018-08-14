var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// compile compressed scss
gulp.task('sass', function(){
    return gulp.src('app/scss/rf-scss.scss')
        .pipe(sass(
            {outputStyle: 'compressed'}
        ).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
});

gulp.task("default", ['sass']);