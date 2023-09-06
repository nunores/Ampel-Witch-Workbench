class MyGameSequence {
    constructor(scene, gameMoves) {
        this.scene = scene;
        this.gameMoves = gameMoves;
    }


    /**
     * 
     * @param {*} gameMove - Move to be added 
     */
    addGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    getMoves(){
        return this.gameMoves;
    }

    undo() {
        if (this.gameMoves.length > 0) {
            if(this.gameMoves[this.gameMoves.length - 1].semaphoreChecker === 0)
            {
                this.gameMoves[this.gameMoves.length - 1].undo();
                this.gameMoves.pop();
            }
            else
            {
                let tempSize = this.gameMoves[this.gameMoves.length - 1].semaphoreChecker + 1;
                for(let i = 0; i < tempSize; i++)
                {
                    this.gameMoves[this.gameMoves.length - 1].undo();
                    this.gameMoves.pop();
                }
            }
        }
    }

    reset() {
        while (this.gameMoves.length) {
            this.undo();
        }
    }

}