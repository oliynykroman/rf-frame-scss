
let settings = {

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

    //clean bulded folder
    clean: '/build',

    //build raster or/and vectro sprites, in main scss should be uncommented sprite css
    isSprite_RASTER: true,
    isSprite_VECTOR: false,

    //scss compilation settings
    compress_Css: 'expanded', //'compressed', 'nested', 'expanded',
    legacyGrid: true,

    //browser sync settings
    browser_sync: 'app/**/*.*',
    isProxy: false,//used when have local server instead browsersunc server
    isProxy_path: 'http://your full URL', //when local server used instead browsersync

}

export { settings };