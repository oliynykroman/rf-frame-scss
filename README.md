# rf-frame-scss

Gulp 4 configuration file and scss mixins library (without leagacy grids, unused flex settings). 
Is fully compatible with MAC M1 chip

If needed old version with grid generator with grid visualiser, flex, and compatibility with IE10 fetaure please use.

[Rf-frame-scss](https://github.com/oliynykroman/rf-frame-scss)

Added responsive images generation with shared picture element

## Settings

## Image sprites
1. Define source files and builded files path in  settings.src: and settings.build :
2. Set next properties in settings.js to true:
    ```
    isSprite_RASTER: false, // set true if you need only raster sprites
    isSprite_VECTOR: false  // set true if you need only vector sprites
    sprite_png: path for raster sprites image 
    sprite_svg: path for vector sprites image 
    ```
## Responsive images
1. Define source files and builded files path in  settings.src: and settings.build :
2. Set array of sizes and image quality fo generated images in settings.js:
```
   responsiveImage: {
        formats: [
            // jpeg
            {width: 640, format: "jpeg", rename: {suffix: "-sm"}},
            {width: 768, format: "jpeg", rename: {suffix: "-md"}},
            {width: 1024, format: "jpeg", rename: {suffix: "-lg"}},
            // webp
            {width: 640, format: "webp", rename: {suffix: "-sm"}},
            {width: 768, format: "webp", rename: {suffix: "-md"}},
            {width: 1024, format: "webp", rename: {suffix: "-lg"}},
            // avif
            {width: 640, format: "avif", rename: {suffix: "-sm"}},
            {width: 768, format: "avif", rename: {suffix: "-md"}},
            {width: 1024, format: "avif", rename: {suffix: "-lg"}},
        ],
    }
```
2. Input image should be *.jpg
2. Output: array of *.webp (filename-${size.width}.webp) and original *.jpg  (filename.jpg) 
3. Prepare your image .html
Example:
```
<picture>
    <source srcset="assets/@@name-320.webp 1x, assets/@@name-320.webp 2x" media="(max-width: 320px)" type="image/webp">
    <source srcset="assets/@@name-480.webp 1x, assets/@@name-480.webp 2x" media="(max-width: 480px)" type="image/webp">
    <source srcset="assets/@@name-800.webp 1x, assets/@@name-800.webp 2x" media="(min-width: 800px)" type="image/webp">
    <img src="assets/@@name.jpg" alt="">
</picture>
```
4. Include image html:
Example:
```
@@include('picture.html', {"name":"example"})
```

## Fonts:
Font face mixins:
```
@mixin font-face($name, $path, $weight: null, $style: null, $exts: eot woff ttf svg)
@mixin calc-font-size($min-vw, $max-vw, $min-font-size, $max-font-size)
```
Font size based on viewport:
```
@mixin calc-font-size($min-vw, $max-vw, $min-font-size, $max-font-size) 
```

## File Include
File include based on  [gulp-file-include](https://www.npmjs.com/package/gulp-file-include): 
Settings
```
  prefix: '@@', // prefix for file include 
  basepath: 'app/template' // base path to all includes
```
Example 
```
    @@include('head.html')  // inlude file
    <!-- @@loop('PATH TO FILE', '/template/JSON FILE NAME') --> //include file with custom JSON data
```

## Lunch
```
npm install
```
```
gulp
```
## Testing
Based on [BackstopJS](https://github.com/garris/BackstopJS): 
1. Install BackstopJS
    ```
    npm install -g backstopjs
    ```

2. Init config:
    ```
    backstop init
    ```

3. Test:
    ```
    backstop test
    backstop approve
    ```
