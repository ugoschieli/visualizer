export type VectorFunction = (
  x: number,
  y: number,
  t: number,
) => [number, number];

export function parseVectorFunction(str: string): VectorFunction {
  const fnBodyIdx = str.indexOf("{");
  const fnBody = str.substring(fnBodyIdx + 1, str.lastIndexOf("}"));
  return new Function("x", "y", "t", fnBody) as VectorFunction;
}
