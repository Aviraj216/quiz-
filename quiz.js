// Greetings
let greatingJS = document.querySelector(".greating");
let name = prompt("Please Provide your Name");
greatingJS.innerHTML += " " + name;

// DOM selectors
let questionJS = document.querySelector("#question");
let option1JS = document.querySelector(".option1");
let option2JS = document.querySelector(".option2");
let option3JS = document.querySelector(".option3");
let option4JS = document.querySelector(".option4");
let countQuestionsJS = document.querySelector(".count-btn");
let limitbtnJS = document.querySelector(".limit-btn");
let resetbtnJS = document.querySelector(".reset-btn");
let showResultJS = document.querySelector(".Result-btn");
let showRightQuestionsJS = document.querySelector(".Rightquestions");
let showWrongQuestionsJS = document.querySelector(".Wrongquestions");
let nextbtnJS = document.querySelector(".next-btn");

const options = [option1JS, option2JS, option3JS, option4JS];

let randomQuestion = null;
let countQuestions = 0;
let limitJS = null;
let remainingQuestions = [...questionsAPI]; // copy so no repeats

let rightAns = 0;
let wrongAns = 0;
let rightQuestionsArray = [];
let wrongQuestionsArray = [];

// shuffle function (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Set how many questions you want
limitbtnJS.addEventListener("click", () => {
  let input;
  do {
    input = prompt("Tell me how many questions you want for test (Numbers Only): ");
    if (input === null) return; // user pressed cancel
    limitJS = Number(input);
    if (isNaN(limitJS) || limitJS <= 0) {
      alert("Enter a valid number greater than 0");
      limitJS = null;
    } else if (limitJS > remainingQuestions.length) {
      alert("Too many questions. We only have " + remainingQuestions.length);
      limitJS = null;
    }
  } while (limitJS === null);
  alert("Quiz will run for " + limitJS + " Questions.");
});

// Load a random question
function loadNextQuestion() {
  // reset option styles
  options.forEach(btn => {
    btn.style.backgroundColor = "";
    btn.classList.remove("animate-correct", "animate-wrong");
  });

  // limit check
  if (limitJS !== null && countQuestions >= limitJS) {
    alert("Quiz finished! No more questions. Click Show Result for result");
    nextbtnJS.innerText = "Start Again"; //  change button text
    return;
  }

  if (remainingQuestions.length === 0) {
    alert("All Questions are Done");
    nextbtnJS.innerText = "Start Again"; //  change button text
    return;
  }

  nextbtnJS.innerText = "Next";

  const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
  randomQuestion = remainingQuestions[randomIndex];

  questionJS.textContent = "Q: " + randomQuestion.question;

  // shuffle answers with correct flag
  const answers = shuffle([
    { text: randomQuestion.right, correct: true },
    { text: randomQuestion.wrong, correct: false },
    { text: randomQuestion.wrong2, correct: false },
    { text: randomQuestion.wrong3, correct: false }
  ]);

  options.forEach((btn, i) => {
    btn.innerText = answers[i].text;
    btn.dataset.correct = answers[i].correct;
  });

  countQuestions++;
  countQuestionsJS.innerText = `Questions: ${countQuestions}`;

  remainingQuestions.splice(randomIndex, 1);
}

// initial load
loadNextQuestion();

options.forEach(option => {
  option.addEventListener("click", () => {
    const isCorrect = option.dataset.correct === "true";

    if (isCorrect) {
      option.style.backgroundColor = "#85b685";
      option.classList.add("animate-correct");
      rightAns++;
      rightQuestionsArray.push(randomQuestion.question);
    } else {
      option.style.backgroundColor = "#c93434ff";
      option.classList.add("animate-wrong");
      wrongAns++;
      wrongQuestionsArray.push(randomQuestion.question);
    }

    // after short delay, remove animation class and load next
    setTimeout(() => {
      option.classList.remove("animate-correct", "animate-wrong");
      loadNextQuestion();
    }, 1000);
  });
});

showRightQuestionsJS.addEventListener("click", () => {
  // remove old tables/results
  document.querySelectorAll("table.right, table.wrong, .result-output").forEach(el => el.remove());

  const table = document.createElement("table");
  table.classList.add("right");
  table.style.color = "black";
  table.style.background = "#6babdf";
  table.style.fontSize = "large";
  table.style.textAlign = "center";
  table.border = "1";

  const header = table.insertRow();
  const hcell = header.insertCell();
  hcell.textContent = "Right Questions";
  hcell.style.color = "black";
  hcell.style.background = "#4f82c4ff";
  hcell.style.fontSize = "x-large";

  rightQuestionsArray.forEach(q => {
    const row = table.insertRow();
    row.insertCell().textContent = q;
  });

  document.body.appendChild(table);
});

showWrongQuestionsJS.addEventListener("click", () => {
  document.querySelectorAll("table.right, table.wrong, .result-output").forEach(el => el.remove());

  const table = document.createElement("table");
  table.classList.add("wrong");
  table.style.color = "black";
  table.style.background = "#6babdf";
  table.style.fontSize = "large";
  table.style.textAlign = "center";
  table.border = "1";

  const header = table.insertRow();
  const hcell = header.insertCell();
  hcell.textContent = "Wrong Questions";
  hcell.style.color = "black";
  hcell.style.background = "#4f82c4ff";
  hcell.style.fontSize = "x-large";

  wrongQuestionsArray.forEach(q => {
    const row = table.insertRow();
    row.insertCell().textContent = q;
  });

  document.body.appendChild(table);
});

showResultJS.addEventListener("click", () => {
  document.querySelectorAll(".result-output").forEach(el => el.remove());

  const outputJS = document.createElement("div");
  outputJS.classList.add("result-output");
  outputJS.innerHTML = `
    <strong>Correct Answers: </strong> ${rightAns} <br>
    <strong>Wrong Answers: </strong> ${wrongAns}`;
  outputJS.style.color = "white";
  outputJS.style.fontSize = "x-large";
  document.body.appendChild(outputJS);
});

// Reset function
function resetQuiz() {
  countQuestions = 0;
  rightAns = 0;
  wrongAns = 0;
  rightQuestionsArray = [];
  wrongQuestionsArray = [];
  limitJS = null;

  remainingQuestions = [...questionsAPI];

  countQuestionsJS.innerText = "Questions: 0";
  questionJS.textContent = "Q: Press Start to begin!";
  option1JS.innerText = "Option 1";
  option2JS.innerText = "Option 2";
  option3JS.innerText = "Option 3";
  option4JS.innerText = "Option 4";

  document.querySelectorAll("table.right, table.wrong, .result-output").forEach(el => el.remove());
}

resetbtnJS.addEventListener("click", () => {
  resetQuiz();
});

//  Restart feature for Next button
nextbtnJS.addEventListener("click", () => {
  if (nextbtnJS.innerText === "Start Again") {
    resetQuiz();
    loadNextQuestion();
  }
});
