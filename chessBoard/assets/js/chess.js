//alert("Here you go!!!!");

let board = [
	['r', 'k', 'b', 'q', 'a', 'b', 'k', 'r'],
	['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
	[" ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " "],
	["P", "P", "P", "P", "P", "P", "P", "P"],
	["R", "K", "B", "Q", "A", "B", "K", "R"]
];

var blacks = ['00r', '01k', '02b', '03q', '04a', '05b', '06k', '07r',
			  '10p', '11p', '12p', '13p', '14p', '15p', '16p', '17p'];

var whites = ['70R', '71K', '72B', '73Q', '74A', '75B', '76K', '77R',
			  '60P', '61P', '62P', '63P', '64P', '65P', '66P', '67P'];

var turn = true;
var rows = document.querySelectorAll('.row');
var allSquares = document.querySelectorAll('.squares');
var listener = {};
var listener2 = {};
var wAMoved = false;
var bAMoved = false;
var lBRook = false, rBRook = false;
var lWRook = false, rWRook = false;
var checkMate = false;
var wKing = {i: 7, j: 4};
var bKing = {i: 0, j: 4};

function setup() {
	var rowNo , colNo, clicked = 0, piece, pre, moves;

	for(var i = 48; i<64; i++)
	{
		listener[i] = function () {
			if(turn)
			{
				rowNo = $(this).parent().index(); colNo = $(this).index();
				if(clicked>=0)
				{
					if(rowNo*8+colNo !== clicked && $(allSquares[clicked]).hasClass('selected'))
					{
						allSquares[clicked].classList.toggle('selected');
					    togglePath_listener(rowNo+''+colNo+piece, moves);
					}
				}

				piece = board[rowNo][colNo];
				if(clicked !== rowNo*8+colNo)
				{
					var fakeBoard = [];
					for(var i = 0; i<8; i++)
						fakeBoard[i] = board[i].slice();
					moves = getMoves(fakeBoard, rowNo, colNo, piece, turn);
				}
				
				clicked = rowNo*8+colNo;	
				allSquares[clicked].classList.toggle('selected');
				togglePath_listener(rowNo+''+colNo+piece, moves);
			}
		};
		allSquares[i].addEventListener('click', listener[i], false);
	}
}

setup();

function togglePath_listener(block, moves) {
	for(var i = 0; i<moves.length; i++)
	{

		var index = Number(moves[i][0])*8+Number(moves[i][1]), p = moves[i][2];
		if(p === ' ')
		{
			if(allSquares[index].classList.toggle('showPath'))
			{
				listener2[index] = function () {
					 var x = $(this).parent().index();
					 var y = $(this).index();
					makeMoveForWhite({i: Number(block[0]), j: Number(block[1]), p: block[2]}, {i: x, j: y, p: board[x][y]}, moves);
				};
				allSquares[index].addEventListener('click', listener2[index], false);
			}
			else {
				allSquares[index].removeEventListener('click', listener2[index], false);
			}
		}
		else 
			if(allSquares[index].classList.toggle('captureable'))
			{
				listener2[index] = function () {
					 var x = $(this).parent().index();
					 var y = $(this).index();
					makeMoveForWhite({i: Number(block[0]), j: Number(block[1]), p: block[2]}, {i: x, j: y, p: board[x][y]}, moves);
				};
				allSquares[index].addEventListener('click', listener2[index], false);
			}
			else{
				allSquares[index].removeEventListener('click', listener2[index], false);
			}
	}
}

function getMoves(fakeBoard, i, j, p, turn) {
	switch(p)
	{
		case 'P': return movesForP(fakeBoard, i, j);
		case 'p': return movesForp(fakeBoard, i, j);
		case 'r': 
		case 'R': return movesForRook(fakeBoard, i, j, turn);
		case 'k': 
		case 'K': return movesForKnight(fakeBoard, i, j, turn);
		case 'b': 
		case 'B': return movesForBishop(fakeBoard, i, j, turn);
		case 'q': 
		case 'Q': return movesForQueen(fakeBoard, i, j, turn);
		case 'a': 
		case 'A': return movesForKing(fakeBoard, i, j, turn);
	}
}

function movesForP(fakeBoard, i, j) {
	var moves = [];
	if(fakeBoard[i-1][j])
	if(fakeBoard[i-1][j] === ' ')
	{
		moves.push((i-1)+''+j+" ");
		if(i == 6 && fakeBoard[i-2][j] === ' ')
			moves.push((i-2)+''+j+' ');
	}
	if(fakeBoard[i-1][j+1])
	{
		var p = fakeBoard[i-1][j+1];
		if(p.charCodeAt() > 96 && p.charCodeAt() < 123)
			moves.push((i-1)+''+(j+1)+p);
	}
	if(fakeBoard[i-1][j-1])
	{
		var p = fakeBoard[i-1][j-1];
		if(p.charCodeAt() > 96 && p.charCodeAt() < 123)
			moves.push((i-1)+''+(j-1)+p);
	}
	return moves;
}

function movesForp(fakeBoard, i, j) {
	var moves = [];
	if(fakeBoard[i+1][j])
	if(fakeBoard[i+1][j] === ' ')
	{
		moves.push((i+1)+''+j+" ");
		if(i == 1 && fakeBoard[i+2][j] === ' ')
			moves.push((i+2)+''+j+' ');
	}
	if(fakeBoard[i+1][j+1])
	{
		var p = fakeBoard[i+1][j+1];
		if(p.charCodeAt() > 64 && p.charCodeAt() < 91)
			moves.push((i+1)+''+(j+1)+p);
	}
	if(fakeBoard[i+1][j-1])
	{
		var p = fakeBoard[i+1][j-1];
		if(p.charCodeAt() > 64 && p.charCodeAt() < 91)
			moves.push((i+1)+''+(j-1)+p);
	}
	return moves;
}

function movesForRook(fakeBoard, i, j, turn) {
	var moves = [];
	var ub, lb;
	var check;
	if(turn)
	{
		ub = 123; lb = 96; check = wKing;
	}
	else {
		ub = 91; lb = 64; check = bKing;
	}
	for(var x = i-1; x >= 0; x--)
	{
		var p = fakeBoard[x][j];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+j+p);
		if(p !== ' ')
			break;
	}
	for(var x = j-1; x >= 0; x--)
	{
		var p = fakeBoard[i][x];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(i+''+x+p);
		if(p !== ' ')
			break;
	}
	for(var x = j+1; x < 8; x++)
	{
		var p = fakeBoard[i][x];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(i+''+x+p);
		if(p !== ' ')
			break;
	}
	for(var x = i+1; x < 8; x++)
	{
		var p = fakeBoard[x][j];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+j+p);
		if(p !== ' ')
			break;
	}
	return moves;
}

