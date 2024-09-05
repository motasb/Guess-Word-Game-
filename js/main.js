// setting game name 
let gameName = "Guess The Word"
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created by Elhlwany`;

// game options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let numberOfHints = 2;
let timeLeft = 180;
let currentTry = 1;
// ************
let scoreTry;
let score;
let stopTimer;
let wordToGuess = "";
const words = [
    "animal", "butter", "chance", "demand", "effort", 
    "figure", "gather", "honest", "island", "jungle", 
    "kidney", "laptop", "monday", "nature", "orange", 
    "planet", "rocket", "silver", "ticket", "yellow", 
    "winner", "beauty", "campus", "dragon", "family", 
    "garage", "health", "impact", "kettle", "legend", 
    "manage", "online", "parade", "reason", "senior", 
    "temple", "united", "vision", "wander", "zipper"
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// mange hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

console.log(wordToGuess);

function generateInputs() {
    const inputsContainer = document.querySelector(".inputs");
    for (let i = 1; i <= numbersOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span> Try ${i} </span>`;

        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        for (let j = 1; j <= numbersOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();

    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");

    inputsInDisabledDiv.forEach((input) => input.disabled = true);

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();

            playSound(document.getElementById("input-sound"));

            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        input.addEventListener("keydown", function (event) {
            
            const currentIndex = Array.from(inputs).indexOf(event.target);

            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();

                playSound(document.getElementById("move"));
            }
            if (event.key === "ArrowLeft") {
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) inputs[prevIndex].focus();
                playSound(document.getElementById("move"));
            }
        });
    });
};

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGusses);


