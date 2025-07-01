// --- KONAMI CODE (GLOBAL, RELIABLE) ---
let konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let userSequence = [];

document.addEventListener('keydown', function(e) {
  userSequence.push(e.code);
  if (userSequence.length > 10) userSequence.shift();
  if (userSequence.join(',') === konamiSequence.join(',')) {
    const konamiElement = document.getElementById('konami');
    konamiElement.style.opacity = '1';
    createMatrixRain();
    setTimeout(() => {
      konamiElement.style.opacity = '0';
    }, 3000);
  }
});

function createMatrixRain() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const char = String.fromCharCode(0x30A0 + Math.random() * 96);
      const x = Math.random() * window.innerWidth;
      const element = document.createElement('div');
      element.textContent = char;
      element.style.position = 'fixed';
      element.style.left = x + 'px';
      element.style.top = '-20px';
      element.style.color = '#00ff00';
      element.style.fontSize = '20px';
      element.style.zIndex = '9999';
      element.style.pointerEvents = 'none';
      document.body.appendChild(element);
      const animation = element.animate([
        { top: '-20px', opacity: 1 },
        { top: window.innerHeight + 'px', opacity: 0 }
      ], {
        duration: 2000,
        easing: 'linear'
      });
      animation.onfinish = () => {
        document.body.removeChild(element);
      };
    }, i * 100);
  }
}

// Global variables
let clickCount = 0;
let isMatrixMode = false;
let isDanceMode = false;
let gameCanvas, gameCtx;
let gameObjects = [];

// Smooth scrolling for navbar links
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Particle system
class ParticleSystem {
  constructor() {
    this.particlesContainer = document.getElementById('particles');
    this.particles = [];
    this.maxParticles = 50;
    this.init();
  }

  init() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.createParticle();
    }
    this.animate();
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    // Random animation duration
    const duration = 6 + Math.random() * 4;
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    const delay = Math.random() * 6;
    particle.style.animationDelay = delay + 's';
    
    this.particlesContainer.appendChild(particle);
    this.particles.push(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particles = this.particles.filter(p => p !== particle);
        this.createParticle();
      }
    }, (duration + delay) * 1000);
  }

  animate() {
    // Continuously create new particles
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createParticle();
      }
    }, 200);
  }
}

// Typewriter effect
class Typewriter {
  constructor(element, text, speed = 100) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.currentIndex = 0;
    this.isTyping = false;
    this.init();
  }

  init() {
    this.element.textContent = '';
    this.startTyping();
  }

  startTyping() {
    if (this.isTyping) return;
    this.isTyping = true;
    this.type();
  }

  type() {
    if (this.currentIndex < this.text.length) {
      this.element.textContent += this.text.charAt(this.currentIndex);
      this.currentIndex++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.isTyping = false;
      // Restart after a delay
      setTimeout(() => {
        this.currentIndex = 0;
        this.element.textContent = '';
        this.startTyping();
      }, 3000);
    }
  }
}

