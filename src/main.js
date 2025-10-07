"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createjs = require("createjs-module");
var stage;
function init() {
    stage = new createjs.Stage("gameCanvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 200;
    stage.addChild(circle);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", function (event) { return handleTick(event); });
}
function handleTick(event) {
    stage.update();
}
