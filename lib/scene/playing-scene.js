import { Container ,Sprite} from "pixi.js";
import { GameScene } from "./base";
import { bindKeyStrokeToPlayer,keyboard } from "../keyboard";
import * as Factory from "../factory";
import { hitTestRectangle,contain } from "../collision";


//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export class PlayingGameScene extends GameScene{
    constructor(app){
        super(app);
    }

    setup(){
        super.setup();

        //Make the sprites and add them to the `this.scene`
        //Create an alias for the texture atlas frame ids
        const textures = this.app.loader.resources["treasureHunter"].textures;

        //Dungeon
        this.sprites["dungeon"] = new Sprite(textures["dungeon.png"]);
        this.scene.addChild(this.sprites["dungeon"]);

        //Door
        this.sprites["door"] = new Sprite(textures["door.png"]);
        this.sprites["door"].position.set(32, 0);
        this.scene.addChild(this.sprites["door"]);

        //Explorer
        const explorer=this.sprites["explorer"] = Factory.createExplorer(textures["explorer.png"]);
        explorer.position.set(68,this.scene.height / 2 - explorer.height / 2 );
        this.scene.addChild(this.sprites["explorer"]);

        //Treasure
        const treasure=this.sprites["treasure"] = new Sprite(textures["treasure.png"]);
        treasure.position.set(
            this.scene.width - treasure.width - 48,
            this.scene.height / 2 - treasure.height / 2
        );
        this.scene.addChild(this.sprites["treasure"]);

        //Make the blobs
        const numberOfBlobs = 6;
        const spacing = 48;
        const xOffset = 150;
        let direction = 1;
        const speed = 5;

        //An array to store all the blob monsters
        this.blobs=[];

        //Make as many blobs as there are `numberOfBlobs`
        let blobTexture = textures['blob.png'];
        for (var i = 0; i < numberOfBlobs; i++) {

            //Make a blob
            var blob = Factory.createBlob(blobTexture, {
                speed,
                direction
            });

            //Space each blob horizontally according to the `spacing` value.
            //`xOffset` determines the point from the left of the screen
            //at which the first blob should be added
            var x = spacing * i + xOffset;

            //Give the blob a random y position
            var y = randomInt(0, this.stage.height - blob.height);

            //Set the blob's position
            blob.x = x;
            blob.y = y;

            //Reverse the direction for the next blob
            direction *= -1;

            //Push the blob into the `blobs` array
            this.blobs.push(blob);

            //Add the blob to the `this.scene`
            this.scene.addChild(blob);
        }

        //Create the health bar
        const healthBar=this.sprites["healthBar"] =Factory.createHealthBar();
        healthBar.position.set(this.stage.width - 170, 6)
        this.scene.addChild(healthBar);

        bindKeyStrokeToPlayer(explorer);
    }

    run(){
        const app=this.app;
        const explorer=this.sprites['explorer'];
        const treasure=this.sprites['treasure'];
        const healthBar=this.sprites['healthBar'];
        const door=this.sprites['door'];

        //use the explorer's velocity to make it move
        explorer.x += explorer.vx;
        explorer.y += explorer.vy;

        //Contain the explorer inside the area of the dungeon
        contain(explorer, { x: 28, y: 10, width: 488, height: 480 });
        //contain(explorer, stage);

        //Set `explorerHit` to `false` before checking for a collision
        var explorerHit = false;

        //Loop through all the sprites in the `enemies` array
        this.blobs.forEach(function (blob) {
            //Move the blob
            blob.y += blob.vy;

            //Check the blob's screen boundaries
            var blobHitsWall = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

            //If the blob hits the top or bottom of the stage, reverse
            //its direction
            if (blobHitsWall === "top" || blobHitsWall === "bottom") {
                // blob.vy *= -1;
                blob.emit('hit_boundry');
            }

            //Test for a collision. If any of the enemies are touching
            //the explorer, set `explorerHit` to `true`
            if (hitTestRectangle(explorer, blob)) {
                explorerHit = true;
            }
        });

        //If the explorer is hit...
        if (explorerHit) {

            //Make the explorer semi-transparent
            explorer.alpha = 0.5;

            //Reduce the width of the health bar's inner rectangle by 1 pixel
            // healthBar.outer.width -= 1;
            healthBar.emit(`get_hurt`, 1);
            const explosion=Factory.createExplosion();
            let point=app.stage.toGlobal(explorer.position);
            explosion.position.set(point.x- explosion.width/2,point.y - explosion.height/2);
            app.stage.addChild(explosion);
            explosion.play();

        } else {
            //Make the explorer fully opaque (non-transparent) if it hasn't been hit
            explorer.alpha = 1;
        }

        //Check for a collision between the explorer and the treasure
        if (hitTestRectangle(explorer, treasure)) {

            //If the treasure is touching the explorer, center it over the explorer
            treasure.x = explorer.x + 8;
            treasure.y = explorer.y + 8;
        }

        //Does the explorer have enough health? If the width of the `innerBar`
        //is less than zero, end the game and display "You lost!"
        if (healthBar.outer.width < 0) {
            //state = end;
            //message.text = "You lost!";
            this.emit('lost');
        }

        //If the explorer has brought the treasure to the exit,
        //end the game and display "You won!"
        if (hitTestRectangle(treasure, door)) {
            //state = end;
            //message.text = "You won!";
            this.emit('won');
        }
    }
}