// Game Canvas System
class GameCanvas {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.init();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw game objects
    gameObjects.forEach(obj => {
      this.ctx.fillStyle = obj.color;
      this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Update position
      obj.y += obj.speed;
      if (obj.y > this.canvas.height) {
        obj.y = -obj.height;
        obj.x = Math.random() * this.canvas.width;
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Mouse Trail Effect
class MouseTrail {
  constructor() {
    this.trail = document.getElementById('mouseTrail');
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.trail.style.left = e.clientX - 5 + 'px';
      this.trail.style.top = e.clientY - 5 + 'px';
    });
  }
}

// Interactive Buttons
class InteractiveButtons {
  constructor() {
    this.init();
  }

  init() {
    // Color change button
    document.getElementById('colorBtn').addEventListener('click', () => {
      this.changeColors();
    });

    // Matrix mode button
    document.getElementById('matrixBtn').addEventListener('click', () => {
      this.toggleMatrixMode();
    });

    // Dance mode button
    document.getElementById('danceBtn').addEventListener('click', () => {
      this.toggleDanceMode();
    });

    // Secret button
    document.getElementById('secretBtn').addEventListener('click', () => {
      this.showSecretSection();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetEverything();
    });
  }

  changeColors() {
    const colors = ['#39ff14', '#ff00cc', '#00ffff', '#ffff00', '#ff8000', '#8000ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Change the CSS variable
    document.documentElement.style.setProperty('--neon-color', randomColor);
    
    // Update ALL neon elements throughout the portfolio (except .retro-btn color)
    const neonElements = document.querySelectorAll('.neon-title, .navbar a, .skill-item, .project-card h3, .contact-section a');
    neonElements.forEach(el => {
      el.style.color = randomColor;
      el.style.textShadow = `0 0 5px ${randomColor}, 0 0 10px ${randomColor}`;
    });
    
    // Change button borders and boxes (but NOT color)
    const buttons = document.querySelectorAll('.retro-btn');
    buttons.forEach(btn => {
      btn.style.borderColor = randomColor;
      btn.style.boxShadow = `0 0 10px ${randomColor}`;
      btn.style.color = '';
      btn.style.textShadow = '';
    });
    
    // Change skill item borders
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(skill => {
      skill.style.borderColor = randomColor;
      skill.style.boxShadow = `0 0 10px ${randomColor}`;
    });
    
    // Change project card borders and titles
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.style.borderColor = randomColor;
      card.style.boxShadow = `0 0 10px ${randomColor}`;
    });
    
    // Change section borders
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.borderColor = randomColor;
      section.style.boxShadow = `0 0 20px ${randomColor}, 0 0 40px ${randomColor} inset`;
    });
    
    // Change social icons
    const socialIcons = document.querySelectorAll('.social-icon svg');
    socialIcons.forEach(icon => {
      icon.style.fill = randomColor;
      icon.style.filter = `drop-shadow(0 0 5px ${randomColor})`;
    });
    
    // Change navbar border
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.borderBottomColor = randomColor;
      navbar.style.boxShadow = `0 0 20px ${randomColor}`;
    }
    
    // Add flash effect
    document.body.style.animation = 'flash 0.3s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 300);
  }

  toggleMatrixMode() {
    isMatrixMode = !isMatrixMode;
    document.body.classList.toggle('matrix-mode', isMatrixMode);
    
    if (isMatrixMode) {
      // Create matrix characters
      this.createMatrixCharacters();
    }
  }

  toggleDanceMode() {
    isDanceMode = !isDanceMode;
    document.body.classList.toggle('dance-mode', isDanceMode);
    
    if (isDanceMode) {
      // Add dance music effect (visual only)
      this.createDanceEffect();
    } else {
      // Stop dance effect
      this.stopDanceEffect();
    }
  }

  stopDanceEffect() {
    const elements = document.querySelectorAll('.floating-icon, .project-card, .skill-item');
    elements.forEach((el) => {
      el.style.animation = '';
    });
  }

  showSecretSection() {
    const secretSection = document.getElementById('secretSection');
    secretSection.style.display = 'block';
    
    // Add confetti effect
    this.createConfetti();
  }

  resetEverything() {
    document.body.classList.remove('matrix-mode', 'dance-mode');
    isMatrixMode = false;
    isDanceMode = false;
    clickCount = 0;
    document.getElementById('clickCount').textContent = '0';
    document.getElementById('secretSection').style.display = 'none';
    
    // Reset colors
    document.documentElement.style.setProperty('--neon-color', '#39ff14');
    
    // Remove all inline styles set by color changer
    const neonElements = document.querySelectorAll('.neon-title, .navbar a, .retro-btn, .skill-item, .project-card h3, .contact-section a');
    neonElements.forEach(el => {
      el.style.color = '';
      el.style.textShadow = '';
    });
    const buttons = document.querySelectorAll('.retro-btn');
    buttons.forEach(btn => {
      btn.style.borderColor = '';
      btn.style.boxShadow = '';
    });
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(skill => {
      skill.style.borderColor = '';
      skill.style.boxShadow = '';
      skill.style.animation = '';
    });
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
      card.style.animation = '';
    });
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach(icon => {
      icon.style.animation = '';
    });
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.borderColor = '';
      section.style.boxShadow = '';
    });
    const socialIcons = document.querySelectorAll('.social-icon svg');
    socialIcons.forEach(icon => {
      icon.style.fill = '';
      icon.style.filter = '';
    });
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.borderBottomColor = '';
      navbar.style.boxShadow = '';
    }
  }

  createMatrixCharacters() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = Math.random() * window.innerWidth;
        const element = document.createElement('div');
        element.textContent = char;
        element.style.position = 'fixed';
        element.style.left = x + 'px';
        element.style.top = '-20px';
        element.style.color = '#00ff00';
        element.style.fontSize = '16px';
        element.style.zIndex = '9999';
        element.style.pointerEvents = 'none';
        document.body.appendChild(element);
        
        const animation = element.animate([
          { top: '-20px', opacity: 1 },
          { top: window.innerHeight + 'px', opacity: 0 }
        ], {
          duration: 3000,
          easing: 'linear'
        });
        
        animation.onfinish = () => {
          document.body.removeChild(element);
        };
      }, i * 100);
    }
  }

  createDanceEffect() {
    const elements = document.querySelectorAll('.floating-icon, .project-card, .skill-item');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = 'dance 0.5s infinite alternate';
      }, index * 100);
    });
  }

  createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
          { top: '-10px', transform: 'rotate(0deg)' },
          { top: window.innerHeight + 'px', transform: 'rotate(360deg)' }
        ], {
          duration: 3000,
          easing: 'ease-in'
        });
        
        animation.onfinish = () => {
          document.body.removeChild(confetti);
        };
      }, i * 50);
    }
  }
}

