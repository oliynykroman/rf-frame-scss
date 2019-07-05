console.log('it works');

// use old standart because need generate for IE10
var body = document.body;


function generateGrid(normalGridColumnsCount, gridGaps, className) {
    var exampleGridContainer = document.createElement('div');
    exampleGridContainer.className += 'example-grid' + (className === undefined ? '' : ' ' + className);
    body.appendChild(exampleGridContainer);
    var normalGridContainer = document.createElement('div');
    normalGridContainer.className += 'normal-grid';
    exampleGridContainer.appendChild(normalGridContainer);
    for (var i = 0; i < normalGridColumnsCount; i++) {
        normalGridContainer.appendChild(box());
    }
    if (gridGaps) {
        var legacyGridContainer = document.createElement('div');
        legacyGridContainer.className += 'legacy-grid';
        exampleGridContainer.appendChild(legacyGridContainer);
        for (var j = 0; j < (normalGridColumnsCount * 2) - 1; j++) {
            legacyGridContainer.appendChild(box());
        }
    }
}

function box() {
    var boxGrid = document.createElement('div');
    boxGrid.className += 'box';

    return boxGrid;
}

generateGrid(14, true);