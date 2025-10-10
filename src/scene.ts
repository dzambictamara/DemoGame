
export class Scene {
    isMoving: boolean = false;
    lights: createjs.Bitmap[] = [];

    constructor(lightImg: Object) {

        for (let i = 0; i < 6; i++) {
            let light = new createjs.Bitmap(lightImg);
            light.scaleX = 0.3;
            light.scaleY = 0.3;
            light.x = (-100 + i * 300);
            light.y = 200;
            this.lights.push(light);
        }
    }

    update(playerSpeed : number) {
        if (!this.isMoving) return;

        for (let light of this.lights) {
            if (light.x < -400) {
                light.x += 6 * 300;
            } else if (light.x > 6 * 300 -100) {
                light.x -= 6 * 300;
            }
            createjs.Tween.get(light).to({ x: light.x - playerSpeed }, 50);
        }
    }
}