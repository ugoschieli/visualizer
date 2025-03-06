import state from "./state";
import { initCanvas } from "./canvas";

export const initWasm = () => {
  const wasmButton = document.getElementById("wasm-btn") as HTMLButtonElement;

  wasmButton.addEventListener("click", async () => {
    const r = await fetch("http://localhost:8080/rust", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        src: btoa(state.editor!.getValue()!),
      }),
    });

    const data = await r.json();
    if (r.status !== 200) {
      return;
    }

    const b64js = data.js;
    const b64wasm = data.wasm;

    const { default: initWasm, render } = await import(
      /* @vite-ignore */ "data:text/javascript;base64," + b64js
    );

    await initWasm({
      module_or_path: "data:application/wasm;base64," + b64wasm,
    });

    state.fn = render;
    cancelAnimationFrame(state.animationId);
    initCanvas();
  });
};
