(function () {
  const swimArea = document.createElement("div");
  swimArea.className = "swim-container";
  swimArea.setAttribute("aria-hidden", "true");
  document.body.appendChild(swimArea);

  const maxFish = 8;
  const spawnInterval = 2800;
  const imgSrc = "鯛焼きフリー.png";

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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taiyaki-quiz");
  const helper = document.getElementById("quiz-helper");
  const resultBox = document.getElementById("quiz-result");
  const resultTitle = resultBox?.querySelector(".result-title");
  const resultDesc = resultBox?.querySelector(".result-desc");
  const resultStore = resultBox?.querySelector(".result-store");
  const resetButton = document.getElementById("quiz-reset");

  if (!form || !resultBox || !resultTitle || !resultDesc || !resultStore) return;

  const outcomes = {
    hot: {
      title: "ほかほか鯛",
      desc: "焼きたて命。香ばしい瞬間を逃さないあなたに。",
      store: "できたて提供の屋台・実演販売店でどうぞ。",
    },
    mochi: {
      title: "包容力モッチリ鯛",
      desc: "外カリ中モチ厚皮派。どっしり満足感がほしいタイプ。",
      store: "厚め生地の老舗たい焼き専門店。",
    },
    seasonal: {
      title: "季節追いかけ鯛",
      desc: "限定フレーバー巡りが性に合う冒険派。",
      store: "季節餡や変わり種が多いチェーン（抹茶・さつまいも・栗など）。",
    },
    classic: {
      title: "きっちり定番鯛",
      desc: "王道こそ正義。ブレない一本筋タイプ。",
      store: "薄皮×小豆一本勝負の老舗。",
    },
    share: {
      title: "おすそ分け鯛",
      desc: "箱買い・手土産が似合うシェア上手。",
      store: "個包装が丁寧な和菓子系たい焼き店。",
    },
    salty: {
      title: "塩見の効いた鯛",
      desc: "甘さ控えめでバランス重視。",
      store: "十勝産小豆や塩バター餡の専門店。",
    },
    light: {
      title: "サクふわ中庸鯛",
      desc: "軽めにサクッと楽しみたい。",
      store: "クロワッサンたい焼き系カフェ。",
    },
    mini: {
      title: "冒険小さめ鯛",
      desc: "小回りの利く変わり種を一つ。",
      store: "チーズ・カレー・明太マヨなど総菜系たい焼き店。",
    },
    steady: {
      title: "慎重ほっとり鯛",
      desc: "まずは一番人気を押さえる慎重派。",
      store: "行列の定番店でまずは粒あん。",
    },
    cool: {
      title: "冷静しっぽ鯛",
      desc: "実はそこまで甘党じゃないかも。",
      store: "白餡・こし餡の軽め、もしくは最中・鯛せんべい系の専門店。",
    },
  };

  function pickOutcome(answers) {
    const yesCount = answers.filter(Boolean).length;
    const [q1, q2, q3, q4, q5] = answers;

    if (yesCount === 5) return outcomes.hot;
    if (yesCount === 4) return outcomes.mochi;
    if (yesCount === 3) {
      if (q1 || q4) return outcomes.seasonal;
      return outcomes.classic;
    }
    if (yesCount === 2) {
      if (q2 && q5) return outcomes.share;
      if (!q2 && q3) return outcomes.salty;
      return outcomes.light;
    }
    if (yesCount === 1) {
      if (q1) return outcomes.mini;
      return outcomes.steady;
    }
    return outcomes.cool;
  }

  function updatePillState(name) {
    const group = form.querySelectorAll(`input[name="${name}"]`);
    group.forEach((input) => {
      const pill = input.closest(".pill-option");
      if (pill) pill.classList.toggle("active", input.checked);
    });
  }

  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.name.startsWith("q")) return;
    updatePillState(target.name);
    helper.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = [];

    for (let i = 1; i <= 5; i += 1) {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        helper.textContent = `Q${i}が未回答です`;
        resultBox.setAttribute("data-empty", "true");
        return;
      }
      answers.push(selected.value === "yes");
    }

    helper.textContent = "";
    const outcome = pickOutcome(answers);
    resultTitle.textContent = `あなたは「${outcome.title}」`;
    resultDesc.textContent = outcome.desc;
    resultStore.textContent = `おすすめ店：${outcome.store}`;
    resultBox.removeAttribute("data-empty");
    resultBox.classList.add("result-on");
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    helper.textContent = "";
    form.querySelectorAll(".pill-option").forEach((pill) => pill.classList.remove("active"));
    resultTitle.textContent = "診断を始めましょう";
    resultDesc.textContent = "◯ / ✕ を選んで「診断する」を押すと、ぴったりなたい焼きタイプとお店のヒントが表示されます。";
    resultStore.textContent = "おすすめ店：まだ未診断です";
    resultBox.setAttribute("data-empty", "true");
  });
});

