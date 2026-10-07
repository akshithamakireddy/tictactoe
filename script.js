/**
 * ==============================================================================
 * Modern Gaming Tic-Tac-Toe Game Engine (script.js)
 * ==============================================================================
 * Clean, robust vanilla JavaScript implementation.
 * Manages board state, 2-player alternation, win/draw detection,
 * score tracking, sound/visual feedback, and UI animations.
 */

// -----------------------------------------------------------------------------
// 1. State Variables
// -----------------------------------------------------------------------------

// 3x3 board represented as an array of 9 strings (indices 0 to 8)
let board = ["", "", "", "", "", "", "", "", ""];

// Current active player: "X" or "O" (Player X starts first)
let currentPlayer = "X";

// Flag to track whether the current round is playable
let isGameActive = true;

// Cumulative score tally
const scores = {
  x: 0,
  o: 0,
  draws: 0
};

// All 8 winning combinations in Tic-Tac-Toe (3 rows, 3 columns, 2 diagonals)
const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6]
];

// -----------------------------------------------------------------------------
// 2. DOM Elements
// -----------------------------------------------------------------------------

const cells = document.querySelectorAll(".board-cell");
const gameBoard = document.getElementById("game-board");
const statusBadge = document.getElementById("status-badge");
const statusText = document.getElementById("status-text");

// Scoreboard values
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawElement = document.getElementById("score-draw");

// Player cards for active glow highlights
const cardPlayerX = document.getElementById("card-player-x");
const cardPlayerO = document.getElementById("card-player-o");

// Action buttons
const restartBtn = document.getElementById("restart-btn");
const resetScoreBtn = document.getElementById("reset-score-btn");

// -----------------------------------------------------------------------------
// 3. Gameplay Logic
// -----------------------------------------------------------------------------

/**
 * Handles cell click events.
 * @param {MouseEvent} event
 */
function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = parseInt(cell.getAttribute("data-cell-index"), 10);

  // Ignore click if cell is already occupied or game round is over
  if (board[index] !== "" || !isGameActive) {
    return;
  }

  // 1. Update internal board state
  board[index] = currentPlayer;

  // 2. Update visual cell UI with smooth pop-in animation
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.classList.add("taken");
  cell.classList.add("pop");

  // Remove pop animation class after completion for clean state
  setTimeout(() => {
    cell.classList.remove("pop");
  }, 350);

  // 3. Check for win, draw, or switch turn
  evaluateGameState();
}

/**
 * Evaluates whether the last move resulted in a win, draw, or next turn.
 */
function evaluateGameState() {
  let roundWon = false;
  let winningLine = null;

  // Check each of the 8 winning combinations
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      roundWon = true;
      winningLine = [a, b, c];
      break;
    }
  }

  // Case 1: Victory
  if (roundWon) {
    handleVictory(winningLine);
    return;
  }

  // Case 2: Draw (all 9 cells filled without winner)
  const isDraw = !board.includes("");
  if (isDraw) {
    handleDraw();
    return;
  }

  // Case 3: Continue match - switch to next player
  switchTurn();
}

/**
 * Handles round victory: highlights winning cells, updates score, and shows victory badge.
 * @param {number[]} winningLine - The 3 winning cell indices.
 */
function handleVictory(winningLine) {
  isGameActive = false;

  // Highlight the winning trio with glowing animation
  winningLine.forEach((index) => {
    cells[index].classList.add("winner");
  });

  // Display celebratory victory message
  statusText.textContent = `Player ${currentPlayer} Wins!`;

  // Update status badge styling
  statusBadge.className = "status-pill";
  statusBadge.classList.add(currentPlayer === "X" ? "win-x" : "win-o");

  // Increment and display winner's score
  if (currentPlayer === "X") {
    scores.x += 1;
    scoreXElement.textContent = scores.x;
    triggerScorePulse(scoreXElement);
  } else {
    scores.o += 1;
    scoreOElement.textContent = scores.o;
    triggerScorePulse(scoreOElement);
  }

  // Remove active turn indicators from score cards
  cardPlayerX.classList.remove("active-player");
  cardPlayerO.classList.remove("active-player");
}

/**
 * Handles tie/draw outcome.
 */
function handleDraw() {
  isGameActive = false;

  // Display draw status
  statusText.textContent = "It's a Draw!";

  // Update status badge styling
  statusBadge.className = "status-pill draw";

  // Increment and display draw score
  scores.draws += 1;
  scoreDrawElement.textContent = scores.draws;
  triggerScorePulse(scoreDrawElement);

  // Remove active turn indicators
  cardPlayerX.classList.remove("active-player");
  cardPlayerO.classList.remove("active-player");
}

/**
 * Alternates player turn between X and O.
 */
function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

/**
 * Updates turn text, status pill, and active player card glow.
 */
function updateTurnDisplay() {
  statusText.textContent = `Player ${currentPlayer} Turn`;

  // Update status badge styling
  statusBadge.className = "status-pill";
  statusBadge.classList.add(currentPlayer === "X" ? "turn-x" : "turn-o");

  // Highlight active player card
  if (currentPlayer === "X") {
    cardPlayerX.classList.add("active-player");
    cardPlayerO.classList.remove("active-player");
  } else {
    cardPlayerO.classList.add("active-player");
    cardPlayerX.classList.remove("active-player");
  }
}

/**
 * Adds a brief scale bounce to score number upon point change.
 * @param {HTMLElement} element
 */
function triggerScorePulse(element) {
  element.style.transform = "scale(1.35)";
  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 250);
}

/**
 * Starts a new game: clears board cells and highlights, resets turn to Player X.
 * Keeps the scoreboard scores intact.
 */
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;

  // Clear cells
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "board-cell";
  });

  // Reset turn display
  updateTurnDisplay();
}

/**
 * Resets all score counts back to 0.
 */
function resetScores() {
  scores.x = 0;
  scores.o = 0;
  scores.draws = 0;

  scoreXElement.textContent = "0";
  scoreOElement.textContent = "0";
  scoreDrawElement.textContent = "0";
}

// -----------------------------------------------------------------------------
// 4. Event Listeners Setup
// -----------------------------------------------------------------------------

// Add click listener to all 9 board cells
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

// "New Game" button listener
restartBtn.addEventListener("click", restartGame);

// "Reset Score" button listener
resetScoreBtn.addEventListener("click", resetScores);

// Initialize game on load
updateTurnDisplay();
