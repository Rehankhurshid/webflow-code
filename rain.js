var container = document.getElementById("animate");
var emoji = ["🔥", "🥪"];
var circles = [];
var generationInterval = 500; // You can adjust this value to control the rate of generation

var lastFrameTime = 0;
var frameInterval = 1000 / 60; // 60 fps

var emojiGenerator;

function generateEmoji() {
  addCircle(
    0,
    window.innerWidth,
    emoji[Math.floor(Math.random() * emoji.length)]
  );
}

function startGenerating() {
  emojiGenerator = setInterval(generateEmoji, generationInterval);
}

function stopGenerating() {
  clearInterval(emojiGenerator);
}

// Start generating emojis continuously right away
startGenerating();

// Pause and resume generation based on page visibility
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    stopGenerating();
  } else {
    startGenerating();
  }
});

function addCircle(xRangeStart, xRangeEnd, color) {
  var c = new Circle(
    xRangeStart + Math.random() * (xRangeEnd - xRangeStart),
    -80 + Math.random() * 50,
    color,
    { x: -0.15 + Math.random() * 0.3, y: (0.5 + Math.random() * 0.5) * 3 }, // Increased the y multiplier from 3 to 6
    [xRangeStart, xRangeEnd]
  );
  circles.push(c);
}

function Circle(x, y, c, v, range) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.color = c;
  this.v = v;
  this.range = range;
  this.element = document.createElement("span");
  this.element.style.opacity = 1;
  this.element.style.position = "absolute";
  this.element.style.fontSize = "40px";
  this.element.style.color = "hsl(" + ((Math.random() * 360) | 0) + ",80%,50%)";
  this.element.innerHTML = c;
  container.appendChild(this.element);
  this.update = function () {
    var newY = _this.y + _this.v.y;
    var newX = _this.x + _this.v.x;
    if (newY > window.innerHeight || _this.x !== newX || _this.y !== newY) {
      _this.y = newY;
      _this.x = newX;
      _this.element.style.transform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
      _this.element.style.webkitTransform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
      _this.element.style.mozTransform =
        "translate3d(" + _this.x + "px, " + _this.y + "px, 0px)";
    }
    if (_this.y > window.innerHeight) {
      var index = circles.indexOf(_this);
      if (index !== -1) {
        circles.splice(index, 1);
        container.removeChild(_this.element);
      }
    }
  };
}

function animate(time) {
  var deltaTime = time - lastFrameTime;
  if (deltaTime >= frameInterval) {
    for (var i = circles.length - 1; i >= 0; i--) {
      circles[i].update();
    }
    lastFrameTime = time;
  }
  requestAnimationFrame(animate);
}

animate();