// Click Counter
class ClickCounter {
  constructor() {
    this.counter = document.getElementById('clickCount');
    this.counterElement = document.getElementById('clickCounter');
    this.init();
  }

  init() {
    document.addEventListener('click', () => {
      clickCount++;
      this.counter.textContent = clickCount;
      
      // Show counter after first click
      if (clickCount === 1) {
        this.counterElement.style.opacity = '1';
      }
      
      // Special effects at certain click counts
      if (clickCount === 10) {
        this.createClickEffect();
      } else if (clickCount === 50) {
        this.createMegaClickEffect();
      }
    });
  }

  createClickEffect() {
    const effect = document.createElement('div');
    effect.textContent = '🎉 10 CLICKS!';
    effect.style.position = 'fixed';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.color = '#ff00cc';
    effect.style.fontSize = '2rem';
    effect.style.zIndex = '9999';
    effect.style.pointerEvents = 'none';
    document.body.appendChild(effect);
    
    const animation = effect.animate([
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
    ], {
      duration: 2000,
      easing: 'ease-out'
    });
    
    animation.onfinish = () => {
      document.body.removeChild(effect);
    };
  }

  createMegaClickEffect() {
    // Create a massive celebration effect
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.textContent = '🎊🎉🎊';
        celebration.style.position = 'fixed';
        celebration.style.left = Math.random() * window.innerWidth + 'px';
        celebration.style.top = Math.random() * window.innerHeight + 'px';
        celebration.style.fontSize = '3rem';
        celebration.style.zIndex = '9999';
        celebration.style.pointerEvents = 'none';
        document.body.appendChild(celebration);
        
        const animation = celebration.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(3)' }
        ], {
          duration: 3000,
          easing: 'ease-out'
        });
        
        animation.onfinish = () => {
          document.body.removeChild(celebration);
        };
      }, i * 200);
    }
  }
}

// --- SNAKE GAME ---
let snakeGameActive = false;
let snakeGameInterval = null;
let snake = [];
let snakeDir = 'right';
let snakeFood = null;
let snakeScore = 0;
const gridSize = 16;
const tileCount = 20;

