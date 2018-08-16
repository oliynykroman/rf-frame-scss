var gulp = require('gulp');
var plumber = require('gulp-plumber'); //errors check

// compile sass plugins
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


// browser sync
var browserSync = require('browser-sync').create();
reload = browserSync.reload;

// svg injector
var injectSvg = require('gulp-inject-svg');
// paTH MUST BE ABSOLUTE fSO WE NNED TO ADD PATH TO APP
var injectSvgOptions = {base: '/app/'};


// image min
const imagemin = require('gulp-imagemin');
// compile compressed scss
gulp.task('sass', function () {
    return gulp.src('app/scss/css.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            {outputStyle: 'compressed'}
        ))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer({browsers: ['last 3 version', '> 5%']}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream: true}));
});

//move html and integrate SVG
gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(injectSvg(injectSvgOptions))
        .pipe(gulp.dest('build/'))
        .pipe(reload({stream: true}));
});

gulp.task('imagemin', () =>
    gulp.src('app/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('build/images'))
);

gulp.task('fonts', () =>
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('build/fonts'))
);

// browser-sync
gulp.task('browser-sync', function () {
    browserSync.init(["css/*.css", "js/*.js"], {
        server: {
            baseDir: "build/"
        }
    });
});

// task watcher
gulp.task("default", ['sass', 'html', 'imagemin', 'fonts', 'browser-sync'], function () {
    gulp.watch('app/scss/*.scss', ['sass', 'html']);
});