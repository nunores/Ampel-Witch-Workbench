class MyGameMove{
	constructor(scene, piece, origin, destination, gameBoard) {        
        this.piece = piece;
        this.scene = scene;
        this.origin = origin;
        this.destination = destination;
        this.gameBoard = gameBoard;
    }

    animate(){
        const keyframe1 = [0, vec3.fromValues(6 - this.destination.firstX, 11 - this.destination.firstY, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];
        const keyframe2 = [2, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)];        
        let animation = new KeyframeAnimation([keyframe1, keyframe2], this.scene);

        this.gameBoard.setPiece(this.piece, this.destination);
        this.scene.animations.push(animation);
        this.piece.setAnimation(animation);
    }
}