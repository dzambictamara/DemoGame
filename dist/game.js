import { Player } from "./player.js";
import { IdleState } from "./states/idleState.js";
import { JumpState } from "./states/JumpState.js";
import { WalkState } from "./states/WalkState.js";
export class Game {
    constructor(loader) {
        this.moveScene = false;
        this.loader = loader;
        this.stage = new createjs.Stage("gameCanvas");
        this.createScene();
        this.createPlayer();
        this.keyboardControls();
    }
    start() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
    }
    update() {
        this.stage.update();
        this.player.state.update();
        if (!this.moveScene)
            return;
        for (let light of this.lights) {
            if (light.x < -400) {
                light.x += 6 * 300;
            }
            else if (light.x > this.stage.canvas.width) {
                light.x -= 6 * 300;
            }
            this.moveLight(light);
        }
    }
    createScene() {
        let background = new createjs.Shape();
        background.graphics.beginLinearGradientFill(["#010101", "#0f375e", "#3e5e7d"], [0, 0.8, 1], 0, 0, 0, 600);
        background.graphics.drawRect(0, 0, 1200, 600);
        this.stage.addChild(background);
        let city = new createjs.Bitmap(this.loader.getResult("city"));
        city.scaleX = 3;
        city.scaleY = 1.2;
        city.x = -100;
        city.y = this.stage.canvas.height - 450;
        this.stage.addChild(city);
        if (!this.lights) {
            this.lights = [];
        }
        for (let i = 0; i < 6; i++) {
            let light = new createjs.Bitmap(this.loader.getResult("light"));
            light.scaleX = 0.3;
            light.scaleY = 0.3;
            light.x = (-100 + i * 300);
            light.y = this.stage.canvas.height - 400;
            this.stage.addChild(light);
            this.lights.push(light);
        }
    }
    createPlayer() {
        let playerSheet = new createjs.SpriteSheet({
            images: [this.loader.getResult("walk1"), this.loader.getResult("walk2"), this.loader.getResult("idle"), this.loader.getResult("jump")],
            frames: { width: 80, height: 110, count: 4 },
            animations: {
                walk: [0, 1, "walk", 0.5],
                idle: [1, 1, "idle"],
                jump: [3, 3, "jump"]
            }
        });
        let startX = this.stage.canvas.width / 2;
        let startY = this.stage.canvas.height - 50;
        this.player = new Player(playerSheet, startX, startY);
        this.stage.addChild(this.player.sprite);
    }
    moveLight(light) {
        this.player.sheet.getAnimation("walk").speed = this.player.speed / 100;
        createjs.Tween.get(light).to({ x: light.x - this.player.sprite.scaleX * this.player.speed }, 50);
    }
    isDoubleClick(keyPressTimestamps, key) {
        const DOUBLE_KEY_THRESHOLD = 300;
        const now = Date.now();
        if (!keyPressTimestamps[key])
            keyPressTimestamps[key] = [];
        keyPressTimestamps[key].push(now);
        keyPressTimestamps[key] = keyPressTimestamps[key].filter(t => now - t <= DOUBLE_KEY_THRESHOLD);
        return keyPressTimestamps[key].length >= 2;
    }
    keyboardControls() {
        let keyPressTimestamps = {};
        window.addEventListener("keydown", (event) => {
            let key = event.key;
            if (key === "p")
                createjs.Ticker.paused = !createjs.Ticker.paused;
            if (createjs.Ticker.paused || event.repeat)
                return;
            if (this.player.state instanceof JumpState)
                return;
            if (key === "ArrowUp") {
                this.player.changeState(new JumpState(this.player));
                return;
            }
            if (key === "ArrowRight") {
                this.player.sprite.scaleX = 1;
                this.moveScene = true;
                this.player.sprite.scaleX = 1;
                this.player.speed = this.isDoubleClick(keyPressTimestamps, key) ? 20 : 10;
                this.player.changeState(new WalkState(this.player));
            }
            if (key === "ArrowLeft") {
                this.moveScene = true;
                this.player.sprite.scaleX = -1;
                this.player.speed = this.isDoubleClick(keyPressTimestamps, key) ? 20 : 10;
                this.player.changeState(new WalkState(this.player));
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                this.player.changeState(new IdleState(this.player));
                this.moveScene = false;
            }
        });
    }
}
