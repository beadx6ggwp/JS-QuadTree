console.log("collision.js OK");

class Rect {
    constructor(x, y, w, h) {
        this.collisionType = "rect";
        this.color = "#FFF";
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    show(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.beginPath();// 為什麼加上這行就能正常顯示?
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
        ctx.stroke();
    }
}

class Circle {
    constructor(x, y, r) {
        this.collisionType = r ? "circle" : "point";
        this.color = "#FFF";
        this.x = x;
        this.y = y;
        this.r = r || 3;
    }
    show(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}


function CheckCollision(shape1, shape2) {
    let arr = [shape1, shape2].sort((a, b) => a.collisionType > b.collisionType);

    switch (arr[0].collisionType + "," + arr[1].collisionType) {
        case "circle,point":
            return PointToCircle(arr[1], arr[0]);
        case "circle,circle":
            return CircleToCircle(arr[0], arr[1]);
        case "point,rect":
            return PointToRect(arr[0], arr[1]);
        case "rect,rect":
            return RectToRect(arr[0], arr[1]);
        case "circle,rect":
            return CircleToRect(arr[0], arr[1]);
    }
}


function PointToCircle(point, circle) {
    let d = Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2);
    return d <= circle.r * circle.r;
}
function PointToRect(point, rect) {
    return !(point.x > rect.x + rect.w || point.x < rect.x ||
        point.y > rect.y + rect.h || point.y < rect.y);
}
function RectToRect(rectA, rectB) {
    return !(rectA.x + rectA.w < rectB.x || rectA.x > rectB.x + rectB.w ||
        rectA.y + rectA.h < rectB.y || rectA.y > rectB.y + rectB.h);
}
function CircleToCircle(c1, c2) {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    return Math.sqrt(dx * dx + dy * dy) <= c1.r + c2.r;
}
function CircleToRect(c, r) {
    let cx = r.x + r.w / 2;
    let cy = r.y + r.h / 2;

    let xDist = Math.abs(cx - c.x);
    let yDist = Math.abs(cy - c.y);

    // 塞選掉所有矩形外部
    if (xDist > r.w / 2 + c.r || yDist > r.h / 2 + c.r) return false;

    // 有在方形內的都算碰撞
    if (xDist <= r.w / 2 || yDist <= r.h / 2) return true;

    // 但還是會漏掉四個角的外側，所以再檢查四個角是否與圓發生碰撞
    let edges = Math.pow(xDist - r.w / 2, 2) + Math.pow(yDist - r.h / 2, 2);
    return edges <= c.r * c.r;
}