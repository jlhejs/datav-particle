function rise(options) {
  let THIS = this

  function box(index, x, y) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.r = Math.random() * 5 + 1;
    var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = "rgba(255,255,255," + alpha + ")";
  }
  box.prototype.draw = function () {
    THIS.content.fillStyle = this.color;
    THIS.content.shadowBlur = this.r * 2;
    THIS.content.beginPath();
    THIS.content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    THIS.content.closePath();
    THIS.content.fill();
  };

  function animate() {
    THIS.content.clearRect(0, 0, THIS.canvasWidth, THIS.canvasHeight);
    for (var i in THIS.round) {
      THIS.round[i].move();
    }
    requestAnimationFrame(animate);
  }

  box.prototype.move = function () {
    this.y -= 0.3; //  上升移动速度
    if (this.y <= -10) {
      this.y = THIS.canvasHeight + 10;
    }
    this.draw();
  };

  this.init = function() {
    for (var i = 0; i < this.initRoundPopulation; i++) {
      this.round[i] = new box(i, Math.random() * this.canvasWidth, Math.random() * this.canvasHeight);
      this.round[i].draw();
    }
    animate();
  }

  this.el = options.el
  this.canvas  = document.createElement("canvas")
  this.background = 'linear-gradient(to right, #0cebeb, #20e3b2, #29ffc6)'
  this.el.appendChild(this.canvas);
  if(this.canvas){
    this.content = this.canvas.getContext("2d");
    this.round = [],
    this.initRoundPopulation = 90;
    this.canvas.style.width = (this.el.clientWidth || this.el.offsetWidth || this.el.scrollWidth)+"px";
    this.canvas.style.height = (this.el.clientHeight || this.el.offsetHeight || this.el.scrollHeight)+"px"
    this.canvas.style.background = this.background;
    this.canvasWidth =  this.canvas.clientWidth || this.canvas.offsetWidth || this.canvas.scrollWidth
    this.canvasHeight =  this.canvas.clientHeight || this.canvas.offsetHeight || this.canvas.scrollHeight
    this.init()
  }
}

export default rise;
