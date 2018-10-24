class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData
    }
}

class Rectangle {
    // xy is topleft
    constructor(x, y, w, h) {
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

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
        return d <= this.rSquared;
    }

    intersects(range) {

        // radius of the circle
        var r = this.r;

        var half_w = range.w / 2;
        var half_h = range.h / 2;

        var cx = range.x + half_w;
        var cy = range.y + half_h;
        var xDist = Math.abs(cx - this.x);
        var yDist = Math.abs(cy - this.y);

        var edges = Math.pow((xDist - half_w), 2) + Math.pow((yDist - half_h), 2);

        // check right and bottom
        // no intersection
        if (xDist > (r + half_w) || yDist > (r + half_h))
            return false;

        // check left and top
        // intersection within the circle
        if (xDist <= half_w || yDist <= half_h)
            return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }
}


class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.areas = [];
        this.level = 1;
        this.MAX_LEVEL = 7;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

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

        if (this.points.length < this.capacity || this.level >= this.MAX_LEVEL) {
            this.points.push(point);
            return true;
        }

        if (this.areas.length <= 0) this.subdivide();
        for (let area of this.areas) {
            if (area.insert(point)) return true;
        }
    }

    query(range, found) {
        if (!found) found = [];

        // 檢查範圍與四叉樹邊界做檢測
        if (!range.intersects(this.boundary)) return found;

        // 當前區域中有相交物體，加入found
        for (let p of this.points) {
            if (range.contains(p)) {
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

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF7";
        ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.show(ctx);
            }
        }
    }
}