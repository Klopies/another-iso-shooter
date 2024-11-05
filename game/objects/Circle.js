import { extendLine } from "../util/math.js";

let logi = 0;

export class Circle {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} vx
   * @param {number} vy
   */
  constructor(x, y, radius, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "#000000ca";
    this.ctx.lineWidth = 2;
    this.ctx.arc(
      Math.floor(this.x * this.canvas.width),
      Math.floor(this.y * this.canvas.height),
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    this.x += this.vx / this.canvas.width;
    this.y += this.vy / this.canvas.height;

    const xCollision = this.collidesWithEdgeX();

    if (xCollision.collidesOuterEdge) {
      if (this.vx > 0) {
        this.vx *= -1;
      }
    }

    if (xCollision.collidesInnerEdge) {
      if (this.vx < 0) {
        this.vx *= -1;
      }
    }

    const yCollision = this.collidesWithEdgeY();

    if (yCollision.collidesOuterEdge) {
      if (this.vy > 0) {
        this.vy *= -1;
      }
    }

    if (yCollision.collidesInnerEdge) {
      if (this.vy < 0) {
        this.vy *= -1;
      }
    }
  }

  collidesWithEdgeX() {
    const collidesOuterEdge =
      this.canvas.width - (this.x * this.canvas.width + this.radius) <= 0;
    const collidesInnerEdge = this.x * canvas.width - this.radius <= 0;

    return {
      collides: collidesInnerEdge || collidesOuterEdge,
      collidesInnerEdge,
      collidesOuterEdge,
    };
  }

  collidesWithEdgeY() {
    const collidesOuterEdge =
      this.canvas.height - (this.y * this.canvas.height + this.radius) <= 0;
    const collidesInnerEdge = this.y * this.canvas.height - this.radius <= 0;

    return {
      collides: collidesInnerEdge || collidesOuterEdge,
      collidesInnerEdge,
      collidesOuterEdge,
    };
  }

  /**
   * @param {Circle} circle
   */
  bounceOffCircle(circle) {
    if (this.x === circle.x && this.y === circle.y) return;
    const [newDirection, newDirectionForCircle] = [
      extendLine(
        {
          x1: circle.x,
          y1: circle.y,
          x2: this.x,
          y2: this.y,
        },
        1
      ),
      extendLine(
        {
          x1: this.x,
          y1: this.y,
          x2: circle.x,
          y2: circle.y,
        },
        1
      ),
    ];

    if (logi < 1) {
      console.log({
        thisX: this.x,
        thisY: this.y,
        circleX: circle.x,
        circleY: circle.y,
        newDirection: newDirection,
        newDirectionForCircle: newDirectionForCircle,
      });
      logi++;
    }

    /** @todo: figure out why i have to do this for the speed to look normal */
    const test = 10;

    this.vx = (newDirection.x - this.x) * test;
    this.vy = (newDirection.y - this.y) * test;

    circle.vx = (newDirectionForCircle.x - circle.x) * test;
    circle.vy = (newDirectionForCircle.y - circle.y) * test;
  }

  /**
   * @param {Circle} circle
   */
  collidesWithCircle(circle) {
    const distX = (circle.x - this.x) * this.canvas.width;
    const distY = (circle.y - this.y) * this.canvas.height;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance === 0) return false;
    return distance <= circle.radius + this.radius;
  }

  /**
   * @param {Array<Circle>} circles
   */
  collidesWithCircles(circles) {
    let circlesColliding = [];
    for (const circle of circles) {
      if (circle.collidesWithCircle(this)) {
        circlesColliding.push(circle);
      }
    }
    return circlesColliding;
  }

  /**
   * @param {Array<Circle>} circles @todo: this can't be right...
   */
  collidesWithAnyCircle(circles) {
    for (const circle of circles) {
      if (circle.collidesWithCircle(this)) {
        return true;
      }
    }
    return false;
  }
}