function movesForKnight(fakeBoard, i, j, turn) {
	var moves = [];
	var ub, lb, check;
	if(turn)
	{
		ub = 123; lb = 96; check = wKing;
	}
	else {
		ub = 91; lb = 64; check = bKing;
	}

	if(i-2 >= 0)
	{
		if(j-1 >= 0)
		{
		var p = fakeBoard[i-2][j-1];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
			moves.push((i-2)+''+(j-1)+p);	
		}
		if(j+1 < 8)
		{
		var p = fakeBoard[i-2][j+1];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
			moves.push((i-2)+''+(j+1)+p);
		}
	}
	if(i+2 < 8)
	{
		if(j-1 >= 0)
		{
		var p = fakeBoard[i+2][j-1];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
			moves.push((i+2)+''+(j-1)+p);
		}
		if(j+1 < 8)
		{
		var p = fakeBoard[i+2][j+1];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push((i+2)+''+(j+1)+p);
		}
	}
	if(j-2 >= 0)
	{
		if(i-1 >= 0)
		{
		var p = fakeBoard[i-1][j-2];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push((i-1)+''+(j-2)+p);
		}
		if(i+1 < 8)
		{
		var p = fakeBoard[i+1][j-2];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push((i+1)+''+(j-2)+p);
		}
	}
	if(j+2 < 8)
	{
		if(i-1 >= 0)
		{
		var p = fakeBoard[i-1][j+2];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push((i-1)+''+(j+2)+p);
		}
		if(i+1 < 8)
		{
		var p = fakeBoard[i+1][j+2];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push((i+1)+''+(j+2)+p);
		}
	}
	
	return moves;
}

