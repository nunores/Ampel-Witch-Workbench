init:-
    menu(Option),
    optionManager(Option).


% optionManager(+Option)

optionManager(1):-
    initial(GameState),
    createGame(GameState, 1, 0, NextPlayer, NewGameState2),
    gameLoop(NewGameState2, NextPlayer),
    init.

optionManager(2):-
    initial(GameState),
    createGameOption2(GameState, 1, 0, NextPlayer, NewGameState2),
    gameLoopOption2(NewGameState2, NextPlayer),
    init.

optionManager(3):-
    initial(GameState),
    botMoveOption3_1(GameState, NextPlayer, 1, NewGameState),
    botMoveOption3_2(NewGameState, NextPlayer, 1, _NewGameState2),
    init.


optionManager(0).

%gameLoopOption2(NewGameState2, NextPlayer).

gameLoopOption2(GameState, 1):-
    (redPiecesOnBoard(GameState),
        gameLoop1FirstRepeat(GameState, NewGameState);
        NewGameState = GameState
    ),    
    (greenPiecesOnBoard(NewGameState),
        gameLoop1SecondRepeat(NewGameState, NewGameState1);
        NewGameState1 = NewGameState
    ),
    (enoughRedPieces(NewGameState1),
        gameLoop1ThirdRepeat(NewGameState1, NewGameState2);
        replaceUpperRed(NewGameState1, NewGameState2)
    ),
    (game_over(NewGameState2, Winner),
        display_game_over(Winner);
        botMove(NewGameState2, 2, 2, _FinalGameState)
    ).

createGameOption2(GameState, _Player, 10, _NextPlayer, NewGameState):-
    changeGameState(11, 5, 1, GameState, NewGameState, 0).

createGameOption2(GameState, 1, YellowsPlaced, NextPlayer, X):-
    display_game(GameState),
    repeat,
        write('Player 1: Choose where you want the yellow piece'),nl,
        readLineInputYellow(Line),
        (Line == -1 ->
            changeGameState(11, 5, 1, GameState, X, 0);
            ((verifyLine(Line), 
                readColumnInput(Column),
                ((verifyColumn(Line, Column),
                    availableSpot(GameState, Line, Column),
                    \+forbiddenYellowSpot(Line, Column),
                    changeGameState(Line, Column, y, GameState, NewGameState, 0),
                    YellowsPlaced_new is YellowsPlaced+1,
                    changeGameState(11, 4, YellowsPlaced_new, NewGameState, NewGameState1, 0),
                    botMove(NewGameState1, NextPlayer, 2, X));
                    false
                ));
                (canStopPlacement(Line, YellowsPlaced), NextPlayer is 1, X = GameState, true);
                write('Invalid coordinates / not enough yellow pieces placed / yellow at that position / forbidden position'), nl,
                false
            )
        ).
        

% gameLoop(+GameState, +Player)

gameLoop(GameState, 1):-
    (redPiecesOnBoard(GameState),
        gameLoop1FirstRepeat(GameState, NewGameState);
        NewGameState = GameState
    ),    
    (greenPiecesOnBoard(NewGameState),
        gameLoop1SecondRepeat(NewGameState, NewGameState1);
        NewGameState1 = NewGameState
    ),
    (enoughRedPieces(NewGameState1),
        gameLoop1ThirdRepeat(NewGameState1, NewGameState2);
        replaceUpperRed(NewGameState1, NewGameState2)
    ),
    (game_over(NewGameState2, Winner),
        display_game_over(Winner);
        gameLoop(NewGameState2, 2)
    ).

gameLoop(GameState, 2):-
    (greenPiecesOnBoard(GameState),
        gameLoop2FirstRepeat(GameState, NewGameState);
        NewGameState = GameState
    ),
    (redPiecesOnBoard(NewGameState),
        gameLoop2SecondRepeat(NewGameState, NewGameState1);
        NewGameState1 = NewGameState
    ),
    (enoughGreenPieces(NewGameState1),
        gameLoop2ThirdRepeat(NewGameState1, NewGameState2);
        replaceUpperGreen(NewGameState1, NewGameState2)
    ),
    (game_over(NewGameState2, Winner),
        display_game_over(Winner);
        gameLoop(NewGameState2, 1)
    ).

gameLoop1FirstRepeat(GameState, NewGameState):-
    repeat,
        display_game(GameState),
        write('Player 1: Choose the red disc you want to move'), nl,
        readLineInput(Line),
        (verifyLine(Line),
            readColumnInput(Column),
            ((verifyColumn(Line, Column),
                (isRedLowerCase(GameState, Line, Column),
                    chooseDestination1(GameState, Line, Column, NewGameState);
                    false
                );
                false
            ));
            write('There is not a red piece in that position'),nl,
            false
        ).

gameLoop1SecondRepeat(NewGameState, NewGameState1):-
    repeat,
        display_game(NewGameState),
        write('Player 1: Choose the green disc you want to move'), nl,
        readLineInput(NewLine),
        (verifyLine(NewLine),
            readColumnInput(NewColumn),
            ((verifyColumn(NewLine, NewColumn),
                (isGreenLowerCase(NewGameState, NewLine, NewColumn),
                    chooseDestination3(NewGameState, NewLine, NewColumn, NewGameState1);
                    false
                );
                false
            ));
            write('There is not a green piece in that position'),nl,
            false
        ).

