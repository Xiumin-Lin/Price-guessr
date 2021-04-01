
const box = document.getElementById("box");
const itemName = document.getElementById("name");
const itemImg = document.getElementById("img");
const user_price = document.getElementById("user_price");
const max_page = 501;
let correctPrice = 0;

const urlPrice =  "https://www.cheapshark.com/api/1.0/deals"; 
function play(){
    console.log("Start game !") //TODO
    document.getElementById("play").hidden = true;
    let page = 2//getRandomNumber(0, max_page);
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
    itemName.innerText = item["title"];
    itemImg.src = item["thumb"];
    correctPrice = item["salePrice"];
    box.hidden = false;
}

function checkPrice(price) {
    return price.localeCompare(correctPrice);
}

const maxScorePerQuestion = 100;
const max_attempt = 3;
let user_attempt = 0;
const nbGame = document.getElementById("nbGame");
const final_score = document.getElementById("final_score");

function getQuestionScore() {
    return Math.floor((maxScorePerQuestion - user_attempt*10) - Math.abs(parseInt(correctPrice) - user_price.valueAsNumber));
}

const answer = document.getElementById("answer");
function guess(){
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
    if(user_attempt === max_attempt || isCorrect){
        score = getQuestionScore();
        answer.innerText = `Correct answer is ${correctPrice} ! You won ${score}/${maxScorePerQuestion} point(s)`;
        nbGame.innerText = parseInt(nbGame.innerText) + 1;
        final_score.innerText = parseInt(final_score.innerText) + score;
        user_attempt = 0;
        play();
    }
    user_price.value = "";
}