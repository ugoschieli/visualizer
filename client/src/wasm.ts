import state from "./state";
import { initCanvas } from "./canvas";

const src =
  "dXNlIHdhc21fYmluZGdlbjo6cHJlbHVkZTo6d2FzbV9iaW5kZ2VuOwoKI1t3YXNtX2JpbmRnZW5dCnB1YiBmbiByZW5kZXIoeDogZjMyLCB5OiBmMzIsIHQ6IGYzMikgLT4gQm94PFtmMzJdPiB7CiAgICBsZXQgazogZjMyID0geCAvIDggYXMgZjMyIC0gMjUgYXMgZjMyOwogICAgbGV0IGU6IGYzMiA9IHkgLyA4IGFzIGYzMiAtIDI1IGFzIGYzMjsKICAgIGxldCBkOiBmMzIgPSAoay5wb3dpKDIpICsgZS5wb3dpKDIpKSAvIDk5IGFzIGYzMjsKCiAgICBsZXQgcSA9IHggLyAzIGFzIGYzMiArICgoayAqIDAuNSkgLyAoeSAqIDUgYXMgZjMyKS5jb3MoKSkgKiAoZC5wb3dpKDIpIC0gdCkuc2luKCk7CiAgICBsZXQgYyA9IGQgLyAyIGFzIGYzMiAtIHQgLyA4IGFzIGYzMjsKCiAgICBsZXQgcHggPSBxICogYy5zaW4oKSArIGUgKiAoZCArIGsgLSB0KS5zaW4oKSArIDIwMCBhcyBmMzI7CiAgICBsZXQgcHkgPSAocSArIHkgLyA4IGFzIGYzMiArIGQgKiA5IGFzIGYzMikgKiBjLmNvcygpICsgMjAwIGFzIGYzMjsKCiAgICBCb3g6Om5ldyhbcHgsIHB5XSkKfQo=";

export const initWasm = () => {
  const wasmButton = document.getElementById("wasm-btn") as HTMLButtonElement;

  wasmButton.addEventListener("click", async () => {
    const r = await fetch("http://localhost:8080/rust", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        src,
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
