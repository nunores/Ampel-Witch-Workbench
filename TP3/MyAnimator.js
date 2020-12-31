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
            if(this.gameSequence.getMoves()[this.index].piece.getType() === 'yellow')
            {
                this.orchestrator.gameBoard.yellowPieces.pop();
                this.orchestrator.gameBoard.yellowPiecesPlaced.push(this.gameSequence.getMoves()[this.index].piece);
            }
            /*if(this.gameSequence.getMoves()[this.index].piece.getType() === 'red')
            {
                this.orchestrator.gameBoard.redPieces.pop();
                this.orchestrator.gameBoard.redPiecesPlaced.push(this.gameSequence.getMoves()[this.index].piece);
            }
            if(this.gameSequence.getMoves()[this.index].piece.getType() === 'green')
            {
                this.orchestrator.gameBoard.greenPieces.pop();
                this.orchestrator.gameBoard.greenPiecesPlaced.push(this.gameSequence.getMoves()[this.index].piece);
            }*/
            this.index++;
            this.currTime = 0;
        }
        if(this.index === this.gameSequence.getMoves().length)
        {
            this.orchestrator.replayMode = false;
        }
    }
}