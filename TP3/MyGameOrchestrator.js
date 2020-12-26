class MyGameOrchestrator extends CGFobject {
	constructor(scene) {
        super(scene);
        this.gameboard = new MyTiles(this.scene);


        /*
        
        this.gameSequence = new MyGameSequence(…);
        this.animator = new MyAnimator(…);
        this.gameboard = new MyGameboard(…);
        this.theme = new MyScenegraph(…);
        this.prolog = new MyPrologInterface(…);
        */
    }

    display(){
        this.gameboard.display();
    }

    pickTile(tile){
        tile.setPiece(new MyPiece(this.scene));
        tile.piece.setAnimation(new KeyframeAnimation([[0, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)], [2, vec3.fromValues(tile.firstX - 6, tile.firstY - 11, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]], this.scene));
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
