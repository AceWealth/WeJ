//JS to create random color grid

var grid = $('#grid');
var s = 50;  //space between blocks
var n = 5;  //shadow range (space between shadow waves)
var l = 18;  //grid length
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var x = Math.floor(width / 50);
//random colors 
var rndCol = function() {
    return Math.ceil(Math.random() * 225+30);
};
for (var i = 0; i < l; i++) {
    for (var j = 0; j < x; j++) {
        var r = rndCol();
        var g = rndCol();
        var b = rndCol();
        var a = Math.random();
        var style = {
            'top': i * (s + n) + 'px',
            'left': j * (s + n) + 'px',
            'background': 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')',
            'background-image': 'linear-gradient(top, hsla(255, 255%, 255%, .95), transparent)',
            'animation-delay': ((i + 1) + (j + 1)) * 110 + 'ms'
        };
        var block = $('<div />').addClass('block').css(style);
        grid.append(block);
    }
}