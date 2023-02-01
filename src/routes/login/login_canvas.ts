
class Ball {
    posX: number;
    posY: number;
    velX: number;
    velY: number;
    rad: number;

    constructor(x: number, y: number) {
        this.posX = x;
        this.posY = y;
        this.velX = (Math.random() * 10) -5;
        this.velY = (Math.random() * 10) -5;
        this.rad = (Math.random() * 50) + 15;
    }

    draw(time: number, ctx: CanvasRenderingContext2D) {
        this.update(time);
        this.render(ctx);
    }

    update(time: number) {
        const xMov = this.velX * time;
        const yMov = this.velY * time;
        this.posX += xMov;
        this.posY += yMov;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.rad, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

export const loginCanvas = function(canvas: HTMLCanvasElement) {
    const w: number = window.innerWidth;
    const h: number = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const balls: Ball[] = [];
    for (let i = 0; i < 75; ++i) {
        balls.push(new Ball(w / 2, h / 2))
    }

    let running = true;
    let start: number = 0, previousTimestamp: number = 0;

    const run: FrameRequestCallback = function(timestamp) {
        if (start === 0) {
            previousTimestamp = timestamp;
            start = timestamp;
        }
        
        if (running) {
            requestAnimationFrame(run);
        }
        
        if (previousTimestamp !== timestamp) {
            const frameTime = timestamp - previousTimestamp;
            ctx.fillStyle = "white";
            ctx.clearRect(0, 0, w, h);

            for (const ball of balls) {
                ball.draw(frameTime / 1000, ctx);
            }
        }
        previousTimestamp = timestamp;
    };

    requestAnimationFrame(run);

    return {
        destroy() {
            running = false;
        }
    };
}