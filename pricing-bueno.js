// let statusText = document.getElementById("status");
// statusText.innerHTML = "Ok 200";

let ethUsdPrice = 0;

$.ajax({
  url:
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  dataType: "json",
  success: function (data) {
    ethUsdPrice = data.ethereum.usd;
    updateValues(); // Initial update on page load
  }
});

function updateValues() {
  let sliderValue = parseInt(
    document.querySelector('[data-value="valueIndicator"]').innerText,
    10
  );
  let outputETH = sliderValue * 0.00009;

  // Convert to string with up to 3 decimal places
  let outputETHStr = outputETH.toFixed(3);
  // Remove trailing zeros
  outputETHStr = parseFloat(outputETHStr).toString();

  $(".ptab-cal_final-val").text(outputETHStr);
  $(".range-dollar").text((outputETH * ethUsdPrice).toFixed(2));
  $(".token-text").text(sliderValue > 1 ? "tokens" : "token");
}

const steps = [
  { id: 1, value: 50 },
  { id: 2, value: 150 },
  { id: 3, value: 350 },
  { id: 4, value: 500 },
  { id: 5, value: 1000 },
  { id: 6, value: 2000 },
  { id: 7, value: 3000 },
  { id: 9, value: 4000 },
  { id: 10, value: 5000 },
  { id: 11, value: 6000 },
  { id: 12, value: 7000 },
  { id: 13, value: 8000 },
  { id: 14, value: 9000 },
  { id: 15, value: 10000 }
];

/* <div class="slider-container" id="sliderContainer" data-min="0" data-max="100" data-value="50">
  <div class="fill" id="fill"></div>
  <div class="slider-thumb" id="sliderThumb"></div>
  <div class="breakpoints" id="breakpoints"> </div>
  <div class="value-indicator" id="valueIndicator">0</div>
</div> */

const sliderContainer = document.getElementById("sliderContainer");
const sliderThumb = document.getElementById("sliderThumb");
const fill = document.getElementById("fill");
const valueIndicator = document.getElementById("valueIndicator");
const breakpointsContainer = document.getElementById("breakpoints");
const numBreakpoints = steps.length;

let isDragging = false;
let breakpointPositions = [];
const thumbOffset = sliderThumb.offsetWidth / 2; // Offset of the thumb

let numElementsInFirstSection = 6; // Set the desired number of elements in the first section
const spacingValue = 50; // Set the desired spacing value

function updateBreakpointPositions() {
  breakpointPositions = Array.from(
    breakpointsContainer.getElementsByClassName("breakpoint")
  ).map((breakpoint) => {
    return breakpoint.offsetLeft;
  });
}

function moveThumbToStep(stepId) {
  const position = findPositionForStep(stepId);
  console.log(position);
  if (position !== null) {
    sliderThumb.style.left = `${position - thumbOffset}px`;
    fill.style.width = `${position}px`;
    const snappedValue = steps.find((step) => step.id === stepId).value;

    const valueIndicators = document.querySelectorAll(
      '[data-value="valueIndicator"]'
    );
    valueIndicators.forEach((indicator) => {
      indicator.innerText = snappedValue;
    });
  }
}

function moveThumbToClosestBreakpoint(position) {
  const closestBreakpoint = findClosestBreakpoint(position);
  sliderThumb.style.left = `${closestBreakpoint - thumbOffset}px`;
  fill.style.width = `${closestBreakpoint}px`;
  const snappedValue =
    steps[breakpointPositions.indexOf(closestBreakpoint)].value;

  const valueIndicators = document.querySelectorAll(
    '[data-value="valueIndicator"]'
  );
  valueIndicators.forEach((indicator) => {
    indicator.innerText = snappedValue;
  });

  updateValues();
}

function findClosestBreakpoint(position) {
  let closest = null;
  let closestDistance = Number.MAX_VALUE;

  breakpointPositions.forEach((breakpointPosition) => {
    const distance = Math.abs(breakpointPosition - position);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = breakpointPosition;
    }
  });

  return closest;
}

function findPositionForStep(stepId) {
  return document.getElementById(stepId).offsetLeft || 0;
}

function addBreakpoints() {
  for (let i = 0; i < numBreakpoints; i++) {
    let position;
    if (i < numElementsInFirstSection) {
      position = (i / numElementsInFirstSection) * spacingValue;
    } else {
      position =
        spacingValue +
        ((i - numElementsInFirstSection) /
          (numBreakpoints - numElementsInFirstSection - 1)) *
          (100 - spacingValue);
    }

    const breakpoint = document.createElement("div");
    breakpoint.classList.add("breakpoint");
    breakpoint.style.left = `${position}%`;
    breakpoint.id = steps[i].id; // Set the step ID as a data attribute
    breakpointsContainer.appendChild(breakpoint);
  }

  updateBreakpointPositions();
}

addBreakpoints();

document.addEventListener("mousedown", (e) => {
  if (
    e.target === sliderThumb ||
    e.target === sliderContainer ||
    e.target.classList.contains("breakpoint")
  ) {
    e.preventDefault();
    isDragging = true;
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    e.preventDefault();
    onMouseMove(e);
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
  }
});

function onMouseDown(e) {
  if (e.target === sliderThumb || e.target === sliderContainer) {
    e.preventDefault();
    isDragging = true;
  } else if (e.target.classList.contains("breakpoint")) {
    e.preventDefault();
    moveThumbToBreakpoint(e.target);
  }
}

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousemove", onMouseMove);

function moveThumbToBreakpoint(breakpoint) {
  const position = breakpoint.offsetLeft + breakpoint.offsetWidth / 2;
  moveThumbToClosestBreakpoint(position);
}

function onMouseMove(e) {
  if (isDragging) {
    e.preventDefault();
    const rect = sliderContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    moveThumbToClosestBreakpoint(offsetX);
  }
}

function onTouchMove(e) {
  if (isDragging) {
    e.preventDefault();
    const offsetX = e.touches[0].clientX - sliderContainer.offsetLeft;
    moveThumbToClosestBreakpoint(offsetX);
  }
}

function onTouchStart(e) {
  if (e.target === sliderThumb || e.target === sliderContainer) {
    e.preventDefault();
    isDragging = true;
  } else if (e.target.classList.contains("breakpoint")) {
    e.preventDefault();
    moveThumbToBreakpoint(e.target);
  }
}

function onTouchEnd() {
  if (isDragging) {
    isDragging = false;
  }
}

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousemove", onMouseMove);

// Add touch event listeners
document.addEventListener("touchstart", onTouchStart);
document.addEventListener("touchmove", onTouchMove);
document.addEventListener("touchend", onTouchEnd);

function updateSliderLayout() {
  // Update breakpoint positions
  updateBreakpointPositions();
  // Move thumb to closest breakpoint to ensure it stays within valid range
  moveThumbToClosestBreakpoint(sliderThumb.offsetLeft + thumbOffset);
}

// Add an event listener for window resize
window.addEventListener("resize", updateSliderLayout);

// Initialize slider layout
updateSliderLayout();

moveThumbToStep(3); // This will move the thumb to step with ID 3
