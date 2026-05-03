const socket = io('http://localhost:3000');

const TOTAL = 100000; // simulate large scale
const COLS = 50;
const ROW_HEIGHT = 25;
const VISIBLE_ROWS = 20;

const container = document.createElement('div');
container.id = 'container';

const grid = document.createElement('div');
grid.id = 'grid';

container.appendChild(grid);
document.body.appendChild(container);

// total height (virtual)
grid.style.height = `${(TOTAL / COLS) * ROW_HEIGHT}px`;

let checkboxes = {};

function render(startRow) {
  grid.innerHTML = '';

  for (let row = startRow; row < startRow + VISIBLE_ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      if (index >= TOTAL) break;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';

      checkbox.style.top = `${row * ROW_HEIGHT}px`;
      checkbox.style.left = `${col * 25}px`;

      checkbox.addEventListener('change', () => {
        socket.emit('toggle', {
          index,
          value: checkbox.checked ? 1 : 0
        });
      });

      checkboxes[index] = checkbox;
      grid.appendChild(checkbox);
    }
  }
}

// scroll handling
container.addEventListener('scroll', () => {
  const startRow = Math.floor(container.scrollTop / ROW_HEIGHT);
  render(startRow);
});

// initial render
render(0);

// socket updates
socket.on('checkbox_update', ({ index, value }) => {
  if (checkboxes[index]) {
    checkboxes[index].checked = value;
  }
});
