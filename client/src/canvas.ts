import state from "./state";

export const initCanvas = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  let previousTime = 0;

  const draw = (time: number) => {
    const dt = (time - previousTime) / 1000;
    previousTime = time;

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.fn == null) return;

    state.t += 2 * dt;

    for (let _y = 99; _y < 300; _y += 5) {
      for (let _x = 99; _x < 300; _x++) {
        const [x, y] = state.fn(_x, _y, state.t);
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, 2 * Math.PI); // Draw tiny points
        ctx.fillStyle = "rgb(255, 96, 96)";
        ctx.fill();
      }
    }
    state.animationId = requestAnimationFrame(draw);
  };

  state.animationId = requestAnimationFrame(draw);
};
