
const minUnits =3, maxUnits=9;

let unitsCount = getRandomInt(minUnits, maxUnits);
let signs = new Array(unitsCount -1).fill(null); // null - пусто, '+', '-'
let currentPlayer = 'player'; // 'player' или 'computer'
const gameDiv = document.getElementById('game');
const infoDiv = document.getElementById('info');
const restartBtn = document.getElementById('restartBtn');

function getRandomInt(min,max){
 return Math.floor(Math.random()*(max-min+1))+min;
}

// Отрисовка игрового поля
function render(){
 gameDiv.innerHTML = '';
 for(let i=0;i<unitsCount;i++){
   // Единица
   const unitSpan = document.createElement('span');
   unitSpan.className='unit';
   unitSpan.textContent='1';
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
         signSpan.title = 'Кликните чтобы выбрать знак (+ или -)';
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

// Ход игрока - выбор знака на позиции i
function playerChooseSign(i){
 if(currentPlayer !== 'player') return;

 // Предлагаем выбрать + или -
 const choice = prompt("Выберите знак для позиции " + (i+1) + " (введите + или -):", "+");
 if(choice !== '+' && choice !== '-'){
   alert("Пожалуйста, введите только '+' или '-'");
   return;
 }

 signs[i] = choice;

 currentPlayer='computer';
 infoDiv.textContent='Ход компьютера...';

 render();

setTimeout(computerTurn,500);
}

// Ход компьютера - выбирает случайный пустой знак и ставит + или -
function computerTurn(){
 // Находим все пустые позиции
 const emptyIndices = [];
 for(let i=0;i<signs.length;i++){
   if(signs[i] === null) emptyIndices.push(i);
 }

 if(emptyIndices.length ===0){
   finishGame();
   return;
 }

 // Компьютер выбирает случайный индекс из пустых
 const chosenIndex = emptyIndices[getRandomInt(0, emptyIndices.length -1)];

 // Компьютер выбирает случайный знак
 const compSign = Math.random() <0.5 ? '+' : '-';

 signs[chosenIndex] = compSign;

 infoDiv.textContent=`Компьютер поставил '${compSign}' на позицию ${chosenIndex+1}. Ваш ход. Выберите знак.`;

 currentPlayer='player';

 render();

 checkIfGameOver();
}

// Проверяем закончилась ли игра (все знаки расставлены)
function checkIfGameOver(){
 if(signs.every(s => s !== null)){
   finishGame();
 }
}

// Вычисляем итоговое значение выражения вида:
// например для единиц и знаков:
// "1 + 1 - 1 + ..."
// вычисляем результат слева направо

function calculateResult(){
 let result=1;

 for(let i=0;i<signs.length;i++){
   let nextUnit=1;

   if(signs[i]==='+'){
     result += nextUnit;
   } else if(signs[i]==='-'){
     result -= nextUnit;
   } else {
     // Если вдруг есть пустой знак (не должно быть)
     throw new Error("Не все знаки расставлены!");
   }
 }

 return result;
}

function finishGame(){
 const res=calculateResult();
 let msg=`Итоговое выражение:\n`;

 for(let i=0;i<unitsCount;i++){
   msg += '1 ';
   
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

restartBtn.addEventListener('click', () => {
 unitsCount=getRandomInt(minUnits,maxUnits);
 signs=new Array(unitsCount-1).fill(null);
 currentPlayer='player';
 infoDiv.textContent='Выберите знак между единицами. Вы ходите первым.';
 restartBtn.style.display='none';
 render();
});

render();
