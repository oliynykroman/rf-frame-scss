# rf-frame-scss

Gulp 4 configuration file and scss mixins library. 

Supports grid generation for older versions IE(11, 10), updated mixins. 
Added backstopJS for markup testing
Added responsive images generation with shared picture element

## Settings
All configs combined in settings.js

## Grid grid:) mixins + settings
1. Set to true 'legacyGrid' property in settings.js
2. Add "js/example-grid.min.js" to main index.html (this will generate html for example grids(for IE and older browsers))
    ```
    <script>
        var gridSettings = {
            columns: 12,
            gaps: true,
            customClass: 'box'
        }
    </script>
    ```
3. Import "../_scss-vars/grid"; to main SCSS file
    ```
        @mixin responsiveGrid(
        $gridPreviewColumns:12, // number of columns
        $showlegacyGrid: false, // show/hide example legacy grid 
        $screenSize:1280px, // define @media min-width
        $gridGap:30px, // set grid gaps for normal grid
        $normalGrid: 1fr repeat(12, minmax(0, 70px)) 1fr, // define grid for normal browser (new standart)
        $legacyGrid:1fr repeat(12, 30px minmax(0, 70px)) 30px 1fr, //define legacy grid for IE11 and browsers without repeat option support
        $ieNativeGrid: "1fr (30px minmax(0px, 70px))[12] 30px 1fr") //define grid for IE(old standart)
        )
    ```

 
## Flex grid + settings 
1.  Import "../_scss-vars/flex"; to main SCSS file  
2.  In /_scss-vars/_vars.scss set:
    ```
    $column_spacer      : 15px; // column spacer
    $column_spacer-left : $column_spacer; //spacer left
    $column_spacer-right: $column_spacer; //spacer right
    $column_counter     : 12; // column counter
    $cont_width         : 95%; //grid full width
    $max_cont_width     : 1170px; //max-width
    ```
    Grid system classes:
    ```
    .flex-container-fluid - fluid grid container 
    .flex-container - fixed by $max_cont_width grid container 
    .flex-row - flex row
    .flex-col-{{media query breakpoint can be defined in _vars.scss}}-{{column width}} 
    .flex-col-{{media query breakpoint}}-hidden
    .flex-col-{{column name}}-hidden
    ```

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
        sizes: [
            { width: 320, quality: 40 },
            { width: 480, quality: 60 },
            { width: 800, quality: 80 },
        ]
    },
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
Settigns
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
