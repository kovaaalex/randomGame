export const board = document.querySelector('#board')
const choose__buttons = document.querySelectorAll('.choose__square')
export const numberColor = {
    2: "#D4F5E9",
    4: "#A7EBC2",
    8: "#7BDD9B",
    16: "#4FCF74",
    32: "#3FA34D",
    64: "#2E813A",
    128: "#21632D",
    256: "#174922",
    512: "#0E2F17",
    1024: "#0A2312",
    2048: "#06190D",
    4096: "#041008",
    8192: "#020905"
};
export let numbers
export let size = 3
choose__buttons.forEach(button => button.addEventListener('click', () => insertInBoard(+button.innerHTML[0])))
export function insertRandomNumber() {
    let randomCell
    do {
        let randomColumn = Math.floor(Math.random() * size)
        let randomRow = Math.floor(Math.random() * size)
        randomCell = randomColumn * size + randomRow
    } while (numbers[randomCell].innerHTML !== '')
    numbers[randomCell].innerHTML = '2'
    numbers[randomCell].style.backgroundColor = numberColor[2]
}
export function insertInBoard(boardSize = 3) {
    size = boardSize
    board.innerHTML = ''
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    for(let i = 0; i < boardSize * boardSize; i++) {
        board.innerHTML += `<div class="number"></div>`
    }
    numbers = document.querySelectorAll('.number')
    insertRandomNumber()
    insertRandomNumber()
}
insertInBoard()