function movesForBishop(fakeBoard, i, j, turn) {
	var moves = [];
	var ub, lb, check;
	if(turn)
	{
		ub = 123; lb = 96; check = wKing;
	}
	else {
		ub = 91; lb = 64; check = bKing;
	}

	for(var x = i-1, y = j+1; x>=0 && y<8; x--, y++)
	{
		var p = fakeBoard[x][y];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+y+p);
		if(p !== ' ')
			break;
	}
	for(var x = i-1, y = j-1; x>=0 && y>=0; x--, y--)
	{
		var p = fakeBoard[x][y];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+y+p);
		if(p !== ' ')
			break;
	}
	for(var x = i+1, y = j+1; x<8 && y<8; x++, y++)
	{
		var p = fakeBoard[x][y];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+y+p);
		if(p !== ' ')
			break;
	}
	for(var x = i+1, y = j-1; x<8 && y>=0; x++, y--)
	{
		var p = fakeBoard[x][y];
		if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub))
			moves.push(x+''+y+p);
		if(p !== ' ') 
			break;
	}

	return moves;
}

function movesForQueen(fakeBoard, i, j, turn) {
	var moves = movesForRook(fakeBoard, i, j, turn);
	var temp = movesForBishop(fakeBoard, i, j, turn);
	temp.forEach(function (move) {
		moves.push(move);
	});
	return moves;
}

function movesForKing(fakeBoard, i, j, turn) {
	var moves = [];
	var ub, lb; // cm = check mate
	var check;
	if(turn)
	{
		ub = 123; lb = 96; check = wKing;
	}
	else {
		ub = 91; lb = 64; check = bKing;
	}

	for(var y = j-1; y<j+2; y++)
	{
		if(i-1 >= 0 && y < 8 && y >= 0)
		{ 
			var p = fakeBoard[i-1][y];
	        if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
	            //if(isInCheck(fakeBoard, {i: i, j: j}, {i: i-1, j: y}, {i: i-1, j: y}, turn))
	        	moves.push((i-1)+''+y+p);
	        	//else cm = true;
		}
		if(y < 8 && y >= 0)
		{ 
			var p = fakeBoard[i][y];
	        if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
	        	//if(isInCheck(fakeBoard, {i: i, j: j}, {i: i, j: y}, {i: i, j: y}, turn))
	        	moves.push((i)+''+y+p);
	        	//else cm = true;
		}
		if(i+1 < 8 && y < 8 && y >= 0)
		{ 
			var p = fakeBoard[i+1][y];
	        if(p === ' ' || (p.charCodeAt() > lb && p.charCodeAt() < ub)) 
	        	//if(isInCheck(fakeBoard, {i: i, j: j}, {i: i+1, j: y}, {i: i+1, j: y}, turn))
	        	moves.push((i+1)+''+y+p);
	        	//else cm = true;
		}
	}
	  
    var castle = isCastle(fakeBoard, i, j, turn);
	if(castle === 'r')
	{
		//if(isInCheck(fakeBoard, {i: i, j: j+2}, turn))
		moves.push(i+''+(j+2)+' '+' ');// castle right
		//else cm = true;
	} else
	if(castle === 'l')
	{
		//if(isInCheck(fakeBoard, {i: i, j: j-2}, turn))
		moves.push(i+''+(j-2)+' '+' ');// castle left
		//else cm = true;
	}else 
	if(castle === 'rl')
	{
		//if(isInCheck(fakeBoard, {i: i, j: j+2}, turn) && isInCheck(fakeBoard, {i: i, j: j-2}), turn)
		{
			moves.push(i+''+(j+2)+' '+' ');// castle right
			moves.push(i+''+(j-2)+' '+' ');// castle left
		}
		//else cm = true;
	}
	
	return moves;
}

