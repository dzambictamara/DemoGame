import { Player } from "./player.js";

export class Game {
    stage: createjs.Stage;
    loader: createjs.LoadQueue;
    lights!: createjs.Bitmap[];
    player!: Player;

    constructor(loader: createjs.LoadQueue) {
        this.loader = loader;
        this.stage = new createjs.Stage("gameCanvas");
        this.createScene();
        this.createPlayer();
        this.keyboardControls();

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.stage);
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

        if (!this.lights) {
            this.lights = [];
        }
        for (let i = 0; i < 6; i++) {
            let light = new createjs.Bitmap(this.loader.getResult("light"));
            light.scaleX = 0.3;
            light.scaleY = 0.3;
            light.x = (-100 + i * 300);
            light.y = (this.stage.canvas as HTMLCanvasElement).height - 400;
            this.stage.addChild(light);
            this.lights.push(light);
        }
    }

    createPlayer() {
        let playerSheet = new createjs.SpriteSheet({
            images: [this.loader.getResult("walk1"), this.loader.getResult("walk2"), this.loader.getResult("idle"), this.loader.getResult("jump")],
            frames: { width: 80, height: 110, count: 4 },
            animations: {
                walk: [0, 1, "walk", 0.1],
                idle: [1, 1, "idle", 0.1],
                jump: [3, 3, "jump", 0.1]
            }
        });

        let startX = (this.stage.canvas as HTMLCanvasElement).width / 2;
        let startY = (this.stage.canvas as HTMLCanvasElement).height - 50;

        this.player = new Player(playerSheet, startX, startY);
        this.stage.addChild(this.player.sprite);
    }


    moveLight(light: createjs.Bitmap) {
        if (this.player.isWalking === false) return;
        createjs.Tween.get(light).to({ x: light.x - this.player.sprite.scaleX * this.player.speed }, 50).call(() => {
            this.player.idle();
        });

    }

    keyboardControls() {
        window.addEventListener("keydown", (event) => {

            //this.player.speed = event.repeat ? 20 : 10;

            switch (event.key) {
                case "ArrowRight":
                    this.player.walk("right");
                    for (let light of this.lights) {
                        if (light.x < -400) {
                            light.x += 6 * 300; // Reset position to the right
                        }
                        this.moveLight(light);
                    }
                    break;

                case "ArrowLeft":

                    this.player.walk("left");
                    for (let light of this.lights) {
                        if (light.x > (this.stage.canvas as HTMLCanvasElement).width) {
                            light.x -= 6 * 300; // Reset position to the left
                        }
                        this.moveLight(light);
                    }
                    break;

                case "ArrowUp":
                    this.player.jump();
                    break;
                default:
                    break;
            }
        });



    }

}