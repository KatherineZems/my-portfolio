function write(text, id){
    document.getElementById(id).innerHTML = text;
}

function writeAdd(text, id){
    document.getElementById(id).innerHTML += text;
}

const navigation = document.querySelector('.navigation')
// Меняет активную секцию и активный пункт меню при клике в навигации
navigation.addEventListener('click', (e) => {
  const target = e.target
  if (target.classList.contains('js-title')) {
    if (window.innerWidth > 1024) {
      const sectionInactive = document.querySelector(".js-section.active")
      sectionInactive.classList.remove("active")
      const idSection = target.getAttribute('href').slice(1)
      const sectionActive = document.getElementById(idSection)
      sectionActive.classList.add("active")
      const titleInactive = navigation.querySelector(".js-title.selected")
      titleInactive.classList.remove("selected")
      target.classList.add("selected")
    } else {
      const toggle = document.getElementById('toggle')
      toggle.checked = false
    }
  }
})

const linksOnMain = document.querySelector('.links')
// Меняет активную секцию и активный пункт меню при клике на кнопки на главной
linksOnMain.addEventListener('click', (e) => {
  const target = e.target
  if (target.closest('.button-main') && window.innerWidth > 1024) {
    const sectionInactive = document.querySelector(".js-section.active")
    sectionInactive.classList.remove("active")
    const idSection = target.closest('.button-main').getAttribute('href').slice(1)
    const sectionActive = document.getElementById(idSection)
    sectionActive.classList.add("active")
    const titles = navigation.querySelectorAll(".js-title")
    for (let title of titles) {
      title.classList.remove("selected")
      if (idSection === title.getAttribute('href').slice(1)) {
        title.classList.add("selected")
      }
    }  
  }
})

// Игра ЗАГАДКИ
let score = 0;
const puzzleForm = document.querySelector('.puzzle__form') 
// Проверка ответов на загадки и отображение результата
puzzleForm.addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)

  score=0
  const correctAnswers = 
    {userAnswer0: ["книга", "книжка", "книги", "книжки" ,"book"],
    userAnswer1: ["я", "сам я", "я сам", "это я", "i"],
    userAnswer2: ["огонь", "пожар", "fire"]}

  for (let pair of data.entries()) {
    const key = pair[0]
    const value = pair[1].trim().toLowerCase()
    const correctAnswer = correctAnswers[key]
    checkAnswer(key, value, correctAnswer)
  }
  // Если все загадки отгаданы, элементы формы скрываются, появляется поздравительная гифка и текст
  if(score===3){
    const formChildrenElems = puzzleForm.children
    console.log(formChildrenElems);
    for (let elem of formChildrenElems) {
      console.log(elem);
      elem.classList.add('display-none')
    }
    
    const result = puzzleForm.querySelector(".result")
    result.classList.add('result-win', 'display-block')
    write("Ура! Вы отгадали все загадки!", "result")
    puzzleForm.querySelector(".gif-win").classList.add('display-block')
  } else {
    write("Правильно отгаданных загадок: " + score, "result")
  }
})
// Проверяет текущий ответ
function checkAnswer(inputName, userAnswer, correctAnswer){
  const input = puzzleForm.querySelector(`[name="${inputName}"]`)
  for(let i = 0; i < correctAnswer.length; i++){
    if(userAnswer === correctAnswer[i]){
        score++
        input.classList.remove('error')
        return
    }
  }	
  input.classList.add('error')
  input.value = ''
}

// Игры УГАДАЙКА и УГАДАЙКА МУЛЬТИПЛЕЕР
let answerGuess = Math.floor((Math.random() * 100))
let answerMulti = Math.floor((Math.random() * 100))
let tryCount = 0
let tryCountMulti = 0
const maxTryCount = 7
const maxTryCountMulti = 8

const hideElem = (idElem) => {
 document.getElementById(idElem).classList.toggle('display-none')
}
const showElem = (idElem) => {
  document.getElementById(idElem).classList.toggle('display-block')
}

