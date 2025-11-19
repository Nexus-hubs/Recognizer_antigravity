// ===== LUXURIOUS LIGHT CYCLES - TRON 1982 EDITION =====
// Enhanced with classic vector graphics, smooth movement, and modern controls

const CONFIG = {
    gridSize: 40,
    cellSize: 20,
    baseSpeed: 100,
    speedIncrease: 0.93,
    speedIncreaseInterval: 8000,
    interpolationSpeed: 0.2,
    trailFadeLength: 80,
    difficulties: {
        easy: { aiSpeed: 1.2, aiSmartness: 0.3 },
        medium: { aiSpeed: 1.0, aiSmartness: 0.6 },
        hard: { aiSpeed: 0.8, aiSmartness: 0.9 }
    }
};

// ===== ADVANCED TRON LIGHT CYCLE RENDERER =====
class LightCycleRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.time = 0;
    }

    // Draw super detailed 1982 TRON-style light cycle
    drawCycle(x, y, direction, color, isPlayer = true) {
        const ctx = this.ctx;
        const size = CONFIG.cellSize * 2.2;
        this.time += 0.1;

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

        const cycleLength = size * 0.9;
        const cycleHeight = size * 0.4;
        const wheelRadius = size * 0.22;

        // Outer glow effect
        ctx.shadowBlur = 35;
        ctx.shadowColor = color;

        // === MAIN BODY - Advanced angular design ===
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;

        // Primary body shape
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.55, 0); // Front point
        ctx.lineTo(cycleLength * 0.35, -cycleHeight * 0.5);
        ctx.lineTo(cycleLength * 0.15, -cycleHeight * 0.7);
        ctx.lineTo(-cycleLength * 0.1, -cycleHeight * 0.85);
        ctx.lineTo(-cycleLength * 0.35, -cycleHeight * 0.6);
        ctx.lineTo(-cycleLength * 0.5, -cycleHeight * 0.35);
        ctx.lineTo(-cycleLength * 0.55, 0);
        ctx.lineTo(-cycleLength * 0.5, cycleHeight * 0.35);
        ctx.lineTo(-cycleLength * 0.35, cycleHeight * 0.6);
        ctx.lineTo(-cycleLength * 0.1, cycleHeight * 0.5);
        ctx.lineTo(cycleLength * 0.25, cycleHeight * 0.35);
        ctx.lineTo(cycleLength * 0.45, cycleHeight * 0.15);
        ctx.closePath();

        // Fill body with gradient effect
        const gradient = ctx.createLinearGradient(-cycleLength/2, 0, cycleLength/2, 0);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.stroke();

        // === CANOPY / COCKPIT ===
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.2, -cycleHeight * 0.45);
        ctx.lineTo(cycleLength * 0.0, -cycleHeight * 0.65);
        ctx.lineTo(-cycleLength * 0.15, -cycleHeight * 0.55);
        ctx.lineTo(-cycleLength * 0.05, -cycleHeight * 0.35);
        ctx.lineTo(cycleLength * 0.15, -cycleHeight * 0.3);
        ctx.closePath();
        ctx.fill();

        // Canopy reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.15, -cycleHeight * 0.4);
        ctx.lineTo(cycleLength * 0.0, -cycleHeight * 0.55);
        ctx.lineTo(-cycleLength * 0.08, -cycleHeight * 0.48);
        ctx.closePath();
        ctx.fill();

        // === FRONT WHEEL - Detailed ===
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;

        // Outer ring
        ctx.beginPath();
        ctx.arc(cycleLength * 0.38, 0, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cycleLength * 0.38, 0, wheelRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Wheel core glow
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(cycleLength * 0.38, 0, wheelRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Wheel spokes
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + this.time;
            ctx.beginPath();
            ctx.moveTo(cycleLength * 0.38 + Math.cos(angle) * wheelRadius * 0.3,
                       Math.sin(angle) * wheelRadius * 0.3);
            ctx.lineTo(cycleLength * 0.38 + Math.cos(angle) * wheelRadius * 0.85,
                       Math.sin(angle) * wheelRadius * 0.85);
            ctx.stroke();
        }

        // === REAR WHEEL - Larger, more detailed ===
        const rearWheelRadius = wheelRadius * 1.4;
        ctx.lineWidth = 4;

        // Outer ring
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.42, 0, rearWheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner rings
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.42, 0, rearWheelRadius * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.42, 0, rearWheelRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Rear wheel core
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(-cycleLength * 0.42, 0, rearWheelRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Rear wheel spokes
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3) - this.time * 0.5;
            ctx.beginPath();
            ctx.moveTo(-cycleLength * 0.42 + Math.cos(angle) * rearWheelRadius * 0.25,
                       Math.sin(angle) * rearWheelRadius * 0.25);
            ctx.lineTo(-cycleLength * 0.42 + Math.cos(angle) * rearWheelRadius * 0.9,
                       Math.sin(angle) * rearWheelRadius * 0.9);
            ctx.stroke();
        }

        // === ENGINE GLOW LINE ===
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(-cycleLength * 0.25, 0);
        ctx.lineTo(cycleLength * 0.25, 0);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // === DETAIL LINES ===
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;

        // Top accent line
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.3, -cycleHeight * 0.25);
        ctx.lineTo(-cycleLength * 0.15, -cycleHeight * 0.4);
        ctx.stroke();

        // Side panel lines
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.2, cycleHeight * 0.2);
        ctx.lineTo(-cycleLength * 0.2, cycleHeight * 0.35);
        ctx.stroke();

        // Front fairing detail
        ctx.beginPath();
        ctx.moveTo(cycleLength * 0.45, -cycleHeight * 0.15);
        ctx.lineTo(cycleLength * 0.35, -cycleHeight * 0.35);
        ctx.stroke();

        ctx.globalAlpha = 1;

        // === EXHAUST PARTICLES (for player) ===
        if (isPlayer) {
            ctx.fillStyle = color;
            for (let i = 0; i < 3; i++) {
                const px = -cycleLength * 0.6 - Math.random() * 5;
                const py = (Math.random() - 0.5) * cycleHeight * 0.3;
                const ps = Math.random() * 2 + 1;
                ctx.globalAlpha = Math.random() * 0.5 + 0.3;
                ctx.beginPath();
                ctx.arc(px, py, ps, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // Draw enhanced trail with advanced effects
    drawTrail(trail, color, isPlayer = true) {
        if (trail.length < 2) return;

        const ctx = this.ctx;

        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';

        // Draw trail segments
        for (let i = 1; i < trail.length; i++) {
            const pos = trail[i];
            const prevPos = trail[i - 1];

            // Calculate opacity based on position
            const fadeStart = Math.max(0, trail.length - CONFIG.trailFadeLength);
            let alpha = 1;
            if (i < fadeStart) {
                alpha = 0.2 + (i / fadeStart) * 0.4;
            }

            const x = pos.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const y = pos.y * CONFIG.cellSize + CONFIG.cellSize / 2;
            const px = prevPos.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const py = prevPos.y * CONFIG.cellSize + CONFIG.cellSize / 2;

            // Outer glow layer
            ctx.globalAlpha = alpha * 0.25;
            ctx.strokeStyle = color;
            ctx.lineWidth = CONFIG.cellSize * 1.0;
            ctx.shadowBlur = 25;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Middle layer
            ctx.globalAlpha = alpha * 0.6;
            ctx.lineWidth = CONFIG.cellSize * 0.7;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Core trail
            ctx.globalAlpha = alpha;
            ctx.lineWidth = CONFIG.cellSize * 0.5;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Bright center line
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = CONFIG.cellSize * 0.12;
            ctx.shadowBlur = 5;
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
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

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

        this.particles = [];

        this.setupCanvas();
        this.setupEventListeners();
        this.setupTouchControls();
        this.updateHighScore();
    }

    setupCanvas() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        const maxSize = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.7, 800);
        const size = CONFIG.gridSize * CONFIG.cellSize;

        this.canvas.width = size;
        this.canvas.height = size;

        const scale = maxSize / size;
        this.canvas.style.width = `${size * scale}px`;
        this.canvas.style.height = `${size * scale}px`;
    }

    playSound(soundMethod) {
        try {
            if (this.settings.soundEnabled && soundSystem && soundSystem.initialized) {
                soundMethod();
            }
        } catch (e) {
            // Silently fail if sound system not ready
        }
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.playSound(() => soundSystem.playClick());
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                soundSystem.init();
                this.playSound(() => soundSystem.playClick());
                this.startGame();
            });
        }

        // Resume button
        const resumeBtn = document.getElementById('resumeBtn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                this.playSound(() => soundSystem.playClick());
                this.resumeGame();
            });
        }

        // Quit button
        const quitBtn = document.getElementById('quitBtn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                this.playSound(() => soundSystem.playClick());
                this.quitToMenu();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.playSound(() => soundSystem.playClick());
                this.startGame();
            });
        }

        // Menu button
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.playSound(() => soundSystem.playClick());
                this.showScreen('startScreen');
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.handleInput(e.key);
            } else if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && this.gameState === 'paused') {
                this.resumeGame();
            }
        });
    }

    setupTouchControls() {
        // Touch/swipe controls
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
                    this.handleDirectionChange(deltaX > 0 ? 'right' : 'left');
                } else {
                    this.handleDirectionChange(deltaY > 0 ? 'down' : 'up');
                }
            }
        }, { passive: false });

        // Virtual D-pad
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            const handler = (e) => {
                e.preventDefault();
                if (this.gameState === 'playing' && btn.dataset.direction) {
                    this.handleDirectionChange(btn.dataset.direction);
                    btn.classList.add('active');
                }
            };

            btn.addEventListener('touchstart', handler, { passive: false });
            btn.addEventListener('mousedown', handler);

            btn.addEventListener('touchend', () => btn.classList.remove('active'));
            btn.addEventListener('mouseup', () => btn.classList.remove('active'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('active'));
        });
    }

    handleDirectionChange(newDir) {
        if (!this.player) return;
        if (newDir !== this.getOppositeDirection(this.player.direction) && newDir !== this.player.direction) {
            this.player.direction = newDir;
            this.playSound(() => soundSystem.playTurn());
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
                this.playSound(() => soundSystem.playCountdown(false));
                count--;
                setTimeout(showCount, 1000);
            } else {
                countdownEl.textContent = 'GO!';
                this.playSound(() => soundSystem.playCountdown(true));
                setTimeout(() => {
                    countdownEl.style.display = 'none';
                    this.gameState = 'playing';
                    this.playSound(() => soundSystem.playEngineHum());
                    this.startGameLoop();
                }, 500);
            }
        };

        showCount();
        if (this.settings.musicEnabled) {
            try {
                soundSystem.startMusic();
            } catch (e) {}
        }
    }

    startGameLoop() {
        this.lastUpdate = Date.now();
        this.lastSpeedIncrease = Date.now();
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

        // Speed increase
        if (now - this.lastSpeedIncrease >= CONFIG.speedIncreaseInterval) {
            this.speed *= CONFIG.speedIncrease;
            this.speedMultiplier = CONFIG.baseSpeed / this.speed;
            this.maxSpeed = Math.max(this.maxSpeed, this.speedMultiplier);
            this.lastSpeedIncrease = now;
            this.playSound(() => soundSystem.playSpeedUp());

            const speedEl = document.getElementById('speed');
            if (speedEl) speedEl.textContent = this.speedMultiplier.toFixed(1) + 'x';
        }

        this.updateVisualPositions();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    updateVisualPositions() {
        this.playerVisual.x += (this.player.x - this.playerVisual.x) * CONFIG.interpolationSpeed;
        this.playerVisual.y += (this.player.y - this.playerVisual.y) * CONFIG.interpolationSpeed;
        this.aiVisual.x += (this.ai.x - this.aiVisual.x) * CONFIG.interpolationSpeed;
        this.aiVisual.y += (this.ai.y - this.aiVisual.y) * CONFIG.interpolationSpeed;
    }

    update() {
        if (this.player.alive) {
            this.moveEntity(this.player);
        }

        if (this.ai.alive) {
            this.updateAI();
            this.moveEntity(this.ai);
        }

        this.checkCollisions();

        // Update particles
        this.particles = this.particles.filter(p => {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.alpha = p.life / p.maxLife;
            return p.life > 0;
        });

        if (this.player.alive) {
            this.score += Math.floor(this.speedMultiplier);
            const scoreEl = document.getElementById('score');
            if (scoreEl) scoreEl.textContent = this.score;
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

        if (newPos.x < 0 || newPos.x >= CONFIG.gridSize ||
            newPos.y < 0 || newPos.y >= CONFIG.gridSize) {
            entity.alive = false;
            return;
        }

        if (this.grid[newPos.y][newPos.x] !== 0) {
            entity.alive = false;
            return;
        }

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
            const newDir = validDirections[Math.floor(Math.random() * validDirections.length)];
            if (newDir !== this.ai.direction) {
                this.ai.direction = newDir;
            }
        }
    }

    evaluatePosition(pos) {
        let score = 0;
        const searchRadius = 6;

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
        try { soundSystem.stopEngineHum(); } catch (e) {}

        const playerWon = this.player.alive && !this.ai.alive;

        if (playerWon) {
            this.playSound(() => soundSystem.playVictory());
        } else {
            this.playSound(() => soundSystem.playCrash());
        }

        const crashEntity = !this.player.alive ? this.player : this.ai;
        this.createExplosion(
            crashEntity.x * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.y * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.color
        );

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('lightCycleHighScore', this.highScore);
            this.updateHighScore();
        }

        setTimeout(() => {
            const title = document.getElementById('gameOverTitle');
            if (title) {
                title.textContent = playerWon ? 'VICTORY' : 'DEREZZED';
                title.className = playerWon ? 'gameover-title victory' : 'gameover-title defeat';
            }

            const finalScore = document.getElementById('finalScore');
            if (finalScore) finalScore.textContent = this.score;

            const survivalTime = document.getElementById('survivalTime');
            if (survivalTime) survivalTime.textContent = this.survivalTime + 's';

            const maxSpeed = document.getElementById('maxSpeed');
            if (maxSpeed) maxSpeed.textContent = this.maxSpeed.toFixed(1) + 'x';

            this.showScreen('gameOverScreen');
        }, 1000);
    }

    createExplosion(x, y, color) {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                color,
                life: 100 + Math.random() * 50,
                maxLife: 150,
                alpha: 1,
                size: Math.random() * 5 + 2
            });
        }

        // Spark particles
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 5;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                color: '#ffffff',
                life: 50 + Math.random() * 30,
                maxLife: 80,
                alpha: 1,
                size: Math.random() * 3 + 1
            });
        }
    }

    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            try { soundSystem.stopEngineHum(); } catch (e) {}
            this.showScreen('pauseScreen');
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.playSound(() => soundSystem.playEngineHum());
            this.showScreen('gameScreen');
            this.lastUpdate = Date.now();
            this.gameLoop();
        }
    }

    quitToMenu() {
        try {
            soundSystem.stopEngineHum();
            soundSystem.stopMusic();
        } catch (e) {}
        this.gameState = 'menu';
        this.showScreen('startScreen');
    }

    updateHighScore() {
        const el = document.getElementById('highScore');
        if (el) el.textContent = this.highScore;
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
    }

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Background
        ctx.fillStyle = '#080c18';
        ctx.fillRect(0, 0, width, height);

        this.drawGrid();

        // Trails
        this.cycleRenderer.drawTrail(this.player.trail, this.player.color, true);
        this.cycleRenderer.drawTrail(this.ai.trail, this.ai.color, false);

        // Cycles
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

        // Particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        if (this.settings.scanlines) {
            this.drawScanlines();
        }

        this.drawVignette();
    }

    drawGrid() {
        const ctx = this.ctx;
        const cellSize = CONFIG.cellSize;
        const gridSize = CONFIG.gridSize;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.06)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= gridSize; i++) {
            const pos = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.canvas.width, pos);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawScanlines() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        for (let y = 0; y < this.canvas.height; y += 3) {
            ctx.fillRect(0, y, this.canvas.width, 1.5);
        }
    }

    drawVignette() {
        const ctx = this.ctx;
        const gradient = ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.25,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.85
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// ===== INITIALIZE GAME =====
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
