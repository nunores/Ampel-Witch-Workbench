% display_game(+GameState, +Player)

display_game(GameState):-
	printGame(GameState),
	printPieces(GameState),
	!.

display_game_over(Winner):-
	write('|                                         |'),nl,
	write('|                                         |'),nl,
	write('|        Congratulations '), write(Winner), write('          |'),nl,
	write('|                                         |'),nl,
	write('|                                         |'),nl.


% printPieces(+GameState)

printPieces(GameState):-
	nth0(11, GameState, PiecesList),
	nth0(0, PiecesList, RedsLeft),
	nth0(1, PiecesList, GreensLeft),
	nth0(2, PiecesList, YellowsPlayer1),
	nth0(3, PiecesList, YellowsPlayer2),
	write('Red: '), write(RedsLeft), write('   '),
	write('Green: '), write(GreensLeft),nl,
	write('Player 1\'s points:' ), write(YellowsPlayer1), write('   '),
	write('Player 2\'s points:'), write(YellowsPlayer2),nl, nl.



% printGame(+GameState)

printGame(GameState):-
	printBoard(GameState, 1).

% printBoard(+GameState, +Row)

printBoard([H|T], 1):-
    write('0.              '),
	printLine(H, 1), 
	printBoard(T, 2).

printBoard([H|T], 2):-
    write('1.             '),
	printLine(H, 2), 
	printBoard(T, 3).

printBoard([H|T], 3):-
    write('2.            '),
	printLine(H, 3), 
	printBoard(T, 4).

printBoard([H|T], 4):-
    write('3.           '),
	printLine(H, 4), 
	printBoard(T, 5).

printBoard([H|T], 5):-
    write('4.          '),
	printLine(H, 5), 
	printBoard(T, 6).

printBoard([H|T], 6):-
    write('5.         '),
	printLine(H, 6), 
	printBoard(T, 7).

printBoard([H|T], 7):-
    write('6.        '),
	printLine(H, 7), 
	printBoard(T, 8).

printBoard([H|T], 8):-
    write('7.       '),
	printLine(H, 8), 
	printBoard(T, 9).

printBoard([H|T], 9):-
    write('8.      '),
	printLine(H, 9), 
	printBoard(T, 10).

printBoard([H|T], 10):-
    write('9.     '),
	printLine(H, 10), 
	printBoard(T, 11).

printBoard([H|T], 11):-
	write('10.   '),
	printLine(H, 11), 
	printBoard(T, 12).

printBoard(_, 12):-!.


% printBoard(+Line)

printLine([x|_], 1):-
	write('X\n').

printLine([x|T], N):-
    N1 is N-1,
	write('X-'),
    printLine(T, N1).

printLine([y|_], 1):-
    write('y\n').

printLine([y|T], N):-
	N1 is N-1,
	write('y-'),
    printLine(T, N1).

printLine([r|_], 1):-
    write('r\n').

printLine([r|T], N):-
	N1 is N-1,
	write('r-'),
    printLine(T, N1).

printLine([g|_], 1):-
    write('g\n').

printLine([g|T], N):-
	N1 is N-1,
	write('g-'),
    printLine(T, N1).

printLine([gc|_], 1):-
    write('G\n').

printLine([gc|T], N):-
	N1 is N-1,
	write('G-'),
    printLine(T, N1).

printLine([rc|_], 1):-
    write('R\n').

printLine([rc|T], N):-
	N1 is N-1,
	write('R-'),
    printLine(T, N1).