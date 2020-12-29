class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameStates = Object.freeze({ "yellowPlacement": 1, "moveYourPiece": 2, "moveOthersPiece": 3, "placeNewPiece": 4, "gameOver": 5 })
        this.currentState = this.gameStates.yellowPlacement;
        this.gameBoard = new MyTiles(this.scene);
        this.prolog = new MyConnection(8081);
        this.tilePicked = null;

        /*
        
        this.gameSequence = new MyGameSequence(…);
        this.animator = new MyAnimator(…);
        this.theme = new MyScenegraph(…);
        */
    }

    display() {
        this.gameBoard.display();
    }

    pickTile(tile) {
        this.moveToBoard(tile);
    }

    pickTile(origin, destination) {
        this.move(origin, destination, 'yellow');
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

    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    if (obj) {
                        var customId = results[i][1];

                        // Selecting a tile with a piece
                        if (results[i][0].piece != null || this.gameBoard.firstTile != null) {
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
                            if (this.currentState === this.gameStates.yellowPlacement) {
                                if (this.gameBoard.yellowPieces.length != 0) {
                                    this.tilePicked = results[i][0];
                                    this.prolog.getPrologRequest('forbiddenYellow(' + this.tilePicked.line + ',' + this.tilePicked.column + ')', function (data) {
                                        if (data.target.response === '0') {
                                            this.pickTile(null, this.tilePicked);
                                        }
                                        else console.log("Invalid yellow piece placement");
                                    }.bind(this));

                                }
                            }
                        }
                        console.log(results[i][0]);
                    }
                }
                results.splice(0, results.length);
            }
        }
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
