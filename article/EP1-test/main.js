var ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#222";
var keys = {}, mousePos = {}, isPressed = false;

window.onload = function () {
    ctx = CreateDisplay("myCanvas", 800, 800);
    width = ctx.canvas.width; height = ctx.canvas.height;

    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);

    main();

}

// ----------------------------------------------------------
function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, width, height);
    //--------Begin-----------

    update(DeltaTime);
    draw(ctx);

    //--------End---------------
    let str1 = "Fps: " + 1000 / Timesub, str2 = "Timesub: " + Timesub, str3 = "DeltaTime: " + DeltaTime;
    drawString(ctx, str1 + "\n" + str2 + "\n" + str3,
        0, height - 31,
        "rgba(255,255,255,0.4)", 10, "consolas",
        0, 0, 0);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
    }
}


var qt, checkRange;

function main() {
    console.log("QuadTree Start");

    qt = new QuadTree(new Rect(0, 0, width, height));

    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {

}

function draw(ctx) {
    qt.show(ctx);
}
//---evnt---
function keydown(e) {
    keys[e.keyCode] = true;
}

function keyup(e) {
    delete keys[e.keyCode];
}

function mousedown(e) {
    isPressed = true;

    qt.insert(new Point(mousePos.x, mousePos.y));
}

function mouseup(e) {
    isPressed = false;

}

function mousemove(e) {
    mousePos.x = e.clientX - ctx.canvas.offsetLeft;
    mousePos.y = e.clientY - ctx.canvas.offsetTop;
}

//----tool-------
function toRadio(angle) {
    return angle * Math.PI / 180;
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}

//---------------------
function CreateDisplay(id, width, height, border) {
    let canvas = document.createElement("canvas");
    let style_arr = [
        "display: block;",
        "margin: 0 auto;",
        "background: #FFF;",
        "padding: 0;",
        "display: block;"
    ];
    canvas.id = id;
    canvas.width = width | 0;
    canvas.height = height | 0;

    if (border) style_arr.push("border:1px solid #000;");

    if (!width && !height) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    canvas.style.cssText = style_arr.join("");

    document.body.appendChild(canvas);

    return canvas.getContext("2d");
}