import { PlayerState } from "./playerState.js";
export class WalkState extends PlayerState {
    update() {
        if (!this.makeUpdate)
            return;
        this.makeUpdate = false;
        this.player.sprite.gotoAndPlay("walk");
    }
}
