import { IdleState } from "./states/idleState.js";
import { PlayerState } from "./states/playerState.js";

export class Player {
    sheet: createjs.SpriteSheet;
    sprite: createjs.Sprite;
    state: PlayerState;
    prevState: PlayerState;
    speed: number = 10;
    isJumping: boolean = false;

    constructor(sheet: createjs.SpriteSheet, startX: number, startY: number) {
        this.sheet = sheet;
        this.sprite = new createjs.Sprite(this.sheet, "idle");
        this.prevState = new IdleState(this);
        this.state = new IdleState(this);
        this.sprite.regX = 80 / 2;
        this.sprite.regY = 110 / 2;
        this.sprite.x = startX;
        this.sprite.y = startY;
    }


    changeState(newState: PlayerState) {
        if (this.isJumping && newState instanceof IdleState) {   //fix jumpState + keyUp  
            this.prevState = newState;
            return;
        };
        this.prevState = this.state;
        this.prevState.makeUpdate = true;
        this.state = newState;
    }

    update(){
        this.state.update();
    }

}
