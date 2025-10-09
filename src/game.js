import { Player } from "./player.js";
var Game = /** @class */ (function () {
    function Game(loader) {
        this.loader = loader;
        this.stage = new createjs.Stage("gameCanvas");
        this.createScene();
        this.createPlayer();
        this.keyboardControls();
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.stage);
    }
    Game.prototype.createScene = function () {
        var background = new createjs.Shape();
        background.graphics.beginLinearGradientFill(["#010101", "#0f375e", "#3e5e7d"], [0, 0.8, 1], 0, 0, 0, 600);
        background.graphics.drawRect(0, 0, 1200, 600);
        this.stage.addChild(background);
        var city = new createjs.Bitmap(this.loader.getResult("city"));
        city.scaleX = 3;
        city.scaleY = 1.2;
        city.x = -100;
        city.y = this.stage.canvas.height - 450;
        this.stage.addChild(city);
        if (!this.lights) {
            this.lights = [];
        }
        for (var i = 0; i < 6; i++) {
            var light = new createjs.Bitmap(this.loader.getResult("light"));
            light.scaleX = 0.3;
            light.scaleY = 0.3;
            light.x = (-100 + i * 300);
            light.y = this.stage.canvas.height - 400;
            this.stage.addChild(light);
            this.lights.push(light);
        }
    };
    Game.prototype.createPlayer = function () {
        var playerSheet = new createjs.SpriteSheet({
            images: [this.loader.getResult("walk1"), this.loader.getResult("walk2"), this.loader.getResult("idle"), this.loader.getResult("jump")],
            frames: { width: 80, height: 110, count: 4 },
            animations: {
                walk: [0, 1, "walk", 0.1],
                idle: [1, 1, "idle", 0.1],
                jump: [3, 3, "jump", 0.1]
            }
        });
        var startX = this.stage.canvas.width / 2;
        var startY = this.stage.canvas.height - 50;
        this.player = new Player(playerSheet, startX, startY);
        this.stage.addChild(this.player.sprite);
    };
    Game.prototype.moveLight = function (light) {
        var _this = this;
        if (this.player.isWalking === false)
            return;
        createjs.Tween.get(light).to({ x: light.x - this.player.sprite.scaleX * this.player.speed }, 50).call(function () {
            _this.player.idle();
        });
    };
    Game.prototype.keyboardControls = function () {
        var _this = this;
        window.addEventListener("keydown", function (event) {
            //this.player.speed = event.repeat ? 20 : 10;
            switch (event.key) {
                case "ArrowRight":
                    _this.player.walk("right");
                    for (var _i = 0, _a = _this.lights; _i < _a.length; _i++) {
                        var light = _a[_i];
                        if (light.x < -400) {
                            light.x += 6 * 300; // Reset position to the right
                        }
                        _this.moveLight(light);
                    }
                    break;
                case "ArrowLeft":
                    _this.player.walk("left");
                    for (var _b = 0, _c = _this.lights; _b < _c.length; _b++) {
                        var light = _c[_b];
                        if (light.x > _this.stage.canvas.width) {
                            light.x -= 6 * 300; // Reset position to the left
                        }
                        _this.moveLight(light);
                    }
                    break;
                case "ArrowUp":
                    _this.player.jump();
                    break;
                default:
                    break;
            }
        });
    };
    return Game;
}());
export { Game };
