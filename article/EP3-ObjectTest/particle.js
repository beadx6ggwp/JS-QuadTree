class Particle {
    constructor(x, y, r, speed, ang) {
        this.collisionType = "circle";
        this.x = x;
        this.y = y;
        this.speed = speed || random(20, 100);
        let angle = ang || random(0, Math.PI * 2);
        this.vx = this.speed * Math.cos(angle);
        this.vy = this.speed * Math.sin(angle);
        this.r = r;
        this.color = "#FFF";
    }
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x - this.r < 0 && this.vx < 0 ||
            this.x + this.r > width && this.vx > 0)
            this.vx *= -1
        if (this.y - this.r < 0 && this.vy < 0 ||
            this.y + this.r > height && this.vy > 0)
            this.vy *= -1
    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}