const guessForm = document.querySelector('.guess__form')
// Проверка ответов для одиночной угадайки
guessForm.addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)
  let userAnswer = data.get('userAnswer').trim()
  if (userAnswer === '') return
  userAnswer = parseInt(userAnswer, 10)
  tryCount++;

  if(userAnswer === answerGuess){
      writeAdd("<br><br><i>Поздравляю, вы угадали!<br>Загаданное число: </i>" + answerGuess, "guessInfo");
      hideElem("guessButton");
      hideElem("guessUserAnswer");
      showElem("guessButtonReset");
  } else if(tryCount >= maxTryCount){
      writeAdd("<br><br><i>Вы проиграли<br>Загаданное число: </i>" + answerGuess, "guessInfo");
      hideElem("guessButton");
      hideElem("guessUserAnswer");
      showElem("guessButtonReset");
  } else if(userAnswer > answerGuess){
      writeAdd("<br>" + userAnswer + " - слишком большое число. Осталось попыток: " + (maxTryCount - tryCount), "guessInfo");	
  } else if(userAnswer < answerGuess){
      writeAdd("<br>" + userAnswer + " - слишком маленькое число. Осталось попыток: " + (maxTryCount - tryCount), "guessInfo");			
  }

  e.target.reset()
})

const multiForm = document.querySelector('.multi__form')
// Проверка ответов для мультиплеерной угадайки
multiForm.addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)
  let userAnswer = data.get('userAnswerMulti').trim()
  if (userAnswer === '') return
  userAnswer = parseInt(userAnswer, 10)
  tryCountMulti++;
  const userId = turn();

  if(userAnswer === answerMulti){
    writeAdd("<br><br><i>" + userId + " Поздравляю, вы угадали!<br>Загаданное число: </i>" + answerMulti, "infoMulti");
    hideElem("buttonMulti");
    hideElem("userAnswerMulti");
    showElem("buttonResetMulti");
    showElem("fatality");
} else if(tryCountMulti >= maxTryCountMulti){
    writeAdd("<br><br><i>Вы проиграли<br>Загаданное число: </i>" + answerMulti, "infoMulti");
    hideElem("buttonMulti");
    hideElem("userAnswerMulti");
    showElem("buttonResetMulti");
    showElem("compWins");
} else if(userAnswer > answerMulti){
    writeAdd("<br>" + userId + ": " + userAnswer + " - слишком большое число. Осталось попыток: " + (maxTryCountMulti - tryCountMulti), "infoMulti");	
} else if(userAnswer < answerMulti){
    writeAdd("<br>" + userId + ": " + userAnswer + " - слишком маленькое число. Осталось попыток: " + (maxTryCountMulti - tryCountMulti), "infoMulti");			
}

  e.target.reset()
})

function turn(){
    if (tryCountMulti % 2 === 0){
        return "Игрок №2";
    } else {
        return "Игрок №1";
    }
}

// Перезапустить УГАДАЙКУ
const guessButtonReset = guessForm.querySelector('.reset-btn')
guessButtonReset.addEventListener('click', () => {
  write('Угадайте число от 0 до 100', 'guessInfo')
  showElem('guessButtonReset')
  hideElem('guessButton')
  hideElem('guessUserAnswer')
  answerGuess = Math.floor((Math.random() * 100))
  tryCount = 0
})

// Перезапустить УГАДАЙКУ МУЛЬТИПЛЕЕР
const multiButtonReset = multiForm.querySelector('.reset-btn')
multiButtonReset.addEventListener('click', () => {
  if(tryCountMulti >= maxTryCountMulti) {
    showElem("compWins")
  } else {
    showElem("fatality")
  }
  write('Угадайте число от 0 до 100<br>Начинает Игрок №1', 'infoMulti')
  showElem('buttonResetMulti')
  hideElem('buttonMulti')
  hideElem('userAnswerMulti')
  answerMulti = Math.floor((Math.random() * 100))
  tryCountMulti = 0
})

// ГЕНЕРАТОР ПАРОЛЕЙ
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function getRandomNumber(max){
    return Math.round(Math.random() * max);
}

const generatorForm = document.querySelector('.generate__form')
// Генерирует пароль
generatorForm.addEventListener('submit', e => {
  e.preventDefault()
  const data = new FormData(e.target)
  const lengthPassword = data.get('lengthPassword')
  let password = ""
  for(let i = 0; i < lengthPassword; i++){
      const n = getRandomNumber(letters.length - 1)
      password += letters[n]
  }
  write(password, "password")
})





