"use strict";

let buttonStart = document.querySelector("#ButtonStart");

let sectionStart = document.querySelector("#Start");
let sectionQuestion = document.querySelector("#Question");
let sectionResults = document.querySelector("#Results");
let sectionScoreBoard = document.querySelector("#ScoreBoard");

let sections = [sectionStart, sectionQuestion, sectionResults, sectionScoreBoard];

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

function LoadQuestion() {};
function StartTimer() {};