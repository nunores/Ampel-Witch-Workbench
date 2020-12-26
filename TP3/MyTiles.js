class MyTiles extends CGFobject {
	constructor(scene) {
        super(scene);
        this.firstX = 0;
        this.firstY = 0;
        this.tiles = [];
        this.yellowPieces = [];
        this.initBuffers();
    }
    
    initBuffers(){
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
            this.yellowPieces.push(new MyPiece(this.scene));
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
                            this.yellowPieces.pop();
                            //this.scene.pickResults[i][0].setPiece(new MyPiece(this.scene));
                            this.scene.gameOrchestrator.pickTile(this.scene.pickResults[i][0]);
                            console.log(this.scene.pickResults[i][0]);
                            console.log("Picked object: " + obj + ", with pick id " + customId);	
                        }					
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    
    addPiece(piece, tile){
        this.tiles.find(tile).addPiece(piece);
    }

    removePiece(tile){
        this.tiles.find(tile).unsetPiece();
    }

    getPiece(tile){
        return this.tiles.find(tile).getPiece();
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
            this.yellowPieces[i].display();
            this.scene.multMatrix(matrix1);
        }
        this.scene.popMatrix();
    }
}