function startSnakeGame() {
  const canvas = document.getElementById('snakeGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  snake = [ {x: 8, y: 10}, {x: 7, y: 10}, {x: 6, y: 10} ];
  snakeDir = 'right';
  snakeFood = placeFood();
  snakeScore = 0;
  snakeGameActive = true;
  drawSnakeGame(ctx);
  if (snakeGameInterval) clearInterval(snakeGameInterval);
  snakeGameInterval = setInterval(() => updateSnakeGame(ctx), 120);
}

function stopSnakeGame() {
  snakeGameActive = false;
  if (snakeGameInterval) clearInterval(snakeGameInterval);
}

function placeFood() {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
}

function updateSnakeGame(ctx) {
  if (!snakeGameActive) return;
  // Move snake
  const head = { ...snake[0] };
  if (snakeDir === 'left') head.x--;
  if (snakeDir === 'right') head.x++;
  if (snakeDir === 'up') head.y--;
  if (snakeDir === 'down') head.y++;

  // Check collision
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    stopSnakeGame();
    drawSnakeGame(ctx, true);
    return;
  }

  snake.unshift(head);
  // Eat food
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore++;
    snakeFood = placeFood();
  } else {
    snake.pop();
  }
  drawSnakeGame(ctx);
}

function drawSnakeGame(ctx, gameOver = false) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Draw grid
  ctx.strokeStyle = '#222';
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, ctx.canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(ctx.canvas.width, i * gridSize);
    ctx.stroke();
  }
  // Draw snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#39ff14' : '#00ffcc';
    ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize);
  });
  // Draw food
  ctx.fillStyle = '#ff00cc';
  ctx.fillRect(snakeFood.x * gridSize, snakeFood.y * gridSize, gridSize, gridSize);
  // Draw score
  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + snakeScore, 8, 24);
  // Game over
  if (gameOver) {
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = '#ff0044';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('Press any arrow to restart', ctx.canvas.width/2, ctx.canvas.height/2 + 32);
  }
  if (gameOver && snakeScore > 0) {
    setTimeout(() => showScoreForm(snakeScore), 500);
  } else {
    renderHallOfFame();
  }
}

function handleSnakeKey(e) {
  if (!snakeGameActive) {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
      startSnakeGame();
    }
    return;
  }
  if (e.code === 'ArrowUp' && snakeDir !== 'down') snakeDir = 'up';
  if (e.code === 'ArrowDown' && snakeDir !== 'up') snakeDir = 'down';
  if (e.code === 'ArrowLeft' && snakeDir !== 'right') snakeDir = 'left';
  if (e.code === 'ArrowRight' && snakeDir !== 'left') snakeDir = 'right';
}

function setupSnakeControls() {
  const controls = document.getElementById('snakeControls');
  if (!controls) return;
  controls.innerHTML = '';
  // Mobile controls
  const btns = [
    {dir:'up',icon:'⬆️'},
    {dir:'left',icon:'⬅️'},
    {dir:'down',icon:'⬇️'},
    {dir:'right',icon:'➡️'}
  ];
  btns.forEach(btn => {
    const b = document.createElement('button');
    b.textContent = btn.icon;
    b.className = 'retro-btn';
    b.style.width = '48px';
    b.style.height = '48px';
    b.onclick = () => {
      if (!snakeGameActive) startSnakeGame();
      snakeDir = btn.dir;
    };
    controls.appendChild(b);
  });
}

// Show/hide snake game with secret section
const origShowSecretSection = InteractiveButtons.prototype.showSecretSection;
InteractiveButtons.prototype.showSecretSection = function() {
  origShowSecretSection.call(this);
  setTimeout(() => {
    startSnakeGame();
    setupSnakeControls();
    window.addEventListener('keydown', handleSnakeKey);
  }, 100);
};

// Stop snake game on reset/close
const origResetEverything = InteractiveButtons.prototype.resetEverything;
InteractiveButtons.prototype.resetEverything = function() {
  stopSnakeGame();
  window.removeEventListener('keydown', handleSnakeKey);
  origResetEverything.call(this);
};

