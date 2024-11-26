import { VectorFunction } from "@/lib/function";
import { useCallback, useEffect, useRef } from "react";
import { useAnimationFrame } from "@/hooks";

let t = 0;

export default function Canvas({ fn }: { fn: VectorFunction | null }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    ctx.current = canvas.current!.getContext("2d");
  }, []);

  const draw = useCallback(
    (_time: number) => {
      ctx.current!.clearRect(
        0,
        0,
        canvas.current!.width,
        canvas.current!.height,
      );

      t += Math.PI / 180;

      for (let y = 99; y < 300; y += 5) {
        for (let x = 99; x < 300; x++) {
          if (fn == null) return;
          const [px, py] = fn(x, y, t);
          ctx.current!.beginPath();
          ctx.current!.arc(px, py, 0.5, 0, 2 * Math.PI); // Draw tiny points
          ctx.current!.fillStyle = "rgb(255, 96, 96)";
          ctx.current!.fill();
        }
      }
    },
    [fn],
  );

  useAnimationFrame(draw);

  return (
    <>
      <canvas
        id="canvas"
        ref={canvas}
        height="400"
        width="400"
        style={{ backgroundColor: "#060606" }}
      ></canvas>
    </>
  );
}
