console.log("script.js carregou");

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let currentPlayer = 'X';
let scoreX = 0;  
let scoreO = 0;  
let scoreDraw = 0; 
let gameOver = false; 

function updateScore() {
    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
    document.getElementById('score-draw').textContent = scoreDraw;
}

function resetGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    document.getElementById('move-log').innerHTML = '';
    document.getElementById('game-message').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    updateBoard();
}

function displayGameMessage(message) {
    let gameMessageElement = document.getElementById('game-message');
    gameMessageElement.textContent = message;
    gameMessageElement.style.display = 'block';
    document.getElementById('restart-btn').style.display = 'block';
}

function updateBoard() {
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById(`cell-${i}`);
        let row = Math.floor(i / 3);
        let col = i % 3;
        cell.innerHTML = board[row][col] || '';
    }
}

function logMove(player, cellIndex) {
    let log = document.getElementById('move-log');
    let row = Math.floor(cellIndex / 3);
    let col = cellIndex % 3;
    log.innerHTML += `Jogador ${player} jogou na posição (${row + 1}, ${col + 1})<br>`;
}

function playerMove(cellIndex) {
    if (gameOver) return;

    let row = Math.floor(cellIndex / 3);
    let col = cellIndex % 3;

    if (board[row][col] === '' && currentPlayer === 'X') {
        board[row][col] = currentPlayer;
        logMove('X', cellIndex);
        updateBoard();
        if (checkWin(currentPlayer)) {
            scoreX++;
            gameOver = true;
            updateScore();
            displayGameMessage('Jogador X venceu!');
            return;
        }
        if (isDraw()) {
            scoreDraw++;
            gameOver = true;
            updateScore();
            displayGameMessage('Jogo terminou empatado!');
            return;
        }
        currentPlayer = 'O';
        setTimeout(computerMove, 500);
    }
}

function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
        (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
        return true;
    }
    return false;
}

function isDraw() {
    return board.flat().every(cell => cell !== '');
}

function computerMove() {
    if (gameOver) return;

    let bestMove = findBestMove();
    if (bestMove) {
        board[bestMove.i][bestMove.j] = 'O';
        logMove('O', bestMove.i * 3 + bestMove.j);
        updateBoard();
        if (checkWin('O')) {
            scoreO++;
            gameOver = true;
            updateScore();
            displayGameMessage('Jogador O venceu!');
            return;
        }
        if (isDraw()) {
            scoreDraw++;
            gameOver = true;
            updateScore();
            displayGameMessage('Jogo terminou empatado!');
        }
        currentPlayer = 'X';
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                let score = minimax(board, 0, false);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

for (let i = 0; i < 9; i++) {
    document.getElementById(`cell-${i}`).addEventListener('click', function() {
        playerMove(i);
    });
}
