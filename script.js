import { board, numbers, size, insertRandomNumber, insertInBoard, numberColor } from './innerBoard.js'
const h4 = document.querySelector('h4')
const h5 = document.querySelector('h5')
const h6 = document.querySelector('h6')
const restart = document.querySelector('.restart')
const game__status = document.querySelector('.game__status')
const bestResultsKey = 'bestResults'
const moveAudio = new Audio('success.mp3')
const loseAudio = new Audio('lose.mp3')

let points = 2;
let steps = 0;
let max = 2
let gameOver = false
restart.addEventListener('click', () => {
    gameOver = false
    numbers.forEach(number => number.innerHTML = '')
    points = 2
    steps = 0
    max = 2
    insertRandomNumber()
    insertRandomNumber()
})
function getLine(i, direction) {
    let line = [];
    if (direction === 'left' || direction === 'right') {
        for (let j = 0; j < size; j++) {
            const tempIndex = i * size + j;
            const tile = board.children[tempIndex];
            const value = parseInt(tile.innerHTML) || 0;
            line.push(value);
        }
        if (direction === 'right') line.reverse();
    } else if (direction === 'up' || direction === 'down') {
        for (let j = 0; j < size; j++) {
            const tempIndex = j * size + i;
            const tile = board.children[tempIndex];
            const value = parseInt(tile.innerHTML) || 0;
            line.push(value);
        }
        if (direction === 'down') line.reverse();
    }
    return line;
}

function setLine(i, filteredLine, direction) {
    if (direction === 'left' || direction === 'right') {
        if (direction === 'right') filteredLine.reverse();
        for (let j = 0; j < size; j++) {
            const tempIndex = i * size + j;
            const tile = board.children[tempIndex];
            tile.innerHTML = filteredLine[j] ? filteredLine[j] : "";
            tile.classList.toggle('empty', filteredLine[j] === 0);
            tile.classList.toggle('non__empty', filteredLine[j] !== 0);
        }
    } else if (direction === 'up' || direction === 'down') {
        if (direction === 'down') filteredLine.reverse();
        for (let j = 0; j < size; j++) {
            const tempIndex = j * size + i;
            const tile = board.children[tempIndex];
            tile.innerHTML = filteredLine[j] ? filteredLine[j] : "";
            tile.classList.toggle('empty', filteredLine[j] === 0);
            tile.classList.toggle('non__empty', filteredLine[j] !== 0);
        }
    }
}

function move(direction) {
    numbers.forEach(number => number.style.backgroundColor = '')
    if (gameOver) return
    let moved = false    
    for (let i = 0; i < size; i++) {
        let currentLine = getLine(i, direction);
        let filteredLine = currentLine.filter(value => value !== 0);
        
        for (let j = 0; j < filteredLine.length - 1; j++) {
            if (filteredLine[j] === filteredLine[j + 1]) {
                filteredLine[j] += filteredLine[j + 1];
                filteredLine[j + 1] = 0;
                points += filteredLine[j]
                moved = true;
                if(filteredLine[j] > max) {
                    max = filteredLine[j];
                    h6.innerHTML = `Максимум в игре: ${max}`;
                }
            }
        }
        filteredLine = filteredLine.filter(value => value !== 0);
        while (filteredLine.length < size) filteredLine.push(0);
        if (JSON.stringify(currentLine) !== JSON.stringify(filteredLine)) moved = true;
        setLine(i, filteredLine, direction);
    }
    if (moved) {
        insertRandomNumber();
        steps++;
        h5.innerHTML = `Ходов: ${steps}`;
        h4.innerHTML = `Очков: ${points}`;
    }
    numbers.forEach(number => number.style.backgroundColor = numberColor[+number.innerHTML])
    if (isGameOver()) {
        endGame()
        loseAudio.play()
    }
    else moveAudio.play()
}
function pressButton(event) {
    if (gameOver) return
    switch (event.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
}
function isGameOver() {
    for (let i = 0; i < size * size; i++) {
        const tile = parseInt(board.children[i].innerHTML) || 0;
        if (tile === 0) return false;
        if (i % size !== size - 1 && tile === (parseInt(board.children[i + 1].innerHTML) || 0)) {
            return false;
        }
        if (i + size < size * size && tile === (parseInt(board.children[i + size].innerHTML) || 0)) {
            return false;
        }
    }
    return true;
}
function getBestResults() {
    const results = localStorage.getItem(bestResultsKey)
    return results ? JSON.parse(results) : []
}
function saveBestResults(results) {
    localStorage.setItem(bestResultsKey, JSON.stringify(results))
}
function updateBestResultsTable() {
    const bestResults = getBestResults();
    const resultsDiv = document.querySelector('#best__results');
    resultsDiv.innerHTML = ''
    const table = document.createElement('table');
    table.setAttribute('border', '1')
    const headerRow = document.createElement('tr');
    const headers = ['Место', 'Очки', 'Ходов', 'Макс. число'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    bestResults.forEach((result, index) => {
        const row = document.createElement('tr');
        const placeCell = document.createElement('td');
        placeCell.textContent = `#${index + 1}`;
        row.appendChild(placeCell);
        const pointsCell = document.createElement('td');
        pointsCell.textContent = result.points;
        row.appendChild(pointsCell);
        const stepsCell = document.createElement('td');
        stepsCell.textContent = result.steps;
        row.appendChild(stepsCell);
        const maxCell = document.createElement('td');
        maxCell.textContent = result.max;
        row.appendChild(maxCell);
        table.appendChild(row);
    })
    resultsDiv.appendChild(table);
}

function addCurrentResult() {
    const bestResults = getBestResults()
    bestResults.push({points, steps, max})
    bestResults.sort((a, b) => b.points - a.points)
    if (bestResults.length > 10) {
        bestResults.length = 10;
    }
    saveBestResults(bestResults)
}
function endGame() {
    max < 2048 ? game__status.innerHTML ='Вы проиграли' : game__status.innerHTML = 'Поздравляем, у вас 2048 очков'
    addCurrentResult()
    updateBestResultsTable()
    gameOver = true
}
window.onload = () => {
    insertInBoard();
    document.addEventListener('keydown', (event) => pressButton(event));
    updateBestResultsTable();
}