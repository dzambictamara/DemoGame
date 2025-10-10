import { PlayerState } from "./playerState.js";

export class IdleState extends PlayerState{
    update(): void {
        this.player.prevState = this;
        this.player.sprite.gotoAndPlay("idle");
        this.player.speed = 10;
    }

}