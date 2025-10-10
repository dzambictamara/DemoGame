import { Player } from "./player.js";
import { Scene } from "./scene.js";
import { IdleState } from "./states/idleState.js";
import { JumpState } from "./states/JumpState.js";
import { WalkState } from "./states/WalkState.js";
export class Game {
    constructor(loader) {
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
        this.scene.update(this.player.sprite.scaleX * this.player.speed);
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
        this.scene = new Scene(this.loader.getResult("light"));
        this.stage.addChild(...this.scene.lights);
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
            if (createjs.Ticker.paused || event.repeat || this.player.state instanceof JumpState)
                return;
            if (key === "ArrowUp")
                this.player.changeState(new JumpState(this.player));
            if (key === "ArrowRight" || key === "ArrowLeft") {
                this.scene.isMoving = true;
                this.player.sprite.scaleX = key === "ArrowRight" ? 1 : -1;
                this.player.speed = this.isDoubleClick(keyPressTimestamps, key) ? 20 : 10;
                this.player.changeState(new WalkState(this.player));
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                this.player.changeState(new IdleState(this.player));
                this.scene.isMoving = false;
            }
        });
    }
}
