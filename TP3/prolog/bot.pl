%valid_moves(+GameState, +Player, -ListOfMoves)

valid_moves(GameState, _Player, ListOfMoves):-
    getPiece(GameState, 11, 5, 0),
    findall([Line, Column], (getPiece(GameState, Line, Column, x), \+forbiddenYellowSpot(Line, Column)), ListOfMoves).

valid_moves(GameState, 1, ListOfMoves):-
    getPiece(GameState, 11, 5, 1),
    findall([Value, [1], [Lineg, Columng], [EndLineg, EndColumng], [Liner, Columnr], [EndLiner, EndColumnr], [LinePiece, ColumnPiece]],
		predicadoGrandeHard(Value, GameState, Lineg, Columng, EndLineg, EndColumng, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece), PossibleMoves
	),
	(PossibleMoves = [] ->
        findall([Value, [1], [Lineg, Columng], [EndLineg, EndColumng], [], [], [LinePiece, ColumnPiece]], predicadoVerdeHard(Value, GameState, Lineg, Columng, EndLineg, EndColumng, LinePiece, ColumnPiece), Lista),
		(Lista = [] ->
			findall([Value, [1], [], [], [Liner, Columnr], [EndLiner, EndColumnr], [LinePiece, ColumnPiece]], predicadoVermelhoHard(Value, GameState, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece), Lista2),
            (Lista2 = [] ->
                findall([Value, [1], [], [], [], [], [LinePiece, ColumnPiece]], predicadoColocaHard(Value, GameState, LinePiece, ColumnPiece), Lista3),
                ListOfMoves = Lista3;
                ListOfMoves = Lista2,
                true    
            );
            ListOfMoves = Lista,
			true
		);
        ListOfMoves = PossibleMoves,
		true
	).

valid_moves(GameState, 2, ListOfMoves):-
    getPiece(GameState, 11, 5, 1),
    findall([[2], [Lineg, Columng], [EndLineg, EndColumng], [Liner, Columnr], [EndLiner, EndColumnr], [LinePiece, ColumnPiece]],
		predicadoGrande(GameState, Lineg, Columng, EndLineg, EndColumng, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece), PossibleMoves
	),
	(PossibleMoves = [] ->
        findall([[2], [Lineg, Columng], [EndLineg, EndColumng], [], [], [LinePiece, ColumnPiece]], predicadoVerde(GameState, Lineg, Columng, EndLineg, EndColumng, LinePiece, ColumnPiece), Lista),
		(Lista = [] ->
			findall([[2], [], [], [Liner, Columnr], [EndLiner, EndColumnr], [LinePiece, ColumnPiece]], predicadoVermelho(GameState, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece), Lista2),
            (Lista2 = [] ->
                findall([[2], [], [], [], [], [LinePiece, ColumnPiece]], predicadoColoca(GameState, LinePiece, ColumnPiece), Lista3),
                ListOfMoves = Lista3;
                ListOfMoves = Lista2,
                true    
            );
            ListOfMoves = Lista,
			true
		);
        ListOfMoves = PossibleMoves,
		true
	).


predicadoGrandeHard(Value, GameState, Liner, Columnr, EndLiner, EndColumnr, Lineg, Columng, EndLineg, EndColumng, LinePiece, ColumnPiece):-
    value(GameState, 1, Value1),
    getPiece(GameState, Liner, Columnr, r), 
	getPiece(GameState, EndLiner, EndColumnr, x),
    makesSemaphore(GameState, EndLiner, EndColumnr, r, Semaphores1),
    (Semaphores1 \= [] ->
        addPointPlayer1(GameState, 1, TempGameState);
        addPointPlayer1(GameState, 0, TempGameState)
    ),
	possibleMovement(TempGameState, Liner, Columnr, EndLiner, EndColumnr),
	movePiece(TempGameState, Liner, Columnr, EndLiner, EndColumnr, NewGameState),
	getPiece(NewGameState, Lineg, Columng, g), 
	getPiece(NewGameState, EndLineg, EndColumng, x),
    makesSemaphore(NewGameState, EndLineg, EndColumng, g, Semaphores2),
    (Semaphores2 \= [] ->
        addPointPlayer1(NewGameState, 1, TempNewGameState);
        addPointPlayer1(NewGameState, 0, TempNewGameState)
    ),
	possibleMovement(TempNewGameState, Lineg, Columng, EndLineg, EndColumng),
	movePiece(TempNewGameState, Lineg, Columng, EndLineg, EndColumng, FinalGameState),
    getPiece(FinalGameState, LinePiece, ColumnPiece, x),
	makesSemaphore(FinalGameState, LinePiece, ColumnPiece, rc, Result), 
    Result = [],
    value(FinalGameState, 1, Value2),
    nonvar(Value2),
    Value is Value2 - Value1.

    
