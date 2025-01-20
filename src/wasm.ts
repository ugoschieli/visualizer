import state from "./state";
import { initCanvas } from "./canvas";

export const initWasm = () => {
  const wasmButton = document.getElementById("wasm-btn") as HTMLButtonElement;

  wasmButton.addEventListener("click", async () => {
    const path = "http://localhost:8000/artifact/example.js";
    const { default: initWasm, render } = await import(/* @vite-ignore */ path);

    await initWasm("http://localhost:8000/artifact/example_bg.wasm");
    state.fn = render;
    cancelAnimationFrame(state.animationId);
    initCanvas();
  });
};
