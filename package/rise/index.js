function rise(options) {
  
  const WIDTH = (options.el.clientWidth || options.el.offsetWidth || options.el.scrollWidth)
  const HEIGHT = options.el.clientHeight || options.el.offsetHeight || options.el.scrollHeight;
  
  let ctx = document.createElement('canvas'),
      content = ctx.getContext('2d'),
      round = [],
      initRoundPopulation = options.size||80;
  ctx.width = WIDTH;
  ctx.height = HEIGHT;
  options.el.appendChild(ctx);
  ctx.style.background = options.background||'linear-gradient(to right, #0cebeb, #20e3b2, #29ffc6)';
  function box(index, x, y) {
      this.index = index;
      this.x = x;
      this.y = y;
      this.r = Math.random() * 5 + 1;
      var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
      this.color = "rgba(255,255,255," + alpha + ")";
  }

  box.prototype.draw = function() {
      content.fillStyle = this.color;
      content.shadowBlur = this.r * 2;
      content.beginPath();
      content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      content.closePath();
      content.fill();
  };

  function animate() {
      content.clearRect(0, 0, WIDTH, HEIGHT);
      for (var i in round) {
          round[i].move();
      }
      requestAnimationFrame(animate)
  }
  
  box.prototype.move = function() {
      this.y -= options.speed ||  0.30;   //  上升移动速度
      if (this.y <= -10) {
          this.y = HEIGHT + 10;
      }
      this.draw();
  };

  function init() {
      for (var i = 0; i < initRoundPopulation; i++) {
          round[i] = new box(i, Math.random() * WIDTH, Math.random() * HEIGHT);
          round[i].draw();
      }
      animate();
  }
  init();
}

export default rise;