predicadoVermelhoHard(Value, GameState, Lineg, Columng, EndLineg, EndColumng, LinePiece, ColumnPiece):-
    value(GameState, 1, Value1),
    getPiece(GameState, Lineg, Columng, g), 
	getPiece(GameState, EndLineg, EndColumng, x),
    makesSemaphore(GameState, EndLineg, EndColumng, g, Semaphores),
    (Semaphores \= [] ->
        addPointPlayer1(GameState, 1, TempGameState);
        addPointPlayer1(GameState, 0, TempGameState)
    ),
	possibleMovement(TempGameState, Lineg, Columng, EndLineg, EndColumng),
	movePiece(TempGameState, Lineg, Columng, EndLineg, EndColumng, FinalGameState),
	getPiece(FinalGameState, LinePiece, ColumnPiece, x),
    makesSemaphore(FinalGameState, LinePiece, ColumnPiece, rc, Result), 
    Result = [],
    value(FinalGameState, 1, Value2),
    nonvar(Value2),
    Value is Value2 - Value1.

predicadoVerdeHard(Value, GameState, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece):-
    value(GameState, 1, Value1),
	getPiece(GameState, Liner, Columnr, r), 
	getPiece(GameState, EndLiner, EndColumnr, x),
    makesSemaphore(GameState, EndLiner, EndColumnr, r, Semaphores),
    (Semaphores \= [] ->
        addPointPlayer1(GameState, 1, TempGameState);
        addPointPlayer1(GameState, 0, TempGameState)
    ),
	possibleMovement(TempGameState, Liner, Columnr, EndLiner, EndColumnr),
	movePiece(TempGameState, Liner, Columnr, EndLiner, EndColumnr, FinalGameState),
	getPiece(FinalGameState, LinePiece, ColumnPiece, x),
    makesSemaphore(FinalGameState, LinePiece, ColumnPiece, rc, Result), 
    Result = [],
    value(FinalGameState, 1, Value2),
    nonvar(Value2),
    Value is Value2 - Value1.

predicadoColocaHard(Value, GameState, LinePiece, ColumnPiece):-
    getPiece(GameState, LinePiece, ColumnPiece, x),
    makesSemaphore(GameState, LinePiece, ColumnPiece, rc, Result), 
    Result = [],
    Value is 0.

