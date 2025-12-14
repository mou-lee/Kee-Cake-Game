const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");

let score = 0;
let timeLeft = 30;
let basketX = 120;

document.addEventListener("keydown", (e) => {
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

    // Catch logic
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

    // Missed
    if (cakeY > 400) {
      score -= 5;
      scoreEl.innerText = score;
      cake.remove();
      clearInterval(fall);
    }
  }, 50);
}

const cakeInterval = setInterval(createCake, 1000);

const timer = setInterval(() => {
  timeLeft--;
  timeEl.innerText = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timer);
    clearInterval(cakeInterval);
    endGame();
  }
}, 1000);

function endGame() {
  resultEl.classList.remove("hidden");

  if (score >= 50) {
    resultEl.innerHTML = `
      🎉 You Win! <br/>
      Coupon Code: <b>CAKE20</b> 🍰
    `;
  } else {
    resultEl.innerHTML = `
      😄 Better Luck Next Time <br/>
      Coupon Code: <b>CAKE5</b>
    `;
  }
}
