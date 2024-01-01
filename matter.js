$(document).ready(function() {
  let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

let engine = Engine.create({
  // Reduce the gravity
  gravity: {
    scale: 0.001, // Adjust this value to control the speed of falling
    x: 0,
    y: 0.25 // Reduced gravity strength for slower falling
  }
});

let render = Render.create({
  element: document.querySelector(".canvas-span"),
  engine: engine,
  options: {
    width: document.querySelector(".canvas-span").offsetWidth,
    height: document.querySelector(".canvas-span").offsetHeight,
    wireframes: false,
    background: "transparent"
  }
});

let fallingBlocks = [];
let blockElements = document.querySelectorAll(".li");

let delay = 0;
let delayIncrement = 500; // Adjust this value to control the delay between blocks falling

blockElements.forEach((block, index) => {
  setTimeout(() => {
    let randomHorizontalOffset = Math.random() * (render.options.width * 0.2); // Random offset between 0 to 20vw
    let startX =
      render.options.width -
      render.options.width * 0.2 -
      randomHorizontalOffset; // 20vw from the right plus random offset
    let startY = -200; // Fixed value above the top of the canvas
    let randomAngle;
    if (index % 2 === 0) {
      // Even index: angle between 0 to +35 degrees
      randomAngle = Math.random() * ((35 * Math.PI) / 180);
    } else {
      // Odd index: angle between 0 to -35 degrees
      randomAngle = Math.random() * ((-35 * Math.PI) / 180);
    }
    let body = Bodies.rectangle(
      startX,
      startY,
      block.offsetWidth,
      block.offsetHeight,
      {
        angle: randomAngle,
        restitution: 0,
        friction: 0.1, // Adjust friction between bodies
        frictionStatic: 0.5, // Adjust static friction
        // frictionAir: 0.05,
        chamfer: { radius: 10 },
        render: {
          visible: false
        }
      }
    );

    let randomAngularVelocity = Math.random() * 0.01 - 0.005; // Random angular velocity between -0.05 to +0.05

    Matter.Body.setAngularVelocity(body, randomAngularVelocity); // Set random angular velocity here

    // Apply a slight random horizontal force to each block
    let randomForce = Math.random() * 0.005 - 0.0025; // Random force between -0.0025 and +0.0025
    Matter.Body.applyForce(body, body.position, { x: randomForce, y: 0 });
    fallingBlocks.push(body);
    World.add(engine.world, body); // Add body to world here
  }, delay);

  delay += delayIncrement;
});
let ground = Bodies.rectangle(
  render.options.width / 2,
  render.options.height,
  render.options.width,
  10,
  {
    isStatic: true,
    render: {
      visible: false
    }
  }
);

// Create static boundaries around the frame
let leftWall = Bodies.rectangle(
  0,
  render.options.height / 2,
  10,
  render.options.height,
  {
    isStatic: true,
    render: {
      visible: false
    }
  }
);
let rightWall = Bodies.rectangle(
  render.options.width,
  render.options.height / 2,
  10,
  render.options.height,
  {
    isStatic: true,
    render: {
      visible: false
    }
  }
);

// Removed ceiling object

World.add(
  engine.world,
  fallingBlocks.concat([ground, leftWall, rightWall]) // Updated to exclude ceiling
);

// Setup mouse constraint for dragging
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2, // You can change the stiffness as per your requirement
      render: {
        visible: false
      }
    }
  });

// Add the mouseConstraint to the world
World.add(engine.world, mouseConstraint);

Engine.run(engine);
Render.run(render);

Matter.Events.on(engine, "afterUpdate", function () {
  fallingBlocks.forEach((block, index) => {
    let position = block.position;
    blockElements[index].style.transform = `translate(${
      position.x - blockElements[index].offsetWidth / 2
    }px, ${position.y - blockElements[index].offsetHeight / 2}px) rotate(${
      block.angle
    }rad)`;
    blockElements[index].style.opacity = "1"; // Set opacity to 1
  });
});

window.addEventListener("scroll", () => {
  gsap.ticker.tick(); // Manually updates GSAP's internal time, which can also trigger ScrollTrigger updates
});
})
