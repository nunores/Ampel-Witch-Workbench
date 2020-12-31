class MyGameMove{
	constructor(scene, piece, origin, destination, gameBoard) {        
        this.scene = scene;
        this.piece = piece;
        this.origin = origin;
        this.destination = destination;
        this.gameBoard = gameBoard;
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

    setupAnimation(pieceType, direction){
        if(pieceType === 'yellow'){
            if(direction === 'toBoard'){
                const keyframe1 = [0, vec3.fromValues(6 - this.destination.firstX, 11 - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -11 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
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
        
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -8 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
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
        
                this.gameBoard.setPiece(this.piece, this.destination);
                this.scene.animations.push(animation);
                this.piece.setAnimation(animation);
            }
            else if (direction === 'toStack'){
                const keyframe1 = [0, vec3.fromValues(-6 + this.origin.firstX, -5 + this.origin.firstY, -(this.gameBoard.yellowPieces.length - 1) * 0.2), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe2 = [2, vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
                const keyframe3 = [4, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
                const animation = new KeyframeAnimation([keyframe1, keyframe2, keyframe3], this.scene);
        
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
        const tempOrigin = this.origin;
        const tempDestination = this.destination;
        
        this.origin = tempDestination;
        this.destination = tempOrigin;
        this.scene.gameOrchestrator.unMove(this.origin, this.destination, this.piece.getType());
    }



}