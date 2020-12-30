class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameStates = Object.freeze({"yellowPlacement": 0, "moveRedPiece": 1, "moveGreenPiece": 2, "placeRedPiece": 3, "placeGreenPiece": 4, "gameOver": 5})
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

    getState(){
        return this.currentState;
    }

    display() {
        this.gameBoard.display();
    }

    pickTile(tile) {
        this.moveToBoard(tile);
    }

    pickTile(origin, destination) {
        if(this.currentState === this.gameStates.yellowPlacement) 
            this.move(origin, destination, 'yellow');
        if(this.currentState === this.gameStates.placeRedPiece)
            this.move(origin, destination, 'red');
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

    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    this.tilePicked = results[i][0];
                    if (obj) {
                        // Player 1's turn
                        if (this.currentPlayer === 1) {
                            if (this.currentState === this.gameStates.yellowPlacement) {
                                // Pieces left on stack
                                if (this.gameBoard.yellowPieces.length != 0) {
                                    // Verify valid yellow placed
                                    this.prolog.getPrologRequest('forbiddenYellow(' + this.tilePicked.line + ',' + this.tilePicked.column + ')', function (data) {
                                        if (data.target.response === '0') {
                                            this.pickTile(null, this.tilePicked);
                                            
                                            if(this.gameBoard.yellowPieces.length == 0) {
                                                this.prolog.getPrologRequest('nextState(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ')', function (data) {
                                                    if (data.target.response === 'moveRed'){
                                                        this.currentState = this.gameStates.moveRedPiece;
                                                    }
                                                    else if(data.target.response === 'moveGreen'){
                                                        this.currentState = this.gameStates.moveGreenPiece;
                                                    }
                                                    else if(data.target.response === 'placeRed')
                                                    {
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
                            if (this.currentState === this.gameStates.moveRedPiece) {
                                if(results[i][0].piece != null || this.gameBoard.firstTile != null)
                                {
                                    // To be moved
                                    if (this.gameBoard.firstTile != null) {

                                        if (results[i][0].piece == null) {
                                            // Verify can move there

                                            //this.tilePicked.setPiece(null);
                                            this.prolog.getPrologRequest('possibleMovement(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ',' + this.gameBoard.firstTile.getLine() + ',' + this.gameBoard.firstTile.getColumn() + ',' + this.tilePicked.getLine() + ',' + this.tilePicked.getColumn() + ')', function (data) {
                                                if (data.target.response === '1'){
                                                    this.pickTile(this.gameBoard.getFirstTile(), this.tilePicked);
                                                    this.gameBoard.firstTile = null;
                                                }
                                            }.bind(this));
                                            break;
                                            
                                        }
                                        else
                                        {
                                            this.gameBoard.firstTile = null;
                                        }
                                    }
                                    // Selecting the first tile
                                    else {
                                        this.gameBoard.firstTile = results[i][0];
                                    }
                                }
                            }
                            if (this.currentState === this.gameStates.moveGreenPiece) {
                                /*request*/
                                console.log(this.currentState);
                                this.currentPlayer = 2;
                                break;
                            }
                            if (this.currentState === this.gameStates.placeRedPiece){
                                // Pieces left on stack
                                if (this.gameBoard.redPieces.length != 0) {
                                    this.pickTile(null, this.tilePicked);
                                    break;
                                }
                            }

                        }


                        // Selecting a tile with a piece
                        /*if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
                            //this.scene.gameOrchestrator.pickTile(this.scene.pickResults[i][0], null);

                            // To be moved
                            if (this.gameBoard.firstTile != null) {
                                if (results[i][0].piece == null) {
                                    this.pickTile(this.gameBoard.firstTile, results[i][0]);
                                    this.gameBoard.firstTile = null;
                                }
                            }
                            // Selecting the first tile
                            else {
                                this.gameBoard.firstTile = results[i][0];
                            }
                        }

                        // Placing a new piece
                        else {

                            // Time to place yellows
                            if (this.currentState === this.gameStates.yellowPlacement) {
                                if (this.gameBoard.yellowPieces.length != 0) {
                                    this.tilePicked = results[i][0];
                                    this.prolog.getPrologRequest('forbiddenYellow(' + this.tilePicked.line + ',' + this.tilePicked.column + ')', function (data) {
                                        if (data.target.response === '0') {
                                            this.pickTile(null, this.tilePicked);
                                        }
                                        else console.log("Invalid yellow piece placement"); // TODO: Print message to user
                                    }.bind(this));

                                }
                            }
                        }*/
                        //console.log(results[i][0]);
                    }
                }
                results.splice(0, results.length);
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