function isCastle(fakeBoard, i, j, turn) {
	var row = 0, rook = 'r', king = bAMoved, left = lBRook, right = rBRook, whichKing = bKing;
	if(turn)
	{
		row = 7; rook = 'R'; king = wAMoved; left = lWRook; right = rWRook;
		whichKing = wKing;
	}
	if(king)
		return false;

	var send = '';
	if(isInCheck(fakeBoard, whichKing, turn))
	if(i === row && j === 4)
	{
		if(right === false && board[row][j+1] === ' ' && board[row][j+2] === ' ' && board[row][j+3] === rook)
		if(isInCheck(fakeBoard, {i: row, j: j+1}, turn) && isInCheck(fakeBoard, {i: row, j: j+2}, turn))
			send = 'r';
		if(left === false && board[row][j-1] === ' ' && board[row][j-2] === ' ' && board[row][j-3] === ' ' && board[row][0] === rook)
		if(isInCheck(fakeBoard, {i: row, j: j-1}, turn) && isInCheck(fakeBoard, {i: row, j: j-2}, turn))
			send += 'l';
		return send;
	}
	return false;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function makeMoveForWhite(from, to, moves) {
	var fakeBoard = [];
 	for(var i = 0; i<8; i++)
		fakeBoard[i] = board[i].slice();
var count = 0;
 for(var i = 0; i<moves.length; i++)
 {
 	var index = Number(moves[i][0])*8+Number(moves[i][1]);
 	allSquares[index].classList.remove('captureable');
 	allSquares[index].classList.remove('showPath');
 	allSquares[index].removeEventListener('click', listener2[index], false);
 }
 
 var current = from.i*8+from.j;
 allSquares[current].classList.remove('selected');
 
 fakeBoard[from.i][from.j] = ' ';
 fakeBoard[to.i][to.j] = from.p;
 var omit = to.i+''+to.j+to.p;
 var flag = 0;
 	if(to.p !== ' ')
	{
		for(var x = 0; x<blacks.length; x++)
		{
			if(omit === blacks[x])
			{
				flag = 1;
				blacks.splice(x, 1);
				break;
			}
		}
	}
 if(from.p ==='A' ? isInCheck(fakeBoard, to, turn) : isInCheck(fakeBoard, wKing, turn))
 {
    if(from.p === 'A')
	 {
	 	if(from.j === 4 && to.j === 2)
	 		castlePlease('l');
	 else if(from.j === 4 && to.j === 6)
	 		castlePlease('r');
	 }

	 if(from.p === 'A')
	 {
	 	wKing.i = to.i; wKing.j = to.j;
	 	if(wAMoved === false)
			wAMoved = true;
	 }
	 if(from.p === 'R' && lWRook == false && from.j === 0)
			lWRook = true;
	 if(from.p === 'R' && rWRook == false && from.j === 7)
			rWRook = true;

 
	 allSquares[current].innerHTML = ' ';
	 allSquares[current].removeEventListener('click', listener[current], false);
	 allSquares[current].classList.add('BLANK');

	 var piece = from.p;
	 if(from.p === 'P' && to.i === 0)
	 		from.p = 'Q';

	 var future = to.i*8+to.j;
	 listener[future] = listener[current];
	 allSquares[future].innerHTML = pieceValue(from.p);
	 allSquares[future].addEventListener('click', listener[future], false);
	 allSquares[future].classList.remove('BLANK');

	 board[from.i][from.j] = ' ';
	 board[to.i][to.j] = from.p;

	var update = from.i+''+from.j+piece;
	for(var x = 0; x<whites.length; x++)
	{
		if(update === whites[x])
		{
			whites[x] = to.i+''+to.j+from.p;
			break;
		}
	}
	
	 turn = false;
	if(isCheckMate(board, turn))
		alert("HUMAN won....");

	 makaAMoveAI();
} else
  {
  	if(flag === 1){
		blacks.push(omit);
	}

  	if(isCheckMate(board, turn))
		alert("AI won....");
  }
}

function pieceValue(piece)
{
	switch(piece)
	{
		case "p":
		{
			return '&#9823;';
		}
		case "P":
		{
			 return '&#9817;';
		}
		case "r":
		     return '&#9820;';
		case "R":
		{
			return '&#9814;';
		}
		case "K":
			return '&#9816;';
		case "k":
		{
			return '&#9822;';
		}
		case "b":
			return '&#9821;';
		case "B":
		{
			return '&#9815;';
		}
		case "q":
		 	return '&#9819;';
		case "Q":
		{
			return '&#9813;';
		}
		case "a":
			return '&#9818;';
		case "A":
		{
			return '&#9812;';
		}
		case " ":
		{
			return '';
		}
	}
}

function piecePoint(piece, i, j) {
	switch(piece)
	{
		case "p":
		{
			return -10 - pawnEvalBlack[i][j];
		}
		case "P":
		{
			 return 10 + pawnEvalWhite[i][j];
		}
		case "r":
		     return -50 - rookEvalBlack[i][j];
		case "R":
		{
			return 50 + rookEvalWhite[i][j];
		}
		case "K":
			return 30 + knightEval[i][j];
		case "k":
		{
			return -30 - knightEval[i][j];
		}
		case "b":
			return -30 - bishopEvalBlack[i][j];
		case "B":
		{
			return 30 + bishopEvalWhite[i][j];
		}
		case "q":
		 	return -90 - evalQueen[i][j];
		case "Q":
		{
			return 90 + evalQueen[i][j];
		}
		case "a":
			return -900 - kingEvalBlack[i][j];
		case "A":
		{
			return 900 + kingEvalWhite[i][j];
		}
		default: return 0;
	}
}

function makaAMoveAI() {
	var fakeBoard = [], fakeBlacks = [], fakeWhites = [];
	for(var i = 0; i<8; i++)
		fakeBoard[i] = board[i].slice();
	fakeBlacks = blacks.slice();
	fakeWhites = whites.slice();

	var player = turn;
	var bestValue = Number.POSITIVE_INFINITY;
	var bestMoveTo, bestMoveFrom; 
	var depth = 4;
	if(whites.length+blacks.length<13)
		depth = 5;
	else if(whites.length+blacks.length<9)
		depth = 6;
	else if(whites.length+blacks.length<7)
		depth = 8;
	else if(whites.length+blacks.length<5)
		depth = 10;
	for(var i = 0; i<fakeBlacks.length; i++)
	{
		var moves = getMoves(fakeBoard, Number(fakeBlacks[i][0]), Number(fakeBlacks[i][1]), fakeBlacks[i][2], false);
		//console.log(fakeBlacks[i][2]+" " + fakeBlacks.length);
		for(var j = 0; j<moves.length; j++)
		{
			var flag = 0;
			if(moves[j][2] !== ' ')
			{
				for(var x = 0; x<fakeWhites.length; x++)
				{
					if(moves[j][2] === fakeWhites[x])
					{
						flag = 1;
						fakeWhites.splice(x, 1);
						break;
					}
				}
			}
			var undoFrom = fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])];
			var undoTo = fakeBoard[Number(moves[j][0])][Number(moves[j][1])];
			fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoFrom;
			fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])] = ' ';
			//console.log(fakeBoard);
			v = minimax(fakeBoard, depth-1, -10000, 10000, !player, fakeWhites, fakeBlacks);

			fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoTo;
			fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])] = undoFrom;
			if(flag === 1)
			fakeWhites.push(moves[j][2]);

			if(bestValue >= v)
			{
				bestValue = v;
				bestMoveTo = moves[j];
				bestMoveFrom = fakeBlacks[i];
			}
		}
	}
	// console.log(bestMoveFrom);
	// console.log(bestMoveTo+"'");
	makeMoveForAI({i: Number(bestMoveFrom[0]), j: Number(bestMoveFrom[1]), p: bestMoveFrom[2]},
				  {i: Number(bestMoveTo[0]), j: Number(bestMoveTo[1]), p: bestMoveTo[2]});
}

