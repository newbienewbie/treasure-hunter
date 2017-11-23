import { Container,utils } from "pixi.js";
const {EventEmitter}=utils;

export class GameScene extends EventEmitter{

    constructor(app){
        super();
        /**
         * Application
         */
        this.app=app;
        this.loader=this.app.loader;
        this.stage=this.app.stage;

        /**
         * scene
         */
        this.scene=new Container();

        /**
         * sprites reference
         */
        this.sprites={};
        this.setup();
    }

    /**
     * set up all 
     * @param {Container} stage 
     */
    setup(){
        this.stage.addChild(this.scene);
    }

    /**
     * update all data
     */
    run(){
        throw Error('the #run() method must be implemented by subclass');
    }

}