gameLoop1ThirdRepeat(NewGameState2, FinalGameState):-
    (enoughRedPieces(NewGameState2),
                (repeat,
                    display_game(NewGameState2),
                    write('Player 1: Choose where you want the red piece'),nl,
                    readLineInput(NewLine2),
                    ((verifyLine(NewLine2), 
                        readColumnInput(NewColumn2),
                        ((verifyColumn(NewLine2, NewColumn2),
                            makesSemaphore(NewGameState2, NewLine2, NewColumn2, rc, PiecesToRemove),
                            PiecesToRemove = [],
                            availableSpot(NewGameState2, NewLine2, NewColumn2),
                            replaceUpperRed(NewGameState2, NewGameState3),
                            changeGameState(NewLine2, NewColumn2, rc, NewGameState3, NewGameState4, 0),
                            getPiece(NewGameState4, 11, 0, NumberRedPieces),
                            NewNumberRedPieces is NumberRedPieces - 1,
                            changeGameState(11, 0, NewNumberRedPieces, NewGameState4, FinalGameState, 0));
                            false
                        ));
                        write('Invalid coordinates'), nl,
                        false
                    ))).

    

gameLoop2FirstRepeat(GameState, NewGameState):-
    repeat,
        display_game(GameState),
        write('Player 2: Choose the green disc you want to move'), nl,
        readLineInput(Line),
        (verifyLine(Line),
            readColumnInput(Column),
            ((verifyColumn(Line, Column),
                (isGreenLowerCase(GameState, Line, Column),
                    chooseDestination2(GameState, Line, Column, NewGameState);
                    false
                );
                false
            ));
            write('There is not a green piece in that position'),nl,
            false
        ).

gameLoop2SecondRepeat(NewGameState, NewGameState2):-
    repeat,
        display_game(NewGameState),
        write('Player 2: Choose the red disc you want to move'), nl,
        readLineInput(NewLine),
        (verifyLine(NewLine),
            readColumnInput(NewColumn),
            ((verifyColumn(NewLine, NewColumn),
                (isRedLowerCase(NewGameState, NewLine, NewColumn),
                    chooseDestination4(NewGameState, NewLine, NewColumn, NewGameState2);
                    false
                );
                false
            ));
            write('There is not a red piece in that position'),nl,
            false
        ).

gameLoop2ThirdRepeat(NewGameState2, NewGameState5):-
    repeat,
        display_game(NewGameState2),
        write('Player 2: Choose where you want the green piece'),nl,
        readLineInput(NewLine2),
        ((verifyLine(NewLine2), 
            readColumnInput(NewColumn2),
            ((verifyColumn(NewLine2, NewColumn2),
                makesSemaphore(NewGameState2, NewLine2, NewColumn2, gc, PiecesToRemove),
                PiecesToRemove = [],
                availableSpot(NewGameState2, NewLine2, NewColumn2),
                replaceUpperGreen(NewGameState2, NewGameState3),
                changeGameState(NewLine2, NewColumn2, gc, NewGameState3, NewGameState4, 0),
                getPiece(NewGameState4, 11, 1, NumberGreenPieces),
                NewNumberGreenPieces is NumberGreenPieces - 1,
                changeGameState(11, 1, NewNumberGreenPieces, NewGameState4, NewGameState5, 0));
                false
            ));
            write('Invalid coordinates'), nl,
            false
        ).

chooseDestination1(GameState, Line, Column, NewGameState):-
    repeat,
        write('Player 1: Choose where you want the red disc to go'), nl,
        readLineInput(New_Line),
        (verifyLine(New_Line),
            readColumnInput(New_Column),
            ((verifyColumn(New_Line, New_Column),
                (availableSpot(GameState, New_Line, New_Column),
                    (possibleMovement(GameState, Line, Column, New_Line, New_Column),
                        movePiece(GameState, Line, Column, New_Line, New_Column, NewGameState_first),
                        makesSemaphore(NewGameState_first, New_Line, New_Column, r, Remove),
                        length(Remove, Size),
                        Value is Size//2,
                        removePiece(NewGameState_first, Remove, NewGameState_second),
                        addPointPlayer1(NewGameState_second, Value, NewGameState);
                        false
                    );
                    false
                );
                false
            ));
            write('That is not a possible position for your piece'),nl,
            false
        ).

chooseDestination2(GameState, Line, Column, NewGameState):-
    repeat,
        write('Player 2: Choose where you want the green disc to go'), nl,
        readLineInput(New_Line),
        (verifyLine(New_Line),
            readColumnInput(New_Column),
            ((verifyColumn(New_Line, New_Column),
                (availableSpot(GameState, New_Line, New_Column),
                    (possibleMovement(GameState, Line, Column, New_Line, New_Column),
                        movePiece(GameState, Line, Column, New_Line, New_Column, NewGameState_first),
                        makesSemaphore(NewGameState_first, New_Line, New_Column, g, Remove),
                        length(Remove, Size),
                        Value is Size//2,
                        removePiece(NewGameState_first, Remove, NewGameState_second),
                        addPointPlayer2(NewGameState_second, Value, NewGameState);
                        false
                    );
                    false
                );
                false
            ));
            write('That is not a possible position for your piece'),nl,
            false
        ).

