class Point {
    constructor(x, y, ObjData) {
        this.collisionType = "point";
        this.ObjData = ObjData;
        this.x = x;
        this.y = y;
    }
}
class Circle {
    constructor(x, y, r) {
        this.collisionType = "circle";
        this.x = x;
        this.y = y;
        this.r = r;
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
    constructor(boundary, level) {
        this.MAX_OBJ = 4;// 該容器最大容量
        this.MAX_LEVEL = 10;// 最大深度

        this.objs = [];// 該容器的物體集合
        this.areas = [];// 四塊子區域
        this.level = level || 1;//當前深度

        this.boundary = boundary;// 容器範圍(Rect)
    }

    /*
    如果該點在範圍內，且容量也夠的話就新增該點至區域內，或是到達最大深度也直接新增
    到達容量上限後，就分割出四個子領域，再將物體分類至最靠近的子領域中
    */
    insert(object) {
        // 先確認物體是否在邊界內
        if (!CheckCollision(this.boundary, object)) return false;

        // 如果當前容量與深度未達上限，就直接新增該物體
        if (this.objs.length < this.MAX_OBJ || this.level >= this.MAX_LEVEL) {
            this.objs.push(object);
            return true;
        }

        // 如果容量達上限，且沒有子領域的話，分割出四個子領域
        if (this.areas.length <= 0) this.subdivide();

        // 嘗試給子領域新增該物體
        for (let area of this.areas) {
            if (area.insert(object)) return true;
        }
    }

    subdivide() {
        let x = this.boundary.x, y = this.boundary.y;
        let w = this.boundary.w, h = this.boundary.h;

        // 矩形以左上為基準，依照各象限順序建立子領域，並新增到areas中
        this.areas.push(new QuadTree(new Rect(x + w / 2, y, w / 2, h / 2), this.level + 1));// topRight
        this.areas.push(new QuadTree(new Rect(x, y, w / 2, h / 2), this.level + 1));// topLeft
        this.areas.push(new QuadTree(new Rect(x, y + h / 2, w / 2, h / 2), this.level + 1));// bottomLeft
        this.areas.push(new QuadTree(new Rect(x + w / 2, y + h / 2, w / 2, h / 2), this.level + 1));// bottomRight
    }

    query(range, found) {
        // 如果沒有給定回傳的陣列，就建立一個
        if (!found) found = [];

        // 判斷搜尋範圍(range)是否與當前領域有相交，沒有就直接跳掉，以節省效率
        // if(!CheckCollision(range, this.boundary)) return;
        if (!CircleToRect(range, this.boundary)) return found;

        // 如果搜尋範圍跟當前領域相交，檢查該領域有多少物體包含在搜尋範圍中，並增加至found
        for (let p of this.objs) {
            // if (CheckCollision(p, range)) {
            //     found.push(p);
            // }
            if (PointToCircle(p, range)) {
                found.push(p);
            }
        }
        // 當該領域有子區域時，繼續往下檢查有多少物件包含在搜尋範圍內
        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.query(range, found);
            }
        }

        // 完成搜尋，回傳結果
        return found;
    }



    show(ctx) {
        // 繪製邊界
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#7FF";
        ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

        // 顯示物體數/容量數，Debug
        // drawString(ctx, this.objs.length + "\n" + this.MAX_OBJ,
        //     this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
        //     "#AA7", 10, "consolas",
        //     0, 0, 0);

        // 往下繪製所有子領域區塊
        if (this.areas.length != 0) {
            for (let area of this.areas) {
                area.show(ctx);
            }
        }

        // 繪製出這塊領域的物體
        // for (let obj of this.objs) {
        //     ctx.beginPath();
        //     ctx.arc(obj.x, obj.y, 3, 0, Math.PI * 2);
        //     ctx.stroke();
        // }
    }
}