import { Game } from "./game.js";


let loader: createjs.LoadQueue;
let game: Game;
function init() {

    let manifest = [
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
    game = new Game(loader);
}


document.addEventListener("DOMContentLoaded", init);

