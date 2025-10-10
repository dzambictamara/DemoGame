import { Player } from "../player.js";

export abstract class PlayerState {
    protected player! : Player
    makeUpdate: boolean = true;

    constructor(player : Player){
        this.player = player;
    }

    abstract update(): void;


}