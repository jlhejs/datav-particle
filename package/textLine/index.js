class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(
            this.x + v.x,
            this.y + v.y);
    }

    addTo(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        return new Vector(
            this.x - v.x,
            this.y - v.y);
    }

    subFrom(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }

    multTo(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n) {
        return new Vector(this.x / n, this.y / n);
    }

    divTo(n) {
        this.x /= n;
        this.y /= n;
    }

    setAngle(angle) {
        var length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setLength(length) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    getLength() {
        return Math.hypot(this.x, this.y);
    }

    getLengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    distanceTo(v) {
        return this.sub(v).getLength();
    }

    distanceToSq(v) {
        return this.sub(v).getLengthSq();
    }

    manhattanDistanceTo(v) {
        return Math.abs(v.x - this.x) + Math.abs(v.y - this.y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    rotate(angle) {
        return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }

    rotateTo(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = x;
        this.y = y;
        return this;
    }

    rotateAround(v, angle) {
        let x = (this.x - v.x) * Math.cos(angle) - (v.y - this.y) * Math.sin(angle) + v.x;
        let y = (this.x - v.x) * Math.sin(angle) + (v.y - this.y) * Math.cos(angle) + v.y;
        return new Vector(x, y);
    }

    rotateMeAround(v, angle) {
        let x = (this.x - v.x) * Math.cos(angle) - (v.y - this.y) * Math.sin(angle) + v.x;
        let y = (this.x - v.x) * Math.sin(angle) + (v.y - this.y) * Math.cos(angle) + v.y;
        this.x = x;
        this.y = y;
        return this;
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
}
class Particle {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.prevPos = new Vector(x, y);
        this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
        this.acc = new Vector(0, 0);
    }

    move(delta) {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
        const color = buffer32[Math.floor(this.pos.y) * w + Math.floor(this.pos.x)];

        let x1, y1;
        if (color) {
            x1 = (Math.random() - 0.5) * 0.5;
            y1 = (Math.random() - 0.5) * 0.5;
        } else {
            const deltaX = this.pos.x - w / 2;
            const deltaY = this.pos.y - h / 2;
            const dist = Math.hypot(deltaX, deltaY);
            const angle = Math.atan2(deltaY, deltaX);
            x1 = Math.cos(angle) * dist * 0.01;
            y1 = Math.sin(angle) * dist * 0.01;
        }
        const acc = new Vector(x1, y1);

        acc.multTo(delta * 0.07);
        if (pointerPos.x !== undefined && pointerPos.y !== undefined) {
            const diff = pointerPos.sub(this.pos);
            let dist = diff.getLength();
            if (dist < w * 0.04) {
                acc.addTo(diff.rotate(Math.PI).mult(2));
            }
        }
        this.acc.addTo(acc);

        this.vel.addTo(this.acc);
        this.pos.addTo(this.vel);
        if (this.vel.getLength() > config.particleSpeed) {
            this.vel.setLength(config.particleSpeed);
        }

        this.acc.x = 0;
        this.acc.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.prevPos.x, this.prevPos.y);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
    }

    wrap() {
        if (this.pos.x > w ||
            this.pos.x < 0 ||
            this.pos.y > h ||
            this.pos.y < 0) {
            this.respawn();
        }
    }
    respawn() {
        let x;
        let y;
        let color;
        do {
            x = Math.floor(Math.random() * w);
            y = Math.floor(Math.random() * h);
            color = buffer32[y * w + x];
        } while (!color);
        this.prevPos.x = this.pos.x = x;
        this.prevPos.y = this.pos.y = y;
    }
}


let canvas;
let ctx;
let w, h;
let size;
let then;
let particles;
let config;
let pointerPos;
let text = ''
let textColor = 'white'
let textSize = 0
let el = null
let buffer32 = null
let backgroundColor = "#000000"
function setup() {
    pointerPos = new Vector(undefined, undefined);
    then = performance.now();
    canvas = document.createElement('canvas');
    el.appendChild(canvas);
    ctx = canvas.getContext("2d");
    window.addEventListener("resize", reset);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerleave", pointerLeave);
    reset();

    config = {
        particleSpeed: 1
    };
    draw(performance.now());
}

function pointerMove(event) {
    pointerPos.x = event.clientX;
    pointerPos.y = event.clientY;
}

function pointerLeave(event) {
    pointerPos.x = undefined;
    pointerPos.y = undefined;
}

function reset() {
    w = canvas.width = (el.clientWidth || el.offsetWidth || el.scrollWidth);
    h = canvas.height = el.clientHeight || el.offsetHeight || el.scrollHeight;
    initParticles();
    drawText();
    drawBackground(1);
}

function initParticles() {
    particles = [];
    let numberOfParticles = w * h / 300;
    for (let i = 0; i < numberOfParticles; i++) {
        let particle = new Particle(Math.random() * w, Math.random() * h);
        particles.push(particle);
    }
}

function draw(now) {
    requestAnimationFrame(draw);
    drawBackground(0.07);
    const delta = now - then;
    drawParticles(delta);
    then = now;
}

function drawBackground(alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, w, h);
}

function drawText() {
    ctx.save();
    let len = text.length;
    let size = textSize||w / len;
    ctx.font = `${size}px sans serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    ctx.restore();
    let image = ctx.getImageData(0, 0, w, h);
    buffer32 = new Uint32Array(image.data.buffer);
}

function drawParticles(delta) {
    ctx.strokeStyle = textColor;
    let x;
    let y;
    particles.forEach(p => {
        x = p.pos.x / size;
        y = p.pos.y / size;
        p.move(delta);
        p.wrap();
        p.draw();
    });
}
String.prototype.colorRgb = function(opacity){
    opacity = opacity || .6;
    var color = this.toLowerCase();
    var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if(color && pattern.test(color)) {
        if(color.length == 4) {
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        var colorNew = [];
        for (var i=1; i<7; i+=2) {
            colorNew.push(parseInt("0x"+color.slice(i, i+2)));
        }
        return "RGBA(" + colorNew.join(",") + ", " + opacity + ")";
    }
    return color;
}
function textLine(options){
    text = options.text||'DatavParticle'
    textColor = options.textColor||"white"
    // todo
    backgroundColor = options.backgroundColor||"#000000"
    if(options.textSize){
        textSize = options.textSize
    }
    el = options.el
    setup()
    
    return 
}
export default textLine