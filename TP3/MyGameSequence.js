class MyGameSequence {
    constructor(scene, gameMoves) {
        this.scene = scene;
        this.gameMoves = gameMoves;
    }


    addGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    getMoves(){
        return this.gameMoves;
    }

    undo() {
        if (this.gameMoves.length > 0) {
            this.gameMoves[this.gameMoves.length - 1].undo();
            this.gameMoves.pop();
        }
    }

    reset() {
        while (this.gameMoves.length) {
            this.undo();
        }
    }

}