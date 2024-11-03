import { init } from "./dirty.js";
init();

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");

let circles = [];

function drawCircles() {
  for (const circle of circles) {
    circle.draw(ctx);
  }
}

class Circle {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} vx
   * @param {number} vy
   *
   */
  constructor(x, y, radius, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.arc(
      this.x * canvas.width,
      this.y * canvas.height,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    context.stroke();
    context.fill();
    context.closePath();
  }

  move() {
    this.x += this.vx / canvas.width;
    this.y += this.vy / canvas.height;

    const xCollision = this.collidesWithEdgeX()

    if (xCollision.collidesOuterEdge) {
      if (this.vx > 0) {
        this.vx *= -1
      }
    }

    if (xCollision.collidesInnerEdge) {
      if (this.vx < 0) {
        this.vx *= -1
      }
    }

    const yCollision = this.collidesWithEdgeY();

    if (yCollision.collidesOuterEdge) {
      if (this.vy > 0) {
        this.vy *= -1
      }
    }

    if (yCollision.collidesInnerEdge) {
      if (this.vy < 0) {
        this.vy *= -1;
      }
    }

    this.draw(ctx);
  }

  collidesWithEdgeX() {
    const collidesOuterEdge =
      canvas.width - (this.x * canvas.width + this.radius) <= 0;
    const collidesInnerEdge = this.x * canvas.width - this.radius <= 0;

    return {
      collides: collidesInnerEdge || collidesOuterEdge,
      collidesInnerEdge,
      collidesOuterEdge,
    };
  }

  collidesWithEdgeY() {
    const collidesOuterEdge =
      canvas.height - (this.y * canvas.height + this.radius) <= 0;
    const collidesInnerEdge = this.y * canvas.height - this.radius <= 0;

    return {
      collides: collidesInnerEdge || collidesOuterEdge,
      collidesInnerEdge,
      collidesOuterEdge,
    };
  }

  /**
   * @param {Circle} circle
   */
  collidesWith(circle) {
    const distX = (circle.x - this.x) * canvas.width;
    const distY = (circle.y - this.y) * canvas.height;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    return distance <= circle.radius + this.radius;
  }

  /**
   * @param {Array<Circle>} circles
   */
  collidesWithAnyCircle(circles) {
    for (const circle of circles) {
      if (circle.collidesWith(this)) {
        return true;
      }
    }
    return false;
  }
}

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  drawCircles();
});

for (const circleId of 100) {
  const radius = Math.random() * 20 + 20;
  let xPosition = Math.random();
  let yPosition = Math.random();
  let circle = new Circle(xPosition, yPosition, radius);

  while (circle.collidesWithAnyCircle(circles)) {
    yPosition = Math.random();
    xPosition = Math.random();
    circle = new Circle(xPosition, yPosition, radius);
  }

  circle.vx = Math.random() + 2 * (Math.random() < 0.5 ? 1 : -1);
  circle.vy = Math.random() + 2 * (Math.random() < 0.5 ? 1 : -1);

  circles.push(circle);
  drawCircles();
}
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const circle of circles) {
    circle.move();
  }
}, 10);
