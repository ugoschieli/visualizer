import * as monaco from "monaco-editor";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import state from "./state";
import { initCanvas } from "./canvas";
import { parseVectorFunction } from "./vectorFunction";

const highlighter = await createHighlighter({
  themes: ["rose-pine"],
  langs: ["javascript"],
});

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
  const editor = document.getElementById("editor") as HTMLPreElement;
  const button = document.getElementById("reload-btn") as HTMLButtonElement;

  button.addEventListener("click", () => {
    state.fn = parseVectorFunction(fnStr);
    cancelAnimationFrame(state.animationId);
    initCanvas();
  });

  monaco.languages.register({ id: "javascript" });
  shikiToMonaco(highlighter, monaco);
  const m = monaco.editor.create(editor, {
    value: fnStr,
    theme: "rose-pine",
    language: "javascript",
    minimap: {
      enabled: false,
    },
    automaticLayout: false,
  });

  window.addEventListener("resize", () => {
    m.layout({ width: 0, height: 0 });

    window.requestAnimationFrame(() => {
      const rect = editor.getBoundingClientRect();
      m.layout({ width: rect.width, height: rect.height });
    });
  });

  m.onDidChangeModelContent(() => {
    fnStr = m.getModel()!.getValue()!;
  });
};
