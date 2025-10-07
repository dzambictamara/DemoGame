import * as createjs from "createjs-module";
let stage : createjs.Stage;

function init() {
    stage = new createjs.Stage("gameCanvas");

    const circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 200;
    stage.addChild(circle);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", handleTick);

}

function handleTick() {
    stage.update();
}

