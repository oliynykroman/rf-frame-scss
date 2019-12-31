# rf-frame-scss

Gulp 4 configuration file and scss mixins library. 

Supports grid generation for older versions IE(11, 10), updated mixins. 
Added backstopJS for markup regressive testing

## How to
All configs combined in settings.js

## Grid grid:) mixins + settings
1. Set to true 'legacyGrid' property
2. Add "js/example-grid.min.js" to main index.html
    ```
    <script>
        var gridSettings = {
            columns: 14,
            gaps: true,
            customClass: 'box'
        }
    </script>
    ```
3. Import "../_scss-vars/grid"; to main SCSS file

    3.1 Set number of columns and generate EXAMPLE grid css  (this code prepare grid like in desktop bootstrap):
    ```
        @mixin exampleGrid($columns:28); //default 28 (12 columns for normal browsers, 28 for ie (older specs don't have gaps))
    ```
         
    3.2 Define MAIN responsive grid for all browsers (this code prepare grid like in desktop bootstrap):
    ```
        @mixin responsiveGrid(
        $screenSize:1280px, // define @media min-width
        $gridGap:30px, // set grid gaps for normal grid
        $normalGrid: 1fr repeat(12, minmax(0, 70px)) 1fr, // define grid for normal browser (new standart)
        $legacyGrid:1fr repeat(12, 30px minmax(0, 70px)) 30px 1fr, //define legacy grid for ie 11 and browsers without repeat option support
        $ieNativeGrid: "1fr (30px minmax(0px, 70px))[12] 30px 1fr") //define grid for IE (old standart)
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
start: gulp

For automate markup regressive testing is used backstop.js
based on: https://medium.com/@lucyhackwrench/%D0%BA%D0%B0%D0%BA-%D0%B8-%D0%B7%D0%B0%D1%87%D0%B5%D0%BC-%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%B2%D0%B5%D1%80%D1%81%D1%82%D0%BA%D1%83-84a378bf7bb4


backstop should be installed globally
run:
backstop init
tests:
$ backstop test
$ backstop approve