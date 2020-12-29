class MyGameSequence{
	constructor(scene, gameMoves) {
        this.scene = scene;
        this.gameMoves = gameMoves;
    }


    addGameMove(gameMove){
        this.gameMoves.push(gameMove);
    }

    undo(){
        this.gameMoves[this.gameMoves.length - 1].undo();
        this.gameMoves.pop(); 
    }

    reset(){
        
    }

}