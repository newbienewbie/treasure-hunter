import { Texture,Container,Sprite,Graphics,Text,extras  } from "pixi.js";
const {AnimatedSprite}=extras;

export function createExplosion() {
    const textures = [];
    for (let i = 0; i < 26; i++) {
        let name = `Explosion_Sequence_A ${i + 1}.png`;
        let texture = Texture.fromFrame(name);
        textures.push(texture);
    }
    const explosion = new AnimatedSprite(textures);
    explosion.loop = false;
    explosion.scale.set(0.5, 0.5);
    explosion.onComplete = function () {
        this.destroy();
    };
    return explosion;
}

export function createHealthBar() {
    const healthBar = new Container();

    //Create the black background rectangle
    const innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 100, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    //Create the front red rectangle
    const outerBar = new Graphics();
    outerBar.beginFill(0xFF0000);
    outerBar.drawRect(0, 0, 100, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;

    healthBar.on('get_hurt', function (damage) {
        this.outer.width -= damage;
    });
    return healthBar;
}

export function createExplorer(texture, opts) {
    const explorer = new Sprite(texture);
    const speed = 2;
    explorer.vx = 0;
    explorer.vy = 0;

    explorer.on('move_left', function () {
        this.vx = -speed;
        this.vy = 0;
    });
    explorer.on('stop_left', function () {
        this.vx = 0;
    });
    explorer.on('move_right', function () {
        this.vx = speed;
        this.vy = 0;
    });
    explorer.on('stop_right', function () {
        this.vx = 0;
    });
    explorer.on('move_top', function () {
        this.vx = 0;
        this.vy = -speed;
    });
    explorer.on('stop_top', function () {
        this.vy = 0;
    });
    explorer.on('move_bottom', function () {
        this.vx = 0;
        this.vy = speed;
    });
    explorer.on('stop_bottom', function () {
        this.vy = 0;
    });

    return explorer;
}

export function createBlob(texture, opts = { speed: 0, direction: 1 }) {

    const { speed, direction } = opts;
    //Make a blob
    const blob = new Sprite(texture);

    blob.speed = speed;
    blob.direction = direction;
    //Set the blob's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the blob will
    //move up. Multiplying `direction` by `speed` determines the blob's
    //vertical direction
    blob.vy = speed * direction;
    blob.on('hit_boundry', function () {
        this.vy = -this.vy;
        this.direction = -this.direction;
    });
    return blob;
}
