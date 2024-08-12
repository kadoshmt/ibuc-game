// utils/soundEffects.ts

export const playCorrectSound = () => {
  const correctSound = new Audio('/correct-sound.mp3');
  correctSound.play();
};

export const playIncorrectSound = () => {
  const incorrectSound = new Audio('/incorrect-sound.mp3');
  incorrectSound.play();
};