// --- SNAKE HALL OF FAME ---
function getHallOfFame() {
  return JSON.parse(localStorage.getItem('snakeHallOfFame') || '[]');
}
function setHallOfFame(entries) {
  localStorage.setItem('snakeHallOfFame', JSON.stringify(entries));
}
function renderHallOfFame(newHighScore = false) {
  const hof = getHallOfFame();
  const container = document.getElementById('hallOfFame');
  if (!container) return;
  let html = `<h3 style='color:#39ff14;text-shadow:0 0 8px #39ff14;'>🏆 Hall of Fame</h3>`;
  if (hof.length === 0) {
    html += `<p style='color:#fff;'>No scores yet. Be the first!</p>`;
  } else {
    html += `<table style='margin:0 auto 1rem auto;color:#fff;font-family:monospace;font-size:1.2rem;box-shadow:0 0 12px #39ff14;width:95%;max-width:600px;'>`;
    html += `<tr><th style='color:#ff00cc;'>#</th><th>Name</th><th>Title</th><th>Score</th></tr>`;
    hof.sort((a,b) => b.score - a.score).forEach((entry, i) => {
      html += `<tr${i===0?" style='font-weight:bold;color:#39ff14;'":''}><td>${i+1}</td><td>${entry.name}</td><td>${entry.title}</td><td>${entry.score}</td></tr>`;
    });
    html += `</table>`;
  }
  if (newHighScore) {
    html += `<div style='color:#ffff00;font-size:1.2rem;text-shadow:0 0 8px #ff0;'>🎉 New High Score! 🎉</div>`;
  }
  container.innerHTML = html;
}
function showScoreForm(score) {
  const container = document.getElementById('hallOfFame');
  if (!container) return;
  container.innerHTML = `<form id='hofForm' style='margin:1rem auto 2rem auto;max-width:400px;'>
    <div style='margin-bottom:0.5rem;'>
      <input id='hofName' type='text' maxlength='16' placeholder='Your Name' required style='width:100%;font-size:1.1rem;padding:0.5rem;border-radius:6px;border:2px solid #39ff14;background:#111;color:#fff;'/>
    </div>
    <div style='margin-bottom:0.5rem;'>
      <input id='hofTitle' type='text' maxlength='32' placeholder='Your Title ' style='width:100%;font-size:1.1rem;padding:0.5rem;border-radius:6px;border:2px solid #ff00cc;background:#111;color:#fff;'/>
    </div>
    <button type='submit' class='retro-btn' style='width:100%;'>Save Score (${score})</button>
  </form>`;
  document.getElementById('hofForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('hofName').value.trim() || 'Anonymous';
    const title = document.getElementById('hofTitle').value.trim() || '';
    const hof = getHallOfFame();
    hof.push({ name, title, score });
    setHallOfFame(hof);
    const isHighScore = hof.length === 1 || score === Math.max(...hof.map(e=>e.score));
    renderHallOfFame(isHighScore);
  };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Start all systems
  new ParticleSystem();
  new Typewriter(document.getElementById('typewriter'), '1 year CS engineering student', 150);
  new GameCanvas();
  new MouseTrail();
  new InteractiveButtons();
  new ClickCounter();
  
  // Add click effects to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
      // Add a ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(57, 255, 20, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.marginLeft = '-10px';
      ripple.style.marginTop = '-10px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    });
  });

  // Add skill item interactions
  document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('click', function() {
      const skillName = this.getAttribute('data-skill');
      this.textContent = `🎯 ${skillName} MASTER! 🎯`;
      this.style.animation = 'rainbow 1s infinite';
      
      setTimeout(() => {
        this.textContent = skillName;
        this.style.animation = '';
      }, 2000);
    });
  });

  // Create initial game objects
  for (let i = 0; i < 5; i++) {
    gameObjects.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: 20,
      height: 20,
      speed: 1 + Math.random() * 2,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`
    });
  }

  // Add close button logic for secret section
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
      const closeBtn = document.getElementById('closeSecretBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          const secretSection = document.getElementById('secretSection');
          if (secretSection) secretSection.style.display = 'none';
          stopSnakeGame();
          window.removeEventListener('keydown', handleSnakeKey);
          // Optionally, focus the navbar or main content
          const nav = document.querySelector('.navbar a');
          if (nav) nav.focus();
        });
      }
    });
  }
});

// Add additional CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes flash {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.5); }
  }
  
  :root {
    --neon-color: #39ff14;
  }
`;
document.head.appendChild(style);

// --- RETRO SOUND EFFECTS ---
const sounds = {
  click: new Audio('assets/sounds/button_click.mp3'),
  eat: new Audio('assets/sounds/Snake_eat.mp3'),
  gameover: new Audio('assets/sounds/game_over.wav'),
  highscore: new Audio('assets/sounds/new_high_score.mp3'),
};
Object.values(sounds).forEach(snd => { snd.volume = 0.5; });
function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}
// --- Add sound to UI buttons ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.retro-btn, .navbar a, #closeSecretBtn').forEach(btn => {
    btn.addEventListener('click', () => playSound('click'));
  });
});
// --- Add sound to Snake game events ---
// Play eat sound
const origUpdateSnakeGame = updateSnakeGame;
updateSnakeGame = function(ctx) {
  const prevLen = snake.length;
  origUpdateSnakeGame(ctx);
  if (snake.length > prevLen) playSound('eat');
};
// Play game over sound
const origDrawSnakeGameSound = drawSnakeGame;
drawSnakeGame = function(ctx, gameOver = false) {
  origDrawSnakeGameSound(ctx, gameOver);
  if (gameOver && snakeScore > 0) {
    setTimeout(() => showScoreForm(snakeScore), 500);
    playSound('gameover');
  } else {
    renderHallOfFame();
  }
};
// Play high score sound
function renderHallOfFame(newHighScore = false) {
  const hof = getHallOfFame();
  const container = document.getElementById('hallOfFame');
  if (!container) return;
  let html = `<h3 style='color:#39ff14;text-shadow:0 0 8px #39ff14;'>🏆 Hall of Fame</h3>`;
  if (hof.length === 0) {
    html += `<p style='color:#fff;'>No scores yet. Be the first!</p>`;
  } else {
    html += `<table style='margin:0 auto 1rem auto;color:#fff;font-family:monospace;font-size:1.2rem;box-shadow:0 0 12px #39ff14;width:95%;max-width:600px;'>`;
    html += `<tr><th style='color:#ff00cc;'>#</th><th>Name</th><th>Title</th><th>Score</th></tr>`;
    hof.sort((a,b) => b.score - a.score).forEach((entry, i) => {
      html += `<tr${i===0?" style='font-weight:bold;color:#39ff14;'":''}><td>${i+1}</td><td>${entry.name}</td><td>${entry.title}</td><td>${entry.score}</td></tr>`;
    });
    html += `</table>`;
  }
  if (newHighScore) {
    html += `<div style='color:#ffff00;font-size:1.2rem;text-shadow:0 0 8px #ff0;'>🎉 New High Score! 🎉</div>`;
    playSound('highscore');
  }
  container.innerHTML = html;
}

