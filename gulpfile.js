'use stricy'
const gulp = require('gulp');
const plumber = require('gulp-plumber'); //errors check
let watch = require('gulp-watch');

// compile sass plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// browser sync
const browserSync = require('browser-sync').create();
reload = browserSync.reload;

// svg injector
const injectSvg = require('gulp-inject-svg');
// paTH MUST BE ABSOLUTE fSO WE NNED TO ADD PATH TO APP
let injectSvgOptions = {base: '/app/'};

// image min
const imagemin = require('gulp-imagemin');


// compile compressed scss
gulp.task('sass', function () {
    return gulp.src(['app/scss/css.scss', 'app/scss/*.css'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(
            // {outputStyle: 'compressed'}
        ))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer({browsers: ['last 3 version', '> 1%'], grid:true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream: true}));
});

//move html and integrate SVG
gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(injectSvg(injectSvgOptions))
        .pipe(gulp.dest('build/'))
        .pipe(reload({stream: true}));
});

//move js
gulp.task('js', function () {
    gulp.src('app/js/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('build/js'))
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
gulp.task('build', [
    'html',
    'js',
    'sass',
    'imagemin',
    'fonts',
]);

gulp.task('watch', function(){
    watch(['app/*.html'], function(event, cb) {
        gulp.start('html');
    });
    watch(['app/scss/*.scss', 'app/scss/*.css'], function(event, cb) {
        gulp.start('sass');
    });
    watch(['app/js/*.js'], function(event, cb) {
        gulp.start('js');
    });
    watch(['app/images/*'], function(event, cb) {
        gulp.start('imagemin');
    });
    watch(['app/fonts/*'], function(event, cb) {
        gulp.start('fonts');
    });
});


// browser-sync
gulp.task('browser-sync', function () {
    browserSync.init(["css/*.css", "js/*.js", "*.html"], {
        server: {
            baseDir: "build/"
        }
    });
});
// task watcher
gulp.task('default', ['build', 'watch', 'browser-sync']);
