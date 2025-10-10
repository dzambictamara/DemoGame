import { PlayerState } from "./playerState.js";
export class JumpState extends PlayerState {
    update() {
        if (!this.makeUpdate)
            return;
        this.makeUpdate = false;
        this.player.sprite.gotoAndPlay("jump");
        createjs.Tween.get(this.player.sprite, { override: true }).to({ y: this.player.sprite.y - 150 }, 500, createjs.Ease.quadOut)
            .to({ y: this.player.sprite.y }, 500, createjs.Ease.quadIn)
            .call(() => {
            this.player.changeState(this.player.prevState);
        });
    }
}
