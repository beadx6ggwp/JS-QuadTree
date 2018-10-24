var canvas,
    ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    DeltaTime = 0,
    loop = true,
    maxSave = 100,
    fpsList = [],
    avgFps = 0;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_debugFontSize = 18,
    ctx_backColor = "#222";
var pauseTime = 0;

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
var radius = 4;

var debug_useQuadTree = 1,
    debug_auxiliaryLine = 0,
    debug_checkRange = 0;

function main() {

    console.log("QuadTree Start");

    qt = new QuadTree(new Rect(0, 0, width, height));
    checkRange = new Rect(0, 0, 150, 150);

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(random(0, width), random(0, height), radius));
    }

    requestAnimationFrame(mainLoop);
}

function mainLoop(timestamp) {
    if (!loop) {
        // over
        drawString(ctx, "Pause",
            width / 2 - 65, height / 2 - 45,
            "#F77", 50, "consolas",
            0, 0, 0);
        return;
    }

    Timesub = timestamp - lastTime;// get sleep
    DeltaTime = Timesub / 1000;
    lastTime = timestamp;
    // count avg fps
    if (fpsList.length >= maxSave) {
        fpsList.push(1000 / Timesub);
        fpsList.shift();
    } else {
        fpsList.push(1000 / Timesub);
    }
    var total = 0;
    for (var i = 0; i < fpsList.length; i++) total += fpsList[i];
    var avgFps = total / fpsList.length;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, width, height);
    //--------Begin-----------

    update(DeltaTime);
    render(ctx);


    //--------End---------------
    let showStr = [
        "Fps: " + 1000 / Timesub,
        "Avg: " + avgFps
    ];
    // "Timesub: " + Timesub,
    // "DeltaTime: " + DeltaTime
    ctx.fillStyle = "rgba(50,50,50,0.9)";
    ctx.fillRect(0, height - ctx_debugFontSize * showStr.length - 5, 250, ctx_debugFontSize * showStr.length + 5);
    drawString(ctx, showStr.join("\n"),
        5, height - ctx_debugFontSize * showStr.length - 5,
        "#EE7", ctx_debugFontSize, "consolas",
        0, 0, 0);

    animation = window.requestAnimationFrame(mainLoop);
}

function update(dt) {
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
            var points = qt.query(new Circle(p.x, p.y, p.r * 2));

            for (let point of points) {
                let other = point.ObjData;
                if (p === other) continue;
                if (CircleToCircle(p, other)) {
                    //debugger;
                    p.color = "#FFF";
                }
            }
        }
    }
    else {
        for (let p of particles) {
            p.update(dt);
            p.color = "#777";
        }
        // check
        for (let p of particles) {
            for (let point of particles) {
                if (p === point) continue;
                if (CircleToCircle(p, point)) {
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
    ctx.fillStyle = "rgba(50,50,50,0.9)";
    ctx.fillRect(0, 0, 340, 60);
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
            if (!loop) {
                lastTime += Date.now() - pauseTime;
                requestAnimationFrame(mainLoop);
            } else {
                pauseTime = Date.now();
            }

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