chooseDestination3(GameState, Line, Column, NewGameState):-
    repeat,
        write('Player 1: Choose where you want the green disc to go'), nl,
        readLineInput(New_Line),
        (verifyLine(New_Line),
            readColumnInput(New_Column),
            ((verifyColumn(New_Line, New_Column),
                (availableSpot(GameState, New_Line, New_Column),
                    (possibleMovement(GameState, Line, Column, New_Line, New_Column),
                        movePiece(GameState, Line, Column, New_Line, New_Column, NewGameState_first),
                        makesSemaphore(NewGameState_first, New_Line, New_Column, g, Remove),
                        length(Remove, Size),
                        Value is Size//2,
                        removePiece(NewGameState_first, Remove, NewGameState_second),
                        addPointPlayer1(NewGameState_second, Value, NewGameState);
                        false
                    );
                    false
                );
                false
            ));
            write('That is not a possible position for your piece'),nl,
            false
        ).

chooseDestination4(GameState, Line, Column, NewGameState):-
    repeat,
        write('Player 2: Choose where you want the red disc to go'), nl,
        readLineInput(New_Line),
        (verifyLine(New_Line),
            readColumnInput(New_Column),
            ((verifyColumn(New_Line, New_Column),
                (availableSpot(GameState, New_Line, New_Column),
                    (possibleMovement(GameState, Line, Column, New_Line, New_Column),
                        movePiece(GameState, Line, Column, New_Line, New_Column, NewGameState_first),
                        makesSemaphore(NewGameState_first, New_Line, New_Column, r, Remove),
                        length(Remove, Size),
                        Value is Size//2,
                        removePiece(NewGameState_first, Remove, NewGameState_second),
                        addPointPlayer2(NewGameState_second, Value, NewGameState);
                        false
                    );
                    false
                );
                false
            ));
            write('That is not a possible position for your piece'),nl,
            false
        ).

possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column),
    Column_temp is Column + 1,
    verifyColumn(Line, Column_temp),
    getPiece(GameState, Line, Column_temp, x),
    countHorizontal(Line, Column, GameState, Counter),    
    (moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        false
    ),!.


possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column),
    Column_temp is Column - 1,
    verifyColumn(Line, Column_temp),
    getPiece(GameState, Line, Column_temp, x),
    countHorizontal(Line, Column, GameState, Counter),
    (moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        fail
    ),!.


possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column),
    Column_temp is Column - 1,
    Line_temp is Line - 1,
    verifyLine(Line_temp),
    verifyColumn(Line_temp, Column_temp),
    getPiece(GameState, Line_temp, Column_temp, x),
    countDiagonals(Line, Column, GameState, left, Counter),
    (moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        false
    ),!.


possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column),
    Line_temp is Line + 1,
    verifyLine(Line_temp),  
    verifyColumn(Line_temp, Column),
    getPiece(GameState, Line_temp, Column, x),
    countDiagonals(Line, Column, GameState, right, Counter),
    (moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        false
    ),!.


possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column),
    Line_temp is Line - 1,
    verifyLine(Line_temp),
    verifyColumn(Line_temp, Column),
    getPiece(GameState, Line_temp, Column, x),
    countDiagonals(Line, Column, GameState, right, Counter),
    (moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        false
    ),!.


possibleMovement(GameState, Line, Column, New_Line, New_Column):-
    (Line =\= New_Line; Column =\= New_Column), 
    Line_temp is Line + 1,
    Column_temp is Column + 1,
    verifyLine(Line_temp),
    verifyColumn(Line_temp, Column_temp),
    getPiece(GameState, Line_temp, Column_temp, x),
    countDiagonals(Line, Column, GameState, left, Counter),
    (moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 1),
        true;
        false
    ),!.

% moveRight(+GameState, +Line, +Column, -NewLine, -NewColumn, -Counter)

moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    ColumnTemp is Column + 1,
    (\+notAvailable(GameState, Line, ColumnTemp),
        moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).

