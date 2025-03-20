const grid = document.getElementById('grid');
let tiles = [];
const size = 3;

const moveSound = new Audio('move.mp3');
const winSound = new Audio('win.mp3');

function init() {
  tiles = [...Array(size * size).keys()];
  shuffleTiles();
}

function shuffleTiles() {
  do {
    tiles = tiles.sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles) || isSolved(tiles));
  renderGrid();
  document.getElementById('message').textContent = '';
}

function isSolvable(tiles) {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

function isSolved(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

function renderGrid() {
  grid.innerHTML = '';
  tiles.forEach((tile, index) => {
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    if (tile === 0) {
      tileElement.classList.add('empty');
    } else {
      tileElement.textContent = tile;
      tileElement.addEventListener('click', () => moveTile(index));
    }
    grid.appendChild(tileElement);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(0);
  if (isValidMove(index, emptyIndex)) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];

    // Reset and play move sound
    moveSound.currentTime = 0;
    moveSound.play();

    renderGrid();

    // Directly check win state after updating
    if (isSolved(tiles)) {
      setTimeout(() => {
        document.getElementById('message').textContent = '🎉 You solved it!';
        winSound.currentTime = 0;
        winSound.play();
      }, 100);
    }
  }
}

function isValidMove(index, emptyIndex) {
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;
  
  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  );
}

init();
