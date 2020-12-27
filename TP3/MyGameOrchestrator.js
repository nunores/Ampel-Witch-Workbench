class MyGameOrchestrator extends CGFobject {
	constructor(scene) {
        super(scene);
        this.gameBoard = new MyTiles(this.scene);


        /*
        
        this.gameSequence = new MyGameSequence(…);
        this.animator = new MyAnimator(…);
        this.gameboard = new MyGameboard(…);
        this.theme = new MyScenegraph(…);
        this.prolog = new MyPrologInterface(…);
        */
    }

    display(){
        this.gameBoard.display();
    }

    pickTile(tile){
        let yellowPieceToMove = this.gameBoard.yellowPieces.pop();
        let gameMove = new MyGameMove(this.scene, yellowPieceToMove, null, tile, this.gameBoard);
        this.gameBoard.yellowPiecesPlaced.push(yellowPieceToMove);
        gameMove.animate();
    }

/*     update(time) {
        this.animator.update(time);
    }
    display() {
        this.theme.display();
        this.gameboard.display();
        this.animator.display();
    
    } */




}
