// ===== GAME CONFIGURATION =====
// Assets loaded from global scope (assets.js)

const cycleImg = new Image();
cycleImg.src = CYCLE_SPRITE;
const tankImg = new Image();
tankImg.src = TANK_SPRITE;

const CONFIG = {
    gridSize: 40,
    cellSize: 20,
    baseSpeed: 100,
    speedIncrease: 0.93,
    speedIncreaseInterval: 8000,
    difficulties: {
        easy: { aiSpeed: 1.2, aiSmartness: 0.3 },
        medium: { aiSpeed: 1.0, aiSmartness: 0.6 },
        hard: { aiSpeed: 0.8, aiSmartness: 0.9 }
    }
};

// ===== GAME STATE =====
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.difficulty = 'medium';
        this.gameState = 'menu'; // menu, countdown, playing, paused, gameover
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('lightCycleHighScore')) || 0;
        this.speed = CONFIG.baseSpeed;
        this.speedMultiplier = 1.0;
        this.startTime = 0;
        this.survivalTime = 0;
        this.maxSpeed = 1.0;

        this.setupCanvas();
        this.setupEventListeners();
        this.updateHighScore();
    }

    setupCanvas() {
        const size = CONFIG.gridSize * CONFIG.cellSize;
        this.canvas.width = size;
        this.canvas.height = size;
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                soundSystem.playClick();
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            soundSystem.init();
            soundSystem.playClick();
            this.startGame();
        });

        // Resume button
        document.getElementById('resumeBtn').addEventListener('click', () => {
            soundSystem.playClick();
            this.resumeGame();
        });

        // Quit button
        document.getElementById('quitBtn').addEventListener('click', () => {
            soundSystem.playClick();
            this.quitToMenu();
        });

        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            soundSystem.playClick();
            this.startGame();
        });

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => {
            soundSystem.playClick();
            this.showScreen('startScreen');
        });

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
        this.player = {
            x: Math.floor(CONFIG.gridSize * 0.25),
            y: Math.floor(CONFIG.gridSize / 2),
            direction: 'right',
            color: '#00f3ff',
            trail: [],
            alive: true
        };

        // Initialize AI
        this.ai = {
            x: Math.floor(CONFIG.gridSize * 0.75),
            y: Math.floor(CONFIG.gridSize / 2),
            direction: 'left',
            color: '#ff6b35',
            trail: [],
            alive: true
        };

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
                soundSystem.playCountdown(false);
                count--;
                setTimeout(showCount, 1000);
            } else {
                countdownEl.textContent = 'GO!';
                soundSystem.playCountdown(true);
                setTimeout(() => {
                    countdownEl.style.display = 'none';
                    this.gameState = 'playing';
                    soundSystem.playEngineHum();
                    this.startGameLoop();
                }, 500);
            }
        };

        showCount();
        soundSystem.startMusic();
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

        // Speed increase over time
        if (now - this.lastSpeedIncrease >= CONFIG.speedIncreaseInterval) {
            this.speed *= CONFIG.speedIncrease;
            this.speedMultiplier = CONFIG.baseSpeed / this.speed;
            this.maxSpeed = Math.max(this.maxSpeed, this.speedMultiplier);
            this.lastSpeedIncrease = now;
            soundSystem.playSpeedUp();
            document.getElementById('speed').textContent = this.speedMultiplier.toFixed(1) + 'x';
        }

        this.render();
        requestAnimationFrame(() => this.gameLoop());
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

        if (newDir !== this.getOppositeDirection(this.player.direction) && newDir !== this.player.direction) {
            this.player.direction = newDir;
            soundSystem.playTurn();
        }
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
            soundSystem.playVictory();
        } else {
            soundSystem.playCrash();
        }

        // Create explosion particles
        const crashEntity = !this.player.alive ? this.player : this.ai;
        this.createExplosion(crashEntity.x * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.y * CONFIG.cellSize + CONFIG.cellSize / 2,
            crashEntity.color);

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
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 60,
                maxLife: 60,
                alpha: 1,
                size: Math.random() * 3 + 1
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
            soundSystem.playEngineHum();
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

        // Clear canvas
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= CONFIG.gridSize; i++) {
            const pos = i * CONFIG.cellSize;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, this.canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(this.canvas.width, pos);
            ctx.stroke();
        }

        // Draw trails with glow
        this.drawTrail(this.player);
        this.drawTrail(this.ai);

        // Draw cycles
        this.drawCycle(this.player);
        this.drawCycle(this.ai);

        // Draw particles
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        });
        ctx.globalAlpha = 1;
    }

    drawTrail(entity) {
        const ctx = this.ctx;

        if (entity.trail.length < 2) return;

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = entity.color;

        ctx.strokeStyle = entity.color;
        ctx.lineWidth = CONFIG.cellSize * 0.6;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';

        ctx.beginPath();
        entity.trail.forEach((pos, i) => {
            const x = pos.x * CONFIG.cellSize + CONFIG.cellSize / 2;
            const y = pos.y * CONFIG.cellSize + CONFIG.cellSize / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    drawCycle(entity) {
        if (!entity.alive) return;

        const ctx = this.ctx;
        const x = entity.x * CONFIG.cellSize + CONFIG.cellSize / 2;
        const y = entity.y * CONFIG.cellSize + CONFIG.cellSize / 2;
        const size = CONFIG.cellSize * 1.5;

        // Rotation based on direction
        let rotation = 0;
        switch (entity.direction) {
            case 'right': rotation = 0; break;
            case 'down': rotation = Math.PI / 2; break;
            case 'left': rotation = Math.PI; break;
            case 'up': rotation = -Math.PI / 2; break;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Enhanced glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = entity.color;

        // Draw futuristic cycle shape if sprite fails or for better look
        if (!tankImg.complete || tankImg.naturalHeight === 0) {
            // Fallback: draw a detailed cycle shape
            ctx.fillStyle = entity.color;
            ctx.strokeStyle = entity.color;
            ctx.lineWidth = 2;

            // Body
            ctx.fillRect(-size * 0.3, -size * 0.2, size * 0.6, size * 0.4);
            // Front
            ctx.beginPath();
            ctx.moveTo(size * 0.3, 0);
            ctx.lineTo(size * 0.5, -size * 0.15);
            ctx.lineTo(size * 0.5, size * 0.15);
            ctx.closePath();
            ctx.fill();
            // Glow line
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.strokeRect(-size * 0.3, -size * 0.05, size * 0.6, size * 0.1);
        } else {
            // Draw sprite with color tint
            ctx.drawImage(tankImg, -size / 2, -size / 2, size, size);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = entity.color;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(-size / 2, -size / 2, size, size);
        }

        ctx.restore();
    }
}

// ===== INITIALIZE GAME =====
let game;
window.addEventListener('load', () => {
    game = new Game();
});
