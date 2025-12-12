(function () {
  const swimArea = document.createElement("div");
  swimArea.className = "swim-container";
  swimArea.setAttribute("aria-hidden", "true");
  document.body.appendChild(swimArea);

  const maxFish = 4;
  const spawnInterval = 4200;
  const imgSrc = "鯛焼き1匹.jpg";

  const rand = (min, max) => Math.random() * (max - min) + min;

  function spawnFish() {
    if (!swimArea.isConnected) return;
    if (swimArea.children.length >= maxFish) return;

    const fish = document.createElement("img");
    fish.src = imgSrc;
    fish.alt = "";
    fish.loading = "lazy";
    fish.className = "taiyaki";

    const scale = rand(0.65, 1.05);
    const duration = rand(14, 24);
    const delay = rand(0, 5);
    const top = rand(12, 78);
    const drift = rand(-10, 10);
    const reverse = Math.random() > 0.5;

    fish.style.setProperty("--swim-scale", scale.toFixed(2));
    fish.style.setProperty("--swim-duration", `${duration}s`);
    fish.style.setProperty("--swim-delay", `${delay}s`);
    fish.style.setProperty("--drift", `${drift}px`);
    fish.style.top = `${top}vh`;
    fish.classList.toggle("reverse", reverse);

    fish.addEventListener("animationend", () => fish.remove());
    swimArea.appendChild(fish);
  }

  for (let i = 0; i < 3; i += 1) {
    setTimeout(spawnFish, i * 800);
  }

  setInterval(spawnFish, spawnInterval);
})();
