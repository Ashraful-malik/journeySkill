function getRandomGradient() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F333FF",
    "#33FFF3",
    "#FF33A8",
    "#A833FF",
    "#FF8C33",
    "#33FF8C",
    "#8C33FF",
  ];
  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomColor1}, ${randomColor2}) `;
}

export const gradientStyle = {
  backgroundImage: getRandomGradient(),
};