move(GameState, [_Value|[[1], Lowerr, LowerrFinal, Lowerg, LowergFinal, NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerr, LineLowerr, ColumnLowerr),
    getCoordinates(LowerrFinal, LineLowerrFinal, ColumnLowerrFinal),
    getCoordinates(Lowerg, LineLowerg, ColumnLowerg),
    getCoordinates(LowergFinal, LineLowergFinal, ColumnLowergFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerr, ColumnLowerr, x, GameState, TempGameState1, 0),
    changeGameState(LineLowerrFinal, ColumnLowerrFinal, r, TempGameState1, TempGameState1Temp, 0),
    makesSemaphore(TempGameState1Temp, LineLowerrFinal, ColumnLowerrFinal, r, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState1Temp, Remove1, TempGameState1TempTemp),
    addPointPlayer1(TempGameState1TempTemp, Value1, TempGameState2),
    changeGameState(LineLowerg, ColumnLowerg, x, TempGameState2, TempGameState3, 0),
    changeGameState(LineLowergFinal, ColumnLowergFinal, g, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowergFinal, ColumnLowergFinal, g, Remove2),
    length(Remove2, Size2),
    Value2 is Size2//2,
    removePiece(TempGameState3Temp, Remove2, TempGameState3TempTemp),
    addPointPlayer1(TempGameState3TempTemp, Value2, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(0, Data, OldRedPieces),
    (OldRedPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, rc, TempGameState4, TempGameState5, 0),
        NewRedPieces is OldRedPieces - 1,
        replaceUpperRed(TempGameState5, TempGameState6),
        changeGameState(11, 0, NewRedPieces, TempGameState6, NewGameState, 0);
        replaceUpperRed(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.
    

move(GameState, [_Value|[[1], [], [], Lowerg, LowergFinal, NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerg, LineLowerg, ColumnLowerg),
    getCoordinates(LowergFinal, LineLowergFinal, ColumnLowergFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerg, ColumnLowerg, x, GameState, TempGameState3, 0),
    changeGameState(LineLowergFinal, ColumnLowergFinal, g, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowergFinal, ColumnLowergFinal, g, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState3Temp, Remove1, TempGameState3TempTemp),
    addPointPlayer1(TempGameState3TempTemp, Value1, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(0, Data, OldRedPieces),
    (OldRedPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, rc, TempGameState4, TempGameState5, 0),
        NewRedPieces is OldRedPieces - 1,
        replaceUpperRed(TempGameState5, TempGameState6),
        changeGameState(11, 0, NewRedPieces, TempGameState6, NewGameState, 0);
        replaceUpperRed(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.

move(GameState, [_Value|[[1], Lowerr, LowerrFinal, [], [], NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerr, LineLowerr, ColumnLowerr),
    getCoordinates(LowerrFinal, LineLowerrFinal, ColumnLowerrFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerr, ColumnLowerr, x, GameState, TempGameState3, 0),
    changeGameState(LineLowerrFinal, ColumnLowerrFinal, r, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowerrFinal, ColumnLowerrFinal, r, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState3Temp, Remove1, TempGameState3TempTemp),
    addPointPlayer1(TempGameState3TempTemp, Value1, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(0, Data, OldRedPieces),
    (OldRedPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, rc, TempGameState4, TempGameState5, 0),
        NewRedPieces is OldRedPieces - 1,
        replaceUpperRed(TempGameState5, TempGameState6),
        changeGameState(11, 0, NewRedPieces, TempGameState6, NewGameState, 0);
        replaceUpperRed(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.

move(GameState, [_Value|[[1], [], [], [], [], NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    nth0(11, GameState, Data),
    nth0(0, Data, OldRedPieces),
    (OldRedPieces > 0 ->
        replaceUpperRed(GameState, TempGameState4),
        changeGameState(LineNewPiece, ColumnNewPiece, rc, TempGameState4, TempGameState5, 0),
        NewRedPieces is OldRedPieces - 1,
        changeGameState(11, 0, NewRedPieces, TempGameState5, NewGameState, 0);
        replaceUpperRed(GameState, TempGameState5),
        NewGameState is TempGameState5
    ), !.

% move(+GameState, +Move, -NewGameState)

move(GameState, Move, NewGameState):-
    getPiece(GameState, 11, 5, 0),
    nth0(0, Move, Line),
    nth0(1, Move, Column),
    changeGameState(Line, Column, y, GameState, NewGameState1, 0),
    nth0(11, GameState, Data),
    nth0(4, Data, YellowsPlaced),
    NewYellowsPlaced is YellowsPlaced + 1,
    changeGameState(11, 4, NewYellowsPlaced, NewGameState1, NewGameState, 0), !.

move(GameState, [[2]|[Lowerg, LowergFinal, Lowerr, LowerrFinal, NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerg, LineLowerg, ColumnLowerg),
    getCoordinates(LowergFinal, LineLowergFinal, ColumnLowergFinal),
    getCoordinates(Lowerr, LineLowerr, ColumnLowerr),
    getCoordinates(LowerrFinal, LineLowerrFinal, ColumnLowerrFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerg, ColumnLowerg, x, GameState, TempGameState1, 0),
    changeGameState(LineLowergFinal, ColumnLowergFinal, g, TempGameState1, TempGameState1Temp, 0),
    makesSemaphore(TempGameState1Temp, LineLowergFinal, ColumnLowergFinal, g, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState1Temp, Remove1, TempGameState1TempTemp),
    addPointPlayer2(TempGameState1TempTemp, Value1, TempGameState2),
    changeGameState(LineLowerr, ColumnLowerr, x, TempGameState2, TempGameState3, 0),
    changeGameState(LineLowerrFinal, ColumnLowerrFinal, r, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowerrFinal, ColumnLowerrFinal, r, Remove2),
    length(Remove2, Size2),
    Value2 is Size2//2,
    removePiece(TempGameState3Temp, Remove2, TempGameState3TempTemp),
    addPointPlayer2(TempGameState3TempTemp, Value2, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(1, Data, OldGreenPieces),
    (OldGreenPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, gc, TempGameState4, TempGameState5, 0),
        NewGreenPieces is OldGreenPieces - 1,
        replaceUpperGreen(TempGameState5, TempGameState6),
        changeGameState(11, 1, NewGreenPieces, TempGameState6, NewGameState, 0);
        replaceUpperGreen(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.
    

move(GameState, [[2]|[[], [], Lowerr, LowerrFinal, NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerr, LineLowerr, ColumnLowerr),
    getCoordinates(LowerrFinal, LineLowerrFinal, ColumnLowerrFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerr, ColumnLowerr, x, GameState, TempGameState3, 0),
    changeGameState(LineLowerrFinal, ColumnLowerrFinal, r, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowerrFinal, ColumnLowerrFinal, r, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState3Temp, Remove1, TempGameState3TempTemp),
    addPointPlayer2(TempGameState3TempTemp, Value1, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(1, Data, OldGreenPieces),
    (OldGreenPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, gc, TempGameState4, TempGameState5, 0),
        NewGreenPieces is OldGreenPieces - 1,
        replaceUpperGreen(TempGameState5, TempGameState6),
        changeGameState(11, 1, NewGreenPieces, TempGameState6, NewGameState, 0);
        replaceUpperGreen(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.

move(GameState, [[2]|[Lowerg, LowergFinal, [], [], NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(Lowerg, LineLowerg, ColumnLowerg),
    getCoordinates(LowergFinal, LineLowergFinal, ColumnLowergFinal),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    changeGameState(LineLowerg, ColumnLowerg, x, GameState, TempGameState3, 0),
    changeGameState(LineLowergFinal, ColumnLowergFinal, g, TempGameState3, TempGameState3Temp, 0),
    makesSemaphore(TempGameState3Temp, LineLowergFinal, ColumnLowergFinal, g, Remove1),
    length(Remove1, Size1),
    Value1 is Size1//2,
    removePiece(TempGameState3Temp, Remove1, TempGameState3TempTemp),
    addPointPlayer2(TempGameState3TempTemp, Value1, TempGameState4),
    nth0(11, TempGameState4, Data),
    nth0(1, Data, OldGreenPieces),
    (OldGreenPieces > 0 ->
        changeGameState(LineNewPiece, ColumnNewPiece, gc, TempGameState4, TempGameState5, 0),
        NewGreenPieces is OldGreenPieces - 1,
        replaceUpperGreen(TempGameState5, TempGameState6),
        changeGameState(11, 1, NewGreenPieces, TempGameState6, NewGameState, 0);
        replaceUpperGreen(TempGameState4, TempGameState5),
        NewGameState is TempGameState5
    ), !.

move(GameState, [[2]|[[], [], [], [], NewPiece]], NewGameState):-
    getPiece(GameState, 11, 5, 1),
    getCoordinates(NewPiece, LineNewPiece, ColumnNewPiece),
    nth0(11, GameState, Data),
    nth0(1, Data, OldGreenPieces),
    (OldGreenPieces > 0 ->
        replaceUpperGreen(GameState, TempGameState4),
        changeGameState(LineNewPiece, ColumnNewPiece, gc, TempGameState4, TempGameState5, 0),
        NewGreenPieces is OldGreenPieces - 1,
        changeGameState(11, 1, NewGreenPieces, TempGameState5, NewGameState, 0);
        replaceUpperGreen(GameState, TempGameState5),
        NewGameState is TempGameState5
    ), !.



predicadoGrande(GameState, Lineg, Columng, EndLineg, EndColumng, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece):-
    getPiece(GameState, Lineg, Columng, g),
	getPiece(GameState, EndLineg, EndColumng, x),
    makesSemaphore(GameState, EndLineg, EndColumng, g, Semaphores1),
    (Semaphores1 \= [] ->
        removePiece(GameState, Semaphores1, TempGameState);
        TempGameState = GameState
    ),
	possibleMovement(TempGameState, Lineg, Columng, EndLineg, EndColumng),
	movePiece(TempGameState, Lineg, Columng, EndLineg, EndColumng, NewGameState),
	getPiece(NewGameState, Liner, Columnr, r),
	getPiece(NewGameState, EndLiner, EndColumnr, x),
    makesSemaphore(NewGameState, EndLiner, EndColumnr, r, Semaphores2),
    (Semaphores2 \= [] ->
        removePiece(NewGameState, Semaphores2, TempNewGameState);
        TempNewGameState = NewGameState
    ),
	possibleMovement(TempNewGameState, Liner, Columnr, EndLiner, EndColumnr),
	movePiece(TempNewGameState, Liner, Columnr, EndLiner, EndColumnr, FinalGameState),
    getPiece(FinalGameState, LinePiece, ColumnPiece, x),
	makesSemaphore(FinalGameState, LinePiece, ColumnPiece, gc, Result),
    Result = [].
    
predicadoVermelho(GameState, Liner, Columnr, EndLiner, EndColumnr, LinePiece, ColumnPiece):-
    getPiece(GameState, Liner, Columnr, r),
	getPiece(GameState, EndLiner, EndColumnr, x),
    makesSemaphore(NewGameState, EndLiner, EndColumnr, r, Semaphores2),
    (Semaphores2 \= [] ->
        removePiece(NewGameState, Semaphores2, TempNewGameState);
        TempNewGameState = NewGameState
    ),
	possibleMovement(TempNewGameState, Liner, Columnr, EndLiner, EndColumnr),
	movePiece(TempNewGameState, Liner, Columnr, EndLiner, EndColumnr, FinalGameState),
	getPiece(FinalGameState, LinePiece, ColumnPiece, x),
    makesSemaphore(FinalGameState, LinePiece, ColumnPiece, gc, Result),
    Result = [].

predicadoVerde(GameState, Lineg, Columng, EndLineg, EndColumng, LinePiece, ColumnPiece):-
	getPiece(GameState, Lineg, Columng, g),
	getPiece(GameState, EndLineg, EndColumng, x),
    makesSemaphore(GameState, EndLineg, EndColumng, g, Semaphores1),
    (Semaphores1 \= [] ->
        removePiece(GameState, Semaphores1, TempGameState);
        TempGameState = GameState
    ),
	possibleMovement(TempGameState, Lineg, Columng, EndLineg, EndColumng),
	movePiece(TempGameState, Lineg, Columng, EndLineg, EndColumng, FinalGameState),
	getPiece(FinalGameState, LinePiece, ColumnPiece, x),
    makesSemaphore(FinalGameState, LinePiece, ColumnPiece, gc, Result),
    Result = [].

predicadoColoca(GameState, LinePiece, ColumnPiece):-
    getPiece(GameState, LinePiece, ColumnPiece, x),
    makesSemaphore(GameState, LinePiece, ColumnPiece, gc, Result),
    Result = [].

% choose_move(+GameState, +Player, +Level, -Move)

choose_move(GameState, Player, easy, Move):-
    getPiece(GameState, 11, 5, 0),
    valid_moves(GameState, Player, ListOfMoves),
    length(ListOfMoves, Length), 
    random(0, Length, Rand),
    nth0(Rand, ListOfMoves, Move).

choose_move(GameState, 2, easy, Move):-
    getPiece(GameState, 11, 5, 1),
    valid_moves(GameState, 2, ListOfMoves),
    length(ListOfMoves, Length), 
    random(0, Length, Rand),
    nth0(Rand, ListOfMoves, Move).

choose_move(GameState, 1, hard, Move):-
    getPiece(GameState, 11, 5, 1),
    valid_moves(GameState, 1, ListOfMoves),
    sort(ListOfMoves, ListOfMovesSorted),
    reverse(ListOfMovesSorted, FinalList),
    nth0(50, FinalList, Move).



% botMove(+GameState, +NextPlayer, +Player, +NewGameState)

botMove(GameState, NextPlayer, 2, X):-
    getPiece(GameState, 11, 5, 0),
    choose_move(GameState, 2, easy, Move),
    move(GameState, Move, NewGameState),
    nth0(11, NewGameState, Data),
    nth0(4, Data, YellowsPlaced),
    createGameOption2(NewGameState, 1, YellowsPlaced, NextPlayer, X).
    

botMove(GameState, _NextPlayer, 2, _NewGameState):-
    getPiece(GameState, 11, 5, 1),
    choose_move(GameState, 2, easy, Move),
    move(GameState, Move, NewGameState),
    (game_over(NewGameState, Winner),
        display_game_over(Winner);
        gameLoopOption2(NewGameState, 1)
    ).

% botMoveOption3(+GameState, +NextPlayer, +Player, +NewGameState)

botMoveOption3_1(GameState, NextPlayer, 1, X):-
    getPiece(GameState, 11, 5, 0),
    choose_move(GameState, 2, easy, Move),
    move(GameState, Move, NewGameState),
    display_game(NewGameState),
    nth0(11, NewGameState, Data),
    nth0(4, Data, YellowsPlaced),
    (YellowsPlaced == 10 ->
        true,
        changeGameState(11, 5, 1, GameState, X, 0);
        (repeat,
            write('Write \'-1\' for Player 2 to play: '),
            read(Variavel),
           Variavel == -1
        ),
        botMoveOption3_1(NewGameState, NextPlayer, 2, X)
    ),!.

botMoveOption3_1(GameState, NextPlayer, 2, X):-
    getPiece(GameState, 11, 5, 0),
    choose_move(GameState, 2, easy, Move),
    move(GameState, Move, NewGameState),
    display_game(NewGameState),
    nth0(11, NewGameState, Data),
    nth0(4, Data, YellowsPlaced),
    (YellowsPlaced == 10 ->
        true,
        changeGameState(11, 5, 1, GameState, X, 0);
        (repeat,
            write('Write \'-1\' for Player 1 to play: '),
            read(Variavel),
            Variavel == -1
        ),
        botMoveOption3_1(NewGameState, NextPlayer, 1, X)
    ),!.

botMoveOption3_2(GameState, _NextPlayer, 2, X):-
    getPiece(GameState, 11, 5, 1),
    choose_move(GameState, 2, easy, Move),
    move(GameState, Move, NewGameState),
    display_game(NewGameState),
    (game_over(NewGameState, Winner),
        display_game_over(Winner);
        (repeat,
            write('Write \'-1\' for Player 1 to play: '),
            read(Variavel),
            Variavel == -1
        ),
        botMoveOption3_2(NewGameState, _NextPlayer, 1, X)
    ),!.

botMoveOption3_2(GameState, _NextPlayer, 1, X):-
    getPiece(GameState, 11, 5, 1),
    choose_move(GameState, 1, hard, Move),
    move(GameState, Move, NewGameState),
    display_game(NewGameState),
    (game_over(NewGameState, Winner),
        display_game_over(Winner);
        (repeat,
            write('Write \'-1\' for Player 2 to play: '),
            read(Variavel),
           Variavel == -1
        ),
        botMoveOption3_2(NewGameState, _NextPlayer, 2, X)
    ),!.

% value(+GameState, +Player, -Value)

value(GameState, 1, Value):-
    nth0(11, GameState, Data),
    nth0(2, Data, Value).
