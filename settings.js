
let settings = {
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
}

export { settings };