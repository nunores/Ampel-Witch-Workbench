class MyAnimator{
	constructor(scene, orchestrator, gameSequence) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;
        this.currentMove = 0;
        this.playing = false;
    }

    reset(){
       this.gameSequence.reset();
    }

    start(){
        this.playing = true;
    }

    pause(){
        this.playing = false;
    }

    undo(){
        this.gameSequence.undo();
        this.currentMove--;
    }

/*     update(time){
         
    }

    display(){
        
    } */
}