const board = document.querySelectorAll('.cell');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const choices = {
    A: document.getElementById('choiceA'),
    B: document.getElementById('choiceB'),
    C: document.getElementById('choiceC'),
    D: document.getElementById('choiceD')
};
const submitAnswerButton = document.getElementById('submit-answer');
const messageElement = document.getElementById('message');

let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentQuestion = null;
let selectedCellIndex = null;

const questions = [
    {
        question: "What is 2 + 2?",
        choices: { A: "3", B: "4", C: "5", D: "6" },
        correctAnswer: "B"
    },
    {
        question: "What is the capital of France?",
        choices: { A: "Berlin", B: "Madrid", C: "Paris", D: "Rome" },
        correctAnswer: "C"
    },
    {
        question: "What is 3 * 5?",
        choices: { A: "15", B: "20", C: "25", D: "30" },
        correctAnswer: "A"
    },
    // Add more questions as needed
];

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return boardState.every(cell => cell !== '');
}

function handleCellClick(event) {
    if (!gameActive || currentPlayer === 'O') return;

    selectedCellIndex = event.target.dataset.index;

    if (boardState[selectedCellIndex] !== '') {
        return;
    }

    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionElement.textContent = currentQuestion.question;
    choices.A.textContent = currentQuestion.choices.A;
    choices.B.textContent = currentQuestion.choices.B;
    choices.C.textContent = currentQuestion.choices.C;
    choices.D.textContent = currentQuestion.choices.D;
    questionContainer.classList.remove('hidden');
}

function handleAnswerSubmission() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
        messageElement.textContent = "Please select an answer!";
        return;
    }

    if (selectedAnswer.value === currentQuestion.correctAnswer) {
        boardState[selectedCellIndex] = currentPlayer;
        board[selectedCellIndex].textContent = currentPlayer;

        if (checkWin()) {
            messageElement.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            messageElement.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = 'O';
            computerMove();
        }
    } else {
        messageElement.textContent = "Incorrect answer! The computer gets another turn.";
        computerMove();
        if (gameActive) {
            computerMove();
        }
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => input.checked = false);
    questionContainer.classList.add('hidden');
}

function computerMove() {
    if (!gameActive) return;

    let emptyCells = [];
    boardState.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerChoice = emptyCells[randomIndex];

    boardState[computerChoice] = 'O';
    board[computerChoice].textContent = 'O';

    if (checkWin()) {
        messageElement.textContent = "Computer wins!";
        gameActive = false;
    } else if (checkDraw()) {
        messageElement.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'X';
    }
}

board.forEach(cell => cell.addEventListener('click', handleCellClick));
submitAnswerButton.addEventListener('click', handleAnswerSubmission);
