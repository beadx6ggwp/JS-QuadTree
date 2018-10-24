class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w
        let h = this.boundary.h

        let nw = new Rectangle(x, y, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);//nortwest

        let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);//norteast

        let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);//soutwest

        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);//souteast

        this.divided = true;
    }

    // 回傳插入結果
    insert(point) {
        if (!this.boundary.constains(point)) return false;

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) this.subdivide();

            if (this.northwest.insert(point)) return true;
            if (this.northeast.insert(point)) return true;
            if (this.southwest.insert(point)) return true;
            if (this.southeast.insert(point)) return true;
        }
    }

    query(range, found) {
        if (!found) found = [];

        if (!this.boundary.intersects(range)) return

        for (let p of this.points) {
            if (range.constains(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    show(ctx) {

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFF";
        ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

        drawString(ctx, this.points.length + "\n" + this.capacity,
            this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
            "rgba(255,255,0,0.5)", 10, "consolas",
            0, 0, 0);

        if (this.divided) {
            this.northwest.show(ctx);
            this.northeast.show(ctx);
            this.southwest.show(ctx);
            this.southeast.show(ctx);
        }

        ctx.fillStyle = "#fff";
        for (let p of this.points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}