% menu(-Option)

menu(Option):-
    printMenu,
    menuOption(Option).


% printMenu

printMenu:-
    nl,
    write('|                            1. Player vs Player                                   |'),nl,
    write('|                                                                                  |'),nl,
    write('|                            2. Player vs CPU (Easy)                               |'),nl,
    write('|                                                                                  |'),nl,                                                                               
	write('|                            3. CPU (Hard) vs CPU (Easy)                           |'),nl,
    write('|                                                                                  |'),nl,
    write('|                            0. Exit                                               |'),nl,
    write('|                                                                                  |'),nl,nl.

% menuOption(-Option)

menuOption(Option):-
    write('Option: '),
    read(Option).