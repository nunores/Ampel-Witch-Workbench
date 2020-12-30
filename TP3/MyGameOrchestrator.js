class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameStates = Object.freeze({ "yellowPlacement": 0, "moveRedPiece": 1, "moveGreenPiece": 2, "placeRedPiece": 3, "placeGreenPiece": 4, "gameOver": 5})
        this.currentState = this.gameStates.yellowPlacement;
        this.currentPlayer = 1;

        this.gameBoard = new MyTiles(this.scene);
        this.prolog = new MyConnection(8081);
        this.tilePicked = null;
        this.gameSequence = new MyGameSequence(this.scene, []);

        /*
        
        this.animator = new MyAnimator(…);
        this.theme = new MyScenegraph(…);
        */
    }

    getState() {
        return this.currentState;
    }

    display() {
        this.gameBoard.display();
    }

    pickTile(tile) {
        this.moveToBoard(tile);
    }

    pickTile(origin, destination) {
        if (this.currentState === this.gameStates.yellowPlacement)
            this.move(origin, destination, 'yellow');
        if (this.currentState === this.gameStates.placeRedPiece)
            this.move(origin, destination, 'red');
        if (this.currentState === this.gameStates.placeGreenPiece)
            this.move(origin, destination, 'green');
        if (this.currentState === this.gameStates.moveRedPiece)
            this.move(origin, destination, 'red');
        if (this.currentState === this.gameStates.moveGreenPiece)
            this.move(origin, destination, 'green');

    }

    move(origin, destination, pieceType) {
        if (pieceType === 'yellow') {
            if (origin === null && destination !== null) {
                let yellowPieceToMove = this.gameBoard.yellowPieces.pop();
                let gameMove = new MyGameMove(this.scene, yellowPieceToMove, null, destination, this.gameBoard);
                this.gameBoard.yellowPiecesPlaced.push(yellowPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                this.gameBoard.yellowPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard);
                for (let index = 0; index < this.gameBoard.yellowPiecesPlaced.length; index++) {
                    if (this.gameBoard.yellowPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.yellowPiecesPlaced.splice(index);
                        break;
                    }
                }
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard);
                gameMove.animate();
            }
        }

        else if (pieceType === 'red') {
            if (origin === null && destination !== null) {
                let redPieceToMove = this.gameBoard.redPieces.pop();
                let gameMove = new MyGameMove(this.scene, redPieceToMove, null, destination, this.gameBoard);
                this.gameBoard.redPiecesPlaced.push(redPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                this.gameBoard.redPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard);
                for (let index = 0; index < this.gameBoard.redPiecesPlaced.length; index++) {
                    if (this.gameBoard.redPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.redPiecesPlaced.splice(index);
                        break;
                    }
                }
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard);
                gameMove.animate();
            }
        }

        else if (pieceType === 'green') {
            if (origin === null && destination !== null) {
                let greenPieceToMove = this.gameBoard.greenPieces.pop();
                let gameMove = new MyGameMove(this.scene, greenPieceToMove, null, destination, this.gameBoard);
                this.gameBoard.greenPiecesPlaced.push(greenPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                this.gameBoard.greenPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard);
                for (let index = 0; index < this.gameBoard.greenPiecesPlaced.length; index++) {
                    if (this.gameBoard.greenPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.greenPiecesPlaced.splice(index);
                        break;
                    }
                }
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard);
                gameMove.animate();
            }
        }

    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    this.tilePicked = results[i][0];
                    if (obj) {
                        console.log("State: " + this.currentState);
                        console.log("Player: " + this.currentPlayer);
                        console.log(JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", ""));

                        // Player 1's turn
                        if (this.currentPlayer === 1) {
                            if (this.currentState === this.gameStates.yellowPlacement) {
                                // Pieces left on stack
                                if (this.gameBoard.yellowPieces.length != 0) {
                                    // Verify valid yellow placed
                                    if(this.tilePicked.piece == null)
                                    {
                                        this.prolog.getPrologRequest('forbiddenYellow(' + this.tilePicked.line + ',' + this.tilePicked.column + ')', function (data) {
                                            if (data.target.response === '0') {
                                                this.pickTile(null, this.tilePicked);
                                                this.gameBoard.startingYellows++;

                                                if (this.gameBoard.yellowPieces.length == 0) {
                                                    this.prolog.getPrologRequest('nextState(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ')', function (data) {
                                                        if (data.target.response === 'moveRed') {
                                                            this.currentState = this.gameStates.moveRedPiece;
                                                        }
                                                        else if (data.target.response === 'moveGreen') {
                                                            this.currentState = this.gameStates.moveGreenPiece;
                                                        }
                                                        else if (data.target.response === 'placeRed') {
                                                            this.currentState = this.gameStates.placeRedPiece;
                                                        }
                                                    }.bind(this));
                                                }
                                            }
                                            else console.log("Invalid yellow piece placement"); // TODO: Print message to user
                                        }.bind(this));
                                        //this.currentPlayer = 2;
                                        break;
                                    }
                                }
                            }
                            if (this.currentState === this.gameStates.moveRedPiece) {
                                if (this.gameBoard.redPiecesPlaced.length != 0) {
                                    if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
                                        // To be moved
                                        if (this.gameBoard.firstTile != null) {

                                            if (results[i][0].piece == null) {
                                                // Verify can move there

                                                this.prolog.getPrologRequest('possibleMovement(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.gameBoard.firstTile.getLine() + ',' + this.gameBoard.firstTile.getColumn() + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ')', function (data) {
                                                    if (data.target.response === '1') {
                                                        this.prolog.getPrologRequest('makesSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'r' + ')', function (data1) {
                                                            this.pickTile(this.gameBoard.getFirstTile(), this.tilePicked);
                                                            this.gameBoard.firstTile = null;
                                                            this.currentState = this.gameStates.moveGreenPiece;
                                                            this.removePieces(JSON.parse(data1.target.response));                                                                                                                        
                                                        }.bind(this));
                                                    }
                                                    else
                                                    {
                                                        this.gameBoard.firstTile = null;
                                                    }
                                                }.bind(this));
                                                break;

                                            }
                                            else {
                                                this.gameBoard.firstTile = null;
                                            }
                                        }
                                        // Selecting the first tile
                                        else {
                                            if(results[i][0].piece.getType() == 'red')
                                                this.gameBoard.firstTile = results[i][0];
                                            else
                                                this.gameBoard.firstTile = null;
                                        }
                                    }
                                }
                                else {
                                    this.currentState = this.gameStates.moveGreenPiece;
                                }
                            }
                            if (this.currentState === this.gameStates.moveGreenPiece) {
                                if (this.gameBoard.greenPiecesPlaced != 0) {
                                    if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
                                        // To be moved
                                        if (this.gameBoard.firstTile != null) {
                                            if (results[i][0].piece == null) {
                                                // Verify can move there
                                                this.prolog.getPrologRequest('possibleMovement(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.gameBoard.firstTile.getLine() + ',' + this.gameBoard.firstTile.getColumn() + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ')', function (data) {
                                                    if (data.target.response === '1') {                                       
                                                        this.prolog.getPrologRequest('makesSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'g' + ')', function (data1) {
                                                            this.pickTile(this.gameBoard.getFirstTile(), this.tilePicked);
                                                            this.gameBoard.firstTile = null;
                                                            this.currentState = this.gameStates.moveGreenPiece;
                                                            this.removePieces(JSON.parse(data1.target.response));                                                                                                                        
                                                        }.bind(this));
                                                    }
                                                    else
                                                    {
                                                        this.gameBoard.firstTile = null;
                                                    }
                                                }.bind(this));
                                                break;

                                            }
                                            else {
                                                this.gameBoard.firstTile = null;
                                            }
                                        }
                                        else
                                        {
                                            if(results[i][0].piece.getType() == 'green')
                                                this.gameBoard.firstTile = results[i][0];
                                            else
                                                this.gameBoard.firstTile = null;
                                        }
                                    }
                                }
                                else {
                                    this.currentState = this.gameStates.placeRedPiece;
                                }
                            }
                            if (this.currentState === this.gameStates.placeRedPiece) {
                                // Pieces left on stack
                                if (this.gameBoard.redPieces.length != 0) {
                                    if(this.tilePicked.piece == null)
                                    {
                                        this.prolog.getPrologRequest('doesntMakeSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'r' + ')', function (data) {
                                            if (data.target.response === '1') {                                       
                                                this.pickTile(null, this.tilePicked);
                                                this.currentPlayer = 2;
                                                this.currentState = this.gameStates.moveGreenPiece;
                                            }
                                        }.bind(this));
                                        break;   
                                    }
                                }
                                else {
                                    this.currentPlayer = 2;
                                    this.currentState = this.gameStates.moveGreenPiece;
                                }
                            }
                        }
                        else if (this.currentPlayer === 2) {
                            if (this.currentState === this.gameStates.yellowPlacement) {
                                // Pieces left on stack
                                if (this.gameBoard.yellowPieces.length != 0) {
                                    // Verify valid yellow placed
                                    this.prolog.getPrologRequest('forbiddenYellow(' + this.tilePicked.line + ',' + this.tilePicked.column + ')', function (data) {
                                        if (data.target.response === '0') {
                                            this.pickTile(null, this.tilePicked);

                                            if (this.gameBoard.yellowPieces.length == 0) {
                                                this.prolog.getPrologRequest('nextState(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ')', function (data) {
                                                    if (data.target.response === 'moveRed') {
                                                        this.currentState = this.gameStates.moveRedPiece;
                                                    }
                                                    else if (data.target.response === 'moveGreen') {
                                                        this.currentState = this.gameStates.moveGreenPiece;
                                                    }
                                                    else if (data.target.response === 'placeRed') {
                                                        this.currentState = this.gameStates.placeRedPiece;
                                                    }
                                                }.bind(this));
                                            }
                                        }
                                        else console.log("Invalid yellow piece placement"); // TODO: Print message to user
                                    }.bind(this));
                                    //this.currentPlayer = 2;
                                    break;
                                }
                            }
                            if (this.currentState === this.gameStates.moveGreenPiece) {
                                if (this.gameBoard.greenPiecesPlaced != 0) {
                                    if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
                                        // To be moved
                                        if (this.gameBoard.firstTile != null) {

                                            if (results[i][0].piece == null) {
                                                // Verify can move there

                                                this.prolog.getPrologRequest('possibleMovement(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.gameBoard.firstTile.getLine() + ',' + this.gameBoard.firstTile.getColumn() + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ')', function (data) {
                                                    if (data.target.response === '1') {
                                                        this.prolog.getPrologRequest('makesSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'g' + ')', function (data1) {
                                                            this.pickTile(this.gameBoard.getFirstTile(), this.tilePicked);
                                                            this.gameBoard.firstTile = null;
                                                            this.currentState = this.gameStates.moveGreenPiece;
                                                            this.removePieces(JSON.parse(data1.target.response));                                                                                                                        
                                                        }.bind(this));
                                                    }
                                                    else
                                                    {
                                                        this.gameBoard.firstTile = null;
                                                    }
                                                }.bind(this));
                                                break;

                                            }
                                            else {
                                                this.gameBoard.firstTile = null;
                                            }
                                        }
                                        else
                                        {
                                            if(results[i][0].piece.getType() == 'green')
                                                this.gameBoard.firstTile = results[i][0];
                                            else
                                                this.gameBoard.firstTile = null;
                                        }
                                    }
                                }
                                else {
                                    this.currentState = this.gameStates.moveRedPiece;
                                }
                            }
                            if (this.currentState === this.gameStates.moveRedPiece) {
                                if (this.gameBoard.redPiecesPlaced.length != 0) {
                                    if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
                                        // To be moved
                                        if (this.gameBoard.firstTile != null) {

                                            if (results[i][0].piece == null) {
                                                // Verify can move there
                                                this.prolog.getPrologRequest('possibleMovement(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.gameBoard.firstTile.getLine() + ',' + this.gameBoard.firstTile.getColumn() + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ')', function (data) {
                                                    if (data.target.response === '1') {
                                                        this.prolog.getPrologRequest('makesSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'r' + ')', function (data1) {
                                                            this.pickTile(this.gameBoard.getFirstTile(), this.tilePicked);
                                                            this.gameBoard.firstTile = null;
                                                            this.currentState = this.gameStates.moveGreenPiece;
                                                            this.removePieces(JSON.parse(data1.target.response));                                                                                                                        
                                                        }.bind(this));
                                                    }
                                                    else
                                                    {
                                                        this.gameBoard.firstTile = null;
                                                    }
                                                    
                                                }.bind(this));
                                                break;

                                            }
                                            else {
                                                this.gameBoard.firstTile = null;
                                            }
                                        }
                                        // Selecting the first tile
                                        else {
                                            if(results[i][0].piece.getType() == 'red')
                                                this.gameBoard.firstTile = results[i][0];
                                            else
                                                this.gameBoard.firstTile = null;
                                        }
                                    }
                                }
                                else {
                                    this.currentState = this.gameStates.placeGreenPiece;
                                }
                            }
                            if (this.currentState === this.gameStates.placeGreenPiece) {
                                // Pieces left on stack
                                if (this.gameBoard.greenPieces.length != 0) {
                                    if(this.tilePicked.piece == null)
                                    {
                                        this.prolog.getPrologRequest('doesntMakeSemaphore(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ',' + 'g' + ')', function (data) {
                                            if (data.target.response === '1') {                                       
                                                this.pickTile(null, this.tilePicked);
                                                this.currentPlayer = 1;
                                                this.currentState = this.gameStates.moveRedPiece;
                                            }
                                        }.bind(this));
                                        break;
                                    }
                                }
                                else {
                                    this.currentPlayer = 1;
                                    this.currentState = this.gameStates.moveRedPiece;
                                }
                            }
                        }
                    }
                }
                results.splice(0, results.length);
            }
        }
    }

    removePieces(piecesToRemove){
        for (const pieceToRemove of piecesToRemove) {
            for(let i = 0; i < this.gameBoard.tiles.length; i++)
            {
                console.log(this.gameBoard.tiles[i]);
                if((this.gameBoard.tiles[i].getLine() === pieceToRemove[0]) && this.gameBoard.tiles[i].getColumn() === pieceToRemove[1])
                {
                    this.move(this.gameBoard.tiles[i], null, this.gameBoard.tiles[i].getPiece().getType());
                    break;
                }
            }
        }
    }


    undo() {
        this.gameSequence.undo();
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
