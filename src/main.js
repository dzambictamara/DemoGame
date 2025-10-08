"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createjs = require("createjs-module");
var stage;
var playerSheet;
var player;
var isJumping = false;
var loader;
var lights = [];
var light;
function init() {
    var manifest = [
        { src: "player/player_idle.png", id: "idle", crossOrigin: "anonymous" },
        { src: "player/player_jump.png", id: "jump", crossOrigin: "anonymous" },
        { src: "player/player_walk1.png", id: "walk1", crossOrigin: "anonymous" },
        { src: "player/player_walk2.png", id: "walk2", crossOrigin: "anonymous" },
        { src: "scene/light.png", id: "light", crossOrigin: "anonymous" },
        { src: "scene/city.png", id: "city", crossOrigin: "anonymous" }
    ];
    loader = new createjs.LoadQueue(false);
    loader.loadManifest(manifest, true, "./assets/");
    loader.on("complete", handleComplete);
}
function handleComplete() {
    stage = new createjs.Stage("gameCanvas");
    var background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#010101", "#0f375e", "#3e5e7d"], [0, 0.8, 1], 0, 0, 0, 600);
    background.graphics.drawRect(0, 0, 1200, 600);
    stage.addChild(background);
    createScene();
    createPlayer();
    keyboardControls();
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);
}
function createScene() {
    var city = new createjs.Bitmap(loader.getResult("city"));
    city.scaleX = 3;
    city.scaleY = 1.2;
    city.x = -100;
    city.y = stage.canvas.height - 450;
    stage.addChild(city);
    if (!lights) {
        lights = [];
    }
    for (var i = 0; i < 6; i++) {
        var light_1 = new createjs.Bitmap(loader.getResult("light"));
        light_1.scaleX = 0.3;
        light_1.scaleY = 0.3;
        light_1.x = (-100 + i * 300);
        light_1.y = stage.canvas.height - 400;
        stage.addChild(light_1);
        lights.push(light_1);
    }
}
function createPlayer() {
    playerSheet = new createjs.SpriteSheet({
        images: [loader.getResult("walk1"), loader.getResult("walk2"), loader.getResult("idle"), loader.getResult("jump")],
        frames: { width: 80, height: 110, count: 4 },
        animations: {
            walk: [0, 1, "walk", 0.005],
            idle: [1, 1, "idle", 0.1],
            jump: [3, 3, "jump", 0.1]
        }
    });
    var startX = stage.canvas.width / 2;
    var startY = stage.canvas.height - 50;
    player = new createjs.Sprite(playerSheet, "idle");
    player.regX = 80 / 2;
    player.regY = 110 / 2;
    player.x = startX;
    player.y = startY;
    stage.addChild(player);
}
function keyboardControls() {
    window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            player.scaleX = 1; // Flip the sprite
            player.gotoAndPlay("walk");
            for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                var light_2 = lights_1[_i];
                if (light_2.x < -400) {
                    light_2.x = light_2.x + 6 * 300; // Reset position to the left
                }
                createjs.Tween.get(light_2).to({ x: light_2.x - 10 }, 50)
                    .call(function () {
                    player.gotoAndPlay("idle");
                });
            }
        }
        if (event.key === "ArrowLeft") {
            player.scaleX = -1; // Flip the sprite
            player.gotoAndPlay("walk");
            for (var _a = 0, lights_2 = lights; _a < lights_2.length; _a++) {
                var light_3 = lights_2[_a];
                if (light_3.x > stage.canvas.width) {
                    light_3.x = light_3.x - 6 * 300; // Reset position to the left
                }
                createjs.Tween.get(light_3).to({ x: light_3.x + 10 }, 50)
                    .call(function () {
                    player.gotoAndPlay("idle");
                });
            }
        }
        if (event.key === "ArrowUp") {
            if (!isJumping) {
                isJumping = true;
                player.gotoAndPlay("jump");
                createjs.Tween.get(player).to({ y: player.y - 150 }, 500, createjs.Ease.quadOut)
                    .to({ y: player.y }, 500, createjs.Ease.quadIn)
                    .call(function () {
                    isJumping = false;
                    player.gotoAndPlay("idle");
                });
            }
        }
    });
}
