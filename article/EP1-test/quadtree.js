class Point {
    constructor(x, y) {
        this.collisionType = "point";
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.collisionType = "rect";
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class QuadTree {
    constructor(boundary) {
        this.MAX_OBJ = 4;// 該容器最大容量
        this.MAX_LEVEL = 5;// 最大深度

        this.objs = [];// 該容器的點集合
        this.areas = [];// 四塊子區域(QuadTree)
        this.level = 1;//當前深度

        this.boundary = boundary;// 容器範圍(Rect)
    }

    /*
    如果該點在範圍內，且容量也夠的話就新增該點至區域內，或是到達最大深度也直接新增
    到容量上限後，就分割出四個子領域，再將物體分類至最靠近的子領域中
    */
    insert(object) {
        if (!CheckCollision(this.boundary, object)) return false;

        if (this.objs.length < this.MAX_OBJ || this.level >= this.MAX_LEVEL) {
            this.objs.push(object);
            return true;
        }

        if (this.areas.length <= 0) this.subdivide();

        for (let area of this.areas) {
            if (area.insert(object)) return true;
        }
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        // 矩形以左上為基準
        this.areas.push(new QuadTree(new Rect(x + w / 2, y, w / 2, h / 2)));//topRight
        this.areas.push(new QuadTree(new Rect(x, y, w / 2, h / 2)));//topLeft
        this.areas.push(new QuadTree(new Rect(x, y + h / 2, w / 2, h / 2)));//bottomLeft
        this.areas.push(new QuadTree(new Rect(x + w / 2, y + h / 2, w / 2, h / 2)));//bottomRight
        for (let area of this.areas) {
            area.level = this.level + 1;
        }
    }

    show(ctx) {
        // 繪製邊界與物體數/容量數
        ctx.strokeStyle = "#FFF";
        ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

        drawString(ctx, this.objs.length + "\n" + this.MAX_OBJ,
            this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
            "rgba(255,255,0,0.5)", 10, "consolas",
            0, 0, 0);

        // 往下繪製所有子領域
        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.show(ctx);
            }
        }

        // 繪製出這塊領域的物體
        for (let obj of this.objs) {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}