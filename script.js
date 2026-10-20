// A little birthday website for Aliff ♡
// Keep the date in YYYY-MM-DD format.
const START_DATE = "2025-03-16";

const loveButton = document.getElementById("love-button");
const loveCount = document.getElementById("love-count");
const loveMessage = document.getElementById("love-message");
const letterButton = document.getElementById("letter-button");
const surpriseMessage = document.getElementById("surprise-message");
const toTop = document.getElementById("to-top");
const musicButton = document.getElementById("music-button");
const music = document.getElementById("bg-music");
const daysCounter = document.getElementById("days-counter");
const daysNumber = document.getElementById("days-number");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Heart burst ---------- */
function burstHearts(originEl, amount = 12) {
  if (reducedMotion || !originEl) return;
  const rect = originEl.getBoundingClientRect();
  const symbols = ["♡", "♥", "✿", "✧"];
  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-burst";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top + rect.height / 2}px`;
    heart.style.setProperty("--dx", `${Math.round(Math.random() * 150 - 75)}px`);
    heart.style.setProperty("--dy", `${Math.round(Math.random() * -130 - 20)}px`);
    heart.style.setProperty("--rot", `${Math.round(Math.random() * 70 - 35)}deg`);
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

/* ---------- Tap for love ---------- */
let hearts = 0;
const loveMessages = [
  "hehe you actually pressed it ♡",
  "okay baby, that's two hearts already 😭",
  "you can stop now, i already love you banyak banyak",
  "ALIFF WHAT ARE YOU DOING HAHAHA ♡",
  "five hearts!! come collect your hugs later",
  "i wish i could give you these hearts in person",
  "okay fine, you win. more hugs for you later ♡",
  "birthday boy privileges: unlimited love from me",
  "if you are smiling at this, mission accomplished hehe",
  "still tapping? okay, i miss you too, sayang ♡"
];
const milestones = {
  10: "ten hearts already? imagine how many i have for you in real life ♡",
  25: "baby that's a lot of hearts. good thing my love for you isn't limited 😭",
  50: "ALIFF ENOUGH HAHAHA. okay, come here and let me hug you ♡"
};

if (loveButton && loveCount && loveMessage) {
  loveButton.addEventListener("click", () => {
    hearts += 1;
    loveCount.textContent = hearts;
    loveButton.textContent = hearts % 2 === 0 ? "♡" : "♥";
    if (milestones[hearts]) {
      loveMessage.textContent = milestones[hearts];
      burstHearts(loveButton, hearts === 50 ? 24 : 18);
    } else if (hearts > 50) {
      loveMessage.textContent = milestones[50];
      burstHearts(loveButton, 5);
    } else {
      loveMessage.textContent = loveMessages[(hearts - 1) % loveMessages.length];
      burstHearts(loveButton, 7);
    }
  });
}

/* ---------- Tiny surprises ---------- */
const surprises = [
  "if i could choose a thousand little moments to relive, i would still want so many of them to be with you ♡",
  "my birthday wish for you is that Allah eases your affairs, keeps you safe, and makes your dreams feel closer. amin 🤎",
  "p.s. you are still my favourite person to annoy, laugh with, and hold close. happy birthday, sayang ♡",
  "remember that you don't have to do everything perfectly. i'm proud of you for trying, and i'll always be cheering for you.",
  "one last thing, baby: thank you for being part of my life. i love you, okay? now smile for me hehe ♡"
];
let surpriseIndex = 0;
if (letterButton && surpriseMessage) {
  letterButton.addEventListener("click", () => {
    surpriseMessage.hidden = false;
    surpriseMessage.classList.remove("pop-in");
    void surpriseMessage.offsetWidth; // restart the animation
    surpriseMessage.classList.add("pop-in");
    surpriseMessage.textContent = surprises[surpriseIndex];
    surpriseIndex = (surpriseIndex + 1) % surprises.length;
    letterButton.textContent = surpriseIndex === 0 ? "read another little note ♡" : "another one, please ♡";
    burstHearts(letterButton, surpriseIndex === 0 ? 18 : 8);
  });
}

/* ---------- Reveal sections as they enter the screen ---------- */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- Back-to-top button ---------- */
let topTicking = false;
function updateTopButton() {
  if (toTop) toTop.classList.toggle("visible", window.scrollY > 420);
  topTicking = false;
}
window.addEventListener("scroll", () => {
  if (!topTicking) {
    topTicking = true;
    window.requestAnimationFrame(updateTopButton);
  }
}, { passive: true });
updateTopButton();
if (toTop) {
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
}

/* ---------- Days of us (calendar days, DST-safe) ---------- */
if (START_DATE && daysCounter && daysNumber) {
  const [y, m, d] = START_DATE.split("-").map(Number);
  const now = new Date();
  const startUTC = Date.UTC(y, m - 1, d);
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (!Number.isNaN(startUTC) && startUTC <= todayUTC) {
    daysNumber.textContent = Math.floor((todayUTC - startUTC) / 86400000);
    daysCounter.hidden = false;
  }
}

/* ---------- Missing photos: fall back to the soft placeholder ----------
   If a photo can't load (wrong name, unsupported format), remove the broken
   <img> so the pretty placeholder shows instead of a blank frame. */
document.querySelectorAll(".photo-placeholder img, .memory-image-placeholder img").forEach((img) => {
  const dropIfBroken = () => img.remove();
  img.addEventListener("error", dropIfBroken, { once: true });
  if (img.complete && img.naturalWidth === 0) dropIfBroken();
});

/* ---------- Music (button appears only if song.mp3 loads) ---------- */
if (music && musicButton) {
  const showButton = () => { musicButton.hidden = false; };
  music.addEventListener("loadedmetadata", showButton);
  music.addEventListener("canplay", showButton);
  music.addEventListener("error", () => { musicButton.hidden = true; });
  if (music.readyState >= 1) showButton();

  const setPlaying = (playing) => {
    musicButton.classList.toggle("playing", playing);
    musicButton.textContent = playing ? "Ⅱ pause our song" : "♪ our song";
    musicButton.setAttribute("aria-pressed", String(playing));
  };

  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        setPlaying(true);
      } catch (error) {
        musicButton.textContent = "♪ tap to play";
      }
    } else {
      music.pause();
      setPlaying(false);
    }
  });
  music.addEventListener("pause", () => setPlaying(false));
  music.addEventListener("play", () => setPlaying(true));
}