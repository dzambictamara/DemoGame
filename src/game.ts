import { Player } from "./player.js";
import { Scene } from "./scene.js";
import { IdleState } from "./states/idleState.js";
import { JumpState } from "./states/JumpState.js";
import { WalkState } from "./states/WalkState.js";

export class Game {
    stage: createjs.Stage;
    loader: createjs.LoadQueue;
    player!: Player;
    scene!: Scene;
    private keyPressTimestamps: Record<string, number[]> = {};

    constructor(loader: createjs.LoadQueue) {
        this.loader = loader;
        this.stage = new createjs.Stage("gameCanvas");
        this.createScene();
        this.createPlayer();
        this.keyboardControls();
        this.pauseControl();
    }

    start() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this))
    }

    update() {
        this.stage.update();
        this.player.update();
        this.scene.update(this.player.sprite.scaleX * this.player.speed)
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
        city.y = (this.stage.canvas as HTMLCanvasElement).height - 450;
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

        let startX = (this.stage.canvas as HTMLCanvasElement).width / 2;
        let startY = (this.stage.canvas as HTMLCanvasElement).height - 50;

        this.player = new Player(playerSheet, startX, startY);
        this.stage.addChild(this.player.sprite);
    }

    keyboardControls() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    pauseControl() {
        window.addEventListener("keydown", (event) => {
            if (event.key === "p") createjs.Ticker.paused = !createjs.Ticker.paused;
        });
    }

    handleKeyDown(event: KeyboardEvent) {
        if (createjs.Ticker.paused || event.repeat || this.player.isJumping) return;

        switch (event.key) {
            case "ArrowUp":
                this.player.changeState(new JumpState(this.player));
                break;
            case "ArrowRight":
            case "ArrowLeft":
                this.scene.isMoving = true;
                this.player.sprite.scaleX = event.key === "ArrowRight" ? 1 : -1;
                this.player.speed = this.isDoubleClick(this.keyPressTimestamps, event.key) ? 20 : 10;
                this.player.changeState(new WalkState(this.player));
                break;
        }

    }

    handleKeyUp(event: KeyboardEvent) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.player.changeState(new IdleState(this.player))
            this.scene.isMoving = false;
        }
    }

    isDoubleClick(keyPressTimestamps: Record<string, number[]>, key: string): boolean {
        const DOUBLE_KEY_THRESHOLD = 300;
        const now = Date.now();

        if (!keyPressTimestamps[key]) keyPressTimestamps[key] = [];
        keyPressTimestamps[key].push(now);
        keyPressTimestamps[key] = keyPressTimestamps[key].filter(t => now - t <= DOUBLE_KEY_THRESHOLD);

        return keyPressTimestamps[key].length >= 2;
    }

}