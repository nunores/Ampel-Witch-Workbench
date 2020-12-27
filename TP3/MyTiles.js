class MyTiles extends CGFobject {
	constructor(scene) {
        super(scene);
        this.firstX = 0;
        this.firstY = 0;
        this.tiles = [];
        this.yellowPieces = [];
        this.yellowPiecesPlaced = [];
        this.createBoard();
    }
    
    createBoard(){
        let index = 0;
        for (let i = 1; i < 12; i++) {
            for(let n = 0; n < i; n++)
            {
                let tile = new MyTile(this.scene, this.firstX, this.firstY);
                this.tiles[index] = tile;
                index++;
                this.firstX -= 1.1;
            }
            this.firstX = 0.51*i;
            this.firstY += 1.1;

        }        

        for(let i = 0; i < 10; i++){
            const piece = new MyPiece(this.scene);
            this.yellowPieces.push(piece);
            this.scene.components.push(piece);
        }
    }

    logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        if(this.yellowPieces.length != 0){
                            //let animation = new KeyframeAnimation([[0, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)], [2, vec3.fromValues(10, 10, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)]], this.scene);
                            
                            //this.scene.yellowPieces[1].setAnimation(animation);
                            //this.scene.pickResults[i][0].setPiece(new MyPiece(this.scene));
                            this.scene.gameOrchestrator.pickTile(this.scene.pickResults[i][0]);
                            console.log("Picked object: " + obj + ", with pick id " + customId);	
                        }					
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    
    setPiece(piece, tile){
        tile.setPiece(piece);
        piece.setTile(tile);
    }

    removePiece(tile){
        tile.unsetPiece();
    }

    getPiece(tile){
        return tile.getPiece();
    }

    getTile(piece){
        for (const tile in this.tiles) {
            if (tile.getPiece() == piece)
                return tile;
        }
        
        return null;
    }

/*     movePiece(piece, startingTile, endingTile){

    } */


	display(){
        this.logPicking();
		for(let i = 0; i < this.tiles.length; i++){
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();
        let matrix = mat4.create();
        let matrix1 = mat4.create();
        this.scene.pushMatrix();
        matrix = mat4.translate(matrix, matrix, [6, 11, 0]);
        this.scene.multMatrix(matrix);      
        matrix1 = mat4.translate(matrix1, matrix1, [0, 0, 0.2]);
        for(let i = 0; i < this.yellowPieces.length; i++){
            if(this.yellowPieces[i].tile === null){
                this.yellowPieces[i].display();
                this.scene.multMatrix(matrix1);
            }
        }
        this.scene.popMatrix();
    }
}