class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    // xy is topleft
    constructor(x, y, w, h) {
        this.collisionType = "rect";
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    constains(point) {
        return (point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h);
    }

    intersects(range) {
        return (this.x + this.w < range.x ||
            this.x < range.x + range.w ||
            this.y + this.h < range.y ||
            this.y < range.y + range.h);
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.areas = [];
        this.level = 1;
        this.MAX_LEVEL = 5;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        // 以左上為基準
        this.areas.push(new QuadTree(new Rectangle(x + w / 2, y, w / 2, h / 2), this.capacity));//topRight
        this.areas.push(new QuadTree(new Rectangle(x, y, w / 2, h / 2), this.capacity));//topLeft
        this.areas.push(new QuadTree(new Rectangle(x, y + h / 2, w / 2, h / 2), this.capacity));//bottomLeft
        this.areas.push(new QuadTree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity));//bottomRight
        for (let area of this.areas) {
            area.level = this.level + 1;
        }
    }

    // 回傳插入結果
    insert(point) {
        if (!this.boundary.constains(point)) return false;

        if (this.points.length < this.capacity ||  this.level >= this.MAX_LEVEL) {
            this.points.push(point);
            return true;
        }

        if (this.areas.length <= 0)
            this.subdivide();

        for (let area of this.areas) {
            if (area.insert(point)) return true;
        }
    }
    
    query(range, found) {
        if (!found) found = [];

        if (!this.boundary.intersects(range)) return found;

        // 當前區域中有相交物體，加入found
        for (let p of this.points) {
            if (range.constains(p)) {
                found.push(p);
            }
        }

        // 如果有子區塊，繼續往下
        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.query(range, found);
            }
        }

        return found;
    }

    show(ctx) {
        let nowColor = "hsl(" + ((this.level) / (this.MAX_LEVEL + 1)) * 359 + ", 100%, 50%)";

        ctx.lineWidth = 1;
        ctx.strokeStyle = nowColor;
        ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

        drawString(ctx, this.points.length + "\n" + this.capacity,
            this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
            "rgba(255,255,0,0.5)", 10, "consolas",
            0, 0, 0);

        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.show(ctx);
            }
        }

        ctx.strokeStyle = nowColor;
        for (let p of this.points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}