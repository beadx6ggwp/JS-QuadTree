class Particle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.r = r;
        this.color = "#FFF";
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.r < 0 || this.x + this.r > width) this.vx *= -1
        if (this.y - this.r < 0 || this.y + this.r > height) this.vy *= -1
    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    intersects(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return dist < this.r + other.r;
    }
}