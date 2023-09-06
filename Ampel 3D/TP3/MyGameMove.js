class MyGameMove{

    /**
     * 
     * @param {*} scene 
     * @param {*} piece - Piece moved 
     * @param {*} origin - Tile from where it moves
     * @param {*} destination - Tile where it moves to 
     * @param {*} gameBoard - Board
     * @param {*} semaphoreChecker - Makes semaphore
     */
	constructor(scene, piece, origin, destination, gameBoard, semaphoreChecker) {        
        this.scene = scene;
        this.piece = piece;
        this.origin = origin;
        this.destination = destination;
        this.gameBoard = gameBoard;
        this.semaphoreChecker = semaphoreChecker;
        this.state = null;
        this.player = null;
    }

    /**
     * 
     * @param {*} state - State to be set
     */
    setState(state)
    {
        this.state = state;
    }

    /**
     * 
     * @param {*} player - Player to be set
     */
    setPlayer(player)
    {
        this.player = player;
    }

    animate(){
        const pieceType = this.piece.getType();

        if(this.origin === null){
            this.setupAnimation(pieceType, 'toBoard');
        }
        else if(this.destination === null){
            this.setupAnimation(pieceType, 'toStack');
        }
        else {
            this.setupAnimation(pieceType, 'onBoard');
        }

        
    }


    /**
     * @brief - Helper function for animate()
     * @param {*} pieceType - Piece to be animatied
     * @param {*} direction - Where it should go
     */
    setupAnimation(pieceType, direction){
        if(pieceType === 'yellow'){
            if(direction === 'toBoard'){
                const keyframe1 = [0, vec3.fromValues(6 - this.destination.firstX, 11 - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.yellowPiecesPlaced.push(this.piece);
                this.gameBoard.yellowPieces.pop();
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -11 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.yellowPieces.push(this.piece);
                for(var i = 0; i < this.gameBoard.yellowPiecesPlaced.length; i++)
                {
                    if(this.gameBoard.yellowPiecesPlaced[i] === this.piece)
                        this.gameBoard.yellowPiecesPlaced.splice(i, 1);
                }
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
                this.gameBoard.removePiece(this.piece, this.origin);
            }
            else if(direction === 'onBoard'){
                const keyframe1 = [0, vec3.fromValues(this.origin.firstX - this.destination.firstX, this.origin.firstY - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];    
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);    
        
                this.gameBoard.movePiece(this.piece, this.origin, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
        }

        if(pieceType === 'red'){
            if(direction === 'toBoard'){
                const keyframe1 = [0, vec3.fromValues(6 - this.destination.firstX, 8 - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.redPiecesPlaced.push(this.piece);
                this.gameBoard.redPieces.pop();
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -8 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.redPieces.push(this.piece);
                for(var i = 0; i < this.gameBoard.redPiecesPlaced.length; i++)
                {
                    if(this.gameBoard.redPiecesPlaced[i] === this.piece)
                        this.gameBoard.redPiecesPlaced.splice(i, 1);
                }
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
                this.gameBoard.removePiece(this.piece, this.origin);
            }
            else if(direction === 'onBoard'){
                const keyframe1 = [0, vec3.fromValues(this.origin.firstX - this.destination.firstX, this.origin.firstY - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];    
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);    
        
                this.gameBoard.movePiece(this.piece, this.origin, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
        }

        
        if(pieceType === 'green'){
            if(direction === 'toBoard'){
                const keyframe1 = [0, vec3.fromValues(6 - this.destination.firstX, 5 - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.greenPiecesPlaced.push(this.piece);
                this.gameBoard.greenPieces.pop();
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -5 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.greenPieces.push(this.piece);
                for(var i = 0; i < this.gameBoard.greenPiecesPlaced.length; i++)
                {
                    if(this.gameBoard.greenPiecesPlaced[i] === this.piece)
                        this.gameBoard.greenPiecesPlaced.splice(i, 1);
                }
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
                this.gameBoard.removePiece(this.piece, this.origin);
            }
            else if(direction === 'onBoard'){
                const keyframe1 = [0, vec3.fromValues(this.origin.firstX - this.destination.firstX, this.origin.firstY - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];    
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);    
        
                this.gameBoard.movePiece(this.piece, this.origin, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }

        }
    }

    undo(){
        this.scene.gameOrchestrator.unMove(this.destination, this.origin, this.piece.getType(), this.state, this.player);
    }



}