moveRight(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.
 
moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    ColumnTemp is Column + 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, Line, ColumnTemp),
        (moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveRight(GameState, Line, ColumnTemp, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).

moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    ColumnTemp is Column - 1,
    (\+notAvailable(GameState, Line, ColumnTemp),
        moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).

moveLeft(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.

moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    ColumnTemp is Column - 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, Line, ColumnTemp),
        (moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveLeft(GameState, Line, ColumnTemp, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).

moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    ColumnTemp is Column + 1,
    LineTemp is Line - 1,
    (\+notAvailable(GameState, LineTemp, ColumnTemp),
        moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).


moveTopLeft(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.

moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    ColumnTemp is Column - 1,
    LineTemp is Line - 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, LineTemp, ColumnTemp),
        (moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveTopLeft(GameState, LineTemp, ColumnTemp, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).

moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    LineTemp is Line + 1,
    (\+notAvailable(GameState, LineTemp, Column),
        moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).


moveBotLeft(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.

moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    LineTemp is Line + 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, LineTemp, Column),
        (moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveBotLeft(GameState, LineTemp, Column, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).

moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    LineTemp is Line - 1,
    (\+notAvailable(GameState, LineTemp, Column),
        moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).

moveTopRight(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.

moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    LineTemp is Line - 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, LineTemp, Column),
        (moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveTopRight(GameState, LineTemp, Column, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).

moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 0):-
    ColumnTemp is Column + 1,
    LineTemp is Line + 1,
    (\+notAvailable(GameState, LineTemp, ColumnTemp),
        moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 1);
        false
    ).

moveBotRight(_GameState, Line, Column, New_Line, New_Column, 0, 1):-
    Line == New_Line,
    Column == New_Column.

moveBotRight(GameState, Line, Column, New_Line, New_Column, Counter, 1):-
    Counter \== 0,
    LineTemp is Line + 1,
    ColumnTemp is Column + 1,
    NewCounter is Counter - 1,
    (notAvailable(GameState, LineTemp, ColumnTemp),
        (moveRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
            true;
            (moveLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                true;
                (moveBotLeft(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                    true;
                    (moveTopRight(GameState, Line, Column, New_Line, New_Column, Counter, 0),
                        true;
                        false
                    )
                )
            )
        );
        moveBotRight(GameState, LineTemp, ColumnTemp, New_Line, New_Column, NewCounter, 1),
            true;
            false
    ).
    
% movePiece(+GameState, +Line, +Column, +NewLine, +NewColumn, -NewGameState):-

movePiece(GameState, Line, Column, NewLine, NewColumn, NewGameState):-
    getPiece(GameState, Line, Column, PieceToMove),
    changeGameState(Line, Column, x, GameState, NewGameState1, 0),
    changeGameState(NewLine, NewColumn, PieceToMove, NewGameState1, NewGameState2, 0),
    NewGameState = NewGameState2.

% createGame(+GameState, +Player, +YellowsPlaced, -NextPlayer, -ResultingGameState)

createGame(GameState, _Player, 10, _NextPlayer, GameState).

createGame(GameState, 1, YellowsPlaced, NextPlayer, X):-
    display_game(GameState),
    repeat,
        write('Player 1: Choose where you want the yellow piece'),nl,
        readLineInputYellow(Line),
        ((verifyLine(Line), 
            readColumnInput(Column),
            ((verifyColumn(Line, Column),
                availableSpot(GameState, Line, Column),
                \+forbiddenYellowSpot(Line, Column),
                changeGameState(Line, Column, y, GameState, NewGameState, 0),
                YellowsPlaced_new is YellowsPlaced+1,
                changeGameState(11, 4, YellowsPlaced_new, NewGameState, NewGameState1, 0),
                createGame(NewGameState1, 2, YellowsPlaced_new, NextPlayer, X));
                false
            ));
            (canStopPlacement(Line, YellowsPlaced), NextPlayer is 1, X = GameState, true);
            write('Invalid coordinates / not enough yellow pieces placed / yellow at that position / forbidden position'), nl,
            false
        ).

createGame(GameState, 2, YellowsPlaced, NextPlayer, X):-
    display_game(GameState),
    repeat,
        write('Player 2: Choose where you want the yellow piece'),nl,
        readLineInputYellow(Line),
        ((verifyLine(Line), 
            readColumnInput(Column),
            ((verifyColumn(Line, Column),
                availableSpot(GameState, Line, Column),
                \+forbiddenYellowSpot(Line, Column),
                changeGameState(Line, Column, y, GameState, NewGameState, 0),
                YellowsPlaced_new is YellowsPlaced+1,
                changeGameState(11, 4, YellowsPlaced_new, NewGameState, NewGameState1, 0),
                createGame(NewGameState1, 1, YellowsPlaced_new, NextPlayer, X));
                false
            ));
            (canStopPlacement(Line, YellowsPlaced), NextPlayer is 2, X = GameState, true);
            write('Invalid coordinates / not enough yellow pieces placed / yellow at that position / forbidden position'), nl,
            false
        ).





% initial(-GameState)


initial(GameState):-
    GameState = 
    [
        
    [x], 
    [x, x],
    [x, x, x],
    [x, x, x, x],
    [x, x, x, x, x],
    [x, x, x, x, x, x],
    [x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x, x],
    [x, x, x, x, x, x, x, x, x, x, x],
    [20, 20, 0, 0, 0, 0] % Peças vermelhas, peças verdes, peças amarelas player1, peças amarelas player2, peças amarelas no começo




    ].

% changeGameState(+Line, +Column, +Piece, +GameState, -NewGameState, +RedirectedFlag)

changeGameState(0, 0, Piece, [[H|_T]|GameState], [[Piece]|GameState], 0):-
    H \== Piece.

changeGameState(0, 0, Piece, [H|GameState], [Piece|GameState], 1):-
    H \== Piece.

changeGameState(0, Column, Piece, [H|GameState], [H|NewGameState], 1):-
	Column > 0,
	NewColumn is Column -1,
	changeGameState(0, NewColumn, Piece, GameState, NewGameState, 1).

changeGameState(1, Column, Piece, [H|[Head|Tail]], [H|[Newhead|Tail]], 0):-
	changeGameState(0, Column, Piece, Head, Newhead, 1).	

changeGameState(Line, Column, Piece, [H|GameState], [H|NewGameState], 0):-
	Line > 0,
	NewLine is Line -1,
	changeGameState(NewLine, Column, Piece, GameState, NewGameState, 0).


% Rules

% forbiddenYellowSpot(+Line, +Column)

forbiddenYellowSpot(0, 0).
forbiddenYellowSpot(1, 0).
forbiddenYellowSpot(2, 0).
forbiddenYellowSpot(3, 0).
forbiddenYellowSpot(4, 0).
forbiddenYellowSpot(5, 0).
forbiddenYellowSpot(6, 0).
forbiddenYellowSpot(7, 0).
forbiddenYellowSpot(8, 0).
forbiddenYellowSpot(9, 0).
forbiddenYellowSpot(10, 0).

forbiddenYellowSpot(1, 1).
forbiddenYellowSpot(2, 2).
forbiddenYellowSpot(3, 3).
forbiddenYellowSpot(4, 4).
forbiddenYellowSpot(5, 5).
forbiddenYellowSpot(6, 6).
forbiddenYellowSpot(7, 7).
forbiddenYellowSpot(8, 8).
forbiddenYellowSpot(9, 9).
forbiddenYellowSpot(10, 10).

forbiddenYellowSpot(10, 1).
forbiddenYellowSpot(10, 2).
forbiddenYellowSpot(10, 3).
forbiddenYellowSpot(10, 4).
forbiddenYellowSpot(10, 5).
forbiddenYellowSpot(10, 6).
forbiddenYellowSpot(10, 7).
forbiddenYellowSpot(10, 8).
forbiddenYellowSpot(10, 9).

% (+GameState, +Line, +Column)
isRed(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == r.

isRed(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == rc.

isRedLowerCase(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == r.



% isGreen(+GameState, +Line, +Column)
isGreen(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == g.

isGreen(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == gc.

isGreenLowerCase(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == g.

% availableSpot(+GameState, +Line, +Column)

availableSpot(GameState, Line, Column):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Element),
    Element == x.


% verifyLine(+Line)

verifyLine(Line):-
    Line > -1,
    Line < 11.


% verifyColumn(+Line, +Column)

verifyColumn(Line, Column):-
    Column > -1,
    Column =< Line.


% canStopPlacement(+Line, +YellowsPlaced)

canStopPlacement(Line, YellowsPlaced):-
    Line =:= -1,
    YellowsPlaced > 4,
    YellowsPlaced < 11.


% getPiece(+GameState, +Line, +Column, -Piece)

getPiece(GameState, Line, Column, Piece):-
    nth0(Line, GameState, LineList),
    nth0(Column, LineList, Piece).



% countHorizontal(+Line, +Column, +GameState, -Result)

countHorizontal(Line, Column, GameState, Result):-
    iterateHorizontally(Line, Column, GameState, right, Counter1),
    iterateHorizontally(Line, Column, GameState, left, Counter2),
    getPiece(GameState, Line, Column, Piece),
    (pieceIsCharacter(Piece),
        Result is Counter1 + Counter2 + 1
    ;
        Result is Counter1 + Counter2
    ),!.
    

% iterateHorizontally(+Line, +Column, +GameState, +Side, -Result)

iterateHorizontally(Line, Column, _GameState, left, Counter):-
    NewColumn is Column - 1,
    outOfBounds(Line, NewColumn),
    Counter is 0.


iterateHorizontally(Line, Column, GameState, left, Counter):-
    NewColumn is Column - 1,
    getPiece(GameState, Line, NewColumn, Piece),
    iterateHorizontally(Line, NewColumn, GameState, left, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2
    ).


iterateHorizontally(Line, Column, _GameState, right, Counter):-
    NewColumn is Column + 1,
    outOfBounds(Line, NewColumn),
    Counter is 0.


iterateHorizontally(Line, Column, GameState, right, Counter):-
    NewColumn is Column + 1,
    getPiece(GameState, Line, NewColumn, Piece),
    iterateHorizontally(Line, NewColumn, GameState, right, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2).

% countDiagonals(+Line, +Column, +GameState, +Side, -Result)

countDiagonals(Line, Column, GameState, right, Result):-
    iterateDiagonally(Line, Column, GameState, right, Counter),
    getPiece(GameState, Line, Column, Piece),
    (pieceIsCharacter(Piece), 
        Result is Counter + 1
    ;
        Result is Counter
    ),!.

countDiagonals(Line, Column, GameState, left, Result):-
    iterateDiagonally(Line, Column, GameState, left, Counter),
    getPiece(GameState, Line, Column, Piece),
    (pieceIsCharacter(Piece),
        Result is Counter + 1
    ;
        Result is Counter
    ),!.


% iterateDiagonally(+Line, +Column, +GameState, +Side, -Result)

iterateDiagonally(Line, Column, GameState, right, Counter):-
    NewLineUp is Line - 1,
    iterateDiagonallyUp(NewLineUp, Column, GameState, right, Counter1),
    NewLineDown is Line + 1,
    iterateDiagonallyDown(NewLineDown, Column, GameState, left, Counter2),
    Counter is Counter1 + Counter2.

    

iterateDiagonally(Line, Column, GameState, left, Counter):-
	NewLineUp is Line - 1,
    NewColumnUp is Column - 1,
    iterateDiagonallyUp(NewLineUp, NewColumnUp, GameState, left, Counter1),
    NewLineDown is Line + 1,
    NewColumnDown is Column + 1,
    iterateDiagonallyDown(NewLineDown, NewColumnDown, GameState, right, Counter2),
    Counter is Counter1 + Counter2.


iterateDiagonallyUp(Line, Column, _GameState, right, Counter):-
    outOfBounds(Line, Column),
    Counter is 0.

iterateDiagonallyUp(Line, Column, GameState, right, Counter):-
    getPiece(GameState, Line, Column, Piece),
    NewLine is Line - 1,
    iterateDiagonallyUp(NewLine, Column, GameState, right, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2).


iterateDiagonallyUp(Line, Column, _GameState, left, Counter):-
    outOfBounds(Line, Column),
    Counter is 0.

iterateDiagonallyUp(Line, Column, GameState, left, Counter):-
    getPiece(GameState, Line, Column, Piece),
    NewLine is Line - 1,
    NewColumn is Column - 1,
    iterateDiagonallyUp(NewLine, NewColumn, GameState, left, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2).


iterateDiagonallyDown(Line, Column, _GameState, right, Counter):-
    outOfBounds(Line, Column),
    Counter is 0.

iterateDiagonallyDown(Line, Column, GameState, right, Counter):-
    getPiece(GameState, Line, Column, Piece),
    NewLine is Line + 1,
    NewColumn is Column + 1,
    iterateDiagonallyDown(NewLine, NewColumn, GameState, right, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2).


iterateDiagonallyDown(Line, Column, _GameState, left, Counter):-
    outOfBounds(Line, Column),
    Counter is 0.

iterateDiagonallyDown(Line, Column, GameState, left, Counter):-
    getPiece(GameState, Line, Column, Piece),
    NewLine is Line + 1,
    iterateDiagonallyDown(NewLine, Column, GameState, left, Counter2),
    (pieceIsCharacter(Piece), 
        Counter is Counter2 + 1
    ;
        Counter is Counter2).

% outOfBounds(+Line, +Column)

outOfBounds(Line, Column):-
    Line < 0;
    Line > 10;
    Column < 0;
    Column > Line.

inBounds(0,0).
inBounds(1,0).
inBounds(1,1).
inBounds(2,0).
inBounds(2,1).
inBounds(2,2).
inBounds(3,0).
inBounds(3,1).
inBounds(3,2).
inBounds(3,3).
inBounds(4,0).
inBounds(4,1).
inBounds(4,2).
inBounds(4,3).
inBounds(4,4).
inBounds(5,0).
inBounds(5,1).
inBounds(5,2).
inBounds(5,3).
inBounds(5,4).
inBounds(5,5).
inBounds(6,0).
inBounds(6,1).
inBounds(6,2).
inBounds(6,3).
inBounds(6,4).
inBounds(6,5).
inBounds(6,6).
inBounds(7,0).
inBounds(7,1).
inBounds(7,2).
inBounds(7,3).
inBounds(7,4).
inBounds(7,5).
inBounds(7,6).
inBounds(7,7).
inBounds(8,0).
inBounds(8,1).
inBounds(8,2).
inBounds(8, 3).
inBounds(8, 4).
inBounds(8, 5).
inBounds(8, 6).
inBounds(8, 7).
inBounds(8, 8).
inBounds(9, 0).
inBounds(9, 1).
inBounds(9, 2).
inBounds(9, 3).
inBounds(9, 4).
inBounds(9, 5).
inBounds(9, 6).
inBounds(9, 7).
inBounds(9, 8).
inBounds(9, 9).
inBounds(10, 0).
inBounds(10, 1).
inBounds(10, 2).
inBounds(10, 3).
inBounds(10, 4).
inBounds(10, 5).
inBounds(10, 6).
inBounds(10, 7).
inBounds(10, 8).
inBounds(10, 9).
inBounds(10, 10).

pieceIsCharacter(y).
pieceIsCharacter(g).
pieceIsCharacter(gc).
pieceIsCharacter(r).
pieceIsCharacter(rc).



notAvailable(_GameState, Line, Column):-
    outOfBounds(Line, Column).

notAvailable(GameState, Line, Column):-
    \+availableSpot(GameState, Line, Column).



% game_over(+GameState, -Winner)

game_over(GameState, Winner):-
    nth0(11, GameState, PiecesList),
    nth0(4, PiecesList, YellowsAtStart),
    yellowsNeeded(YellowsAtStart, YellowsNeeded),
    
    nth0(2, PiecesList, YellowsP1),

    YellowsP1 >= YellowsNeeded, 
    Winner = 'Player1'.

    
game_over(GameState, Winner):-
    nth0(11, GameState, PiecesList),
    nth0(4, PiecesList, YellowsAtStart),
    yellowsNeeded(YellowsAtStart, YellowsNeeded),
    
    nth0(3, PiecesList, YellowsP2),

    YellowsP2 >= YellowsNeeded,
    Winner = 'Player2'.
    
% yellowsNeeded(+YellowsAtStart, -YellowsNeeded)

yellowsNeeded(5, 3).
yellowsNeeded(6, 3).
yellowsNeeded(7, 4).
yellowsNeeded(8, 4).
yellowsNeeded(9, 5).
yellowsNeeded(10, 5).


% lowerRedAvailable(++GameState, +Counter)

lowerRedAvailable(GameState, Counter):-
    Counter =< 10,
    nth0(Counter, GameState, LineList),
    (member(r, LineList),
        true;
        NewCounter is Counter + 1,
        lowerRedAvailable(GameState, NewCounter)
    ).
    
% lowerGreenAvailable(++GameState, +Counter)

lowerGreenAvailable(GameState, Counter):-
    Counter =< 10,
    nth0(Counter, GameState, LineList),
    (member(g, LineList),
        true;
        NewCounter is Counter + 1,
        lowerRedAvailable(GameState, NewCounter)
    ).

% makesSemaphore(+GameState, +Line, +Column, +Piece, -PiecesToRemove)

makesSemaphore(GameState, Line, Column, Piece, PiecesToRemove):-
    Piece == g,
    hasYellowsAdjacent(GameState, Line, Column, YellowsAdjacent),
    iterateYellowsAdjacent(GameState, Line, Column, YellowsAdjacent, g, UnpreparedPiecesToRemove),
    exclude(emptyList, UnpreparedPiecesToRemove, DuplicatedPiecesToRemove),
    remove_dups(DuplicatedPiecesToRemove, PiecesToRemoveTemp),
    PiecesToRemove = PiecesToRemoveTemp, !.

    
makesSemaphore(GameState, Line, Column, Piece, PiecesToRemove):-
    Piece == gc,
    hasYellowsAdjacent(GameState, Line, Column, YellowsAdjacent),
    iterateYellowsAdjacent(GameState, Line, Column, YellowsAdjacent, g, UnpreparedPiecesToRemove),
    exclude(emptyList, UnpreparedPiecesToRemove, DuplicatedPiecesToRemove),
    remove_dups(DuplicatedPiecesToRemove, PiecesToRemoveTemp),
    PiecesToRemove = PiecesToRemoveTemp, !.


makesSemaphore(GameState, Line, Column, Piece, PiecesToRemove):-
    Piece == r,
    hasYellowsAdjacent(GameState, Line, Column, YellowsAdjacent),
    iterateYellowsAdjacent(GameState, Line, Column, YellowsAdjacent, r, UnpreparedPiecesToRemove),
    exclude(emptyList, UnpreparedPiecesToRemove, DuplicatedPiecesToRemove),
    remove_dups(DuplicatedPiecesToRemove, PiecesToRemoveTemp),
    PiecesToRemove = PiecesToRemoveTemp, !.

makesSemaphore(GameState, Line, Column, Piece, PiecesToRemove):-
    Piece == rc,
    hasYellowsAdjacent(GameState, Line, Column, YellowsAdjacent),
    iterateYellowsAdjacent(GameState, Line, Column, YellowsAdjacent, r, UnpreparedPiecesToRemove),
    exclude(emptyList, UnpreparedPiecesToRemove, DuplicatedPiecesToRemove),
    remove_dups(DuplicatedPiecesToRemove, PiecesToRemoveTemp),
    PiecesToRemove = PiecesToRemoveTemp, !.


% iterateYellowsAdjacent(+GameState, +Line, +Column, +YellowsAdjacent, +Piece, -PiecesToRemove)


iterateYellowsAdjacent(_GameState, _Line, _Column, [], _Piece, _PiecesToRemove).

iterateYellowsAdjacent(GameState, Line, Column, [Yellow|Rest], g, [OriginalPiece, YellowPiece, OtherPiece | PiecesToRemove]):-
    getCoordinates(Yellow, YellowLine, YellowColumn),
    getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn),
    (\+outOfBounds(OtherLine, OtherColumn), 
        (isRed(GameState, OtherLine, OtherColumn) ->
            OriginalPiece = [Line, Column],
            YellowPiece = [YellowLine, YellowColumn],
            OtherPiece = [OtherLine, OtherColumn];
            OriginalPiece = [],
            YellowPiece = [],
            OtherPiece = [] 
        ),
        iterateYellowsAdjacent(GameState, Line, Column, Rest, g, PiecesToRemove)
    
    );

    OriginalPiece = [],
    YellowPiece = [],
    OtherPiece = [],

    iterateYellowsAdjacent(GameState, Line, Column, Rest, g, PiecesToRemove).


iterateYellowsAdjacent(GameState, Line, Column, [Yellow|Rest], r, [OriginalPiece, YellowPiece, OtherPiece | PiecesToRemove]):-
    getCoordinates(Yellow, YellowLine, YellowColumn),
    getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn),
    (\+outOfBounds(OtherLine, OtherColumn), 
        (isGreen(GameState, OtherLine, OtherColumn) ->
            OriginalPiece = [Line, Column],
            YellowPiece = [YellowLine, YellowColumn],
            OtherPiece = [OtherLine, OtherColumn];
            OriginalPiece = [],
            YellowPiece = [],
            OtherPiece = []
        ),
        iterateYellowsAdjacent(GameState, Line, Column, Rest, r, PiecesToRemove)
    
    );

    OriginalPiece = [],
    YellowPiece = [],
    OtherPiece = [], 

    iterateYellowsAdjacent(GameState, Line, Column, Rest, r, PiecesToRemove).


% getOtherCoordinate(+Line, +Column, +YellowLine, +YellowColumn, -OtherLine, -OtherColumn)

% Right
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line,
    YellowColumn is Column + 1,
    OtherLine is Line,
    OtherColumn is Column + 2.


% Left
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line,
    YellowColumn is Column - 1,
    OtherLine is Line,
    OtherColumn is Column - 2.

% TopRight
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line - 1,
    YellowColumn is Column,
    OtherLine is Line - 2,
    OtherColumn is Column.

% BotRight
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line + 1,
    YellowColumn is Column + 1,
    OtherLine is Line + 2,
    OtherColumn is Column + 2.

% TopLeft
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line - 1,
    YellowColumn is Column - 1,
    OtherLine is Line - 2,
    OtherColumn is Column - 2.

% BotLeft
getOtherCoordinates(Line, Column, YellowLine, YellowColumn, OtherLine, OtherColumn):-
    YellowLine is Line + 1,
    YellowColumn is Column,
    OtherLine is Line + 2,
    OtherColumn is Column.

% getCoordinates(+Coordinates, -Line, -Column)

getCoordinates([Line|[Column|_Rest]], Line, Column).
    


% hasYellowsAdjacent(+GameState, +Line, +Column, -YellowsAdjacent)

hasYellowsAdjacent(GameState, Line, Column, YellowsAdjacent):-
    ColumnRight is Column + 1,
    (\+outOfBounds(Line, ColumnRight),
        (getPiece(GameState, Line, ColumnRight, y),
            RightList = [Line, ColumnRight]
        )
        ;
            RightList = []
    ),

    ColumnLeft is Column - 1,
    (\+outOfBounds(Line, ColumnLeft),
        (getPiece(GameState, Line, ColumnLeft, y),
            LeftList = [Line, ColumnLeft]
        )
        ;
            LeftList = []
    ),

    LineTopRight is Line - 1,
    (\+outOfBounds(LineTopRight, Column),
        (getPiece(GameState, LineTopRight, Column, y),
            TopRightList = [LineTopRight, Column]
        )
        ;
            TopRightList = []
    ),

    LineTopLeft is Line - 1,
    ColumnTopLeft is Column - 1,
    (\+outOfBounds(LineTopLeft, ColumnTopLeft),
        (getPiece(GameState, LineTopLeft, ColumnTopLeft, y),
            TopLeftList = [LineTopLeft, ColumnTopLeft]
        )
        ;
            TopLeftList = []
    ),

    LineBotRight is Line + 1,
    ColumnBotRight is Column + 1,
    (\+outOfBounds(LineBotRight, ColumnBotRight),
        (getPiece(GameState, LineBotRight, ColumnBotRight, y),
            BotRightList = [LineBotRight, ColumnBotRight]
        )
        ;
            BotRightList = []
    ),

    LineBotLeft is Line + 1,
    (\+outOfBounds(LineBotRight, Column),
        (getPiece(GameState, LineBotLeft, Column, y),
            BotLeftList = [LineBotLeft, Column]
        )
        ;
            BotLeftList = []
    ),

    UnpreparedYellowsAdjacent = [RightList, LeftList, TopRightList, TopLeftList, BotRightList, BotLeftList],
    exclude(emptyList, UnpreparedYellowsAdjacent, YellowsAdjacent).


emptyList([]).

replaceUpperGreen(GameState, NewGameState):-
    getPiece(GameState, Line, Column, gc),
    changeGameState(Line, Column, g, GameState, NewGameState, 0).

replaceUpperGreen(GameState, GameState).

    
replaceUpperRed(GameState, NewGameState):-
    getPiece(GameState, Line, Column, rc),
    changeGameState(Line, Column, r, GameState, NewGameState, 0).  

replaceUpperRed(GameState, GameState).



% enoughRedPieces(+GameState)
enoughRedPieces(GameState):-
    nth0(11, GameState, PiecesList),
    nth0(0, PiecesList, Reds),
    Reds > 0.
    
    
enoughGreenPieces(GameState):-
    nth0(11, GameState, PiecesList),
    nth0(1, PiecesList, Greens),
    Greens > 0.

removePiece(GameState, [], GameState).

removePiece(GameState, [Head|[]], NewGameState1):-
    getCoordinates(Head, Line, Column),
    changeGameState(Line, Column, x, GameState, NewGameState1, 0).

removePiece(GameState, [Head|Tail], NewGameState1):-
    getCoordinates(Head, Line, Column),
    changeGameState(Line, Column, x, GameState, NewGameState2, 0),
    removePiece(NewGameState2, Tail, FinalGameState),
    NewGameState1 = FinalGameState.


% addPointPlayer1(+GameState, +Value, -NewGameState)

addPointPlayer1(GameState, 0, GameState).

addPointPlayer1(GameState, Value, NewGameState):-
    getPiece(GameState, 11, 2, Piece),
    PieceReplacement is Piece + Value,
    changeGameState(11, 2, PieceReplacement, GameState, NewGameState, 0).

% addPointPlayer2(+GameState, +Value, -NewGameState)

addPointPlayer2(GameState, 0, GameState).

addPointPlayer2(GameState, Value, NewGameState):-
    getPiece(GameState, 11, 3, Piece),
    PieceReplacement is Piece + Value,
    changeGameState(11, 3, PieceReplacement, GameState, NewGameState, 0).


greenPiecesOnBoard(GameState):-
    getPiece(GameState, _Line, _Column, g).

redPiecesOnBoard(GameState):-
    getPiece(GameState, _Line, _Column, r).
