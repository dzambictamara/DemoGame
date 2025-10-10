import { Game } from "./game.js";
function init() {
    let manifest = [
        { src: "player/player_idle.png", id: "idle", crossOrigin: "anonymous" },
        { src: "player/player_jump.png", id: "jump", crossOrigin: "anonymous" },
        { src: "player/player_walk1.png", id: "walk1", crossOrigin: "anonymous" },
        { src: "player/player_walk2.png", id: "walk2", crossOrigin: "anonymous" },
        { src: "scene/light.png", id: "light", crossOrigin: "anonymous" },
        { src: "scene/city.png", id: "city", crossOrigin: "anonymous" }
    ];
    let loader = new createjs.LoadQueue(false);
    loader.loadManifest(manifest, true, "./assets/");
    loader.on("complete", () => {
        let game = new Game(loader);
        game.start();
    });
}
document.addEventListener("DOMContentLoaded", init);
