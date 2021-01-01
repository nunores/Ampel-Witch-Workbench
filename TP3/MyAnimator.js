class MyAnimator{
	constructor(scene, orchestrator, gameSequence) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;
        this.currTime = 0;
        this.index = 0;
    }

    reset(){
       this.gameSequence.reset();
    }

    undo(){
        this.gameSequence.undo();
    }

    update(deltaTime){
        
        this.currTime += deltaTime;
        if(this.currTime >= 4)
        {
            this.gameSequence.getMoves()[this.index].animate();
            this.index++;
            this.currTime = 0;
        }
        if(this.index === this.gameSequence.getMoves().length)
        {
            this.orchestrator.replayMode = false;
        }
    }
}