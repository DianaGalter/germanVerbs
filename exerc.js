"use strict"
var lastFocusInputName;  //в каком инпуте последний раз находился фокус
var inputs = document.getElementsByTagName('INPUT');
var randVerb = []; //выбираем случайный глагол из выбранного набора глаголов
var inputsName = [];  //перечень аттрибутов name у инпутов
var countVerbs = 0; //будем подсчитывать, сколько глаголов уже потренировали
var choosingPanel = document.getElementsByClassName('choosingPanel')[0]; //панелька с выбором группы
var verbsTable = document.getElementsByClassName('verbsTable')[0]; // паненлька с глаголами
var invisible = document.getElementsByClassName('invisible')[0]; // невидимый объект
var timerId; //задержка до появления посказки
var focusStart; //начальное положение каретки
var focusEnd; //конечное положение каретки
var lastFocusedInput;
for (var i = 0; i < 7; i++) {
	inputsName[i] = inputs[i].getAttribute('name'); //записываем все имена инпутов в массив
};

document.onclick = function (event) {
	
	var target = event.target;
	if (choosingPanel.classList.contains('invisible')) {
		switch (target.tagName) {
			case 'INPUT':
				lastFocusInputName = target.getAttribute('name');//сохраняем фокус в переменной
				focusStart = target.selectionStart;
				focusEnd = target.selectionEnd;
				break;
			case 'IMG':
				inputs[inputsName[0]].focus();
				break;
			case 'BUTTON':
				if (target.parentElement.id == 'letters') { //дополнительные символы, которых нет на клавиатуре
					putTheLetter(target); //вписываем выбранную букву в инпут
				};
				if (target.id == 'check') { //нажали на кнопку "проверить"
					check(randVerb[countVerbs]); //передаём в функцию проверки число, полученное рандомом в функции nextVerb
				};
				if (target.id == 'nextVerb') { //кнопка "дальше"
					nextVerb(true); //листаем следующий глагол
				};
				if (target.id == 'startButton') { //кнопка "в начало"
					switchPanel();//возвращаемся на стартовую панель
				};
				break;
			default: return;
		};
	} else {
		if (target.tagName == 'BUTTON') {
			chooseGroup(target.id);
		};
	};
};

hintHover.onmouseover = function () {
	timerId = setTimeout(showDiv, 700, hint);  //выводим подсказку при наведение на кнопку инфо
};

hintHover.onmouseout = function () {
	clearTimeout(timerId);  //если быстро ушли с кнопки инфо, не выводим подсказку
	setTimeout(hideDiv, 500, hint); //прячем подсказку
	
};

document.oninput = function(e) {
	focusStart = e.target.length;
	focusEnd = e.target.length;
};

function check(num) { //проверяем, правильно ли ввели данные в тренировочной таблице
		for (var i = 0; i < 7; i++) {
			if (inputs[inputsName[i]].value == verb[num][inputsName[i]]) { //сравниваем то, что в инпуте, с тем, что в базе

				//разобраться с переводами!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

				inputs[inputsName[i]].setAttribute('border-state', 'true');
		} else {
			inputs[inputsName[i]].setAttribute('border-state', 'false');
		};
		
	};
};

function nextVerb(value) { //следующий глагол из выбранной группы
	inputs[inputsName[0]].focus(); //фокусируемся на первом инпуте
	lastFocusInputName = inputsName[0];//запоминаем первый инпут
	if (value) {
		for (var i = 0; i < 7; i++) { //прогоняем по всем инпутам
			if (inputs[inputsName[i]].getAttribute('border-state') != 'true') { //пока все окошки не будут правильно заполнены
				showDiv(wrongAnswer); //показали окошко ошибки
				setTimeout(hideDiv, 5000, wrongAnswer); // спрятали окошко
				return; //кнопка "дальше" не сработает
			} else {
				clearUpInputs(i); //убираем обводку и написанное в инпутах
			};
		};
	};
	
	

	if (countVerbs) {
		verbName.innerHTML = verb[randVerb[countVerbs-1]].verb; //в заголовок вписываем полученный глагол
		hint.innerHTML = '(' + verb[randVerb[countVerbs-1]].verb + ', ' + verb[randVerb[countVerbs-1]].er + ', ' + verb[randVerb[countVerbs-1]].translation + ')'; //вписываем подсказку
		countVerbs--; //уменьшаем число оставшихся глаголов
	} else {

		showDiv(allDone); // всплывает окошко, что глаголы кончились
		setTimeout(hideDiv, 3000, allDone); //через 5 секунд прячем всплывающее окошко
		setTimeout(switchPanel, 3000);  //идём на начальную панель
	};
	
};

function chooseGroup(band) {
	var bandMin, bandMax; //диапазон глаголов

	if (band == '0') { //если выбрали кнопку "все глаголы"
		bandMin = 0; //диапазон от 0 до 181
		bandMax = 181; // то есть, все глаголы =)
	} else {
		band -= 1; //так как группы начинаются с 1, а глаголы с 0, понижаем значение на 1
		bandMin = band * 13; //получаем нижнюю границу диапазона (всего в группе 13 глаголов)
		bandMax = bandMin + 12; //получаем верхнюю границу (12 - чтобы не повторялись первый и последний глагол в соседних группах)
	};
	
	for (var i = 0; i <= (bandMax - bandMin); i++) { //прогоняем цикл либо 13 раз, если выбрали группу, либо 182, если все глаголы
		randVerb[i] = i + bandMin; //заполняем массив порядковыми номерами в нужном диапазоне
	};
	shuffle(randVerb);//перемешиваем наш массив
	countVerbs = randVerb.length; //подсчитывалка итераций, длиной в массив
	switchPanel(); //прячем видимое, спрятанное показываем
	nextVerb(false); //запускаем глагол
};


function shuffle(arr) {//функция перемешивает массив
	arr.sort(compareRandom);
};

function compareRandom(a, b) { //с помощью этой функции будем сортировать массив случайным образом
  return Math.random() - 0.5;
};

function switchPanel() { //показываем спрятанное, прячем видимое
	verbsTable.classList.toggle('invisible');
	choosingPanel.classList.toggle('invisible');
	hideDiv(wrongAnswer);
	hideDiv(allDone);
	for (var i = 0; i < 7; i++) {
		clearUpInputs(i);
	};
};

function putTheLetter(target) {
	lastFocusedInput = document.getElementsByName(lastFocusInputName)[0];
	var str = lastFocusedInput.value;

	if (focusStart < str.length) {
		lastFocusedInput.value = str.substring(0, focusStart) + target.innerHTML + str.substring(focusEnd, str.length); //записываем нажатый символ в инпут
	} else {
		lastFocusedInput.value = str.substring(0, focusStart) + target.innerHTML; //записываем нажатый символ в инпут
	};
	//setCaretToPos(lastFocusedInput, ++focusStart); //переведем каретку на позицию после вставленного символа
	lastFocusedInput.focus(); //делаем фокус снова активным
};

/*function setSelectionRange(input, selectionStart, selectionEnd) { //не знаю, имеет ли это смысл
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
	var range = lastFocusedInput.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionStart);
    range.moveStart('character', selectionEnd);
    range.select();
  }
};
 
function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
};*/

function showDiv (div) {
	div.style = 'display: block';
};

function hideDiv (div) {
	div.style = 'display: none';
};

function clearUpInputs(i) {
	inputs[inputsName[i]].removeAttribute('border-state'); //все окошки правильно заполнены, тогда убираем обводку
	inputs[i].value = ''; //подчистили инпуты от введённых данных
};