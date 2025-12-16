const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

/* ==========================
   SPEED CONTROLS (EDIT THESE)
========================== */
const KEYBOARD_SPEED = 10;   // arrow key speed
const DRAG_SPEED = 0.10;     // basket smoothness (0.1 = slow, 0.25 = fast)
const CAKE_FALL_SPEED = 10;   // cake falling speed

let score = 0;
let timeLeft = 30;
let basketX = 120;
let cakeInterval;
let timer;
let gameRunning = false;

/* ==========================
   KEYBOARD CONTROL
========================== */
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") basketX -= KEYBOARD_SPEED;
  if (e.key === "ArrowRight") basketX += KEYBOARD_SPEED;

  basketX = Math.max(
    0,
    Math.min(gameArea.clientWidth - basket.offsetWidth, basketX)
  );

  basket.style.left = basketX + "px";
});

/* ==========================
   DESKTOP MOUSE DRAG
========================== */
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
  let targetX = e.clientX - gameRect.left - basket.offsetWidth / 2;

  targetX = Math.max(
    0,
    Math.min(gameArea.clientWidth - basket.offsetWidth, targetX)
  );

  basketX += (targetX - basketX) * DRAG_SPEED;
  basket.style.left = basketX + "px";
});

/* ==========================
   MOBILE TOUCH DRAG
========================== */
basket.addEventListener("touchstart", (e) => {
  if (!gameRunning) return;
  e.preventDefault();
});

basket.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  e.preventDefault();

  const touch = e.touches[0];
  const gameRect = gameArea.getBoundingClientRect();

  let targetX = touch.clientX - gameRect.left - basket.offsetWidth / 2;

  targetX = Math.max(
    0,
    Math.min(gameArea.clientWidth - basket.offsetWidth, targetX)
  );

  basketX += (targetX - basketX) * DRAG_SPEED;
  basket.style.left = basketX + "px";
});

/* ==========================
   CAKE LOGIC (ACCURATE HIT)
========================== */
function createItem() {
  const isBomb = Math.random() < 0.2; // 20% bomb chance
  const item = document.createElement("div");

  item.classList.add(isBomb ? "bomb" : "cake");
  item.innerText = isBomb ? "💣" : "🍫";

  item.style.left =
    Math.random() * (gameArea.clientWidth - 30) + "px";
  item.style.top = "0px";

  gameArea.appendChild(item);

  let itemY = 0;

  const fall = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fall);
      item.remove();
      return;
    }

    itemY += CAKE_FALL_SPEED;
    item.style.top = itemY + "px";

    const itemRect = item.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    // COLLISION
    if (
      itemRect.bottom >= basketRect.top &&
      itemRect.left < basketRect.right &&
      itemRect.right > basketRect.left
    ) {
      clearInterval(fall);
      item.remove();

      // 💣 BOMB HIT
      if (isBomb) {
        gameRunning = false;
        clearInterval(timer);
        clearInterval(cakeInterval);
        endGame(); // final score remains
        return;
      }

      // 🍰 CAKE HIT
      score += 10;
      scoreEl.innerText = score;
      return;
    }

    // MISSED ITEM
    if (itemY > gameArea.clientHeight) {
      if (!isBomb) {
        score -= 5;
        scoreEl.innerText = score;
      }
      clearInterval(fall);
      item.remove();
    }
  }, 50);
}


/* ==========================
   START GAME
========================== */
function startGame() {
  score = 0;
  timeLeft = 30;
  basketX = (gameArea.clientWidth - basket.offsetWidth) / 2;

  scoreEl.innerText = score;
  timeEl.innerText = timeLeft;
  basket.style.left = basketX + "px";

  gameRunning = true;
  startBtn.disabled = true;

  cakeInterval = setInterval(createItem, 500);

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

/* ==========================
   END GAME
========================== */
function endGame() {
  startBtn.style.display = "none";
  resultEl.classList.remove("hidden");

  let offerText = "";
  let messageText = "";

  if (score >= 200) {
    offerText = "🎉 20% OFF";
    messageText = "Awesome! You did great 🎊";
  } else if (score >= 150) {
    offerText = "🔥 15% OFF";
    messageText = "Great job! Keep it up 👏";
  } else if (score >= 100) {
    offerText = "😎 10% OFF";
    messageText = "Nice try! Well played 🙂";
  } else {
    offerText = "🙂 5% OFF";
    messageText =
      "Sorry, you lost 😔<br/>But as our valued customer, we are giving you a <b>5% OFF</b> coupon 💖";
  }

  resultEl.innerHTML = `
    🎂 Game Over! <br/><br/>
    ${messageText}<br/><br/>
    Your Score: <b>${score}</b><br/><br/>
    Coupon: <b>${offerText}</b>
  `;
}


startBtn.addEventListener("click", startGame);
