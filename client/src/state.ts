import { VectorFunction } from "./vectorFunction";
import * as monaco from "monaco-editor";

export default {
  t: 0,
  fn: null,
  animationId: 0,
  editor: null,
  language: "javascript",
} as {
  t: number;
  fn: VectorFunction | null;
  animationId: number;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  language: string;
};
