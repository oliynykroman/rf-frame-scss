"use strict"
const gulp = require('gulp');
const watch = require('gulp-watch');

// compile sass plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// browser sync
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// svg injector
const injectSvg = require('gulp-inject-svg');
// settings must be absolute
const injectSvgOptions = {base: '/app/'};

// image min
const imagemin = require('gulp-imagemin');

//png, jpeg, svg sprites
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer');
const svgSprite = require("gulp-svg-sprites");

// js, json min
const uglify = require('gulp-uglify');
const jsonminify = require('gulp-jsonminify');


const settings = {
    build: { //prod
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        cleanCss: 'build/css/',
        sprite_css: 'app/_scss-vars/',
        sprite_image_name: '../images/sprite.png',
        img: 'build/images/',
        fonts: 'build/fonts/',
        json: 'build/json/',
        assets: 'build/assets/',
        favicons: 'build/favicons/',
        ico: 'build/',
    },
    src: { //develop
        html: ['app/*.html'],
        js: 'app/js/*.js',
        style: ['app/scss/css.scss'],
        cleanCss: ['app/css/*.css'],
        img: 'app/images/*.*',
        sprite_png: 'app/images/sprites/**/*.{png,jpg}',
        sprite_svg: 'app/images/sprites/**/*.svg',
        fonts: 'app/fonts/**/*.*',
        json: 'app/json/*.json',
        assets: 'app/assets/**/*.*',
        favicons: 'app/favicons/**/*.*',
        ico: 'app/*.ico',
    },
    clean: '/build',

    //compress files
    compress_Css:'expanded', //'compressed', 'nested', 'expanded'

    // browser sync settings
    browser_sync: 'app/**/*.*',
    isProxy: false,//used when have local server instead browsersunc server
    isProxy_path: 'http://your full URL', //when local server used instead browsersync
    // sprite settings
    isSprite_RASTER: false,
    isSprite_VECTOR: false,
};

// compile  scss
gulp.task('sass', settings.isSprite ? ['sprite'] : [], function () {
    return gulp.src(settings.src.style)
        .pipe(sass(
            {outputStyle: settings.compress_Css}
        ))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer({browsers: ['last 4 version', '> 1%'], grid: false}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(settings.build.css))
        .pipe(reload({stream: true}));
});
//move html and integrate SVG
gulp.task('html', function () {
    gulp.src(settings.src.html)
        .pipe(injectSvg(injectSvgOptions))
        .pipe(gulp.dest(settings.build.html))
        .pipe(reload({stream: true}));
});
//move css
gulp.task('css', function () {
    gulp.src(settings.src.cleanCss)
        .pipe(gulp.dest(settings.build.cleanCss))
        .pipe(reload({stream: true}));
});
//move js
gulp.task('js', function () {
    gulp.src(settings.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(settings.build.js))
        .pipe(reload({stream: true}));
});
//minify json
gulp.task('json', function () {
    gulp.src(settings.src.json)
        .pipe(jsonminify())
        .pipe(gulp.dest(settings.build.json))
        .pipe(reload({stream: true}));
});
// minify images
gulp.task('imagemin', function () {
    gulp.src(settings.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(settings.build.img))
});
//sprites generator
gulp.task('sprite', function () {
    // raster (PNG, JPG) images
    if (settings.isSprite_RASTER) {
        var spriteData = gulp.src(settings.src.sprite_png)
            .pipe(spritesmith({
                imgName: settings.build.sprite_image_name,
                cssName: 'sprite.css'
            }));
        var imgStream = spriteData.img
            .pipe(buffer())
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5})
            ]))
            .pipe(gulp.dest(settings.build.img));
        var cssStream = spriteData.css
            .pipe(gulp.dest(settings.build.sprite_css));
        return merge(imgStream, cssStream);
    }
    // vector images SVG
    if (settings.isSprite_VECTOR) {
        return gulp.src(settings.src.sprite_svg)
            .pipe(svgSprite({
                    selector: "sp-svg-%f",
                    svg: {
                        sprite: "sprite.svg"
                    },
                    svgPath: "%f",
                    cssFile: "svg_sprite.css",
                    common: "sprite-svg"
                }
            ))
            .pipe(gulp.dest(settings.build.img));
    }
});

// move addititional files
gulp.task('assets', function () {
    gulp.src(settings.src.assets)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(settings.build.assets))
        .pipe(reload({stream: true}));
});
gulp.task('favicons', function () {
    gulp.src(settings.src.favicons)
        .pipe(gulp.dest(settings.build.favicons))
        .pipe(reload({stream: true}));
});
gulp.task('ico', function () {
    gulp.src(settings.src.ico)
        .pipe(gulp.dest(settings.build.ico))
        .pipe(reload({stream: true}));
});
gulp.task('fonts', function () {
    gulp.src(settings.src.fonts)
        .pipe(gulp.dest(settings.build.fonts))
        .pipe(reload({stream: true}));
});
// first build
gulp.task('build', [
    'html',
    'css',
    'js',
    'sprite',
    'sass',
    'imagemin',
    'assets',
    'favicons',
    'ico',
    'fonts',
    'json',
]);
// file watchers
gulp.task('watch', function () {
    watch(settings.src.html, function () {
        gulp.start('html');
    });
    watch(settings.src.cleanCss, function () {
        gulp.start('css');
    });
    watch(settings.src.sprite_png, function (event, cb) {
        gulp.start('sprite');
    });
    watch(settings.src.style, function (event, cb) {
        gulp.start('sass');
    });
    watch(settings.src.js, function (event, cb) {
        gulp.start('js');
    });
    watch(settings.src.img, function (event, cb) {
        gulp.start('imagemin');
    });
    watch(settings.src.assets, function (event, cb) {
        gulp.start('assets');
    });
    watch(settings.src.favicons, function (event, cb) {
        gulp.start('favicons');
    });
    watch(settings.src.ico, function (event, cb) {
        gulp.start('ico');
    });
    watch(settings.src.fonts, function (event, cb) {
        gulp.start('fonts');
    });
    watch(settings.src.json, function (event, cb) {
        gulp.start('json');
    });
});
// browser-sync
gulp.task('browser-sync', function () {
    if (!settings.isProxy) {
        browserSync.init(settings.browser_sync, {
            server: {
                baseDir: "build/"
            }
        });
    } else {
        // if proxy already have server
        browserSync.init({
            proxy: {
                target: settings.isProxy_path,
            }
        });
    }

});
// default build
gulp.task('default', ['build', 'watch', 'browser-sync']);