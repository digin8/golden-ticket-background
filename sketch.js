/*  Golden Ticket Background Animation
    ---------------------------------
    Semi-transparent navy overlay with twinkling sparkles.
    Built with p5.js for simplicity.
*/

// Store animated elements
const clouds = [];
const sparkles = [];

function setup() {
  // Create full-screen transparent canvas and attach to overlay DIV
  const c = createCanvas(windowWidth, windowHeight);
  c.parent('overlay');
  noStroke();
  colorMode(HSL, 360, 100, 100, 1);

  // Spawn translucent clouds for depth
  for (let i = 0; i < 12; i++) {
    clouds.push(new Cloud(random(width)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear(); // keep background image visible

  // ---- Clouds ----
  clouds.forEach(cl => {
    cl.update();
    cl.render();
  });

  // ---- Sparkles ----
  // Spawn new sparkles more frequently
  if (frameCount % 12 === 0) {
    sparkles.push(new Sparkle());
    // Occasionally add an extra sparkle for more density
    if (random() < 0.3) sparkles.push(new Sparkle());
  }

  // Update & render sparkles with sharper appearance
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.update();
    s.render();
    if (s.isFinished()) sparkles.splice(i, 1);
  }
}

// ----------------------------------------
//  Cloud class
// ----------------------------------------
class Cloud {
  constructor(startX = -200) {
    this.reset(startX);
  }

  reset(xPos) {
    const hueVal = random(210, 230); // navy-ish variation
    const satVal = random(15, 35);
    const lightVal = random(12, 25);
    this.col = color(hueVal, satVal, lightVal, 0.05);

    // Position clouds in the middle area
    this.y = random(height * 0.3, height * 0.7);
    this.x = xPos;
    this.radius = random(width * 0.4, width * 0.7);
    // Slow drift
    this.speed = random(0.035, 0.08);
  }

  update() {
    this.x += this.speed;
    if (this.x - this.radius > width) {
      this.reset(-this.radius);
    }
  }

  render() {
    const steps = 10;
    const baseAlpha = alpha(this.col);
    for (let i = steps; i >= 1; i--) {
      const r = this.radius * (i / steps);
      const a = baseAlpha * (i / steps);
      fill(hue(this.col), saturation(this.col), lightness(this.col), a);
      ellipse(this.x, this.y, r * 2);
    }
  }
}

// ----------------------------------------
//  Sparkle class
// ----------------------------------------
class Sparkle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.maxR = random(2, 4);
    this.r = 0;
    this.fade = 1; // alpha value (1 → 0)
  }

  update() {
    this.r += 0.2;
    this.fade -= 0.01;
  }

  isFinished() {
    return this.fade <= 0;
  }

  render() {
    if (this.fade <= 0) return;

    // Draw a small 4-point star (two crossed lines) for glint effect
    push();
    translate(this.x, this.y);
    const alphaVal = this.fade;
    stroke(0, 0, 100, alphaVal);
    strokeWeight(1.5); // Thinner lines for sharper appearance
    line(-this.r, 0, this.r, 0);
    line(0, -this.r, 0, this.r);
    pop();
  }
} 