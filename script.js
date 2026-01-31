console.log("JS carregou");
let activated = false;
let clickCount = 0;
let noHidden = false;

const arena = document.getElementById("arena");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yes");

yesBtn.addEventListener("click", () => {
  alert("🎉 Sabia!");
});

const STATES = {
  PARADO: "parado",
  DESLIZE: "deslize",
  FUGA: "fuga",
  TELEPORTE: "teleporte"
};

let currentState = STATES.PARADO;
let fugaInterval = null;
let fugaTimeout = null;

// ========================
// utilidades
// ========================
function randomPosition() {
  const maxX = arena.clientWidth - noBtn.offsetWidth;
  const maxY = arena.clientHeight - noBtn.offsetHeight;

  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY
  };
}

function randomState() {
  const options = [STATES.DESLIZE, STATES.FUGA, STATES.TELEPORTE];
  return options[Math.floor(Math.random() * options.length)];
}

// ========================
// estados
// ========================
function teleportar() {
  noBtn.style.transition = "none";

  const { x, y } = randomPosition();
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  // efeito simples
  noBtn.style.transform = "scale(0.7)";
  noBtn.style.opacity = "0";

  requestAnimationFrame(() => {
    noBtn.style.transition = "transform 0.2s ease, opacity 0.2s ease";
    noBtn.style.transform = "scale(1)";
    noBtn.style.opacity = "1";
	
  });
}

function deslizar() {
  noBtn.style.transition = "left 0.3s ease, top 0.3s ease";

  const { x, y } = randomPosition();
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

function iniciarFuga() {
  noBtn.style.transition = "left 0.15s linear, top 0.15s linear";

  fugaInterval = setInterval(() => {
    const { x, y } = randomPosition();
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }, 150);
}

function pararFuga() {
  if (fugaInterval) {
    clearInterval(fugaInterval);
    fugaInterval = null;
  }
}

// ========================
// controlador central
// ========================
function setState(state) {
  currentState = state;

  pararFuga();
  if (fugaTimeout) {
    clearTimeout(fugaTimeout);
    fugaTimeout = null;
  }

  switch (state) {
    case STATES.PARADO:
      break;

    case STATES.DESLIZE:
      deslizar();
      break;

    case STATES.TELEPORTE:
      teleportar();
      break;

    case STATES.FUGA:
      iniciarFuga();
      fugaTimeout = setTimeout(() => {
        setState(randomState());
      }, 1200);
      break;
  }
}

// ========================
// eventos
// ========================
noBtn.addEventListener("mouseenter", () => {
  if (!activated) return;

  if (currentState === STATES.PARADO) {
    setState(randomState());
  }
});


noBtn.addEventListener("click", () => {
  if (noHidden) return;

  clickCount++;

  if (clickCount >= 3) {
    hideNo();
    return;
  }

  setState(randomState());
});

function hideNo() {
  noHidden = true;
  clickCount = 0;

  noBtn.style.transition = "opacity 0.2s ease";
  noBtn.style.opacity = "0";
  noBtn.style.pointerEvents = "none";

  setTimeout(showNo, 1200);
}

function showNo() {
  const { x, y } = randomPosition();

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.opacity = "1";
  noBtn.style.pointerEvents = "auto";

  noHidden = false;
  setState(STATES.PARADO);
}