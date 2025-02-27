import { RyuseiCode, javascript, Extensions } from "@ryusei/code";
import "@ryusei/code/dist/css/themes/ryuseicode-ryusei.min.css";

import state from "./state";
import { initCanvas } from "./canvas";
import { parseVectorFunction } from "./vectorFunction";

const initialFnStr = `const a = (x, y, t) => {
  const k = x / 8 - 25;
  const e = y / 8 - 25;
  const d = (k ** 2 + e ** 2) / 99;

  const q = x / 3 + ((k * 0.5) / Math.cos(y * 5)) * Math.sin(d ** 2 - t);
  const c = d / 2 - t / 8;

  const px = q * Math.sin(c) + e * Math.sin(d + k - t) + 200;
  const py = (q + y / 8 + d * 9) * Math.cos(c) + 200;

  return [px, py];
};`;

let fnStr = initialFnStr;

export const initEditor = () => {
  const pre = document.getElementById("editor") as HTMLPreElement;
  const button = document.getElementById("reload-btn") as HTMLButtonElement;

  button.addEventListener("click", () => {
    state.fn = parseVectorFunction(fnStr);
    cancelAnimationFrame(state.animationId);
    initCanvas();
  });

  pre.innerHTML = initialFnStr;

  RyuseiCode.register([javascript()]);
  RyuseiCode.compose(Extensions);

  const ryuseiCode = new RyuseiCode({
    language: "javascript",
  });

  ryuseiCode.on("changed", () => {
    fnStr = ryuseiCode.toString();
  });

  ryuseiCode.apply(pre);
};
