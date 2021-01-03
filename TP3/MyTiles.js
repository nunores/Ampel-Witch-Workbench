class MyTiles extends CGFobject {
	constructor(scene) {
        super(scene);
        this.firstX = 0;
        this.firstY = 0;
        
        this.tiles = [];

        this.yellowPieces = [];
        this.yellowPiecesPlaced = [];

        this.redPieces = [];
        this.redPiecesPlaced = [];

        this.greenPieces = [];
        this.greenPiecesPlaced = [];

        this.startingYellows = 0;

        this.player1Points = 0;
        this.player2Points = 0;
        
        this.markerSetup();

        this.timerSetup();

        this.gameOverSetup();

        this.createBoard();

        this.materialBoard = new CGFappearance(this.scene);
        this.textureBoard = new CGFtexture(this.scene, "./scenes/images/dark_wood.jpg");
        this.materialBoard.setTexture(this.textureBoard);

        this.firstTile = null;

    }

    markerSetup(){
        this.player1Marker = new MySpriteText(this.scene, "Player 1 Points: " + this.player1Points.toString());
        this.player2Marker = new MySpriteText(this.scene, "Player 2 Points: " + this.player2Points.toString());
    }

    timerSetup(){
        this.timer = new MySpriteText(this.scene, "Time: " + this.player1Points.toString());
    }

    gameOverSetup(){
        this.gameOverMarker = new MySpriteText(this.scene, "Game Over");
    }
    
    createBoard(){     
        this.createTiles(); 
        this.createYellowPieces();
        this.createGreenPieces();
        this.createRedPieces();
    }

    createYellowPieces(){
        for(let i = 0; i < 10; i++){
            const piece = new MyPiece(this.scene, 'yellow');
            this.yellowPieces.push(piece);
            this.scene.components.push(piece);
        }
    }

    createGreenPieces(){
        for(let i = 0; i < 20; i++){
            const piece = new MyPiece(this.scene, 'green');
            this.greenPieces.push(piece);
            this.scene.components.push(piece);
        }
    }

    createRedPieces(){
        for(let i = 0; i < 20; i++){
            const piece = new MyPiece(this.scene, 'red');
            this.redPieces.push(piece);
            this.scene.components.push(piece);
        }
    }

    createTiles(){
        let index = 0;
        for (let i = 0; i < 11; i++) {
            for(let n = 0; n < (i+1); n++)
            {
                let tile = new MyTile(this.scene, this.firstX, this.firstY, i, n);
                this.tiles[index] = tile;
                index++;
                this.firstX -= 1.1;
            }
            this.firstX = 0.51*(i+1);
            this.firstY += 1.1;

        }    
    }

    
    setPiece(piece, tile){
        tile.setPiece(piece);
        piece.setTile(tile);
    }

    removePiece(piece, tile){
        tile.unsetPiece();
        piece.unsetTile();
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

    getFirstTile(){
        return this.firstTile;
    }

    movePiece(piece, startingTile, endingTile){
        this.setPiece(piece, endingTile);
        this.removePiece(piece, startingTile);
    }

    unMovePiece(piece, startingTile, endingTile){
        this.removePiece(piece, endingTile);
        this.setPiece(piece, startingTile);
    }


	display(){

        this.scene.pushMatrix();

        this.scene.translate(-5, -4.5, -2.9);

        this.scene.pushMatrix();

        this.scene.translate(-8, 1, 0);
        this.scene.rotate(90 * DEGREE_TO_RAD, 0, 0, 1);

        this.player1Marker.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.translate(-6, 1, 0);
        this.scene.rotate(90 * DEGREE_TO_RAD, 0, 0, 1);

        this.player2Marker.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.translate(-4, 5, 0);
        this.scene.rotate(90 * DEGREE_TO_RAD, 0, 0, 1);

        this.timer.display();

        this.scene.popMatrix();

        if(this.scene.gameOrchestrator.currentState === this.scene.gameOrchestrator.gameStates.gameOver){
            this.scene.pushMatrix();

            this.scene.translate(15, 15, 0);
            this.scene.rotate(90 * DEGREE_TO_RAD, 0, 0, -1);
    
            this.gameOverMarker.display();
    
            this.scene.popMatrix();
        }

        this.scene.popMatrix();

        let matrix = mat4.create();
        let matrix1 = mat4.create();
        let matrix2 = mat4.create();
        let matrix3 = mat4.create();

        this.scene.pushMatrix();
        this.scene.translate(-0.4, 5.5, -0.5);
        this.displayBoard();
        this.scene.popMatrix();

		for(let i = 0; i < this.tiles.length; i++){
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();

        // Display

        this.scene.pushMatrix();
        matrix = mat4.translate(matrix, matrix, [6, 11, -0.5]);
        this.scene.multMatrix(matrix);      
        matrix1 = mat4.translate(matrix1, matrix1, [0, 0, 0.2]);
        this.displayYellowPieces(matrix1);
        this.scene.popMatrix();

        matrix2 = mat4.translate(matrix2, matrix2, [6, 8, -0.5]);
        this.scene.pushMatrix();
        this.scene.multMatrix(matrix2);
        this.displayRedPieces(matrix1);
        this.scene.popMatrix();

        matrix3 = mat4.translate(matrix3, matrix3, [6, 5, -0.5]);
        this.scene.pushMatrix();
        this.scene.multMatrix(matrix3);
        this.displayGreenPieces(matrix1);
        this.scene.popMatrix();
    }

    displayYellowPieces(matrix) {
        for(let i = 0; i < this.yellowPieces.length; i++){
            if(this.yellowPieces[i].tile === null){
                this.yellowPieces[i].getMaterial().apply();
                this.yellowPieces[i].display();
                this.scene.multMatrix(matrix);
            }
        }
    }

    displayGreenPieces(matrix) {
        for(let i = 0; i < this.greenPieces.length; i++){
            if(this.greenPieces[i].tile === null){
                this.greenPieces[i].getMaterial().apply();
                this.greenPieces[i].display();
                this.scene.multMatrix(matrix);
            }
        }
    }

    displayRedPieces(matrix) {
        for(let i = 0; i < this.redPieces.length; i++){
            if(this.redPieces[i].tile === null){
                this.redPieces[i].getMaterial().apply();
                this.redPieces[i].display();
                this.scene.multMatrix(matrix);
            }
        }
    }

    displayBoard(){
        this.materialBoard.apply();
        let plane = new Plane(this.scene, 10, 10);

        this.setMaterialBoard();

        this.scene.pushMatrix();
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -3);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -7.5, -1.5);
        this.scene.scale(1, 1, 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(0, -7.5, -1.5);
        this.scene.scale(1, 1, 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, -7.5, -1.5);
        this.scene.scale(1, 1, 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.translate(0, -7.5, -1.5);
        this.scene.scale(1, 1, 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(15, 15, 1);
        plane.display();
        this.scene.popMatrix();
    }

    
    setMaterialBoard(){
        this.materialBoard.setAmbient(0, 0, 0.1, 1);
        this.materialBoard.setEmission(0, 0, 0.1, 1);
        this.materialBoard.apply();
    }


    convertToPrologGameState(){
        let gameState = [];
        let arrayIndex = 0;
        for (let i = 0; i < 11; i++) {
            let tempArray = [];

            for (let index = 0; index < i + 1; index++) {
                if(this.tiles[arrayIndex].piece === null)
                {
                    tempArray.push('x');
                }
                else if (this.tiles[arrayIndex].piece.getType() === 'yellow'){
                    tempArray.push('y');
                }
                else if (this.tiles[arrayIndex].piece.getType() === 'red'){
                    tempArray.push('r');
                }
                else if (this.tiles[arrayIndex].piece.getType() === 'green'){
                    tempArray.push('g');
                }
                else if (this.tiles[arrayIndex].piece.getType() === 'redCylinder'){
                    tempArray.push('rc');
                }
                else if (this.tiles[arrayIndex].piece.getType() === 'greenCylinder'){
                    tempArray.push('gc');
                }
                arrayIndex++;
            }

            gameState.push(tempArray);

        }

        gameState.push([this.redPieces.length, this.greenPieces.length, this.player1Points, this.player2Points, this.startingYellows, this.scene.gameOrchestrator.getState() === 0 ? 0 : 1]);

        return gameState;
    }
}