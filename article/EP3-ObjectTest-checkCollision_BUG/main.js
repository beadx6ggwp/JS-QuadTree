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
    ctx_debugFontSize = 18;
ctx_backColor = "#222";

var mousePos = {}, mouseInside = 0;

window.onload = function () {
    console.log("EP3-ObjectTest");
    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mousemove", mousemove, false);

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
    width = canvas.width; height = canvas.height;

    main();
}

var qt, checkRange;
var particles = [];
var radius = 6;

var debug_useQuadTree = 1,
    debug_auxiliaryLine = 0,
    debug_checkRange = 0;

function main() {

    console.log("QuadTree Start");

    qt = new QuadTree(new Rect(0, 0, width, height));
    checkRange = new Rect(0, 0, 150, 150);

    for (let i = 0; i < 100; i++) {
        //particles.push(new Particle(random(0, width), random(0, height), radius));
    }

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

    update(DeltaTime);
    render(ctx);


    //--------End---------------
    let showStr = [
        "Fps: " + 1000 / Timesub,
        "Timesub: " + Timesub,
        "DeltaTime: " + DeltaTime
    ];
    drawString(ctx, showStr.join("\n"),
        5, height - ctx_debugFontSize * showStr.length - 5,
        "#EE7", ctx_debugFontSize, "consolas",
        0, 0, 0);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
        drawString(ctx, "Pause",
            width / 2 - 60, height / 2 - 45,
            "#EE7", 50, "consolas",
            0, 0, 0);
    }
}

function update(dt) {

    // for (let p of particles) {
    //     p.update(dt);
    //     p.color = "#777";
    // }

    if (debug_useQuadTree) {
        // Clear quadtree
        qt = new QuadTree(new Rect(0, 0, width, height));

        // insert object
        for (let p of particles) {
            p.update(dt);
            p.color = "#777";
            qt.insert(new Point(p.x, p.y, p));
        }

        // check
        for (let p of particles) {
            let points = qt.query(new Circle(p.x, p.y, p.r * 2));
            for (let point of points) {
                let other = point.ObjData;
                if (p === other) continue;
                if (CheckCollision(p, other)) {
                    //debugger;
                    p.color = "#FFF";
                }
            }
        }
    }
}
function render(ctx) {
    // 顯示四叉樹
    if (debug_auxiliaryLine) {
        qt.show(ctx);
    }

    for (let p of particles) {
        p.render(ctx);
    }

    let showText = [
        "CheckMode : " + (debug_useQuadTree ? "QuadTree" : "No QuadTree"),
        "Particles : " + particles.length
    ];
    drawString(ctx, showText.join("\n"),
        1, 0,
        "#EE7", 26, "consolas",
        0, 0, 0);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

//---evnt---
function mousedown(e) {
    if (!mouseInside) return;
    if (!loop) return;

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(mousePos.x, mousePos.y, radius));
    }
}

function mousemove(e) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;

    if (mousePos.x < 0 || mousePos.x > width || mousePos.y < 0 || mousePos.y > height) {
        mouseInside = 0;
        return;
    }
    mouseInside = 1;

    checkRange.x = mousePos.x - checkRange.w / 2;
    checkRange.y = mousePos.y - checkRange.h / 2;
}

function SwitchMode(n) {
    switch (n) {
        case 0:
            if (!loop) requestAnimationFrame(mainLoop);
            loop ^= 1;
            break;
        case 1:
            particles = [];
            break;
        case 2:
            debug_useQuadTree ^= 1;
            debug_auxiliaryLine = 0;
            break;
        case 3:
            if (!debug_useQuadTree) return;
            debug_auxiliaryLine ^= 1;
            break;
    }
}