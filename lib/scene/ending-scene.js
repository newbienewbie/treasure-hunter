import { Text } from "pixi.js";
import { GameScene } from "./base";


export class EndingGameScene extends GameScene{
    constructor(app){
        super(app);
        this.on('won',()=>{
            this.sprites['message'].text='You Won !';
            this.scene.visible=true;
        });
        this.on('lost',()=>{
            this.scene.visible=true;
            this.sprites['message'].text='You Lost !';
        });
    }
    setup(){
        this.scene.visible = false;
        const message = new Text( "The End!", { font: "64px Futura", fill: "white" });
        message.x = 120;
        message.y = this.stage.height / 2 - 32;
        this.sprites['message']=message;
        this.scene.addChild(message);
        super.setup();
    }
    run(){
    }
}
