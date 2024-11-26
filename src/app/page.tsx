"use client";
import { useState } from "react";
import Canvas from "@/components/Canvas";
import Editor from "@/components/Editor";
import { VectorFunction } from "@/lib/function";

export default function Home() {
  const [fn, setFn] = useState<VectorFunction | null>(null);

  return (
    <>
      <Canvas fn={fn} />
      <Editor setFn={setFn} />
    </>
  );
}
