import * as monaco from "monaco-editor";
import { shikiToMonaco } from "@shikijs/monaco";
import { languages } from "./config.json";
import { createHighlighter } from "shiki";
import state from "./state";
import { initCanvas } from "./canvas";
import { parseVectorFunction } from "./vectorFunction";

const highlighter = await createHighlighter({
  themes: ["rose-pine"],
  langs: ["javascript", "rust"],
});

const readCode = (language: string) => {
  return atob(languages.filter((l) => l.id === language)[0].initialCode);
};

export const initEditor = () => {
  let fnStr = readCode("javascript");

  const editor = document.getElementById("editor") as HTMLPreElement;
  const button = document.getElementById("reload-btn") as HTMLButtonElement;
  const languagesSelect = document.getElementById(
    "languages",
  ) as HTMLSelectElement;

  languages.forEach((l) => {
    const option = document.createElement("option");
    option.value = l.id;
    option.innerText = l.label;
    languagesSelect.appendChild(option);
  });

  button.addEventListener("click", () => {
    state.fn = parseVectorFunction(fnStr);
    cancelAnimationFrame(state.animationId);
    initCanvas();
  });

  languagesSelect.addEventListener("change", () => {
    const language = languagesSelect.value;
    state.language = language;
    fnStr = readCode(language);
    m.getModel()?.dispose();
    m.setModel(monaco.editor.createModel(fnStr, language));
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
  state.editor = m;

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