// --- PIXEL MASCOT REACTIONS ---
function mascotSetFace(expression) {
  const mouth = document.getElementById('mascotMouth');
  const eyeL = document.getElementById('mascotEyeL');
  const eyeR = document.getElementById('mascotEyeR');
  if (!mouth || !eyeL || !eyeR) return;
  // Reset
  mouth.setAttribute('class', '');
  eyeL.setAttribute('class', '');
  eyeR.setAttribute('class', '');
  // Default neutral
  mouth.setAttribute('cx', 40);
  mouth.setAttribute('cy', 48);
  mouth.setAttribute('rx', 6);
  mouth.setAttribute('ry', 3);
  mouth.setAttribute('fill', '#111');
  eyeL.setAttribute('cy', 38);
  eyeL.setAttribute('r', 3);
  eyeR.setAttribute('cy', 38);
  eyeR.setAttribute('r', 3);
  // Expressions
  if (expression === 'happy') {
    mouth.setAttribute('cy', 52);
    mouth.setAttribute('rx', 8);
    mouth.setAttribute('ry', 4);
    mouth.setAttribute('fill', '#39ff14');
    eyeL.setAttribute('cy', 40);
    eyeL.setAttribute('r', 2.5);
    eyeR.setAttribute('cy', 40);
    eyeR.setAttribute('r', 2.5);
  } else if (expression === 'sad') {
    mouth.setAttribute('cy', 54);
    mouth.setAttribute('rx', 8);
    mouth.setAttribute('ry', 4);
    mouth.setAttribute('fill', '#ff00cc');
    eyeL.setAttribute('cy', 42);
    eyeL.setAttribute('r', 2);
    eyeR.setAttribute('cy', 42);
    eyeR.setAttribute('r', 2);
  } else if (expression === 'oh') {
    mouth.setAttribute('cy', 52);
    mouth.setAttribute('rx', 4);
    mouth.setAttribute('ry', 6);
    mouth.setAttribute('fill', '#ff00cc');
    eyeL.setAttribute('cy', 38);
    eyeL.setAttribute('r', 3);
    eyeR.setAttribute('cy', 38);
    eyeR.setAttribute('r', 3);
  } else if (expression === 'celebrate') {
    mouth.setAttribute('cy', 52);
    mouth.setAttribute('rx', 10);
    mouth.setAttribute('ry', 5);
    mouth.setAttribute('fill', '#ffff00');
    eyeL.setAttribute('cy', 40);
    eyeL.setAttribute('r', 2.5);
    eyeR.setAttribute('cy', 40);
    eyeR.setAttribute('r', 2.5);
  }
}
// Update mascotReact to handle hand visibility
function mascotReact(type, message = '') {
  const mascot = document.getElementById('pixelMascot');
  const speech = document.getElementById('mascotSpeech');
  const handGroup = document.getElementById('mascotHandGroup');
  if (!mascot) return;
  mascot.classList.remove('jump', 'wave', 'celebrate', 'sad');
  void mascot.offsetWidth; // force reflow for animation restart
  // Set face
  if (type === 'wave') mascotSetFace('happy');
  else if (type === 'jump') mascotSetFace('happy');
  else if (type === 'celebrate') mascotSetFace('celebrate');
  else if (type === 'sad') mascotSetFace('sad');
  else mascotSetFace('');
  // Handle hand visibility and wave
  if (type === 'wave') {
    if (handGroup) {
      handGroup.style.opacity = '1';
      mascot.classList.add('wave');
      setTimeout(() => {
        if (handGroup) handGroup.style.opacity = '0';
      }, 800);
    }
  }
  if (speech) {
    if (message) {
      speech.textContent = message;
      speech.classList.add('visible');
    } else {
      speech.classList.remove('visible');
      setTimeout(() => { speech.textContent = ''; }, 200);
    }
  }
  if (type === 'wave') setTimeout(() => mascot.classList.remove('wave'), 800);
  if (message) setTimeout(() => {
    if (speech) speech.classList.remove('visible');
    setTimeout(() => { if (speech) speech.textContent = ''; }, 200);
  }, 2200);
}

