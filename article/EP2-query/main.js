var canvas,
    ctx,
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

var mousePos = {};

window.onload = function () {
    console.log("EP2-RangeQuery");
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mousemove", mousemove, false);

    canvas = document.getElementById("myCanvas1");
    ctx = canvas.getContext('2d');
    width = canvas.width; height = canvas.height;

    main();
}

var queryTree, checkRange;

function main() {

    console.log("QueryTree Start");

    queryTree = new QuadTree(new Rect(0, 0, width, height));
    checkRange = new Rect(0, 0, 150, 150);

    requestAnimationFrame(mainLoop);
}

function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, width, height);
    //--------Begin-----------

    // 取得搜尋範圍內的物體
    let pts = queryTree.query(checkRange);

    // 顯示四叉樹
    queryTree.show(ctx);

    // 將搜尋範圍內的物體放大並變色，加以區分
    ctx.fillStyle = "#7F7";
    for (let p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // 顯示搜尋範圍與數量
    ctx.strokeStyle = "#7F7";
    ctx.lineWidth = 3;
    ctx.strokeRect(checkRange.x, checkRange.y, checkRange.w, checkRange.h);
    drawString(ctx, pts.length + "",
        checkRange.x + 20, checkRange.y + 20,
        "#7F7", 14, "consolas",
        0, 0, 0);

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

//---evnt---
function mousedown(e) {
    queryTree.insert(new Point(mousePos.x, mousePos.y));
}

function mousemove(e) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;

    if (mousePos.x < 0 || mousePos.x > width ||
        mousePos.y < 0 || mousePos.y > height) return;

    checkRange.x = mousePos.x - checkRange.w / 2;
    checkRange.y = mousePos.y - checkRange.h / 2;
}