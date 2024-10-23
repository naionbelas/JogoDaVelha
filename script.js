// início script.js

console.log("script.js carregou"); // Exibe uma mensagem no console para confirmar que o script foi carregado

// Inicializa o tabuleiro como uma matriz 3x3 preenchida com strings vazias
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let currentPlayer = 'X'; // Define o jogador atual como 'X'
let scoreX = 0;  // Armazena a pontuação do jogador X
let scoreO = 0;  // Armazena a pontuação do jogador O
let scoreDraw = 0; // Armazena a quantidade de empates
let gameOver = false; // Indica se o jogo terminou

// Atualiza o marcador de pontuação na interface
function updateScore() {
    document.getElementById('score-x').textContent = scoreX; // Atualiza a pontuação do jogador X
    document.getElementById('score-o').textContent = scoreO; // Atualiza a pontuação do jogador O
    document.getElementById('score-draw').textContent = scoreDraw; // Atualiza a quantidade de empates
}

// Reinicia o jogo, limpando o tabuleiro e as variáveis
function resetGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X'; // Reseta o jogador atual para X
    gameOver = false; // Indica que o jogo não está mais encerrado
    document.getElementById('move-log').innerHTML = ''; // Limpa o log de movimentos
    document.getElementById('game-message').style.display = 'none'; // Esconde a mensagem de fim de jogo
    document.getElementById('restart-btn').style.display = 'none'; // Esconde o botão de reiniciar
    updateBoard(); // Atualiza a interface do tabuleiro
}

// Exibe uma mensagem de fim de jogo e mostra o botão de reiniciar
function displayGameMessage(message) {
    let gameMessageElement = document.getElementById('game-message');
    gameMessageElement.textContent = message; // Define o texto da mensagem
    gameMessageElement.style.display = 'block'; // Torna a mensagem visível
    document.getElementById('restart-btn').style.display = 'block'; // Mostra o botão de reiniciar
}

// Atualiza o tabuleiro na interface com o estado atual
function updateBoard() {
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById(`cell-${i}`); // Seleciona a célula correspondente
        let row = Math.floor(i / 3); // Calcula a linha da célula
        let col = i % 3; // Calcula a coluna da célula
        cell.innerHTML = board[row][col] || ''; // Atualiza o conteúdo da célula
    }
}

// Registra o movimento de um jogador no log
function logMove(player, cellIndex) {
    let log = document.getElementById('move-log'); // Seleciona o elemento de log
    let row = Math.floor(cellIndex / 3); // Calcula a linha do movimento
    let col = cellIndex % 3; // Calcula a coluna do movimento
    log.innerHTML += `Jogador ${player} jogou na posição (${row + 1}, ${col + 1})<br>`; // Adiciona a entrada de log
}

// Função chamada quando o jogador faz um movimento
function playerMove(cellIndex) {
    if (gameOver) return; // Se o jogo já terminou, não faz nada

    let row = Math.floor(cellIndex / 3); // Calcula a linha da célula escolhida
    let col = cellIndex % 3; // Calcula a coluna da célula escolhida

    // Verifica se a célula está vazia e se é a vez do jogador X
    if (board[row][col] === '' && currentPlayer === 'X') {
        board[row][col] = currentPlayer; // Registra o movimento do jogador X
        logMove('X', cellIndex); // Loga o movimento
        updateBoard(); // Atualiza o tabuleiro na interface
        // Verifica se o jogador X ganhou
        if (checkWin(currentPlayer)) {
            scoreX++; // Incrementa a pontuação do jogador X
            gameOver = true; // Marca o jogo como terminado
            updateScore(); // Atualiza a pontuação na interface
            displayGameMessage('Jogador X venceu!'); // Exibe a mensagem de vitória
            return;
        }
        // Verifica se houve um empate
        if (isDraw()) {
            scoreDraw++; // Incrementa a contagem de empates
            gameOver = true; // Marca o jogo como terminado
            updateScore(); // Atualiza a pontuação na interface
            displayGameMessage('Jogo terminou empatado!'); // Exibe a mensagem de empate
            return;
        }
        currentPlayer = 'O'; // Altera para o jogador O
        setTimeout(computerMove, 500); // Aguarda meio segundo antes de fazer a jogada do computador
    }
}

