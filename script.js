
const deck = document.getElementById("deck");
const counter = document.getElementById("counter");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progressBar");
const musicToggle = document.getElementById("musicToggle");
const loveSong = document.getElementById("loveSong");
const musicStatus = document.getElementById("musicStatus");

let slides = Array.from(deck.querySelectorAll(".slide"));
let current = 0;

function refresh() {
  slides = Array.from(deck.querySelectorAll(".slide"));
  current = Math.max(0, Math.min(current, slides.length - 1));

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === current);
    slide.setAttribute("aria-hidden", String(index !== current));
  });

  counter.textContent = `${current + 1} / ${slides.length}`;
  prevButton.disabled = current === 0;
  nextButton.textContent = current === slides.length - 1 ? "Start over ↺" : "Next →";
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
}

function goTo(index) {
  slides = Array.from(deck.querySelectorAll(".slide"));
  current = (index + slides.length) % slides.length;
  refresh();
  slides[current].scrollTo({ top: 0, behavior: "smooth" });
}

prevButton.addEventListener("click", () => {
  if (current > 0) goTo(current - 1);
});

nextButton.addEventListener("click", () => {
  goTo(current === slides.length - 1 ? 0 : current + 1);
});

document.getElementById("readAgain").addEventListener("click", () => goTo(0));

document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.matches("input, textarea, [contenteditable='true']")) return;

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    goTo(current === slides.length - 1 ? 0 : current + 1);
  }

  if (event.key === "ArrowLeft" && current > 0) {
    goTo(current - 1);
  }
});

musicToggle.addEventListener("click", async () => {
  if (loveSong.paused) {
    try {
      await loveSong.play();
      musicToggle.textContent = "Ⅱ Pause music";
      musicStatus.textContent = "Now playing ♡";
    } catch {
      musicStatus.textContent = "Check that your music file exists.";
    }
  } else {
    loveSong.pause();
    musicToggle.textContent = "▶ Play music";
    musicStatus.textContent = "Music paused";
  }
});

loveSong.addEventListener("ended", () => {
  musicToggle.textContent = "▶ Play music";
});

loveSong.addEventListener("error", () => {
  musicStatus.textContent = "Audio file not found or unsupported.";
});

function setPhotoOrientation() {
    document.querySelectorAll(".photo-box img").forEach(image => {
        const updateOrientation = () => {
            const box = image.closest(".photo-box");

            if (!box || !image.naturalWidth || !image.naturalHeight) return;

            box.classList.remove("portrait", "landscape", "square");

            if (image.naturalHeight > image.naturalWidth) {
                box.classList.add("portrait");
            } else if (image.naturalWidth > image.naturalHeight) {
                box.classList.add("landscape");
            } else {
                box.classList.add("square");
            }
        };

        if (image.complete) {
            updateOrientation();
        } else {
            image.addEventListener("load", updateOrientation, { once: true });
        }
    });
}

setPhotoOrientation();

refresh();
