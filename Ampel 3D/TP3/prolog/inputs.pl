% readLineInput(+Line)

readLineInput(Input):-
	write('Line: '),
	read(Input).


% readLineInputYellow(+Line)

readLineInputYellow(Input):-
	write('Line:  (-1 to stop placement)'),
	read(Input).

% readColumnInput(+Column)

readColumnInput(Input):-
	write('Column: '),
	read(Input).

