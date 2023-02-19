"use strict";

const gameStartTime = 60;
const lsHighScore = "HighScores";


const sectionStart = document.querySelector("#Start");
const sectionQuestion = document.querySelector("#Question");
const sectionResults = document.querySelector("#Results");
const sectionScoreBoard = document.querySelector("#ScoreBoard");
const sections = [sectionStart, sectionQuestion, sectionResults, sectionScoreBoard];
const sectionHeader = document.querySelector("header");

const wrongWrightBox = document.querySelector("#Question p");
const inputNewInitials = document.querySelector("#InitialForm input");

let responseTimout;
let questionInterval;
let questionTimeBonus = 0;
let questionTimePenalty = 0;
let score = 0;
let gameTimeout = gameStartTime;
let gameInterval;
let highScores = [];


let Questions;
let currentAnswer = "";
let usedQuestions = [];

document.querySelector("#ButtonBack").addEventListener("click", function() {
    ChangeSections(sectionStart);
    sectionHeader.style = "";
});

document.querySelector("#ButtonStart").addEventListener("click", function() {
    score = 0;

    LoadQuestion();

    ChangeSections(sectionQuestion);

    StartTimer();
});

document.querySelector("#InitialForm button").addEventListener("click", function() {
    let initals = inputNewInitials.value;

    if (initals.length > 3 || initals.length < 1){
        alert("Initials must be 1-3 characters");
    } else {    
        AddHighScore(CreateHighScoreEntry(initals, score));

        LoadScoreBoard();

        ChangeSections(sectionScoreBoard);
        sectionHeader.style = "visibility: hidden";
    }
});

document.querySelector("#LinkHighScore").addEventListener("click", function () {
    LoadScoreBoard();

    ChangeSections(sectionScoreBoard);
    sectionHeader.style = "visibility: hidden";
});

document.querySelector("#ButtonClearHighScore").addEventListener("click", function () {
    localStorage.removeItem(lsHighScore);
    
    highScores = [];

    LoadScoreBoard();
});

function LoadScoreBoard() {
    let scoreString = localStorage.getItem(lsHighScore);

    if (scoreString != null){
        highScores = JSON.parse(scoreString);
    }

    highScores.sort(function(a, b) {
        return b.score-a.score;
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

    localStorage.setItem(lsHighScore, JSON.stringify(highScores));
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
    let timeLeftBox = document.querySelector("#TimeLeft");

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

    document.querySelector("#Score").textContent = score;

    inputNewInitials.value = "";

    ChangeSections(sectionResults);

    ResetUsedQuestions();

    gameTimeout = gameStartTime;
    UpdateTimeLeft();
};

UpdateTimeLeft();
//Needed to get scores from storage initially if they already exist
LoadScoreBoard();

fetch("./assets/data/questions.json")
    .then((response) => response.json())
    .then((json) => Questions = json);