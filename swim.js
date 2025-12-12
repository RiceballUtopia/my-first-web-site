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
