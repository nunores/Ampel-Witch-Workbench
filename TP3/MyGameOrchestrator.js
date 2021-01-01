class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.gameStates = Object.freeze({ "yellowPlacement": 0, "moveRedPiece": 1, "moveGreenPiece": 2, "placeRedPiece": 3, "placeGreenPiece": 4, "gameOver": 5})
        this.currentState = this.gameStates.yellowPlacement;
        this.currentPlayer = 1;

        this.gameBoard = new MyTiles(this.scene);
        this.prolog = new MyConnection(8081);
        this.tilePicked = null;
        
        this.newGameMove = null;
        this.gameSequence = new MyGameSequence(this.scene, []);
        
        this.animator = new MyAnimator(this.scene, this, this.gameSequence);

        this.replayMode = false;
  
        const botOptions = {
            pvp : "pvp",
            pve: "pve",
            eve: "eve"
        };
        
        //this.botOption = botOptions[0];
        this.botPlayer2 = false;
        this.botvbot = true;

        this.nextPlayer = false;
    }

    getState() {
        return this.currentState;
    }

    display() {
        this.gameBoard.display();
    }

    pickTile(origin, destination) {
        if (this.currentState === this.gameStates.yellowPlacement)
            this.move(origin, destination, 'yellow', 0);
        if (this.currentState === this.gameStates.placeRedPiece)
            this.move(origin, destination, 'red', 0);
        if (this.currentState === this.gameStates.placeGreenPiece)
            this.move(origin, destination, 'green', 0);
        if (this.currentState === this.gameStates.moveRedPiece)
            this.move(origin, destination, 'red', 0);
        if (this.currentState === this.gameStates.moveGreenPiece)
            this.move(origin, destination, 'green', 0);

    }

    move(origin, destination, pieceType, semaphoreChecker) {
        if (pieceType === 'yellow') {
            if (origin === null && destination !== null) {
                let yellowPieceToMove = this.gameBoard.yellowPieces[this.gameBoard.yellowPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, yellowPieceToMove, null, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                //this.gameBoard.yellowPiecesPlaced.push(yellowPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.yellowPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                /*for (let index = 0; index < this.gameBoard.yellowPiecesPlaced.length; index++) {
                    if (this.gameBoard.yellowPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.yellowPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                gameMove.animate();
            }
        }

        else if (pieceType === 'red') {
            if (origin === null && destination !== null) {
                let redPieceToMove = this.gameBoard.redPieces[this.gameBoard.redPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, redPieceToMove, null, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                //this.gameBoard.redPiecesPlaced.push(redPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.redPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                /*for (let index = 0; index < this.gameBoard.redPiecesPlaced.length; index++) {
                    if (this.gameBoard.redPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.redPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                gameMove.animate();
            }
        }

        else if (pieceType === 'green') {
            if (origin === null && destination !== null) {
                let greenPieceToMove = this.gameBoard.greenPieces[this.gameBoard.greenPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, greenPieceToMove, null, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                //this.gameBoard.greenPiecesPlaced.push(greenPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.greenPieces.push(origin.getPiece());
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                /*for (let index = 0; index < this.gameBoard.greenPiecesPlaced.length; index++) {
                    if (this.gameBoard.greenPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.greenPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, semaphoreChecker);
                gameMove.setState(this.currentState);
                gameMove.setPlayer(this.currentPlayer);
                this.gameSequence.addGameMove(gameMove);
                gameMove.animate();
            }
        }

    }

    unMove(origin, destination, pieceType, state, player) {
        if (pieceType === 'yellow') {
            if (origin === null && destination !== null) {
                let yellowPieceToMove = this.gameBoard.yellowPieces[this.gameBoard.yellowPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, yellowPieceToMove, null, destination, this.gameBoard, 0);
                //this.gameBoard.yellowPiecesPlaced.push(yellowPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.yellowPieces.push(origin.getPiece());
                //this.gameBoard.yellowPiecesPlaced.pop();
                this.gameBoard.startingYellows--;
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, 0);
                /*for (let index = 0; index < this.gameBoard.yellowPiecesPlaced.length; index++) {
                    if (this.gameBoard.yellowPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.yellowPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, 0);
                gameMove.animate();
            }
        }

        else if (pieceType === 'red') {
            if (origin === null && destination !== null) {
                let redPieceToMove = this.gameBoard.redPieces[this.gameBoard.redPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, redPieceToMove, null, destination, this.gameBoard, 0);
                //this.gameBoard.redPiecesPlaced.push(redPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.redPieces.push(origin.getPiece());
                //this.gameBoard.redPiecesPlaced.pop();
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, 0);
                /*for (let index = 0; index < this.gameBoard.redPiecesPlaced.length; index++) {
                    if (this.gameBoard.redPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.redPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, 0);
                gameMove.animate();
            }
        }

        else if (pieceType === 'green') {
            if (origin === null && destination !== null) {
                let greenPieceToMove = this.gameBoard.greenPieces[this.gameBoard.greenPieces.length - 1];
                let gameMove = new MyGameMove(this.scene, greenPieceToMove, null, destination, this.gameBoard, 0);
                //this.gameBoard.greenPiecesPlaced.push(greenPieceToMove);
                gameMove.animate();
            }
            else if (origin !== null && destination === null) {
                //this.gameBoard.greenPieces.push(origin.getPiece());
                //this.gameBoard.greenPiecesPlaced.pop();
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, null, this.gameBoard, 0);
                /*for (let index = 0; index < this.gameBoard.greenPiecesPlaced.length; index++) {
                    if (this.gameBoard.greenPiecesPlaced[index].getTile() == origin) {
                        this.gameBoard.greenPiecesPlaced.splice(index);
                        break;
                    }
                }*/
                gameMove.animate();
            }
            else {
                let gameMove = new MyGameMove(this.scene, origin.getPiece(), origin, destination, this.gameBoard, 0);
                gameMove.animate();
            }
        }
        this.currentState = state;
        this.currentPlayer = player;
    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    this.tilePicked = results[i][0];
                    if (obj) {
                        console.log(this.gameBoard.yellowPieces);
                        console.log(this.gameSequence);
                        console.log(this.gameBoard.greenPiecesPlaced);
                        console.log(this.gameBoard.redPiecesPlaced);
                        console.log("State: " + this.currentState);
                        console.log("Player: " + this.currentPlayer);
                        console.log(JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", ""));

                        // Player 1's turn
                        if(this.currentState !== this.gameStates.gameOver)
                        {
                            if(this.botvbot)
                            {
                                this.botvbotPlayPlayer1();
                            }
                            else if (this.currentPlayer === 1) {
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
                                                    if(this.botPlayer2)
                                                        this.botPlayer2PlayYellow();

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
                                                                this.gameBoard.player1Points += Math.floor(JSON.parse(data1.target.response).length / 2); // Adding semaphores made  
                                                                if(this.gameBoard.player1Points >= 5)
                                                                    this.currentState = this.gameStates.gameOver;                                                                                                                  
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
                                                                this.currentState = this.gameStates.placeRedPiece;
                                                                this.removePieces(JSON.parse(data1.target.response));   
                                                                this.gameBoard.player1Points += Math.floor(JSON.parse(data1.target.response).length / 2);    
                                                                if(this.gameBoard.player1Points >= 5)
                                                                    this.currentState = this.gameStates.gameOver;                                                                                                                  
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
                                                    if(!this.botPlayer2)
                                                    {
                                                        this.currentPlayer = 2;
                                                        this.currentState = this.gameStates.moveGreenPiece;
                                                    }
                                                    else
                                                    {
                                                        this.currentPlayer = 1;
                                                        this.currentState = this.gameStates.moveRedPiece;
                                                        this.botPlayer2Play();
                                                    }
                                                }
                                            }.bind(this));
                                            break;   
                                        }
                                    }
                                    else {
                                        if(!this.botPlayer2)
                                        {
                                            this.currentPlayer = 2;
                                            this.currentState = this.gameStates.moveGreenPiece;
                                        }
                                        else
                                        {
                                            this.currentPlayer = 1;
                                            this.currentState = this.gameStates.moveRedPiece;
                                            this.botPlayer2Play();
                                        }
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
                                                                this.currentState = this.gameStates.moveRedPiece;
                                                                this.removePieces(JSON.parse(data1.target.response));
                                                                this.gameBoard.player2Points += Math.floor(JSON.parse(data1.target.response).length / 2);  
                                                                if(this.gameBoard.player2Points >= 5)
                                                                    this.currentState = this.gameStates.gameOver;                                                                                                                       
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
                                                                this.currentState = this.gameStates.placeGreenPiece;
                                                                this.removePieces(JSON.parse(data1.target.response));
                                                                this.gameBoard.player2Points += Math.floor(JSON.parse(data1.target.response).length / 2); 
                                                                if(this.gameBoard.player2Points >= 5)
                                                                    this.currentState = this.gameStates.gameOver;                                                                                                                        
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
                }
                results.splice(0, results.length);
            }
        }
    }

    botvbotPlayPlayer1()
    {
        this.nextPlayer = false;
        if (this.currentState === this.gameStates.yellowPlacement)
        {
            this.prolog.getPrologRequest('choose_move(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + '2' + ')', function (data) {
                const move = JSON.parse(data.target.response);
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === move[0]) && (this.gameBoard.tiles[i].getColumn() === move[1]))
                    {
                        this.move(null, this.gameBoard.tiles[i], 'yellow', 1);
                        this.nextPlayer = true;
                        break;
                    }
                
                }
                if(this.gameBoard.yellowPieces.length == 0)
                    this.currentState = this.gameStates.moveRedPiece;
                this.botvbotPlayPlayer1();
            }.bind(this));
        }
        else
        {
            this.prolog.getPrologRequest('choose_move(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + '2' + ')', function (data) {
                let move = JSON.parse(data.target.response);
    
                let greenOrigin = move[1];
                let greenDestination = move[2];
                let redOrigin = move[3];
                let redDestination = move[4];
                let greenPlacement = move[5];
    
                let undoChecker = 0;
                
                let greenOriginTile = null;
                let greenDestinationTile = null;
                let redOriginTile = null;
                let redDestinationTile = null;
    
                if(greenOrigin.length !== 0)
                {
                    for(let i = 0; i < this.gameBoard.tiles.length; i++)
                    {
                        if((this.gameBoard.tiles[i].getLine() === greenOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === greenOrigin[1]))
                        {
                            greenOriginTile = this.gameBoard.tiles[i];
                            break;
                        }
                    }
                    for(let i = 0; i < this.gameBoard.tiles.length; i++)
                    {
                        if((this.gameBoard.tiles[i].getLine() === greenDestination[0]) && (this.gameBoard.tiles[i].getColumn() === greenDestination[1]))
                        {
                            greenDestinationTile = this.gameBoard.tiles[i];
                            break;
                        }
                    }
                    this.move(greenOriginTile, greenDestinationTile, 'red', 0);
                    undoChecker++;
                }
                if(redOrigin.length !== 0)
                {
                    for(let i = 0; i < this.gameBoard.tiles.length; i++)
                    {
                        if((this.gameBoard.tiles[i].getLine() === redOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === redOrigin[1]))
                        {
                            redOriginTile = this.gameBoard.tiles[i];
                            break;
                        }
                    }
                    for(let i = 0; i < this.gameBoard.tiles.length; i++)
                    {
                        if((this.gameBoard.tiles[i].getLine() === redDestination[0]) && (this.gameBoard.tiles[i].getColumn() === redDestination[1]))
                        {
                            redDestinationTile = this.gameBoard.tiles[i];
                            break;
                        }
                    }
                    this.move(redOriginTile, redDestinationTile, 'green', 0);
                    undoChecker++;
                }
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === greenPlacement[0]) && (this.gameBoard.tiles[i].getColumn() === greenPlacement[1]))
                    {
                        this.move(null, this.gameBoard.tiles[i], 'red', undoChecker);
                        break;
                    }
                }
                this.nextPlayer = true;
                this.currentPlayer = 1;
                this.currentState = this.gameStates.moveRedPiece;
                this.botvbotPlayPlayer2();
            }.bind(this));
        }
    }

    botvbotPlayPlayer2()
    {
        this.nextPlayer = false;
        console.log(JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", ""));
        this.prolog.getPrologRequest('choose_move_hard(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + '1' + ')', function (data) {
            let move = JSON.parse(data.target.response);

            let greenOrigin = move[2];
            let greenDestination = move[3];
            let redOrigin = move[4];
            let redDestination = move[5];
            let greenPlacement = move[6];

            let undoChecker = 0;
            
            let greenOriginTile = null;
            let greenDestinationTile = null;
            let redOriginTile = null;
            let redDestinationTile = null;

            if(greenOrigin.length !== 0)
            {
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === greenOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === greenOrigin[1]))
                    {
                        greenOriginTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === greenDestination[0]) && (this.gameBoard.tiles[i].getColumn() === greenDestination[1]))
                    {
                        greenDestinationTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                this.move(greenOriginTile, greenDestinationTile, 'green', 0);
                undoChecker++;
            }
            if(redOrigin.length !== 0)
            {
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === redOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === redOrigin[1]))
                    {
                        redOriginTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === redDestination[0]) && (this.gameBoard.tiles[i].getColumn() === redDestination[1]))
                    {
                        redDestinationTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                this.move(redOriginTile, redDestinationTile, 'red', 0);
                undoChecker++;
            }
            for(let i = 0; i < this.gameBoard.tiles.length; i++)
            {
                if((this.gameBoard.tiles[i].getLine() === greenPlacement[0]) && (this.gameBoard.tiles[i].getColumn() === greenPlacement[1]))
                {
                    this.move(null, this.gameBoard.tiles[i], 'green', undoChecker);
                    break;
                }
            }
            this.nextPlayer = true;
            this.currentPlayer = 1;
            this.currentState = this.gameStates.moveRedPiece;
            this.botvbotPlayPlayer1();
        }.bind(this));
    }

    botPlayer2PlayYellow(){
        this.prolog.getPrologRequest('choose_move(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + '2' + ')', function (data) {
            const move = JSON.parse(data.target.response);
            for(let i = 0; i < this.gameBoard.tiles.length; i++)
            {
                if((this.gameBoard.tiles[i].getLine() === move[0]) && (this.gameBoard.tiles[i].getColumn() === move[1]))
                {
                    this.move(null, this.gameBoard.tiles[i], 'yellow', 1);
                    break;
                }
            
            }
            if(this.gameBoard.yellowPieces.length == 0)
                this.currentState = this.gameStates.moveRedPiece;
        
        }.bind(this));
    }

    botPlayer2Play(){
        this.prolog.getPrologRequest('choose_move(' + JSON.stringify(this.gameBoard.convertToPrologGameState()).replaceAll("\"", "") + ','  + '2' + ')', function (data) {
            let move = JSON.parse(data.target.response);

            let greenOrigin = move[1];
            let greenDestination = move[2];
            let redOrigin = move[3];
            let redDestination = move[4];
            let greenPlacement = move[5];

            let undoChecker = 0;
            
            let greenOriginTile = null;
            let greenDestinationTile = null;
            let redOriginTile = null;
            let redDestinationTile = null;

            if(greenOrigin.length !== 0)
            {
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === greenOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === greenOrigin[1]))
                    {
                        greenOriginTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === greenDestination[0]) && (this.gameBoard.tiles[i].getColumn() === greenDestination[1]))
                    {
                        greenDestinationTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                this.move(greenOriginTile, greenDestinationTile, 'green', 0);
                undoChecker++;
            }
            if(redOrigin.length !== 0)
            {
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === redOrigin[0]) && (this.gameBoard.tiles[i].getColumn() === redOrigin[1]))
                    {
                        redOriginTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                for(let i = 0; i < this.gameBoard.tiles.length; i++)
                {
                    if((this.gameBoard.tiles[i].getLine() === redDestination[0]) && (this.gameBoard.tiles[i].getColumn() === redDestination[1]))
                    {
                        redDestinationTile = this.gameBoard.tiles[i];
                        break;
                    }
                }
                this.move(redOriginTile, redDestinationTile, 'red', 0);
                undoChecker++;
            }
            for(let i = 0; i < this.gameBoard.tiles.length; i++)
            {
                if((this.gameBoard.tiles[i].getLine() === greenPlacement[0]) && (this.gameBoard.tiles[i].getColumn() === greenPlacement[1]))
                {
                    this.move(null, this.gameBoard.tiles[i], 'green', undoChecker);
                    break;
                }
            }
            this.currentPlayer = 1;
            this.currentState = this.gameStates.moveRedPiece;
        }.bind(this));
    }

    removePieces(piecesToRemove){
        for (const pieceToRemove of piecesToRemove) {
            for(let i = 0; i < this.gameBoard.tiles.length; i++)
            {
                console.log(this.gameBoard.tiles[i]);
                if((this.gameBoard.tiles[i].getLine() === pieceToRemove[0]) && this.gameBoard.tiles[i].getColumn() === pieceToRemove[1])
                {
                    if(pieceToRemove === piecesToRemove[piecesToRemove.length-1])
                    {
                        this.move(this.gameBoard.tiles[i], null, this.gameBoard.tiles[i].getPiece().getType(), piecesToRemove.length);
                    }
                    else
                        this.move(this.gameBoard.tiles[i], null, this.gameBoard.tiles[i].getPiece().getType(), 0);
                    break;
                }
            }
        }
    }


    undo() {
        this.animator.undo();
    }

    reset(){
        this.animator.reset();
    }

    replay(){
        const moves = Array.from(this.gameSequence.getMoves());
        const state = this.currentState;
        const player = this.currentPlayer;
        this.animator.reset();
        this.currentState = state;
        this.currentPlayer = player;
        this.gameSequence = new MyGameSequence(this.scene, moves);
        this.animator = new MyAnimator(this.scene, this, this.gameSequence);
        this.replayMode = true;
        
    }

}
