var canvas,
    ctx,
    width,
    height,
    backColor = "#222";
var mousePos = {};

window.onload = function () {
    console.log("EP1-Insert & show-noLoop");
    document.addEventListener("mousedown", mousedown, false);

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
    width = canvas.width; height = canvas.height;

    main();
}

var qt;

function main() {
    
    console.log("QuadTree Start");
    
    qt = new QuadTree(new Rect(0, 0, width, height));

    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, width, height);
}

//---evnt---
function mousedown(e) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
    
    if (mousePos.x < 0 || mousePos.x > width ||
        mousePos.y < 0 || mousePos.y > height) return;

    qt.insert(new Point(mousePos.x, mousePos.y));

    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, width, height);
    qt.show(ctx);
}