function handleGusses() {
    let successGuess = true;
    playSound(document.getElementById("input-sound"));
    for (let i = 1; i <= numbersOfLetters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }
    if (successGuess) {

        scoreTry = numbersOfTries - currentTry;
        score = timeLeft + numberOfHints * 15 + scoreTry * 15;
        playSound(document.getElementById("win"));
        clearInterval(stopTimer);

        let playerName = document.querySelector(".name span").textContent;
        let currentTime = score;

        let winnerData = { name: playerName, time: currentTime };

        let winners = JSON.parse(localStorage.getItem("winners")) || [];

        winners.push(winnerData);

        // ترتيب الفائزين بناءً على الوقت المتبقي من الأعلى إلى الأدنى
        winners.sort((a, b) => b.time - a.time);

        // حفظ الفائزين في localStorage بعد الترتيب
        localStorage.setItem("winners", JSON.stringify(winners));

        // عرض أعلى 5 فائزين فقط
        let tasksSection = document.querySelector(".tasks");
        tasksSection.innerHTML = ""; // مسح المحتويات القديمة

        winners.slice(0, 5).forEach(winner => {
            if (winner && winner.name && winner.time !== undefined) {  // تحقق من وجود القيم
                let taskItem = document.createElement("div");
                taskItem.classList.add("task-item");
                taskItem.classList.add("container");
                taskItem.innerHTML = `<span> Winner: ${winner.name}</span>    <span>Score: ${winner.time}</span>`;
                
                tasksSection.appendChild(taskItem);
            }
        });
        showConfetti();

        messageArea.innerHTML = `You win score: <span>${score}</span> <p>Click "Ctrl" for Reload</p> `;
        
        // if (numberOfHints === 2) {
        //     // messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;
        // }

        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        getHintButton.disabled = true;
        guessButton.disabled = true;
        
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => input.disabled = true);
        
        currentTry++;
        
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => input.disabled = false);
        
        let el = document.querySelector(`.try-${currentTry}`);
        
        if (el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose The word is <span>${wordToGuess}</span> <p>Click "Ctrl" for Reload</p>`;
            playSound(document.getElementById("over"));
        }
    }
    if (guessButton.disabled) {
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Control') {
                location.reload();
            }
            if (event.key === 'r' && event.altKey) {
                window.localStorage.clear();
                location.reload();
            }
        })
    }
};
// ************************************************
document.addEventListener("DOMContentLoaded", function () {
    let tasksSection = document.querySelector(".tasks");
    
    // استرجاع بيانات الفائزين من localStorage
    let winners = JSON.parse(localStorage.getItem("winners")) || [];
    
    // ترتيب الفائزين بناءً على الوقت المتبقي من الأعلى إلى الأدنى
    winners.sort((a, b) => b.time - a.time);
    
    // عرض أعلى 5 فائزين فقط
    winners.slice(0, 5).forEach(winner => {
        if (winner && winner.name && winner.time !== undefined) {  // تحقق من وجود القيم
            let taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.classList.add("container");
            taskItem.innerHTML = `<span> Winner: ${winner.name}</span>    <span>Score: ${winner.time}</span>  `;
            
            tasksSection.appendChild(taskItem);
        }
    });
    });
// ************************************************

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
        playSound(document.getElementById("input-sound"));
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        playSound(document.getElementById("move"));
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = ""
            prevInput.focus();
        }
    }
}
document.addEventListener("keydown", handleBackspace);

function showConfetti() {
    
    var d = 15 * 1000;
    var animationEnd = Date.now() + d;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / d);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // ****************************************************
    var end = Date.now() + (15 * 1000);

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// ******************************************************
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    document.getElementById("timer").textContent = minutes + ":" + seconds;

    timeLeft--;

    if (timeLeft < 0 ) {
        clearInterval(stopTimer);
        document.getElementById("timer").textContent = " Time Over !";
    }
};

if (document.querySelector(".control-buttons span")) {
    document.addEventListener('keydown', function (event) {

        if (event.key === 'Enter') {

            let button = document.querySelector(".control-buttons span");

            if (button) {
                button.click();
                playSound(document.getElementById("input-sound"));
            }
        }
    })
};

document.querySelector(".control-buttons span").onclick = function () {

    playSound(document.getElementById("input-sound"));
    let yourName = prompt(" Enter your Name or Cancele ");

    if (yourName == null || yourName == "") {
        document.querySelector(".name span").innerHTML = "Unknown";
    } else {
        document.querySelector(".name span").innerHTML = yourName;
    }
    generateInputs();
    document.getElementById("start").play();
    document.querySelector(".control-buttons").remove();
    document.querySelector(".inputs").children[0].children[1].focus();

    stopTimer = setInterval(updateTimer, 1000);

    document.addEventListener('keydown', function(event) {
        // التحقق مما إذا كان المفتاح المضغوط هو "Enter"
        if (event.key === 'Enter') {
          // البحث عن الزر بالـ id الخاص به
        let button = document.getElementById('check');
          // إذا كان الزر موجودًا، يتم محاكاة الضغط عليه
        if (button) {
            button.click();
            playSound(document.getElementById("input-sound"));
        }
        }
        if (event.key === 'Control') {
            // البحث عن الزر بالـ id الخاص به
        let button = document.getElementById('hint');
            // إذا كان الزر موجودًا، يتم محاكاة الضغط عليه
        if (button) {
            button.click();
            playSound(document.getElementById("input-sound"));
        }
        }
    });
};
// ****************************************************************
//  سحب متغير من السى اس اس واضافته فى الجافا والتعديل عليه وارجاعه فى متغير جديد يمكن استخدامه فى سى اس اس
function hexToRgb(hex) {
    // إزالة الهاش # إذا كانت موجودة
    hex = hex.replace(/^#/, '');

    // تحويل اللون إلى رقم صحيح
    let bigint = parseInt(hex, 16);

    // استخراج قيم RGB
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `${r} ${g} ${b} / 20%`;
}

  // استدعاء متغير CSS
let root = document.documentElement;
let primaryColorHex = getComputedStyle(root).getPropertyValue('--primary-color').trim();

// تحويل اللون من Hex إلى RGB

let primaryColorRgb = hexToRgb(primaryColorHex);

// إنشاء متغير جديد في CSS مع القيمة الجديدة
root.style.setProperty('--primary-color-rgb', `rgb(${primaryColorRgb})`);

// يمكنك الآن استخدام المتغير الجديد في CSS
getComputedStyle(root).getPropertyValue('--primary-color-rgb');
// ******************************************************************
function playSound(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
};