"use strict";

let buttonStart = document.querySelector("#ButtonStart");

let sectionStart = document.querySelector("#Start");
let sectionQuestion = document.querySelector("#Question");
let sectionResults = document.querySelector("#Results");
let sectionScoreBoard = document.querySelector("#ScoreBoard");

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
    }
];

let currentAnswer = "";

buttonStart.addEventListener("click", function() {
    LoadQuestion();

    ChangeSections(sectionQuestion);

    StartTimer();
});

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

    currentAnswer = question.answer;

    const wrongRight = document.querySelector("#Question p");
    wrongRight.classList.add("hide");
};

function GetQuestion(){
    return Questions[0];
};

function StartTimer() {};