// Verifica se o jogador venceu
function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        // Verifica linhas e colunas
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true; // Vitória em linha
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true; // Vitória em coluna
    }
    // Verifica as diagonais
    if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
        (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
        return true; // Vitória em diagonal
    }
    return false; // Nenhuma vitória encontrada
}

// Verifica se o jogo terminou em empate
function isDraw() {
    return board.flat().every(cell => cell !== ''); // Retorna verdadeiro se todas as células estiverem preenchidas
}

// Função para o movimento do computador
function computerMove() {
    if (gameOver) return; // Se o jogo já terminou, não faz nada

    let bestMove = findBestMove(); // Encontra o melhor movimento para o computador
    if (bestMove) {
        board[bestMove.i][bestMove.j] = 'O'; // Registra o movimento do computador
        logMove('O', bestMove.i * 3 + bestMove.j); // Loga o movimento do computador
        updateBoard(); // Atualiza o tabuleiro na interface
        // Verifica se o computador venceu
        if (checkWin('O')) {
            scoreO++; // Incrementa a pontuação do jogador O
            gameOver = true; // Marca o jogo como terminado
            updateScore(); // Atualiza a pontuação na interface
            displayGameMessage('Jogador O venceu!'); // Exibe a mensagem de vitória
            return;
        }
        // Verifica se houve um empate
        if (isDraw()) {
            scoreDraw++; // Incrementa a contagem de empates
            gameOver = true; // Marca o jogo como terminado
            updateScore(); // Atualiza a pontuação na interface
            displayGameMessage('Jogo terminou empatado!'); // Exibe a mensagem de empate
        }
        currentPlayer = 'X'; // Altera para o jogador X
    }
}

// Encontra o melhor movimento para o computador usando a estratégia Minimax
function findBestMove() {
    let bestScore = -Infinity; // Inicia a melhor pontuação como negativa infinita
    let move = null; // Inicializa a variável de movimento como nula

    // Itera sobre o tabuleiro para encontrar o melhor movimento
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') { // Se a célula estiver vazia
                board[i][j] = 'O'; // Simula o movimento do computador
                let score = minimax(board, 0, false); // Calcula a pontuação usando Minimax
                board[i][j] = ''; // Reverte o movimento

                if (score > bestScore) { // Se a pontuação atual for melhor que a melhor pontuação encontrada
                    bestScore = score; // Atualiza a melhor pontuação
                    move = { i, j }; // Atualiza o melhor movimento
                }
            }
        }
    }
    return move; // Retorna o melhor movimento encontrado
}

// Implementa o algoritmo Minimax para determinar a melhor jogada
function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth; // Retorna uma pontuação alta se O venceu
    if (checkWin('X')) return depth - 10; // Retorna uma pontuação baixa se X venceu
    if (isDraw()) return 0; // Retorna 0 se houver empate

    if (isMaximizing) { // Se for a vez do computador
        let bestScore = -Infinity; // Inicializa a melhor pontuação como negativa infinita
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') { // Se a célula estiver vazia
                    board[i][j] = 'O'; // Simula o movimento do computador
                    let score = minimax(board, depth + 1, false); // Calcula a pontuação recursivamente
                    board[i][j] = ''; // Reverte o movimento
                    bestScore = Math.max(score, bestScore); // Atualiza a melhor pontuação
                }
            }
        }
        return bestScore; // Retorna a melhor pontuação
    } else { // Se for a vez do jogador
        let bestScore = Infinity; // Inicializa a melhor pontuação como infinita
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') { // Se a célula estiver vazia
                    board[i][j] = 'X'; // Simula o movimento do jogador
                    let score = minimax(board, depth + 1, true); // Calcula a pontuação recursivamente
                    board[i][j] = ''; // Reverte o movimento
                    bestScore = Math.min(score, bestScore); // Atualiza a melhor pontuação
                }
            }
        }
        return bestScore; // Retorna a melhor pontuação
    }
}

// Adiciona um ouvinte de evento a cada célula do tabuleiro para registrar os cliques
for (let i = 0; i < 9; i++) {
    document.getElementById(`cell-${i}`).addEventListener('click', function() {
        playerMove(i); // Chama a função playerMove quando a célula é clicada
    });
}

// fim script.js