function makeMoveForAI(from , to) {
	//console.log("makeMoveForAI");
	if(from.p === 'a')
	 {
	 	if(from.j === 4 && to.j === 2)
	 		castlePlease('l');
	 else if(from.j === 4 && to.j === 6)
	 		castlePlease('r');
	 }

	if(from.p === 'a')
	{
		bKing.i = to.i; bKing.j = to.j;
		if(bAMoved == false)
		bAMoved = true;
	}
	if(from.p === 'r' && lBRook == false && from.j === 0)
		lBRook = true;
 	if(from.p === 'r' && rBRook == false && from.j === 7)
		rBRook = true;

	 var current = from.i*8+from.j;
	 allSquares[current].innerHTML = ' ';
	 allSquares[current].classList.add('BLANK');

	 var piece = from.p;
	 if(from.p === 'p' && to.i === 7)
 		from.p = 'q';

	 var future = to.i*8+to.j;
	 allSquares[future].innerHTML = pieceValue(from.p);
	 allSquares[future].classList.remove('BLANK');
     allSquares[future].removeEventListener('click', listener[future], false);

     board[from.i][from.j] = ' ';
	 board[to.i][to.j] = from.p;
	 if(isInCheck(board, bKing, turn) === false)
	 {
		// document.querySelector('.endgame').style.display = 'block';
		// var divHeight = $('#container').height();
		// var divWidth =  $('#container').width();
		// $('.endgame').css('min-height', divHeight+'px');
		// $('.endgame').css('min-width', divWidth+'px');	 
		alert("YOU won the game ... AI lost... :(  ")
	}

	 var update = from.i+''+from.j+piece;
	for(var x = 0; x<blacks.length; x++)
	{
		if(update === blacks[x])
		{
			blacks[x] = to.i+''+to.j+from.p;
			break;
		}
	}

	 if(to.p !== ' ')
	 {
	 	var omit = to.i+''+to.j+to.p;
	 	for(var x = 0; x<whites.length; x++)
	 	{
	 		if(omit === whites[x])
	 		{
	 			whites.splice(x, 1);
	 			break;
	 		}
	 	}
	 }
	 turn = true;
}

