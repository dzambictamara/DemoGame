import { PlayerState } from "./playerState.js";
export class IdleState extends PlayerState {
    update() {
        this.player.prevState = this;
        this.player.sprite.gotoAndPlay("idle");
        this.player.speed = 10;
    }
}
