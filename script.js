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

// ==========================
// KEYBOARD CONTROL
// ==========================
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft" && basketX > 0) basketX -= 20;
  if (e.key === "ArrowRight" && basketX < gameArea.clientWidth - basket.offsetWidth) {
    basketX += 20;
  }

  basket.style.left = basketX + "px";
});

// ==========================
// DESKTOP MOUSE DRAG
// ==========================
let isDragging = false;

basket.addEventListener("mousedown", () => {
  if (!gameRunning) return;
  isDragging = true;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging || !gameRunning) return;

  const gameRect = gameArea.getBoundingClientRect();
  let x = e.clientX - gameRect.left - basket.offsetWidth / 2;

  if (x < 0) x = 0;
  if (x > gameArea.clientWidth - basket.offsetWidth) {
    x = gameArea.clientWidth - basket.offsetWidth;
  }

  basketX = x;
  basket.style.left = basketX + "px";
});

// ==========================
// MOBILE TOUCH DRAG
// ==========================
basket.addEventListener("touchstart", (e) => {
  if (!gameRunning) return;
  e.preventDefault();
});

basket.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  e.preventDefault();

  const touch = e.touches[0];
  const gameRect = gameArea.getBoundingClientRect();

  let x = touch.clientX - gameRect.left - basket.offsetWidth / 2;

  if (x < 0) x = 0;
  if (x > gameArea.clientWidth - basket.offsetWidth) {
    x = gameArea.clientWidth - basket.offsetWidth;
  }

  basketX = x;
  basket.style.left = basketX + "px";
});

// ==========================
// CAKE LOGIC
// ==========================
function createCake() {
  const cake = document.createElement("div");
  cake.classList.add("cake");
  cake.innerText = "🍰";
  cake.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
  gameArea.appendChild(cake);

  let cakeY = 0;

  const fall = setInterval(() => {
    cakeY += 5;
    cake.style.top = cakeY + "px";

    if (
      cakeY > 330 &&
      parseInt(cake.style.left) > basketX - 20 &&
      parseInt(cake.style.left) < basketX + basket.offsetWidth
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

// ==========================
// START GAME
// ==========================
function startGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.innerText = score;
  timeEl.innerText = timeLeft;

  gameRunning = true;
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

// ==========================
// END GAME
// ==========================
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
