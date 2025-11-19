// ===== ASSET CONFIGURATION =====
// Light Cycles uses procedural vector graphics - no external sprites needed
// This file is kept for potential future asset loading

const CYCLE_SPRITE = '';
const TANK_SPRITE = '';

// Asset preloader for future use
class AssetLoader {
    constructor() {
        this.assets = new Map();
        this.loaded = false;
    }

    async loadAll() {
        // Currently using procedural graphics
        // Future: Load sprite sheets, sounds, etc.
        this.loaded = true;
        return Promise.resolve();
    }

    get(name) {
        return this.assets.get(name);
    }
}

const assetLoader = new AssetLoader();
