import { Application} from "pixi.js";
import { EndingGameScene,PlayingGameScene } from "./scene";


const app=new Application(512,512);
document.body.appendChild(app.view);
app.stop();


/**
 *  当前的游戏场景状态
 */
let state=()=>{};


app.loader
    .add('treasureHunter',"/dist/img/treasureHunter.json")
    .add('explosion','/dist/img/explosion.json')
    .load(function setup() {
        const stage = app.stage;
        //Make the game scene and add it to the stage
    
        const playingScene = new PlayingGameScene(app);
        const endingScene = new EndingGameScene(app);
    
        playingScene.on('won', function () {
            endingScene.emit('won');
            this.scene.visible = false;
            state = endingScene.run.bind(endingScene);
        });
        playingScene.on('lost', function () {
            endingScene.emit('lost');
            this.scene.visible = false;
            state = endingScene.run.bind(endingScene);
        });
    
        //Set the game state
        state = playingScene.run.bind(playingScene);
    
        app.start();
    });



app.ticker.add(function(delta){
    state();
});