function castlePlease(csl) {
	 var j1, j2, i = 0, p = 'r', ps = blacks;
	 if(csl == 'l')
	 {
	 	j1 = 0; j2 = 3;
	 }
	 else {
	 	j1 = 7; j2 = 5;
	 }
	 if(turn)
	 {
	 	i = 7;
	 	p = 'R';
	 	ps = whites;
	 }
	 var current = i*8+j1;
	 allSquares[current].innerHTML = '';
	 allSquares[current].classList.add('BLANK');

	 var future = i*8+j2;
	 allSquares[future].innerHTML = pieceValue(p);
	 allSquares[future].classList.remove('BLANK');

	 if(turn)
	 {
	 	listener[future] = listener[current];
	 	allSquares[future].addEventListener('click', listener[future], false);
	 }

	 board[i][j1] = ' ';
	 board[i][j2] = p;

	for(var x = 0; x<ps.length; x++)
	{
		if(i+''+j1+p === ps[x])
		{
			ps[x] = i+''+j2+p;
			break;
		}
	}
}

function isInCheck(fakeBoard, checkIt, turn) {
	
	var oponant = whites;
	if(turn)
	{
		oponant = blacks;
	}

	for(var x = 0; x<oponant.length; x++)
	{
		if(oponant[x][2] === 'A' || oponant[x][2] === 'a')
			continue;
		else if(oponant[x][2] === 'p')
		{    
			if((Number(oponant[x][0])+1 === checkIt.i && Number(oponant[x][1])+1 === checkIt.j))
			{
			
				return false;
			}
			else if((Number(oponant[x][0])+1 === checkIt.i && Number(oponant[x][1])-1 === checkIt.j))
			{
			
				return false;
			}
			continue;
		}
		else if(oponant[x][2] === 'P')
		{
			if((Number(oponant[x][0])-1 === checkIt.i && Number(oponant[x][1])+1 === checkIt.j))
			{
			
				return false;
			}
			else if((Number(oponant[x][0])-1 === checkIt.i && Number(oponant[x][1])-1 === checkIt.j))
			{
			
				return false;
			}
			continue;
		}
		else 
		{
			var moves = getMoves(fakeBoard, Number(oponant[x][0]), Number(oponant[x][1]), oponant[x][2], !turn);
			for(var y = 0; y<moves.length; y++)
			{
				if(checkIt.i === Number(moves[y][0]) && checkIt.j === Number(moves[y][1]))
				{
					return false;
				}
			}
		}
	}
	return true;
}

