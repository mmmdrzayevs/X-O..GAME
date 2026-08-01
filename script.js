const cells = [...document.querySelectorAll('.cell')];
const boardEl = document.querySelector('#board');
const turnEl = document.querySelector('#turn-switch');
const statusEl = document.querySelector('#status');
const scores = { X: 0, O: 0, draw: 0 };
let board = Array(9).fill(''), current = 'X', finished = false, soundOn = true;
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function tone(freq) { if (!soundOn) return; const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = freq; gain.gain.setValueAtTime(.055, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .13); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .13); }
function updateTurn() { const oTurn = current === 'O'; turnEl.classList.toggle('o-active', oTurn); boardEl.classList.toggle('o-turn', oTurn); statusEl.textContent = `${current}-ın sırasıdır — seçimini et!`; }
function updateScores() { document.querySelector('#x-score').textContent = scores.X; document.querySelector('#o-score').textContent = scores.O; document.querySelector('#draw-score').textContent = scores.draw; }
function checkGame() { const line = wins.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]); if (line) { finished = true; line.forEach(i => cells[i].classList.add('winner')); scores[current]++; updateScores(); statusEl.textContent = `🎉 ${current} qalib gəldi! Möhtəşəm oynadın.`; boardEl.classList.add('finished'); tone(760); return; } if (board.every(Boolean)) { finished = true; scores.draw++; updateScores(); statusEl.textContent = '🤝 Heç-heçə! Bir raund da oynayın.'; boardEl.classList.add('finished'); tone(380); return; } current = current === 'X' ? 'O' : 'X'; updateTurn(); }
function play(index) { if (finished || board[index]) return; board[index] = current; const cell = cells[index]; cell.textContent = current; cell.classList.add(current.toLowerCase(), 'pop'); cell.setAttribute('aria-label', `${index + 1}-ci xana: ${current}`); tone(current === 'X' ? 520 : 430); checkGame(); }
function newRound() { board = Array(9).fill(''); current = 'X'; finished = false; cells.forEach(c => { c.textContent = ''; c.className = 'cell'; c.removeAttribute('aria-label'); }); boardEl.classList.remove('finished'); updateTurn(); statusEl.textContent = 'X başlayır — uğurlar!'; }
cells.forEach(cell => cell.addEventListener('click', () => play(+cell.dataset.index)));
document.querySelector('#new-round').addEventListener('click', newRound);
document.querySelector('#reset-score').addEventListener('click', () => { scores.X = scores.O = scores.draw = 0; updateScores(); newRound(); });
document.querySelector('#sound-toggle').addEventListener('click', e => { soundOn = !soundOn; e.currentTarget.textContent = soundOn ? '🔊 Səs açıq' : '🔇 Səs bağlı'; e.currentTarget.setAttribute('aria-pressed', soundOn); });
updateTurn(); updateScores();
