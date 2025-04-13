import confetti from "canvas-confetti";

export const useConfetti = () => {
  const smallConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
  };

  const celebrateFullScreen = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 40,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        ...defaults,
        particleCount: 150,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  };

  return {
    smallConfetti,
    celebrateFullScreen,
  };
};
