import * as createjs from "createjs-module";
let stage: createjs.Stage;
let playerSheet: createjs.SpriteSheet;
let player: createjs.Sprite;
let isJumping = false;
let loader: createjs.LoadQueue;
function init() {

    let manifest = [
        { src: "player_idle.png", id: "idle", crossOrigin: "anonymous" },
        { src: "player_jump.png", id: "jump", crossOrigin: "anonymous" },
        { src: "player_walk1.png", id: "walk1", crossOrigin: "anonymous" },
        { src: "player_walk2.png", id: "walk2", crossOrigin: "anonymous" },

    ];
    loader = new createjs.LoadQueue(false);
    loader.loadManifest(manifest, true, "./assets/player/");
    loader.on("complete", handleComplete);
}



function handleComplete() {
    stage = new createjs.Stage("gameCanvas");

    let background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#010101", "#0f375e", "#3e5e7d"], [0, 0.8, 1], 0, 0, 0, 600);
    background.graphics.drawRect(0, 0, 1200, 600);
    stage.addChild(background);

    createPlayer();
    stage.addChild(player);

    keyboardControls();
    
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", stage);
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

    let startX = (stage.canvas as HTMLCanvasElement).width / 2;
    let startY = (stage.canvas as HTMLCanvasElement).height - 50;

    player = new createjs.Sprite(playerSheet, "idle");
    player.regX = 80 / 2;
    player.regY = 110 / 2;
    player.x = startX;
    player.y = startY;
}

function keyboardControls() {
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowRight":
                player.scaleX = 1; // Flip the sprite
                player.gotoAndPlay("walk");
                createjs.Tween.get(player).to({ x: player.x + 10 }, 50)
                    .call(() => { player.gotoAndPlay("idle"); });
                break;

            case "ArrowLeft":
                player.scaleX = -1; // Flip the sprite
                player.gotoAndPlay("walk");
                createjs.Tween.get(player).to({ x: player.x - 10 }, 50)
                    .call(() => {
                        player.gotoAndPlay("idle");
                    });
                break;

            case "ArrowUp":
                console.log("Up arrow pressed");
                if (!isJumping) {
                    isJumping = true;
                    player.gotoAndPlay("jump");
                    createjs.Tween.get(player).to({ y: player.y - 150 }, 500, createjs.Ease.quadOut)
                        .to({ y: player.y }, 500, createjs.Ease.quadIn)
                        .call(() => {
                            isJumping = false;
                            player.gotoAndPlay("idle");
                        });
                }
                break;
            default:
                break;
        }
    });

}


