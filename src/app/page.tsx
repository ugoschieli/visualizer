"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { RyuseiCode, javascript, Extensions } from "@ryusei/code";
import "@ryusei/code/dist/css/themes/ryuseicode-ryusei.min.css";
import { parseVectorFunction, VectorFunction } from "@/lib/function";

export default function Home() {
  const [fn, setFn] = useState<VectorFunction | null>(null);
  const [fnStr, setFnStr] = useState("");

  const loadFn = useCallback(() => {
    setFn(() => parseVectorFunction(fnStr));
  }, [fnStr]);

  /********************** Canvas *********************/
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      t += Math.PI / 180;

      for (let y = 99; y < 300; y += 5) {
        for (let x = 99; x < 300; x++) {
          if (fn == null) return;
          const [px, py] = fn(x, y, t);
          ctx.beginPath();
          ctx.arc(px, py, 0.5, 0, 2 * Math.PI); // Draw tiny points
          ctx.fillStyle = "rgb(255, 96, 96)";
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    ctx.fillStyle = "#060606";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw();
  }, [fn]);

  /********************** Code Editor *********************/
  useEffect(() => {
    const pre = document.getElementById("editor") as HTMLPreElement;

    RyuseiCode.register([javascript()]);
    RyuseiCode.compose(Extensions);

    const ryuseiCode = new RyuseiCode({
      language: "javascript",
    });

    ryuseiCode.on("changed", () => {
      setFnStr(ryuseiCode.toString());
    });

    ryuseiCode.apply(pre);
  }, []);

  /********************** HTML *********************/
  return (
    <>
      <canvas
        id="canvas"
        height="400"
        width="400"
        style={{ backgroundColor: "#060606" }}
      ></canvas>
      <button onClick={loadFn}>Reload Fn</button>
      <pre id="editor"></pre>
    </>
  );
}
