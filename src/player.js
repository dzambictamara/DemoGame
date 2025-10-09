var Player = /** @class */ (function () {
    function Player(sheet, startX, startY) {
        this.speed = 10;
        this.isJumping = false;
        this.isWalking = false;
        this.sheet = sheet;
        this.sprite = new createjs.Sprite(this.sheet, "idle");
        this.sprite.regX = 80 / 2;
        this.sprite.regY = 110 / 2;
        this.sprite.x = startX;
        this.sprite.y = startY;
    }
    Player.prototype.idle = function () {
        this.isWalking = false;
        this.sprite.gotoAndPlay("idle");
    };
    Player.prototype.jump = function () {
        var _this = this;
        if (this.isJumping)
            return;
        this.isJumping = true;
        this.sprite.gotoAndPlay("jump");
        createjs.Tween.get(this.sprite, { override: true }).to({ y: this.sprite.y - 150 }, 500, createjs.Ease.quadOut)
            .to({ y: this.sprite.y }, 500, createjs.Ease.quadIn)
            .call(function () {
            _this.isJumping = false;
            if (_this.isWalking) {
                _this.sprite.gotoAndPlay("walk");
            }
        });
    };
    Player.prototype.walk = function (direction) {
        if (this.isJumping)
            return;
        this.isWalking = true;
        this.sprite.gotoAndPlay("walk");
        if (direction === "right") {
            this.sprite.scaleX = 1; // Flip the sprite
        }
        else {
            this.sprite.scaleX = -1; // Flip the sprite
        }
    };
    return Player;
}());
export { Player };
