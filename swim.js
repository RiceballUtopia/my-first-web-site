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

  const makeFishDataUri = ({ body, tail, cheek, eye, mouth }) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" role="img" aria-hidden="true"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${body}" offset="0"/><stop stop-color="${tail}" offset="1"/></linearGradient></defs><path fill="url(#g)" d="M22 40c0-16 18-30 46-30 18 0 36 8 46 18l-12 11 12 11C104 60 86 68 68 68 40 68 22 56 22 40Z"/><path fill="${tail}" d="M22 40 8 28v24z"/><path fill="${tail}" d="M50 22c6-2 18-4 24 0 2 2-14 6-20 6-6 0-8-4-4-6Z"/><circle cx="74" cy="36" r="5.5" fill="${eye}" opacity=".95"/><circle cx="73" cy="35" r="2.5" fill="#fff" opacity=".9"/><circle cx="64" cy="46" r="4" fill="${cheek}" opacity=".9"/><path stroke="${eye}" stroke-width="3" stroke-linecap="round" d="${mouth}"/></svg>`;
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
    return `data:image/svg+xml,${encoded}`;
  };

  const outcomes = {
    hot: { title: "ほかほか鯛", desc: "焼きたて命。香ばしい瞬間を逃さないあなたに。", store: "できたて提供の屋台・実演販売店でどうぞ。", img: makeFishDataUri({ body: "#f4c27a", tail: "#e39644", cheek: "#f97373", eye: "#2c2218", mouth: "M80 48c-4 2-8 2-12 0" }) },
    mochi: { title: "包容力モッチリ鯛", desc: "外カリ中モチ厚皮派。どっしり満足感がほしいタイプ。", store: "厚め生地の老舗たい焼き専門店。", img: makeFishDataUri({ body: "#d3b48c", tail: "#b88c5c", cheek: "#f472b6", eye: "#1f1a16", mouth: "M80 48c-5 4-11 4-16 0" }) },
    seasonal: { title: "季節追いかけ鯛", desc: "限定フレーバー巡りが性に合う冒険派。", store: "季節餡や変わり種が多いチェーン（抹茶・さつまいも・栗など）。", img: makeFishDataUri({ body: "#b7e3c0", tail: "#7acdb5", cheek: "#ef4444", eye: "#0f172a", mouth: "M80 48c-3 4-10 4-14 0" }) },
    classic: { title: "きっちり定番鯛", desc: "王道こそ正義。ブレない一本筋タイプ。", store: "薄皮×小豆一本勝負の老舗。", img: makeFishDataUri({ body: "#f1d9a9", tail: "#d2a45c", cheek: "#fb7185", eye: "#2c2218", mouth: "M78 48c-4 2-9 2-13 0" }) },
    share: { title: "おすそ分け鯛", desc: "箱買い・手土産が似合うシェア上手。", store: "個包装が丁寧な和菓子系たい焼き店。", img: makeFishDataUri({ body: "#f8d7c0", tail: "#f0a97a", cheek: "#fbbf24", eye: "#1f1a16", mouth: "M80 46c-4 5-10 5-14 0" }) },
    salty: { title: "塩見の効いた鯛", desc: "甘さ控えめでバランス重視。", store: "十勝産小豆や塩バター餡の専門店。", img: makeFishDataUri({ body: "#cddff0", tail: "#9ab7d6", cheek: "#7dd3fc", eye: "#0b1423", mouth: "M80 48c-6 0-12 0-16 0" }) },
    light: { title: "サクふわ中庸鯛", desc: "軽めにサクッと楽しみたい。", store: "クロワッサンたい焼き系カフェ。", img: makeFishDataUri({ body: "#ffe8b5", tail: "#ffc266", cheek: "#f9a8d4", eye: "#2c2218", mouth: "M80 46c-3 3-9 3-12 0" }) },
    mini: { title: "冒険小さめ鯛", desc: "小回りの利く変わり種を一つ。", store: "チーズ・カレー・明太マヨなど総菜系たい焼き店。", img: makeFishDataUri({ body: "#d4f1ff", tail: "#9fd7ff", cheek: "#f97373", eye: "#0f172a", mouth: "M80 48c-2 4-8 4-10 0" }) },
    steady: { title: "慎重ほっとり鯛", desc: "まずは一番人気を押さえる慎重派。", store: "行列の定番店でまずは粒あん。", img: makeFishDataUri({ body: "#eed9c4", tail: "#d5b49f", cheek: "#fecdd3", eye: "#241b14", mouth: "M80 48c-4 2-8 2-12 0" }) },
    cool: { title: "冷静しっぽ鯛", desc: "実はそこまで甘党じゃないかも。", store: "白餡・こし餡の軽め、もしくは最中・鯛せんべい系の専門店。", img: makeFishDataUri({ body: "#dce4ed", tail: "#aebcc9", cheek: "#bfdbfe", eye: "#0f172a", mouth: "M80 48c-3-2-9-2-12 0" }) },
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
