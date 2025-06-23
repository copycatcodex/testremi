let deck = [];
let discardPile = [];
let playerHand = [];
let selectedCardIndex = null;
let score = sessionStorage.getItem("remiScore") ? parseInt(sessionStorage.getItem("remiScore")) : 0;
let session = sessionStorage.getItem("remiSession") ? parseInt(sessionStorage.getItem("remiSession")) : 1;

document.getElementById("score").textContent = score;
document.getElementById("session").textContent = session;

function initGame() {
  deck = [];
  discardPile = [];
  const suits = ["♥", "♦", "♣", "♠"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  deck.push({ value: "JOKER" });
  shuffle(deck);
  dealCards();
  updateDiscardPile();
  updateHand();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function dealCards() {
  playerHand = deck.splice(0, 7);
}

function updateHand() {
  const container = document.getElementById("player-hand");
  container.innerHTML = "";
  playerHand.forEach((card, index) => {
    const cardEl = document.createElement("span");
    cardEl.textContent = card.value + (card.suit || "");
    cardEl.className = index === selectedCardIndex ? "selected" : "";
    cardEl.onclick = () => {
      selectedCardIndex = index === selectedCardIndex ? null : index;
      updateHand();
    };
    container.appendChild(cardEl);
  });
}

function updateDiscardPile() {
  const last = discardPile[discardPile.length - 1];
  document.getElementById("discard-pile").textContent = last
    ? last.value + (last.suit || "")
    : "(kosong)";
}

function drawFromDeck() {
  if (deck.length === 0) {
    endSession("Deck habis!");
    return;
  }
  const card = deck.pop();
  playerHand.push(card);
  updateHand();
}

function drawFromDiscard() {
  const last = discardPile[discardPile.length - 1];
  if (!last) return alert("Pembuangan kosong");
  playerHand.push(discardPile.pop());
  updateDiscardPile();
  updateHand();
}

function discardCard() {
  if (selectedCardIndex === null) return alert("Pilih kartu untuk dibuang.");
  const card = playerHand[selectedCardIndex];
  if (card.value === "JOKER") return alert("Tidak bisa buang Joker!");
  discardPile.push(card);
  playerHand.splice(selectedCardIndex, 1);
  selectedCardIndex = null;
  updateHand();
  updateDiscardPile();
}

function cardValue(card) {
  if (card.value === "JOKER") return 0;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 15;
  return 5;
}

function closeCard() {
  if (playerHand.length < 7) return alert("Lengkapi 7 kartu dulu.");
  const total = playerHand.reduce((sum, card) => sum + cardValue(card), 0);
  score += 250; // Closed card bonus
  score -= total; // Kurangi nilai kartu di tangan
  endSession("Closed Card! Kamu dapat bonus 250 poin!");
}

function endSession(message) {
  alert(message);
  session++;
  sessionStorage.setItem("remiScore", score);
  sessionStorage.setItem("remiSession", session);
  document.getElementById("score").textContent = score;
  document.getElementById("session").textContent = session;

  if (score >= 1000) {
    alert("Selamat! Kamu menang! Skor 1000+");
    sessionStorage.clear();
    score = 0;
    session = 1;
  }
  initGame();
}

// Mulai permainan
initGame();
