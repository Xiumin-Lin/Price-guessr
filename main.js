const answer = document.getElementById("answer");
const attempts = document.getElementById("attempts");
const box = document.getElementById("box");
const final_score = document.getElementById("final_score");
const itemImg = document.getElementById("img");
const itemName = document.getElementById("name");
const maxScorePerQuestion = 100;
const max_aaa_page = 25;
const max_attempt = 3;
const max_page = 50; //if filter for aaa is disable
const nbGame = document.getElementById("nbGame");
const urlPrice =  "https://www.cheapshark.com/api/1.0/deals";
const user_price = document.getElementById("user_price");
let correctPrice = 0;
let user_attempt = 0;

function play(){
    console.log("Start game !") //TODO
    document.getElementById("play").hidden = true;
    page = getRandomNumber(0, max_aaa_page);

    console.log("page", page); //TODO
    // fetch
    fetch(`${urlPrice}?storeID=1&pageNumber=${page}&AAA=1`)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        console.log("Data :", data); //TODO
        loadData(data);
    })
    sessionStorage.setItem("final_score", final_score.innerText);
    sessionStorage.setItem("nbGame", nbGame.innerText);

    // const urlSteam =  "https://store.steampowered.com/api/appdetails"
    // let gameSteamID; //637090
    // fetch(`${urlSteam}?appids=${gameSteamID}`)
    // .then(function(res){
    //     return res.json();
    // })
    // .then(function(data){
    //     document.getElementById("res").innerText = JSON.stringify(data, null, 4);
    //     console.log(data);
    // })
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomItem(data) {
    let idx = getRandomNumber(0, data.length)
    let item = data[idx];
    return item;
}

function loadData(data){
    let item = getRandomItem(data);
    console.log(item) //TODO
    // document.getElementById("res").innerText = JSON.stringify(item, null, 4); //TODO
    setQuiz(item);
    setSessionGameItem(item);
}

function setQuiz(item){
    itemName.innerText = item["title"];
    itemImg.src = item["thumb"];
    correctPrice = Math.round(parseFloat(item["salePrice"]));
    box.hidden = false;
}

function checkPrice(price) {
    return price.localeCompare(correctPrice);
}

function getQuestionScore() {
    let score = Math.round((maxScorePerQuestion - user_attempt*10) - Math.abs(correctPrice - user_price.valueAsNumber));
    return (score >= 0)? score : 0;
}

function getAttemptsLeft() {
    return (max_attempt - user_attempt);
}

document.getElementById("guess").addEventListener("submit", (e)=>{
    e.preventDefault();
    guess();
});

function guess(){
    if(user_price.value === "") {
        answer.innerText = "Must be a positive number";
        return
    }
    let isCorrect = false;
    let score = 0;
    switch(checkPrice(user_price.value)) {
        case 1:
            answer.innerText = "Cheaper ! Try again";
            user_attempt++;
            break;
        case 0:
            isCorrect = true;
            break;
        case -1: 
            answer.innerText = "More ! Try again";
            user_attempt++;
            break;
    }

    attempsLeft = getAttemptsLeft();
    attempts.innerText = `You have ${attempsLeft} attempts left`;
    if(user_attempt === max_attempt || isCorrect){
        score = getQuestionScore();
        answer.innerText = `Correct answer is ${correctPrice} ! You won ${score}/${maxScorePerQuestion} point(s)`;
        nbGame.innerText = parseInt(nbGame.innerText) + 1;
        final_score.innerText = parseInt(final_score.innerText) + score;
        console.log("score",score);
        console.log("total",final_score.innerText);
        user_attempt = 0;
        attempts.innerText = '';
        play();
    }
    user_price.value = "";
    sessionStorage.setItem("user_attempt", user_attempt);
}

if(sessionStorage.length){
    if(confirm("Load last game session ?"))
        setLastSession();
    else
        sessionStorage.clear();
}

function setSessionGameItem(item){
    let jsonItem = JSON.stringify(item);
    sessionStorage.setItem("game", jsonItem);
}

function setLastSession(){
    console.log(sessionStorage); //TODO
    document.getElementById("play").hidden = true;
    setQuiz(JSON.parse(sessionStorage.getItem("game")));

    user_attempt = sessionStorage.getItem("user_attempt");
    final_score.innerText = sessionStorage.getItem("final_score");
    nbGame.innerText = sessionStorage.getItem("nbGame");
}