// --- Taiyaki Shooting Game ---
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("taiyaki-game");
  const startBtn = document.getElementById("game-start");
  const resetBtn = document.getElementById("game-reset");
  const scoreEl = document.getElementById("game-score");
  const livesEl = document.getElementById("game-lives");
  const waveEl = document.getElementById("game-wave");

  if (!canvas || !startBtn || !resetBtn || !scoreEl || !livesEl || !waveEl) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const images = {
    player: "鯛焼きフリー.png",
    cream: "シュークリーム.png",
    shortcake: "ショートケーキ.png",
    ice: "アイスクリーム２.png",
    bg: "空.png",
  };

  const imgCache = new Map();
  Object.entries(images).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    imgCache.set(key, img);
  });

  const keys = new Set();
  const bullets = [];
  const enemies = [];

  const state = {
    running: false,
    lastTime: 0,
    score: 0,
    lives: 3,
    wave: 1,
    spawnTimer: 0,
  };

  const player = {
    x: width / 2,
    y: height - 80,
    w: 68,
    h: 52,
    speed: 300,
    fireCooldown: 0,
  };

  function resetGame() {
    state.running = false;
    state.lastTime = 0;
    state.score = 0;
    state.lives = 3;
    state.wave = 1;
    state.spawnTimer = 0;
    bullets.length = 0;
    enemies.length = 0;
    player.x = width / 2;
    player.fireCooldown = 0;
    renderHUD();
    clearCanvas();
    drawStartMessage();
  }

  function renderHUD() {
    scoreEl.textContent = state.score.toString();
    livesEl.textContent = state.lives.toString();
    waveEl.textContent = state.wave.toString();
  }

  function clearCanvas() {
    const bg = imgCache.get("bg");
    if (bg?.complete && bg.naturalWidth > 0) {
      ctx.drawImage(bg, 0, 0, width, height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = "rgba(7, 10, 20, 0.9)";
      ctx.fillRect(0, 0, width, height);
    }
  }

  function drawStartMessage() {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#fef3c7";
    ctx.font = "24px 'M PLUS 1p', 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("スペース / クリック / タップで射撃", width / 2, height / 2 - 10);
    ctx.fillText("スタートでたい焼きが出撃します", width / 2, height / 2 + 24);
  }

  function spawnEnemy() {
    const sprites = ["cream", "shortcake", "ice"];
    const kind = sprites[Math.floor(Math.random() * sprites.length)];
    const img = imgCache.get(kind);
    const size = 60;
    const speed = 70 + Math.random() * 40 + state.wave * 5;
    const x = Math.random() * (width - size) + size / 2;
    enemies.push({ x, y: -size, w: size, h: size, speed, kind, img });
  }

  function fire() {
    if (player.fireCooldown > 0) return;
    bullets.push({ x: player.x, y: player.y - player.h / 2, r: 7, speed: 520 });
    player.fireCooldown = 0.18;
  }

  function update(dt) {
    const moveDir = (keys.has("ArrowRight") || keys.has("d")) - (keys.has("ArrowLeft") || keys.has("a"));
    player.x += moveDir * player.speed * dt;
    player.x = Math.max(player.w / 2, Math.min(width - player.w / 2, player.x));

    if (player.fireCooldown > 0) player.fireCooldown -= dt;
    if (keys.has(" ") || keys.has("Space")) fire();

    bullets.forEach((b) => {
      b.y -= b.speed * dt;
    });
    while (bullets.length && bullets[0].y < -20) bullets.shift();

    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnEnemy();
      state.spawnTimer = Math.max(0.4, 1.2 - state.wave * 0.05);
    }

    enemies.forEach((e) => {
      e.y += e.speed * dt;
    });

    // collisions
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const e = enemies[i];
      for (let j = bullets.length - 1; j >= 0; j -= 1) {
        const b = bullets[j];
        if (Math.abs(e.x - b.x) < e.w / 2 && Math.abs(e.y - b.y) < e.h / 2) {
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          state.score += 10;
          if (state.score % 80 === 0) state.wave += 1;
          renderHUD();
          break;
        }
      }
    }

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const e = enemies[i];
      if (e.y - e.h / 2 > height) {
        enemies.splice(i, 1);
        state.lives -= 1;
        if (state.lives <= 0) {
          gameOver();
          return;
        }
        renderHUD();
      }
    }
  }

  function draw() {
    clearCanvas();
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.08)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#6b3f28";
    bullets.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    enemies.forEach((e) => {
      if (e.img?.complete) {
        ctx.drawImage(e.img, e.x - e.w / 2, e.y - e.h / 2, e.w, e.h);
      } else {
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h);
      }
    });

    const pImg = imgCache.get("player");
    if (pImg?.complete) {
      ctx.drawImage(pImg, player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
    } else {
      ctx.fillStyle = "#f4c27a";
      ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
    }

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(0, height - 6, width, 6);
  }

  function loop(timestamp) {
    if (!state.running) return;
    const delta = (timestamp - state.lastTime) / 1000 || 0;
    state.lastTime = timestamp;
    update(delta);
    draw();
    requestAnimationFrame(loop);
  }

  function gameOver() {
    state.running = false;
    renderHUD();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#fef3c7";
    ctx.font = "26px 'M PLUS 1p', 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", width / 2, height / 2 - 10);
    ctx.fillText(`Score: ${state.score}`, width / 2, height / 2 + 24);
  }

  function toggleStart() {
    state.running = !state.running;
    if (state.running) {
      state.lastTime = performance.now();
      requestAnimationFrame(loop);
    } else {
      startBtn.blur();
    }
  }

  startBtn.addEventListener("click", () => {
    if (state.lives <= 0) resetGame();
    toggleStart();
  });

  resetBtn.addEventListener("click", resetGame);

  window.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "a", "d", " "].includes(e.key)) {
      e.preventDefault();
      keys.add(e.key === " " ? "Space" : e.key);
    }
    if (e.key === " " || e.key === "Spacebar") fire();
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key === " " ? "Space" : e.key);
  });

  ["click", "touchstart"].forEach((eventName) => {
    canvas.addEventListener(eventName, (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const clientX = eventName === "touchstart" ? e.touches[0].clientX : e.clientX;
      const targetX = ((clientX - rect.left) / rect.width) * width;
      player.x = targetX;
      fire();
    });
  });

  resetGame();
});
