const settings = {
    //property contain object with settings where should be placed builded files
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        cleanCss: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/',
        json: 'build/json/',
        assets: 'build/assets/',
        favicons: 'build/favicons/',
        ico: 'build/',
    },

    //property contain object for start configuration
    src: {
        html: ['app/**/*.html', 'app/template/**/*.*'],
        js: 'app/js/*.js',
        style: ['app/scss/**/*.scss'],
        cleanCss: ['app/css/*.css'],
        img: 'app/images/*.*',
        sprite_png: 'app/images/sprites/**/*.{png,jpg}',
        sprite_svg: 'app/images/sprites/**/*.svg',
        fonts: 'app/fonts/**/*.*',
        json: 'app/json/*.json',
        assets: 'app/assets/**/*.*',
        responsive: 'app/responsive/**/*.{jpg,png}',
        favicons: 'app/favicons/**/*.*',
        ico: 'app/*.ico',
    },

    //responsive images sizes
    responsiveImage: {
        formats: [
            // jpeg
            {width: 640, format: "jpeg", rename: {suffix: "-sm"}},
            {width: 768, format: "jpeg", rename: {suffix: "-md"}},
            {width: 1440, format: "jpeg", rename: {suffix: "-lg"}},
            // webp
            {width: 640, format: "webp", rename: {suffix: "-sm"}},
            {width: 768, format: "webp", rename: {suffix: "-md"}},
            {width: 1440, format: "webp", rename: {suffix: "-lg"}},
            // avif
            {width: 640, format: "avif", rename: {suffix: "-sm"}},
            {width: 768, format: "avif", rename: {suffix: "-md"}},
            {width: 1440, format: "avif", rename: {suffix: "-lg"}},
        ],
    },

    //html Include settings
    htmlInlcludeSettings: {
        prefix: '@@',
        basepath: 'app'
    },

    //clean build folder
    clean: '/build',

    //build raster or/and vector sprites, in main scss should be uncommented sprite css
    isSprite_RASTER: false,
    isSprite_VECTOR: false,

    //scss compilation settings
    compress_Css: 'compressed', //'compressed', 'nested', 'expanded',
    legacyGrid: true,

    //browser sync settings
    browser_sync: 'app/**/*.*',
    isProxy: false,//used when have local server instead browserSync server
    isProxy_path: 'http://your full URL', //when local server used instead browserSync
    port: 3001

}

const gulp = require("gulp");
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const imagemin = require('gulp-imagemin');
const sharpResponsive = require("gulp-sharp-responsive");
const embedSvg = require('gulp-embed-svg');

const fileInclude = require('gulp-file-include');
const uglify = require('gulp-uglify');
const gulpJsonMinify = require('gulp-json-minify');

const browserSync = require('browser-sync').create();

const scss = () => {
    return gulp
        .src(settings.src.style)
        .pipe(plumber())
        .pipe(sass({outputStyle: settings.compress_Css}))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(
            rename({
                suffix: ".min",
            })
        )
        .pipe(gulp.dest(settings.build.css))
        .pipe(browserSync.stream());
}

const cleanCss = () => {
    return gulp
        .src(settings.src.cleanCss)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.cleanCss))
        .pipe(browserSync.stream());
};

//move html and integrate SVG
const html = () => {
    return (
        gulp
            .src(settings.src.html)
            .pipe(plumber())
            .pipe(fileInclude(settings.htmlInlcludeSettings))
            .pipe(embedSvg({
                root: './app/images',
                selectors: '.inline-svg'
            }))
            .pipe(gulp.dest(settings.build.html))
            .pipe(browserSync.stream())
    );
};

//js
const jsMinify = () => {
    return gulp
        .src(settings.src.js)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(
            rename({
                suffix: ".min",
            })
        )
        .pipe(gulp.dest(settings.build.js))
        .pipe(browserSync.stream());
};

//json
const jsonMinify = () => {
    return gulp
        .src(settings.src.json)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.json));
};

// Responsive images generator
const responsiveImages = (done) => {
    gulp
        .src(settings.src.responsive)
        .pipe(plumber())
        .pipe(sharpResponsive({
            includeOriginalFile: true,
            formats: settings.responsiveImage.formats
        }))
        .pipe(gulp.dest(settings.build.assets));
    done();
};

// minify images
const imageMinify = () => {
    return gulp
        .src(settings.src.img)
        .pipe(plumber())
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
            ])
        )
        .pipe(gulp.dest(settings.build.img));
};

// move additional files
const assets = () => {
    return gulp
        .src(settings.src.assets)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.assets));
};

// favicons folder
const favicons = () => {
    return gulp
        .src(settings.src.favicons)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.favicons))
        .pipe(browserSync.stream());
};

// ico move
const ico = () => {
    return gulp
        .src(settings.src.ico)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.ico))
        .pipe(browserSync.stream());
};

// folder fonts move
const fonts = () => {
    return gulp
        .src(settings.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.fonts))
        .pipe(browserSync.stream());
};

function watch() {
    gulp.watch(settings.src.style, scss);
    gulp.watch(settings.src.cleanCss, cleanCss);
    gulp.watch(settings.src.html, html);
    gulp.watch(settings.src.js, jsMinify);
    gulp.watch(settings.src.json, jsonMinify);
    gulp.watch(settings.src.assets, assets);
    gulp.watch(settings.src.favicons, favicons);
    gulp.watch(settings.src.ico, ico);
    gulp.watch(settings.src.fonts, fonts);
    gulp.watch(settings.src.responsive, responsiveImages);
    gulp.watch(settings.src.img, imageMinify);
    if (!settings.isProxy) {
        return browserSync.init(settings.browser_sync, {
            server: {
                baseDir: settings.build.html,
            },
            port: settings.port,
        });
    } else {
        // if proxy already have server
        return browserSync.init({
            proxy: {
                target: settings.isProxy_path,
            },
            port: settings.port,
        });
    }
}

exports.default = gulp.series(
    gulp.parallel(scss, cleanCss, html, jsMinify, jsonMinify),
    gulp.parallel(assets, favicons, ico, fonts),
    gulp.parallel(responsiveImages, imageMinify),
    gulp.parallel(watch)
);
