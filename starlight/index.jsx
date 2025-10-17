/**
 * Starlight - A Cosmic Visualization Tool
 * Interactive starry sky visualizations in the browser
 */

class Starlight {
  constructor(options = {}) {
    this.canvas = options.canvas;
    this.stars = options.stars || 100;
    this.constellations = options.constellations || [];
    this.planets = options.planets || [];
    this.theme = options.theme || 'default';
    this.animations = options.animations || {};
    this.ctx = this.canvas.getContext('2d');
    this.starsArray = [];
    this.animationId = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (!this.canvas) {
      throw new Error('Canvas element is required');
    }

    this.resizeCanvas();
    this.generateStars();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  generateStars() {
    this.starsArray = [];
    for (let i = 0; i < this.stars; i++) {
      this.starsArray.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedStar = this.getStarAtPosition(x, y);
      if (clickedStar) {
        this.emit('starClick', { star: clickedStar });
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check for constellation hover
      // Implementation for constellation detection would go here
    });
  }

  getStarAtPosition(x, y) {
    return this.starsArray.find(star => {
      const distance = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2);
      return distance < star.radius * 3;
    });
  }

  render() {
    if (!this.isInitialized) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    // Draw stars
    this.drawStars();

    // Draw constellations
    this.drawConstellations();

    // Draw planets
    this.drawPlanets();

    // Animate if enabled
    if (this.animations.twinkle) {
      this.animateTwinkle();
    }

    if (this.animations.shootingStars) {
      this.animateShootingStars();
    }

    this.animationId = requestAnimationFrame(() => this.render());
  }

  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    switch (this.theme) {
      case 'midnight':
        gradient.addColorStop(0, '#000011');
        gradient.addColorStop(1, '#000033');
        break;
      case 'aurora':
        gradient.addColorStop(0, '#001122');
        gradient.addColorStop(0.5, '#003344');
        gradient.addColorStop(1, '#001122');
        break;
      default:
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#000022');
    }
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStars() {
    this.starsArray.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.fill();
    });
  }

  drawConstellations() {
    // Simplified constellation drawing
    // In a real implementation, you'd have constellation data
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;

    // Example: Draw Orion constellation lines
    if (this.constellations.includes('Orion')) {
      this.ctx.beginPath();
      // Simplified Orion lines - in reality, use actual star positions
      this.ctx.moveTo(100, 100);
      this.ctx.lineTo(150, 120);
      this.ctx.lineTo(200, 100);
      this.ctx.stroke();
    }
  }

  drawPlanets() {
    this.planets.forEach(planet => {
      this.ctx.beginPath();
      this.ctx.arc(planet.x || Math.random() * this.canvas.width,
                   planet.y || Math.random() * this.canvas.height,
                   planet.size || 5, 0, Math.PI * 2);
      this.ctx.fillStyle = planet.color || '#FF6B35';
      this.ctx.fill();
    });
  }

  animateTwinkle() {
    this.starsArray.forEach(star => {
      star.twinkleOffset += star.twinkleSpeed;
      star.brightness = 0.5 + 0.5 * Math.sin(star.twinkleOffset);
    });
  }

  animateShootingStars() {
    // Simple shooting star animation
    // In a real implementation, this would be more sophisticated
    if (Math.random() < 0.005) { // Occasional shooting star
      const startX = Math.random() * this.canvas.width;
      const startY = 0;
      const endX = startX + 200;
      const endY = this.canvas.height;

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }
  }

  update(options) {
    Object.assign(this, options);
    if (options.stars && options.stars !== this.stars) {
      this.stars = options.stars;
      this.generateStars();
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
    this.isInitialized = false;
  }

  on(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners && this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Starlight;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return Starlight; });
} else {
  window.Starlight = Starlight;
}
