import { init } from "./dirty.js";
import { Circle } from "./game/objects/Circle.js";
init();

class Game {
  constructor({ ticksPerSecond = 500 }) {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerHeight;
    this.framesPerSecond = 60;
    this.ticksPerSecond = ticksPerSecond;
    /** @type {Array<Circle>} */
    this.circles = [];
    this.createCircles();
    this.drawCircles();
  }

  createCircles() {
    for (const circleId of 50) {
      const radius = Math.random() * 20 + 30;
      let xPosition = Math.random();
      let yPosition = Math.random();
      let circle = new Circle(xPosition, yPosition, radius);
      
      /** probably not the best collision detection @todo: improve this */
      while (circle.collidesWithAnyCircle(this.circles)) {
        yPosition = Math.random();
        xPosition = Math.random();
        circle = new Circle(xPosition, yPosition, radius);
      }
      circle.vx = (2 + Math.random() / 5) * (Math.random() < 0.5 ? 1 : -1);
      circle.vy = 2 + (Math.random() / 5) * (Math.random() < 0.5 ? 1 : -1);

      this.circles.push(circle);
    }
  }

  drawCircles() {
    for (const circle of this.circles) {
      circle.draw(this.ctx);
    }
  }
  /**
   * we do game state updates here
   */
  update() {
    for (const circle of this.circles) {
      circle.move();
      const collidingCircles = circle.collidesWithCircles(this.circles);
      for (const collidingCircle of collidingCircles) {
        circle.bounceOffCircle(collidingCircle);
      }
    }
  }

  /**
   * draws the game state to the canvas
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCircles();
  }

  /**
   * browser api wrapper for calling our render function whenever the browser wants to
   * draw an animation frame, this generally matches the display refresh rate of the device
   */
  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  startLoop() {
    setInterval(() => {
      this.update();
    }, 1000 / this.ticksPerSecond);
    this.animate();
  }
}

window.addEventListener("load", () => {
  const game = new Game({
    ticksPerSecond: 100,
  });

  game.startLoop();
});
