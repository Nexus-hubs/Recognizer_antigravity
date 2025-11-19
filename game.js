// ===== LUXURIOUS LIGHT CYCLES - TRON 1982 EDITION =====
// Enhanced with classic vector graphics, smooth movement, and modern controls

const CONFIG = {
    gridSize: 40,
    cellSize: 20,
    baseSpeed: 100,
    speedIncrease: 0.93,
    speedIncreaseInterval: 8000,
    interpolationSpeed: 0.15,
    trailFadeLength: 100,
    difficulties: {
        easy: { aiSpeed: 1.2, aiSmartness: 0.3 },
        medium: { aiSpeed: 1.0, aiSmartness: 0.6 },
        hard: { aiSpeed: 0.8, aiSmartness: 0.9 }
    }
};

// ===== CLASSIC TRON LIGHT CYCLE RENDERER =====
class LightCycleRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // Draw classic 1982 TRON-style light cycle
    drawCycle(x, y, direction, color, isPlayer = true) {
        const ctx = this.ctx;
        const size = CONFIG.cellSize * 1.8;

        // Direction rotation
        let rotation = 0;
        switch (direction) {
            case 'right': rotation = 0; break;
            case 'down': rotation = Math.PI / 2; break;
            case 'left': rotation = Math.PI; break;
            case 'up': rotation = -Math.PI / 2; break;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Enhanced glow effect
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;

        // Classic TRON cycle design - angular, sleek vector style
        const cycleLength = size * 0.8;
        const cycleHeight = size * 0.35;
        const wheelRadius = size * 0.18;

        // Main body - angular design like 1982 movie
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        // Body shape (elongated angular)
        ctx.beginPath();
        // Front point
        ctx.moveTo(cycleLength * 0.5, 0);
        // Top front
        ctx.lineTo(cycleLength * 0.2, -cycleHeight * 0.6);
        // Top back canopy
        ctx.lineTo(-cycleLength * 0.1, -cycleHeight * 0.8);
        // Back top
        ctx.lineTo(-cycleLength * 0.4, -cycleHeight * 0.5);
        // Back wheel area
        ctx.lineTo(-cycleLength * 0.5, -cycleHeight * 0.3);
        ctx.lineTo(-cycleLength * 0.5, cycleHeight * 0.3);
        // Bottom back
        ctx.lineTo(-cycleLength * 0.4, cycleHeight * 0.5);
        // Bottom front
        ctx.lineTo(cycleLength * 0.2, cycleHeight * 0.3);
        ctx.closePath();

        // Fill with semi-transparent color
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();

        // Canopy/cockpit highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.15, -cycleHeight * 0.5);
        ctx.lineTo(-cycleLength * 0.05, -cycleHeight * 0.65);
        ctx.lineTo(-cycleLength * 0.1, -cycleHeight * 0.4);
        ctx.lineTo(cycleLength * 0.1, -cycleHeight * 0.3);
        ctx.closePath();
        ctx.fill();

        // Front wheel (larger, more prominent)
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cycleLength * 0.35, 0, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner wheel glow
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(cycleLength * 0.35, 0, wheelRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Rear wheel
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.4, 0, wheelRadius * 1.2, 0, Math.PI * 2);
        ctx.stroke();

        // Inner rear wheel glow
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.4, 0, wheelRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Engine glow line
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-cycleLength * 0.3, 0);
        ctx.lineTo(cycleLength * 0.2, 0);
        ctx.stroke();

        // Additional detail lines for that vector graphics feel
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;

        // Top detail line
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.3, -cycleHeight * 0.2);
        ctx.lineTo(-cycleLength * 0.2, -cycleHeight * 0.3);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // Draw enhanced trail with gradient fade
    drawTrail(trail, color, isPlayer = true) {
        if (trail.length < 2) return;

        const ctx = this.ctx;

        // Main trail with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';

        // Draw trail segments with gradient intensity
        for (let i = 1; i < trail.length; i++) {
            const pos = trail[i];
            const prevPos = trail[i - 1];

            // Calculate opacity based on position in trail
            const fadeStart = Math.max(0, trail.length - CONFIG.trailFadeLength);
            let alpha = 1;
            if (i < fadeStart) {
                alpha = 0.3 + (i / fadeStart) * 0.3;
            }

            const x = pos.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const y = pos.y * CONFIG.cellSize + CONFIG.cellSize / 2;
            const px = prevPos.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const py = prevPos.y * CONFIG.cellSize + CONFIG.cellSize / 2;

            // Outer glow
            ctx.globalAlpha = alpha * 0.3;
            ctx.strokeStyle = color;
            ctx.lineWidth = CONFIG.cellSize * 0.9;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Core trail
            ctx.globalAlpha = alpha;
            ctx.lineWidth = CONFIG.cellSize * 0.6;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Bright center line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = CONFIG.cellSize * 0.15;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// ===== MAIN GAME CLASS =====
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cycleRenderer = new LightCycleRenderer(this.ctx);

        this.difficulty = 'medium';
        this.gameState = 'menu';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('lightCycleHighScore')) || 0;
        this.speed = CONFIG.baseSpeed;
        this.speedMultiplier = 1.0;
        this.startTime = 0;
        this.survivalTime = 0;
        this.maxSpeed = 1.0;

        // Smooth interpolation
        this.playerVisual = { x: 0, y: 0 };
        this.aiVisual = { x: 0, y: 0 };

        // Touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 30;

        // Settings
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            scanlines: true,
            particleIntensity: 1
        };

        this.setupCanvas();
        this.setupEventListeners();
        this.setupTouchControls();
        this.updateHighScore();
        this.handleResize();
    }

    setupCanvas() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        const container = document.getElementById('gameScreen');
        const maxSize = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.75, 800);
        const size = CONFIG.gridSize * CONFIG.cellSize;

        this.canvas.width = size;
        this.canvas.height = size;

        // Scale canvas visually for responsiveness
        const scale = maxSize / size;
        this.canvas.style.width = `${size * scale}px`;
        this.canvas.style.height = `${size * scale}px`;
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.settings.soundEnabled) soundSystem.playClick();
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            soundSystem.init();
            if (this.settings.soundEnabled) soundSystem.playClick();
            this.startGame();
        });

        // Resume button
        document.getElementById('resumeBtn').addEventListener('click', () => {
            if (this.settings.soundEnabled) soundSystem.playClick();
            this.resumeGame();
        });

        // Quit button
        document.getElementById('quitBtn').addEventListener('click', () => {
            if (this.settings.soundEnabled) soundSystem.playClick();
            this.quitToMenu();
        });

        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            if (this.settings.soundEnabled) soundSystem.playClick();
            this.startGame();
        });

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => {
            if (this.settings.soundEnabled) soundSystem.playClick();
            this.showScreen('startScreen');
        });

        // Settings button (if exists)
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                if (this.settings.soundEnabled) soundSystem.playClick();
                this.showScreen('settingsScreen');
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.handleInput(e.key);
            } else if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && this.gameState === 'playing') {
                this.pauseGame();
            } else if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && this.gameState === 'paused') {
                this.resumeGame();
            }
        });
    }

    setupTouchControls() {
        // Touch/swipe controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (this.gameState !== 'playing') return;

            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;

            if (Math.abs(deltaX) > this.swipeThreshold || Math.abs(deltaY) > this.swipeThreshold) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    this.handleDirectionChange(deltaX > 0 ? 'right' : 'left');
                } else {
                    // Vertical swipe
                    this.handleDirectionChange(deltaY > 0 ? 'down' : 'up');
                }
            }
        }, { passive: false });

        // Virtual D-pad controls
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    const direction = btn.dataset.direction;
                    this.handleDirectionChange(direction);
                    btn.classList.add('active');
                }
            });
            btn.addEventListener('touchend', () => {
                btn.classList.remove('active');
            });
        });
    }

    handleDirectionChange(newDir) {
        if (newDir !== this.getOppositeDirection(this.player.direction) && newDir !== this.player.direction) {
            this.player.direction = newDir;
            if (this.settings.soundEnabled) soundSystem.playTurn();
        }
    }

    startGame() {
        this.showScreen('gameScreen');
        this.score = 0;
        this.speed = CONFIG.baseSpeed;
        this.speedMultiplier = 1.0;
        this.maxSpeed = 1.0;
        this.startTime = Date.now();

        // Initialize grid
        this.grid = Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(0));

        // Initialize player
        const playerStartX = Math.floor(CONFIG.gridSize * 0.25);
        const playerStartY = Math.floor(CONFIG.gridSize / 2);
        this.player = {
            x: playerStartX,
            y: playerStartY,
            direction: 'right',
            color: '#00f3ff',
            brightColor: '#5dfdff',
            trail: [{ x: playerStartX, y: playerStartY }],
            alive: true
        };
        this.playerVisual = { x: playerStartX, y: playerStartY };

        // Initialize AI
        const aiStartX = Math.floor(CONFIG.gridSize * 0.75);
        const aiStartY = Math.floor(CONFIG.gridSize / 2);
        this.ai = {
            x: aiStartX,
            y: aiStartY,
            direction: 'left',
            color: '#ff6b35',
            brightColor: '#ff8c61',
            trail: [{ x: aiStartX, y: aiStartY }],
            alive: true
        };
        this.aiVisual = { x: aiStartX, y: aiStartY };

        // Mark starting positions
        this.grid[this.player.y][this.player.x] = 1;
        this.grid[this.ai.y][this.ai.x] = 2;

        this.particles = [];
        this.gameState = 'countdown';
        this.countdown();
    }

    countdown() {
        const countdownEl = document.getElementById('countdown');
        let count = 3;

        const showCount = () => {
            if (count > 0) {
                countdownEl.textContent = count;
                countdownEl.style.display = 'block';
                if (this.settings.soundEnabled) soundSystem.playCountdown(false);
                count--;
                setTimeout(showCount, 1000);
            } else {
                countdownEl.textContent = 'GO!';
                if (this.settings.soundEnabled) soundSystem.playCountdown(true);
                setTimeout(() => {
                    countdownEl.style.display = 'none';
                    this.gameState = 'playing';
                    if (this.settings.soundEnabled) soundSystem.playEngineHum();
                    this.startGameLoop();
                }, 500);
            }
        };

        showCount();
        if (this.settings.musicEnabled) soundSystem.startMusic();
    }

    startGameLoop() {
        this.lastUpdate = Date.now();
        this.lastSpeedIncrease = Date.now();
        this.lastRender = performance.now();
        this.gameLoop();
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdate;

        if (deltaTime >= this.speed) {
            this.update();
            this.lastUpdate = now;
        }

        // Speed increase over time
        if (now - this.lastSpeedIncrease >= CONFIG.speedIncreaseInterval) {
            this.speed *= CONFIG.speedIncrease;
            this.speedMultiplier = CONFIG.baseSpeed / this.speed;
            this.maxSpeed = Math.max(this.maxSpeed, this.speedMultiplier);
            this.lastSpeedIncrease = now;
            if (this.settings.soundEnabled) soundSystem.playSpeedUp();
            document.getElementById('speed').textContent = this.speedMultiplier.toFixed(1) + 'x';
        }

        // Smooth interpolation for visual positions
        this.updateVisualPositions();

        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    updateVisualPositions() {
        // Smooth interpolation for player
        this.playerVisual.x += (this.player.x - this.playerVisual.x) * CONFIG.interpolationSpeed;
        this.playerVisual.y += (this.player.y - this.playerVisual.y) * CONFIG.interpolationSpeed;

        // Smooth interpolation for AI
        this.aiVisual.x += (this.ai.x - this.aiVisual.x) * CONFIG.interpolationSpeed;
        this.aiVisual.y += (this.ai.y - this.aiVisual.y) * CONFIG.interpolationSpeed;
    }

    update() {
        // Move player
        if (this.player.alive) {
            this.moveEntity(this.player);
        }

        // Move AI
        if (this.ai.alive) {
            this.updateAI();
            this.moveEntity(this.ai);
        }

        // Check collisions
        this.checkCollisions();

        // Update particles
        this.particles = this.particles.filter(p => {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.alpha = p.life / p.maxLife;
            return p.life > 0;
        });

        // Update score
        if (this.player.alive) {
            this.score += Math.floor(this.speedMultiplier);
            document.getElementById('score').textContent = this.score;
        }

        this.survivalTime = Math.floor((Date.now() - this.startTime) / 1000);
    }

    moveEntity(entity) {
        const newPos = { x: entity.x, y: entity.y };

        switch (entity.direction) {
            case 'up': newPos.y--; break;
            case 'down': newPos.y++; break;
            case 'left': newPos.x--; break;
            case 'right': newPos.x++; break;
        }

        // Check bounds
        if (newPos.x < 0 || newPos.x >= CONFIG.gridSize ||
            newPos.y < 0 || newPos.y >= CONFIG.gridSize) {
            entity.alive = false;
            return;
        }

        // Check collision with trails
        if (this.grid[newPos.y][newPos.x] !== 0) {
            entity.alive = false;
            return;
        }

        // Update position
        entity.x = newPos.x;
        entity.y = newPos.y;
        entity.trail.push({ x: entity.x, y: entity.y });
        this.grid[entity.y][entity.x] = entity === this.player ? 1 : 2;
    }

    updateAI() {
        const config = CONFIG.difficulties[this.difficulty];
        const directions = ['up', 'down', 'left', 'right'];
        const validDirections = directions.filter(dir => {
            if (this.getOppositeDirection(dir) === this.ai.direction) return false;

            const testPos = { x: this.ai.x, y: this.ai.y };
            switch (dir) {
                case 'up': testPos.y--; break;
                case 'down': testPos.y++; break;
                case 'left': testPos.x--; break;
                case 'right': testPos.x++; break;
            }

            if (testPos.x < 0 || testPos.x >= CONFIG.gridSize ||
                testPos.y < 0 || testPos.y >= CONFIG.gridSize) return false;

            return this.grid[testPos.y][testPos.x] === 0;
        });

        if (validDirections.length === 0) return;

        // Smart AI: evaluate directions
        if (Math.random() < config.aiSmartness) {
            const scores = validDirections.map(dir => {
                const testPos = { x: this.ai.x, y: this.ai.y };
                switch (dir) {
                    case 'up': testPos.y--; break;
                    case 'down': testPos.y++; break;
                    case 'left': testPos.x--; break;
                    case 'right': testPos.x++; break;
                }
                return this.evaluatePosition(testPos);
            });

            const maxScore = Math.max(...scores);
            const bestDirs = validDirections.filter((_, i) => scores[i] === maxScore);
            const newDir = bestDirs[Math.floor(Math.random() * bestDirs.length)];

            if (newDir !== this.ai.direction) {
                this.ai.direction = newDir;
            }
        } else {
            // Random movement
            const newDir = validDirections[Math.floor(Math.random() * validDirections.length)];
            if (newDir !== this.ai.direction) {
                this.ai.direction = newDir;
            }
        }
    }

    evaluatePosition(pos) {
        let score = 0;
        const searchRadius = 5;

        for (let dy = -searchRadius; dy <= searchRadius; dy++) {
            for (let dx = -searchRadius; dx <= searchRadius; dx++) {
                const x = pos.x + dx;
                const y = pos.y + dy;

                if (x >= 0 && x < CONFIG.gridSize && y >= 0 && y < CONFIG.gridSize) {
                    if (this.grid[y][x] === 0) score++;
                }
            }
        }

        return score;
    }

    getOppositeDirection(dir) {
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        return opposites[dir];
    }

    handleInput(key) {
        const dirMap = {
            'ArrowUp': 'up', 'w': 'up', 'W': 'up',
            'ArrowDown': 'down', 's': 'down', 'S': 'down',
            'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
            'ArrowRight': 'right', 'd': 'right', 'D': 'right',
            'Escape': 'pause', 'p': 'pause', 'P': 'pause'
        };

        const newDir = dirMap[key];
        if (!newDir) return;

        if (newDir === 'pause') {
            this.pauseGame();
            return;
        }

        this.handleDirectionChange(newDir);
    }

    checkCollisions() {
        if (!this.player.alive || !this.ai.alive) {
            this.endGame();
        }
    }

    endGame() {
        this.gameState = 'gameover';
        soundSystem.stopEngineHum();

        const playerWon = this.player.alive && !this.ai.alive;

        if (playerWon) {
            if (this.settings.soundEnabled) soundSystem.playVictory();
        } else {
            if (this.settings.soundEnabled) soundSystem.playCrash();
        }

        // Create explosion particles
        const crashEntity = !this.player.alive ? this.player : this.ai;
        this.createExplosion(
            crashEntity.x * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.y * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.color
        );

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('lightCycleHighScore', this.highScore);
            this.updateHighScore();
        }

        // Show game over screen
        setTimeout(() => {
            const title = document.getElementById('gameOverTitle');
            title.textContent = playerWon ? 'VICTORY' : 'GAME OVER';
            title.className = playerWon ? 'gameover-title victory' : 'gameover-title defeat';

            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('survivalTime').textContent = this.survivalTime + 's';
            document.getElementById('maxSpeed').textContent = this.maxSpeed.toFixed(1) + 'x';

            this.showScreen('gameOverScreen');
        }, 1000);
    }

    createExplosion(x, y, color) {
        const particleCount = 80 * this.settings.particleIntensity;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                color,
                life: 80 + Math.random() * 40,
                maxLife: 120,
                alpha: 1,
                size: Math.random() * 4 + 2
            });
        }

        // Add spark particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                color: '#ffffff',
                life: 40 + Math.random() * 20,
                maxLife: 60,
                alpha: 1,
                size: Math.random() * 2 + 1
            });
        }
    }

    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            soundSystem.stopEngineHum();
            this.showScreen('pauseScreen');
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            if (this.settings.soundEnabled) soundSystem.playEngineHum();
            this.showScreen('gameScreen');
            this.lastUpdate = Date.now();
            this.gameLoop();
        }
    }

    quitToMenu() {
        soundSystem.stopEngineHum();
        soundSystem.stopMusic();
        this.gameState = 'menu';
        this.showScreen('startScreen');
    }

    updateHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas with dark background
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, width, height);

        // Draw grid with perspective feel
        this.drawGrid();

        // Draw trails with enhanced effects
        this.cycleRenderer.drawTrail(this.player.trail, this.player.color, true);
        this.cycleRenderer.drawTrail(this.ai.trail, this.ai.color, false);

        // Draw cycles at interpolated positions
        if (this.player.alive) {
            const px = this.playerVisual.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const py = this.playerVisual.y * CONFIG.cellSize + CONFIG.cellSize / 2;
            this.cycleRenderer.drawCycle(px, py, this.player.direction, this.player.color, true);
        }

        if (this.ai.alive) {
            const ax = this.aiVisual.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const ay = this.aiVisual.y * CONFIG.cellSize + CONFIG.cellSize / 2;
            this.cycleRenderer.drawCycle(ax, ay, this.ai.direction, this.ai.color, false);
        }

        // Draw particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Scanline effect for retro feel
        if (this.settings.scanlines) {
            this.drawScanlines();
        }

        // Vignette effect
        this.drawVignette();
    }

    drawGrid() {
        const ctx = this.ctx;
        const cellSize = CONFIG.cellSize;
        const gridSize = CONFIG.gridSize;

        // Grid lines with subtle glow
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= gridSize; i++) {
            const pos = i * cellSize;

            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.canvas.height);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.canvas.width, pos);
            ctx.stroke();
        }

        // Border glow
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawScanlines() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';

        for (let y = 0; y < this.canvas.height; y += 4) {
            ctx.fillRect(0, y, this.canvas.width, 2);
        }
    }

    drawVignette() {
        const ctx = this.ctx;
        const gradient = ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.3,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.8
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// ===== INITIALIZE GAME =====
let game;
window.addEventListener('load', () => {
    game = new Game();
});
