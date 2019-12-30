"use strict"

const gulp = require('gulp');
const plumber = require('gulp-plumber');

// sass
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
sass.compiler = require('node-sass');

// html injector html, svg
const rigger = require('gulp-rigger');
const injectSvg = require('gulp-inject-svg');
const injectSvgOptions = { base: '/app/' };

// js, json min
const uglify = require('gulp-uglify');
const jsonminify = require('gulp-jsonminify');

// image min
const imagemin = require('gulp-imagemin');

//png, jpeg, svg sprites
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer');
const svgSprite = require("gulp-svg-sprites");

// browser sync
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

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
        style: ['app/scss/*.scss'],
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
    compress_Css: 'expanded', //'compressed', 'nested', 'expanded'

    // browser sync settings
    browser_sync: 'app/**/*.*',
    isProxy: false,//used when have local server instead browsersunc server
    isProxy_path: 'http://your full URL', //when local server used instead browsersync
    // sprite settings
    isSprite_RASTER: false,
    isSprite_VECTOR: false,
};

// compile  sass into css
function scss() {
    return gulp.src(settings.src.style)
        .pipe(plumber())
        .pipe(sass(
            { outputStyle: settings.compress_Css }
        ))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer({ grid: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(settings.build.css))
        .pipe(reload({ stream: true }));
}

//move css
function cleanCss() {
    return gulp.src(settings.src.cleanCss)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.cleanCss))
        .pipe(reload({ stream: true }));
}

//move html and integrate SVG
function html() {
    return gulp.src(settings.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(injectSvg(injectSvgOptions))
        .pipe(gulp.dest(settings.build.html))
        .pipe(reload({ stream: true }));

}

//move js
function jsMinify() {
    return gulp.src(settings.src.js)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(settings.build.js))
        .pipe(reload({ stream: true }));
}
//minify json
function jsonMinify() {
    return gulp.src(settings.src.json)
        .pipe(plumber())
        .pipe(jsonminify())
        .pipe(rename({
            suffix: '.min.json'
        }))
        .pipe(gulp.dest(settings.build.json));
}
// minify images
function imageMinify() {
    return gulp.src(settings.src.img)
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]));
}

//sprites generator
function imageRasterSprites(cb) {
    // raster (PNG, JPG) images
    if (settings.isSprite_RASTER) {
        let spriteData = gulp.src(settings.src.sprite_png)
            .pipe(spritesmith({
                imgName: settings.build.sprite_image_name,
                cssName: 'sprite.css'
            }));
        let imgStream = spriteData.img
            .pipe(imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 })
            ]))
            .pipe(gulp.dest(settings.build.img))
        let cssStream = spriteData.css
            .pipe(gulp.dest(settings.build.sprite_css));
        return merge(imgStream, cssStream);
    }
    cb();
}
function imageVectorSprites(cb) {
    // vector images SVG
    if (settings.isSprite_VECTOR) {
        return gulp.src(settings.src.sprite_svg)
            .pipe(plumber())
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
            .pipe(gulp.dest(settings.build.img))
            .pipe(reload({ stream: true }));
    }
    cb();
}

// move addititional files
function assets() {
    return gulp.src(settings.src.assets)
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest(settings.build.assets))
        .pipe(reload({ stream: true }));
}

// favicons folder
function favicons() {
    return gulp.src(settings.src.favicons)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.favicons))
        .pipe(reload({ stream: true }));
}

// ico move
function ico() {
    return gulp.src(settings.src.ico)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.ico))
        .pipe(reload({ stream: true }));
}

// folder fonts move
function fonts() {
    return gulp.src(settings.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.fonts))
        .pipe(reload({ stream: true }));
}

// browser-sync
function browser_sync(cb) {
    if (!settings.isProxy) {
        return browserSync.init(settings.browser_sync, {
            server: {
                baseDir: "build/"
            }
        });
    } else {
        // if proxy already have server
        return browserSync.init({
            proxy: {
                target: settings.isProxy_path,
            }
        });
    }
    cb();
}

function watch() {
    gulp.watch(settings.src.style, scss);
    gulp.watch(settings.src.cleanCss, cleanCss);
    gulp.watch(settings.src.html, html);
    gulp.watch(settings.src.js, jsMinify);
    gulp.watch(settings.src.json, jsonMinify);
    gulp.watch(settings.src.img, imageMinify);
    gulp.watch(settings.src.sprite_png, imageRasterSprites);
    gulp.watch(settings.src.sprite_svg, imageVectorSprites);
    gulp.watch(settings.src.assets, assets);
    gulp.watch(settings.src.favicons, favicons);
    gulp.watch(settings.src.ico, ico);
    gulp.watch(settings.src.fonts, fonts);
}
// exports.build = gulp.parallel(scss, cleanCss, html, jsMinify, jsonMinify, imageMinify, imageRasterSprites, imageVectorSprites, assets, favicons, ico, fonts);
// exports.default = function () {
//     watch('app/**/*.*', { events: 'all' }, function (cb) {
//         console.log('fdsfdsf');
//         cb();
//     })
// }
gulp.task('default', gulp.series(scss, cleanCss, html, jsMinify, jsonMinify, imageMinify, imageRasterSprites, imageVectorSprites, assets, favicons, ico, fonts, watch, browser_sync));