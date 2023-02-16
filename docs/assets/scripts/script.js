"use strict";

const gameStartTime = 60;

let buttonStart = document.querySelector("#ButtonStart");
let buttonSubmit = document.querySelector("#InitialForm button");

let sectionStart = document.querySelector("#Start");
let sectionQuestion = document.querySelector("#Question");
let sectionResults = document.querySelector("#Results");
let sectionScoreBoard = document.querySelector("#ScoreBoard");
let wrongWrightBox = document.querySelector("#Question p");
let scoreBox = document.querySelector("#Score");
let timeLeftBox = document.querySelector("#TimeLeft");

let responseTimout;
let questionInterval;
let questionTimeBonus = 0;
let questionTimePenalty = 0;
let score = 0;
let gameTimeout = gameStartTime;
let gameInterval;
let highScores = [];

let sections = [sectionStart, sectionQuestion, sectionResults, sectionScoreBoard];

let Questions = [{
        prompt: "the condition in an if /else statement is enclosed with _____",
        choices: ['quotes', 'curly brackets', 'parenthesis', 'square brackets'],
        answer: "parenthesis"
    },{
        prompt: "Arrays in JavaScript can be used to store ______",
        choices: ['numbers and strings', 'oher arrays', 'booleans', 'all of the above'],
        answer: "all of the above"
    },{
        prompt: "String values must be enclosed with _____ when being assigned to variables",
        choices: ['commas', 'curly brackets', 'quotes', 'parenthesis'],
        answer: "quotes"
    },{
        prompt: "Commonly used data types DO Not Include:",
        choices: ['strings', 'booleans', 'alerts', 'numbers'],
        answer: "alerts"
    },{
        prompt: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ['JavaScript', 'terminal/bash', 'for loops', 'console.log'],
        answer: "console.log"
    },{
        prompt: "True or False: Java and JavaScript are the same thing",
        choices: ['true', 'false'],
        answer: "false"
    }
];

let currentAnswer = "";
let usedQuestions = [];

buttonStart.addEventListener("click", function() {
    score = 0;

    LoadQuestion();

    ChangeSections(sectionQuestion);

    StartTimer();
});

buttonSubmit.addEventListener("click", function() {
    AddHighScore(CreateHighScoreEntry(document.querySelector("#InitialForm input").value, score));

    LoadScoreBoard();

    ChangeSections(sectionScoreBoard);
});

function LoadScoreBoard() {
    highScores = JSON.parse(localStorage.getItem("HighScores"));

    highScores.sort(function(a, b) {
        return a.score-b.score;
    });

    let scoreBoard = document.querySelector("#ScoreBoard ol");

    scoreBoard.innerHTML = "";

    highScores.forEach(highScore => {
        let newScore = document.createElement("li");

        newScore.textContent = highScore.initials + ' - ' + highScore.score;

        scoreBoard.appendChild(newScore);
    });
};

function AddHighScore(highScore){
    highScores.push(highScore);

    localStorage.setItem("HighScores", JSON.stringify(highScores));
};

function CreateHighScoreEntry(initials, score){
    return {
        initials: initials,
        score: score
    }
};

sectionQuestion.querySelector(":scope ol").addEventListener("click", function(event) {
    if (event.target.tagName !== "LI" || responseTimout != undefined)
    {
        //the user didn't click an answer so don't do anything
        //or the user already answered and the question hasn't reset yet. 
        return;
    }

    responseTimout = window.setTimeout(function () {
        responseTimout = undefined;

        LoadQuestion();

    }, 2000);
    
    if (event.target.textContent === currentAnswer)
    {
        wrongWrightBox.textContent = "Correct!";
        score += 1 + questionTimeBonus;
    } else {
        wrongWrightBox.textContent = "Wrong!";
        gameTimeout -= questionTimePenalty;
    }

    wrongWrightBox.classList.remove("hide");
});

function ResetUsedQuestions() {
    while (usedQuestions.pop() !== undefined)
    {
        usedQuestions.pop();
    }
};

function ChangeSections(NewSection) {
    sections.forEach(element => {
        if (element === NewSection) {
            element.classList.remove("hide");
        } else {
            element.classList.add("hide");
        }
    });
};

function LoadQuestion() {
    //We've used all the available questions so end the game. 
    if(Questions.length === usedQuestions.length)
    {
        EndGame();

        return;
    }

    const question = GetQuestion();

    const prompt = document.querySelector("#Question h1");
    prompt.textContent = question.prompt;

    const promptLIs = document.querySelectorAll("#Question li");

    for (let index = 0; index < promptLIs.length; index++) {
        if (index < question.choices.length)
        {
            promptLIs[index].classList.remove("hide");
            promptLIs[index].textContent = question.choices[index];

        } else 
        {
            promptLIs[index].classList.add("hide");
        }
    }

    StartQuestionInterval();

    currentAnswer = question.answer;

    wrongWrightBox.classList.add("hide");
};

function StartQuestionInterval() {
    //reset the interval if it's still running from previous question
    clearInterval(questionInterval);

    questionTimeBonus = 5;
    questionTimePenalty = 0;

    questionInterval = setInterval(function () {
        questionTimeBonus--;
        questionTimePenalty++;
    }, 1000);
}

function GetQuestion(){
    const randomNum = Math.floor(Math.random() * Questions.length);

    if (usedQuestions.some(r => r === randomNum)) {
        return GetQuestion();
    } else {
        usedQuestions.push(randomNum);
    }

    return Questions[randomNum];
};

function StartTimer() {
    gameTimeout = gameStartTime;

    gameInterval = setInterval(function () {
        gameTimeout--;

        if (gameTimeout < 0) {

            EndGame();
            return;
        }
        
        UpdateTimeLeft();
    }, 1000)

};

function UpdateTimeLeft() {
    if (gameTimeout >= 0){
        timeLeftBox.textContent = gameTimeout;
    } else {
        timeLeftBox.textContent = 0;
    }
};

function EndGame() {

    clearTimeout(responseTimout);
    clearInterval(questionInterval);
    clearInterval(gameInterval);

    scoreBox.textContent = score;

    ChangeSections(sectionResults);

    ResetUsedQuestions();

    gameTimeout = gameStartTime;
    UpdateTimeLeft();
};

UpdateTimeLeft();
LoadScoreBoard();