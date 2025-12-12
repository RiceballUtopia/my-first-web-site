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
  const resultImage = document.getElementById("result-image");
  const resetButton = document.getElementById("quiz-reset");

  if (!form || !resultBox || !resultTitle || !resultDesc || !resultStore || !resultImage) return;

  const makeAnimalWithHat = ({ fur, earType, cheek, accent, eye, nose, hatBase, hatTail }) => {
    const ears = (() => {
      switch (earType) {
        case "cat":
          return `<path fill="${fur}" stroke="${eye}" stroke-width="1" d="M40 36 50 12 60 38Z"/><path fill="${fur}" stroke="${eye}" stroke-width="1" d="M80 36 70 12 60 38Z"/>`;
        case "bear":
          return `<circle cx="44" cy="24" r="10" fill="${fur}" stroke="${eye}" stroke-width="1"/><circle cx="76" cy="24" r="10" fill="${fur}" stroke="${eye}" stroke-width="1"/>`;
        case "rabbit":
          return `<ellipse cx="44" cy="16" rx="7" ry="16" fill="${fur}" stroke="${eye}" stroke-width="1"/><ellipse cx="76" cy="16" rx="7" ry="16" fill="${fur}" stroke="${eye}" stroke-width="1"/>`;
        case "dog":
          return `<path fill="${fur}" stroke="${eye}" stroke-width="1" d="M36 26 q-12 8 -6 20 q12-2 18-10Z"/><path fill="${fur}" stroke="${eye}" stroke-width="1" d="M84 26 q12 8 6 20 q-12-2 -18-10Z"/>`;
        case "panda":
          return `<circle cx="44" cy="24" r="11" fill="${eye}"/><circle cx="76" cy="24" r="11" fill="${eye}"/>`;
        case "penguin":
          return ``;
        case "fox":
          return `<path fill="${fur}" stroke="${eye}" stroke-width="1" d="M38 38 50 12 60 34Z"/><path fill="${fur}" stroke="${eye}" stroke-width="1" d="M82 38 70 12 60 34Z"/>`;
        case "hamster":
          return `<circle cx="44" cy="24" r="9" fill="${fur}" stroke="${eye}" stroke-width="1"/><circle cx="76" cy="24" r="9" fill="${fur}" stroke="${eye}" stroke-width="1"/>`;
        case "tanuki":
          return `<path fill="${fur}" stroke="${eye}" stroke-width="1" d="M38 32 q4-10 12-12 q-4 12 -2 20Z"/><path fill="${fur}" stroke="${eye}" stroke-width="1" d="M82 32 q-4-10 -12-12 q4 12 2 20Z"/>`;
        case "owl":
          return `<path fill="${fur}" stroke="${eye}" stroke-width="1" d="M40 36 50 18 60 34Z"/><path fill="${fur}" stroke="${eye}" stroke-width="1" d="M80 36 70 18 60 34Z"/>`;
        default:
          return ``;
      }
    })();

    const hat = `<g transform="translate(28 4) scale(0.65)"><path fill="${hatBase}" d="M10 20c0-8 10-16 26-16 10 0 20 4 26 10l-7 7 7 7C49 34 39 38 29 38 13 38 10 28 10 20Z"/><path fill="${hatTail}" d="M10 20 0 12v16z"/><path fill="${hatTail}" d="M30 10c4-1 12-3 16 0 1 1-10 4-14 4s-6-3-2-4Z"/><circle cx="44" cy="18" r="4" fill="${eye}" opacity=".9"/><circle cx="42.5" cy="17" r="1.5" fill="#fff" opacity=".9"/></g>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" role="img" aria-hidden="true"><rect width="120" height="100" rx="16" fill="rgba(255,255,255,0)"/><g>${ears}<circle cx="60" cy="52" r="32" fill="${fur}" stroke="${eye}" stroke-width="1.5"/><circle cx="48" cy="46" r="8" fill="${cheek}" opacity=".8"/><circle cx="72" cy="46" r="8" fill="${cheek}" opacity=".8"/><circle cx="48" cy="44" r="4" fill="${eye}"/><circle cx="72" cy="44" r="4" fill="${eye}"/><circle cx="50" cy="43" r="1.2" fill="#fff" opacity=".9"/><circle cx="74" cy="43" r="1.2" fill="#fff" opacity=".9"/><circle cx="60" cy="56" r="3" fill="${nose}" stroke="${eye}" stroke-width="1"/><path d="M56 60 q4 5 8 0" stroke="${eye}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M56 62 q4 4 8 0" stroke="${eye}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M60 38 q6-2 10 2" stroke="${accent}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M60 38 q-6-2 -10 2" stroke="${accent}" stroke-width="1.5" fill="none" stroke-linecap="round"/>${hat}</g></svg>`;
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
    return `data:image/svg+xml,${encoded}`;
  };

  const outcomes = {
    hot: {
      title: "ほかほか鯛",
      desc: "焼きたて命。香ばしい瞬間を逃さないあなたに。",
      store: "できたて提供の屋台・実演販売店でどうぞ。",
      img: makeAnimalWithHat({ fur: "#f6d7a7", earType: "cat", cheek: "#f97373", accent: "#eab308", eye: "#1f1a16", nose: "#ef4444", hatBase: "#f4c27a", hatTail: "#e39644" }),
    },
    mochi: {
      title: "包容力モッチリ鯛",
      desc: "外カリ中モチ厚皮派。どっしり満足感がほしいタイプ。",
      store: "厚め生地の老舗たい焼き専門店。",
      img: makeAnimalWithHat({ fur: "#d5b99b", earType: "bear", cheek: "#f472b6", accent: "#b45309", eye: "#2c2218", nose: "#4b5563", hatBase: "#d3b48c", hatTail: "#b88c5c" }),
    },
    seasonal: {
      title: "季節追いかけ鯛",
      desc: "限定フレーバー巡りが性に合う冒険派。",
      store: "季節餡や変わり種が多いチェーン（抹茶・さつまいも・栗など）。",
      img: makeAnimalWithHat({ fur: "#c5efd3", earType: "rabbit", cheek: "#ef4444", accent: "#16a34a", eye: "#0f172a", nose: "#0ea5e9", hatBase: "#b7e3c0", hatTail: "#7acdb5" }),
    },
    classic: {
      title: "きっちり定番鯛",
      desc: "王道こそ正義。ブレない一本筋タイプ。",
      store: "薄皮×小豆一本勝負の老舗。",
      img: makeAnimalWithHat({ fur: "#f3e0b2", earType: "dog", cheek: "#fb7185", accent: "#9a3412", eye: "#2c2218", nose: "#f97316", hatBase: "#f1d9a9", hatTail: "#d2a45c" }),
    },
    share: {
      title: "おすそ分け鯛",
      desc: "箱買い・手土産が似合うシェア上手。",
      store: "個包装が丁寧な和菓子系たい焼き店。",
      img: makeAnimalWithHat({ fur: "#f8f1ea", earType: "panda", cheek: "#fbbf24", accent: "#7c2d12", eye: "#111827", nose: "#111827", hatBase: "#f8d7c0", hatTail: "#f0a97a" }),
    },
    salty: {
      title: "塩見の効いた鯛",
      desc: "甘さ控えめでバランス重視。",
      store: "十勝産小豆や塩バター餡の専門店。",
      img: makeAnimalWithHat({ fur: "#e2ecf7", earType: "penguin", cheek: "#7dd3fc", accent: "#2563eb", eye: "#0b1423", nose: "#1f2937", hatBase: "#cddff0", hatTail: "#9ab7d6" }),
    },
    light: {
      title: "サクふわ中庸鯛",
      desc: "軽めにサクッと楽しみたい。",
      store: "クロワッサンたい焼き系カフェ。",
      img: makeAnimalWithHat({ fur: "#ffeec4", earType: "fox", cheek: "#f9a8d4", accent: "#f97316", eye: "#2c2218", nose: "#f97316", hatBase: "#ffe8b5", hatTail: "#ffc266" }),
    },
    mini: {
      title: "冒険小さめ鯛",
      desc: "小回りの利く変わり種を一つ。",
      store: "チーズ・カレー・明太マヨなど総菜系たい焼き店。",
      img: makeAnimalWithHat({ fur: "#e4f6ff", earType: "hamster", cheek: "#f97373", accent: "#0ea5e9", eye: "#0f172a", nose: "#f59e0b", hatBase: "#d4f1ff", hatTail: "#9fd7ff" }),
    },
    steady: {
      title: "慎重ほっとり鯛",
      desc: "まずは一番人気を押さえる慎重派。",
      store: "行列の定番店でまずは粒あん。",
      img: makeAnimalWithHat({ fur: "#e9d9c7", earType: "tanuki", cheek: "#fecdd3", accent: "#92400e", eye: "#241b14", nose: "#92400e", hatBase: "#eed9c4", hatTail: "#d5b49f" }),
    },
    cool: {
      title: "冷静しっぽ鯛",
      desc: "実はそこまで甘党じゃないかも。",
      store: "白餡・こし餡の軽め、もしくは最中・鯛せんべい系の専門店。",
      img: makeAnimalWithHat({ fur: "#e3e8f0", earType: "owl", cheek: "#bfdbfe", accent: "#475569", eye: "#0f172a", nose: "#0f172a", hatBase: "#dce4ed", hatTail: "#aebcc9" }),
    },
  };

  const defaultImage = outcomes.hot.img;

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
    resultImage.src = outcome.img;
    resultImage.alt = `${outcome.title}のキャラクター`;
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
    resultImage.src = defaultImage;
    resultImage.alt = "たい焼きタイプのキャラクター";
    resultBox.setAttribute("data-empty", "true");
  });

  resultImage.src = defaultImage;
});