function minimax(fakeBoard, depth, alpha, beta, player, fakeWhites, fakeBlacks) {
	//console.log(fakeBoard);
	if(depth === 0 || isCheckMate(fakeBoard, player))
	{
		return evaluator(fakeBoard, player);
	}

	var bestValue , v;
	if(player)
	{
		bestValue = Number.NEGATIVE_INFINITY;
		for(var i = 0; i<fakeWhites.length; i++)
		{
			var moves = getMoves(fakeBoard, Number(fakeWhites[i][0]), Number(fakeWhites[i][1]), fakeWhites[i][2], player);
			for(var j = 0; j<moves.length; j++)
			{
				var flag = 0;
				if(moves[j][2] !== ' ')
				{
					for(var x = 0; x<fakeBlacks.length; x++)
					{
						if(moves[j][2] === fakeBlacks[x])
						{
							flag = 1; 
							fakeBlacks.splice(x, 1);
							break;
						}
					}
				}
				var undoFrom = fakeBoard[Number(fakeWhites[i][0])][Number(fakeWhites[i][1])];
				var undoTo = fakeBoard[Number(moves[j][0])][Number(moves[j][1])];
				fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoFrom;
				fakeBoard[Number(fakeWhites[i][0])][Number(fakeWhites[i][1])] = ' ';

				v = minimax(fakeBoard, depth - 1, alpha, beta, false, fakeWhites, fakeBlacks);

				fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoTo;
				fakeBoard[Number(fakeWhites[i][0])][Number(fakeWhites[i][1])] = undoFrom;
				if(flag === 1)
				{
					fakeBlacks.push(moves[j][2]);
							//console.log(moves[j][2]);
				}
				bestValue = Math.max(v, bestValue);
				alpha = Math.max(alpha, bestValue);
				if(beta <= bestValue)
					return bestValue;
			}
		}
		return bestValue;
	}
	else {
		bestValue = Number.POSITIVE_INFINITY;

		for(var i = 0; i<fakeBlacks.length; i++)
		{
			flag = 0; 
			var moves = getMoves(fakeBoard, Number(fakeBlacks[i][0]), Number(fakeBlacks[i][1]), fakeBlacks[i][2], player);
			for(var j = 0; j<moves.length; j++)
			{
				if(moves[j][2] !== ' ')
				{
					for(var x = 0; x<fakeWhites.length; x++)
					{
						if(moves[j][2] === fakeWhites[x])
						{
							flag = 1; 
							fakeWhites.splice(x, 1);
							break;
						}
					}
				}
				var undoFrom = fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])];
				var undoTo = fakeBoard[Number(moves[j][0])][Number(moves[j][1])];
				fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoFrom;
				fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])] = ' ';

				v = minimax(fakeBoard, depth - 1, alpha, beta, true, fakeWhites, fakeBlacks);

				fakeBoard[Number(moves[j][0])][Number(moves[j][1])] = undoTo;
				fakeBoard[Number(fakeBlacks[i][0])][Number(fakeBlacks[i][1])] = undoFrom;
				if(flag === 1)
				fakeWhites.push(moves[j][2]);
				bestValue = Math.min(v, bestValue);
				beta = Math.min(beta, bestValue);
				if(beta <= alpha)
					return bestValue;
			}
		}
		return bestValue;
	}
}

function isCheckMate(fakeBoard, player) {
	var k = 'a', king = bKing;
	if(player)
	{
		k = 'A'; king = wKing;
	}
	if(isInCheck(fakeBoard, king, player))
		return false;
	var moves = movesForKing(fakeBoard, king.i, king.j, player);
	for(var i = 0; i<moves.length; i++)
	{
		fakeBoard[Number(moves[i][0])][Number(moves[i][1])] = k;
		fakeBoard[king.i][king.j] = ' ';
		if(isInCheck(fakeBoard, {i: Number(moves[i][0]), j: Number(moves[i][1])}))
		{
			fakeBoard[Number(moves[i][0])][Number(moves[i][1])] = moves[i][2];
			fakeBoard[king.i][king.j] = k;
			return false;
		}
		fakeBoard[Number(moves[i][0])][Number(moves[i][1])] = moves[i][2];
	}
	fakeBoard[king.i][king.j] = k;
	return true;
}

function evaluator(fakeBoard) {
	var total = 0;
	for(var i = 0; i<8; i++)
	{
		for(var j = 0; j<8; j++)
		{
			//total += getPieceValue(fakeBoard[i][j], i ,j, player);;
			total += piecePoint(fakeBoard[i][j], i, j);
		}
	}
	return total;
}

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




// var getPieceValue = function (piece, x, y, player) {
//     if (piece === null) {
//         return 0;
//     }
//     var getAbsoluteValue = function (piece, isWhite, x ,y) {
//         if (piece === 'p' || piece === 'P') {
//             return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
//         } else if (piece === 'r' || piece === 'R') {
//             return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
//         } else if (piece === 'k' || piece === 'K') {
//             return 30 + knightEval[y][x];
//         } else if (piece === 'b' || piece === 'B') {
//             return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
//         } else if (piece === 'q' || piece === 'Q') {
//             return 90 + evalQueen[y][x];
//         } else if (piece === 'a' || piece === 'A') {
//             return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
//         }
//         //throw "Unknown piece: " + piece;
//     };

//     var absoluteValue = getAbsoluteValue(piece, player, x ,y);
//     return piece.color === 'w' ? absoluteValue : -absoluteValue;
// };
