// utils/confetti.ts

export function confetti(el: HTMLElement, confettiCountMultiplier: number) {
  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const titleWidth = el.offsetWidth;
  const totalConfetti = Math.floor(titleWidth * confettiCountMultiplier / 10);

  for (let i = 0; i < totalConfetti; i++) {
    const confetto = document.createElement('i');
    confetto.style.transform = `translate3d(${randomNumber(-250, 250)}px, ${randomNumber(-150, 150)}px, 0) rotate(${randomNumber(1, 360)}deg)`;
    confetto.style.background = `hsla(${randomNumber(1, 360)}, 100%, 50%, 1)`;
    confetto.classList.add('confetti');
    el.appendChild(confetto);
  }

  setTimeout(() => {
    const childConfetti = el.querySelectorAll('i');
    childConfetti.forEach(confetto => confetto.remove());
  }, 3000);
}