// --- Wire mascot to actions in secret section ---
function isSecretSectionVisible() {
  const s = document.getElementById('secretSection');
  return s && s.style.display !== 'none';
}
// Color change, dance, matrix mode
['colorBtn','danceBtn','matrixBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      if (isSecretSectionVisible()) mascotReact('jump', 'Nice color!');
    });
  }
});
// Snake game events
const origUpdateSnakeGameMascot = updateSnakeGame;
updateSnakeGame = function(ctx) {
  const prevLen = snake.length;
  origUpdateSnakeGameMascot(ctx);
  if (snake.length > prevLen && isSecretSectionVisible()) {
    // Show speech bubble and change face, but no hand wave
    const speech = document.getElementById('mascotSpeech');
    if (speech) {
      speech.textContent = 'Yum!';
      speech.classList.add('visible');
      setTimeout(() => {
        speech.classList.remove('visible');
        setTimeout(() => { speech.textContent = ''; }, 200);
      }, 1500);
    }
    mascotSetFace('happy');
    setTimeout(() => mascotSetFace('happy'), 1000);
  }
};
const origDrawSnakeGameMascot = drawSnakeGame;
drawSnakeGame = function(ctx, gameOver = false) {
  origDrawSnakeGameMascot(ctx, gameOver);
  if (gameOver && snakeScore > 0 && isSecretSectionVisible()) {
    setTimeout(() => showScoreForm(snakeScore), 500);
    // Show speech bubble and change face, but no hand wave
    const speech = document.getElementById('mascotSpeech');
    if (speech) {
      speech.textContent = 'Ouch! Try again!';
      speech.classList.add('visible');
      setTimeout(() => {
        speech.classList.remove('visible');
        setTimeout(() => { speech.textContent = ''; }, 200);
      }, 2000);
    }
    mascotSetFace('sad');
    setTimeout(() => mascotSetFace('sad'), 2000);
    playSound('gameover');
  } else {
    renderHallOfFame();
  }
};
// High score
function renderHallOfFame(newHighScore = false) {
  const hof = getHallOfFame();
  const container = document.getElementById('hallOfFame');
  if (!container) return;
  let html = `<h3 style='color:#39ff14;text-shadow:0 0 8px #39ff14;'>🏆 Hall of Fame</h3>`;
  if (hof.length === 0) {
    html += `<p style='color:#fff;'>No scores yet. Be the first!</p>`;
  } else {
    html += `<table style='margin:0 auto 1rem auto;color:#fff;font-family:monospace;font-size:1.2rem;box-shadow:0 0 12px #39ff14;width:95%;max-width:600px;'>`;
    html += `<tr><th style='color:#ff00cc;'>#</th><th>Name</th><th>Title</th><th>Score</th></tr>`;
    hof.sort((a,b) => b.score - a.score).forEach((entry, i) => {
      html += `<tr${i===0?" style='font-weight:bold;color:#39ff14;'":''}><td>${i+1}</td><td>${entry.name}</td><td>${entry.title}</td><td>${entry.score}</td></tr>`;
    });
    html += `</table>`;
  }
  if (newHighScore) {
    html += `<div style='color:#ffff00;font-size:1.2rem;text-shadow:0 0 8px #ff0;'>🎉 New High Score! 🎉</div>`;
    playSound('highscore');
    if (isSecretSectionVisible()) {
      // Show speech bubble and change face, but no hand wave
      const speech = document.getElementById('mascotSpeech');
      if (speech) {
        speech.textContent = 'New High Score!';
        speech.classList.add('visible');
        setTimeout(() => {
          speech.classList.remove('visible');
          setTimeout(() => { speech.textContent = ''; }, 200);
        }, 3000);
      }
      mascotSetFace('celebrate');
      setTimeout(() => mascotSetFace('happy'), 3000);
    }
  }
  container.innerHTML = html;
}
// Button clicks in secret section
['resetBtn','closeSecretBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      if (isSecretSectionVisible()) {
        const handGroup = document.getElementById('mascotHandGroup');
        if (handGroup) handGroup.style.opacity = '1';
        mascotReact('wave', 'See you soon!');
      }
    });
  }
});
// Show mascot when secret section is shown
const origShowSecretSectionMascot = InteractiveButtons.prototype.showSecretSection;
InteractiveButtons.prototype.showSecretSection = function() {
  origShowSecretSectionMascot.call(this);
  setTimeout(() => {
    renderHallOfFame();
    mascotReact('wave', 'Welcome!');
    // Set default happy face after wave to ensure mouth is always visible
    setTimeout(() => {
      mascotSetFace('happy');
    }, 800);
  }, 120);
};

// --- PROJECT DESCRIPTION TOGGLE ---
function toggleDescription(button) {
  const projectCard = button.closest('.project-card');
  const preview = projectCard.querySelector('.project-preview');
  const fullDescription = projectCard.querySelector('.project-full-description');
  
  if (fullDescription.style.display === 'none') {
    // Show full description
    preview.style.display = 'none';
    fullDescription.style.display = 'block';
    button.textContent = '📖 Show Less';
    button.classList.add('active');
  } else {
    // Hide full description
    preview.style.display = 'block';
    fullDescription.style.display = 'none';
    button.textContent = '📖 Read More';
    button.classList.remove('active');
  }
} 