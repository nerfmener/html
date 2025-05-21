const minUnits = 3, maxUnits = 15;

// Получаем случайное число в диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Инициализируем массив чисел для каждой позиции
let units = [];
let unitsCount = getRandomInt(minUnits, maxUnits);
for (let i=0; i<unitsCount; i++){
  units.push(getRandomInt(1, 15)); // Можно выбрать любой диапазон для чисел
}

let signs = new Array(unitsCount - 1).fill(null); // знаки между числами
let currentPlayer = 'player'; // 'player' или 'computer'
const gameDiv = document.getElementById('game');
const infoDiv = document.getElementById('info');
const restartBtn = document.getElementById('restartBtn');

function getRandomInt(min, max) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

// Отрисовка игрового поля
function render() {
  gameDiv.innerHTML = '';
  for(let i=0;i<unitsCount;i++){
    // Число
    const unitSpan = document.createElement('span');
    unitSpan.className='unit';
    unitSpan.textContent=units[i];
    gameDiv.appendChild(unitSpan);
    
    // Если не последняя единица - рисуем знак
    if(i < unitsCount -1){
      const signSpan = document.createElement('span');
      signSpan.className='sign';
      
      if(signs[i] === null){
        signSpan.classList.add('empty');
        signSpan.textContent='?';
        if(currentPlayer === 'player'){
          signSpan.style.cursor = 'pointer';
          signSpan.title = 'Кликните чтобы выбрать знак (+ , - или *)';
          signSpan.addEventListener('click', () => playerChooseSign(i));
        } else {
          signSpan.style.cursor = 'default';
          signSpan.title = '';
        }
      } else {
        signSpan.textContent=signs[i];
        if(currentPlayer === 'computer' && signs[i] !== null){
          signSpan.classList.add('computer');
        } else {
          signSpan.classList.remove('computer');
        }
        signSpan.style.cursor='default';
        signSpan.title='';
      }
      
      gameDiv.appendChild(signSpan);
    }
  }
}

// Ход игрока
function playerChooseSign(i){
 if(currentPlayer !== 'player') return;

 const choice = prompt("Выберите знак для позиции " + (i+1) + " (введите + , - или *):", "+");
 if(choice !== '+' && choice !== '-' && choice !== '*'){
   alert("Пожалуйста, введите только '+', '-' или *");
   return;
 }

 signs[i] = choice;

 currentPlayer='computer';
 infoDiv.textContent='Ход компьютера...';

 render();

 setTimeout(computerTurn,500);
}

// Ход компьютера
function computerTurn(){
 const emptyIndices = [];
 for(let i=0;i<signs.length;i++){
   if(signs[i] === null) emptyIndices.push(i);
 }

 if(emptyIndices.length ===0){
   finishGame();
   return;
 }

 const chosenIndex = emptyIndices[getRandomInt(0, emptyIndices.length -1)];
 const compSign = Math.random() <0.5 ?  '+' : '-';

 signs[chosenIndex] = compSign;

 infoDiv.textContent=`Компьютер поставил '${compSign}' на позицию ${chosenIndex+1}. Ваш ход. Выберите знак.`;

 currentPlayer='player';

 render();

 checkIfGameOver();
}

// Проверка окончания игры
function checkIfGameOver(){
 if(signs.every(s => s !== null)){
   finishGame();
 }
}

// Вычисление результата
function calculateResult() {
  let result = units[0];

  for(let i=0; i<signs.length; i++){
    if(signs[i] === '+'){
      result += units[i+1];
    } else if(signs[i] === '-'){
      result -= units[i+1];}
      else if(signs[i] === '*'){
        result *= units[i+1];
    } else {
      throw new Error("Не все знаки расставлены!");
    }
  }
  return result;
}

function finishGame() {
 const res=calculateResult();
 let msg='';

 // Формируем строку выражения
 for(let i=0;i<unitsCount;i++){
   msg += units[i] + ' ';
   if(i < signs.length){
     msg += signs[i] + ' ';
   }
 }

 msg += `\n\nРезультат вычисления равен ${res}.\n`;

 if(res %2 ===0){
   msg += "Число чётное — вы проиграли 😞";
 } else {
   msg += "Число нечётное — вы выиграли 🎉";
 }

 infoDiv.textContent=msg.replace(/\n/g,'\n');

 currentPlayer=null;
 restartBtn.style.display='inline-block';
}

// Обработчик перезапуска
restartBtn.addEventListener('click', () => {
 unitsCount=getRandomInt(minUnits,maxUnits);
 units = [];
 for(let i=0; i<unitsCount; i++){
   units.push(getRandomInt(1,15));
 }
 signs=new Array(unitsCount-1).fill(null);
 currentPlayer='player';
 infoDiv.textContent='Выберите знак между числами.';
 restartBtn.style.display='none';
 render();
});

render();

