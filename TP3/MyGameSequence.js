class MyGameSequence{
	constructor(scene, gameMoves) {
        super(scene);
        this.gameMoves = gameMoves;
    }


    addGameMove(gameMove){
        this.gameMoves.push(gameMove);
    }


}