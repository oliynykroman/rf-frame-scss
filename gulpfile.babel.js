
import { settings } from './settings.js';

const gulp = require('gulp');
const plumber = require('gulp-plumber');

// sass
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
sass.compiler = require('node-sass');

// html injector html, svg
const fileinclude = require('gulp-file-include');
const injectSvg = require('gulp-inject-svg');
const injectSvgOptions = { base: '/app/' };

// js, json min
const uglify = require('gulp-uglify');
const jsonminify = require('gulp-jsonminify');

// image min
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageResize = require("gulp-image-resize");
var $ = require('gulp-load-plugins')();

//png, jpeg, svg sprites
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const buffer = require('vinyl-buffer');
const svgSprite = require("gulp-svg-sprites");

// browser sync
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Responsive images generator
const responsiveImages = () => {
    let stream;
    settings.responsiveImage.sizes.forEach(size => {
        stream = gulp.src(settings.src.responsive)
            .pipe(
                $.responsive({
                    '*.jpg': [
                        {
                            width: size.width,
                            format: 'webp',
                            rename: { suffix: `-${size.width}` }
                        }
                    ],
                },
                    {
                        // Global configuration for all images
                        // The output quality for JPEG, WebP and TIFF output formats
                        quality: size.quality,
                        // Use progressive (interlace) scan for JPEG and PNG output
                        progressive: true,
                        // Strip all metadata
                        withMetadata: false
                    }
                )
            )
            .pipe(gulp.dest(settings.build.assets));
    });
    return stream;
}
exports.responsiveImages = responsiveImages;

const scss = () => {
    return gulp.src(settings.src.style)
        .pipe(plumber())
        .pipe(sass(
            { outputStyle: settings.compress_Css }
        ))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer({ grid: settings.legacyGrid }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(settings.build.css))
        .pipe(browserSync.stream());
}

exports.scss = scss;

//move css form folder css (normalize plugin required css)
const cleanCss = () => {
    return gulp.src(settings.src.cleanCss)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.cleanCss))
        .pipe(browserSync.stream());
}
exports.cleanCss = cleanCss;

//move html and integrate SVG
const html = () => {
    return gulp.src(settings.src.html)
        .pipe(plumber())
        // .pipe(rigger())
        .pipe(fileinclude(settings.htmlInlcudeSettings))
        .pipe(injectSvg(injectSvgOptions))
        .pipe(gulp.dest(settings.build.html))
        .pipe(browserSync.stream());
}
exports.html = html;

//js
const jsMinify = () => {
    return gulp.src(settings.src.js)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(settings.build.js))
        .pipe(browserSync.stream());
}
exports.jsMinify = jsMinify;

//json
const jsonMinify = () => {
    return gulp.src(settings.src.json)
        .pipe(plumber())
        .pipe(jsonminify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(settings.build.json));

}
exports.jsonMinify = jsonMinify;

// minify images
const imageMinify = () => {
    return gulp.src(settings.src.img)
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest(settings.build.img));
}
exports.imageMinify = imageMinify;

// move addititional files
const assets = () => {
    return gulp.src(settings.src.assets)
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest(settings.build.assets));
}
exports.assets = assets;

// favicons folder
const favicons = () => {
    return gulp.src(settings.src.favicons)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.favicons))
        .pipe(browserSync.stream());
}
exports.favicons = favicons;

// ico move
const ico = () => {
    return gulp.src(settings.src.ico)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.ico))
        .pipe(browserSync.stream());
}
exports.ico = ico;

// folder fonts move
const fonts = () => {
    return gulp.src(settings.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(settings.build.fonts))
        .pipe(browserSync.stream());
}
exports.fonts = fonts;

const watch = () => {
    gulp.watch(settings.src.style, scss);
    gulp.watch(settings.src.cleanCss, cleanCss);
    gulp.watch(settings.src.html, html);
    gulp.watch(settings.src.js, jsMinify);
    gulp.watch(settings.src.json, jsonMinify);
    gulp.watch(settings.src.responsive, responsiveImages);
    gulp.watch(settings.src.img, imageMinify);
    gulp.watch(settings.src.assets, assets);
    gulp.watch(settings.src.favicons, favicons);
    gulp.watch(settings.src.ico, ico);
    gulp.watch(settings.src.fonts, fonts);
    if (!settings.isProxy) {
        return browserSync.init(settings.browser_sync, {
            server: {
                baseDir: settings.build.html
            },
            port: settings.port
        });
    } else {
        // if proxy already have server
        return browserSync.init({
            proxy: {
                target: settings.isProxy_path
            },
            port: settings.port
        });
    }
}
exports.watch = watch;

exports.default = gulp.series(
    gulp.parallel(
        scss,
        cleanCss,
        html,
        jsMinify,
        jsonMinify
    ),
    gulp.parallel(
        responsiveImages,
        imageMinify,
        assets,
        favicons,
        ico,
        fonts),
    gulp.parallel(
        watch)
);