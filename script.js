const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

let score = 0;
let timeLeft = 30;
let basketX = 120;
let cakeInterval;
let timer;
let gameRunning = false;
let gameFinished = localStorage.getItem("gameFinished") === "true";


document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && basketX > 0) basketX -= 20;
  if (e.key === "ArrowRight" && basketX < 240) basketX += 20;
  basket.style.left = basketX + "px";
});

function createCake() {
  const cake = document.createElement("div");
  cake.classList.add("cake");
  cake.innerText = "🍰";
  cake.style.left = Math.random() * 260 + "px";
  gameArea.appendChild(cake);

  let cakeY = 0;
  const fall = setInterval(() => {
    cakeY += 5;
    cake.style.top = cakeY + "px";

    if (
      cakeY > 330 &&
      parseInt(cake.style.left) > basketX - 20 &&
      parseInt(cake.style.left) < basketX + 40
    ) {
      score += 10;
      scoreEl.innerText = score;
      cake.remove();
      clearInterval(fall);
    }

    if (cakeY > 400) {
      score -= 5;
      scoreEl.innerText = score;
      cake.remove();
      clearInterval(fall);
    }
  }, 50);
}

function startGame() {
  startBtn.disabled = true;

  cakeInterval = setInterval(createCake, 1000);

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      clearInterval(cakeInterval);
      gameRunning = false;
      endGame();
    }
  }, 1000);
}

function endGame() {
  startBtn.style.display = "none";
  resultEl.classList.remove("hidden");

  let offerText = "";

  if (score >= 300) {
    offerText = "🎉 20% OFF";
  } else if (score >= 200) {
    offerText = "🔥 15% OFF";
  } else if (score >= 100) {
    offerText = "😎 10% OFF";
  } else {
    offerText = "🙂 5% OFF";
  }

  resultEl.innerHTML = `
    🎂 Game Over! <br/>
    Your Score: <b>${score}</b><br/><br/>
    Coupon: <b>${offerText}</b>
  `;
}



startBtn.addEventListener("click", startGame);
