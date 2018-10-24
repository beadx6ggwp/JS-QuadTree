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
    ctx_backColor = "#777";
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

var dragObj;
var dragOffset = { x: 0, y: 0 };

var shape_arr = [];

function main() {
    mousePos.collisionType = "point";

    shape_arr.push(new Circle(150, 150, 50));
    shape_arr.push(new Circle(350, 150, 70));
    shape_arr.push(new Rect(450, 450, 100, 200));
    shape_arr.push(new Rect(150, 450, 200, 100));
    window.requestAnimationFrame(mainLoop);
    //mainLoop();
}


function update(dt) {
    for (let objA of shape_arr) {
        objA.color = "#FFF";
        for (let objB of shape_arr) {
            if (objA === objB) continue;
            if (CheckCollision(objA, objB)) {
                objA.color = "rgba(255, 127, 127, 0.5)";
            }
        }
    }
}

function draw(ctx) {
    for (let i = 0; i < shape_arr.length; i++) {
        let obj = shape_arr[i];
        obj.show(ctx);
        drawString(ctx, i + "",
            obj.x, obj.y,
            "#000", 10, "consolas",
            0, 0, 0);
    }
}

function FinDragPoint(point) {
    for (let obj of shape_arr) {
        if (CheckCollision(point, obj)) return obj;
    }
    return null;
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
    let x = mousePos.x;
    let y = mousePos.y;

    dragObj = FinDragPoint(mousePos);
    if (dragObj) {
        dragOffset.x = mousePos.x - dragObj.x;
        dragOffset.y = mousePos.y - dragObj.y;
    }
}

function mouseup(e) {
    isPressed = false;

    dragObj = null;
    dragOffset = { x: 0, y: 0 };
}

function mousemove(e) {
    mousePos.x = e.clientX - ctx.canvas.offsetLeft
    mousePos.y = e.clientY - ctx.canvas.offsetTop;

    if (dragObj) {
        dragObj.x = mousePos.x - dragOffset.x;
        dragObj.y = mousePos.y - dragOffset.y;
    }

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