export class Player {
    sprite: createjs.Sprite;
    sheet: createjs.SpriteSheet;
    speed: number = 10;
    isJumping: boolean = false;
    isWalking: boolean = false;


    constructor(sheet: createjs.SpriteSheet, startX: number, startY: number) {
        this.sheet = sheet;
        this.sprite = new createjs.Sprite(this.sheet, "idle");
        this.sprite.regX = 80 / 2;
        this.sprite.regY = 110 / 2;
        this.sprite.x = startX;
        this.sprite.y = startY;
    }

    idle() {
        this.isWalking = false;
        this.sprite.gotoAndPlay("idle");
    }

    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.sprite.gotoAndPlay("jump");
        createjs.Tween.get(this.sprite, { override: true }).to({ y: this.sprite.y - 150 }, 500, createjs.Ease.quadOut)
            .to({ y: this.sprite.y }, 500, createjs.Ease.quadIn)
            .call(() => {
                this.isJumping = false;
                this.idle();
            });

    }

    walk(direction: "left" | "right",) {
        if (this.isJumping) return;
        this.isWalking = true;
        this.sprite.gotoAndPlay("walk");

        if (direction === "right") {
            this.sprite.scaleX = 1; // Flip the sprite
        } else {
            this.sprite.scaleX = -1; // Flip the sprite
        }
    }


}
