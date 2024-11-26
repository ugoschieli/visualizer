export type SimpleFunction = (x: number) => number;
export type ParametricFunction = (t: number) => [number, number];
export type VectorFunction = (
  x: number,
  y: number,
  t: number,
) => [number, number];

// General version of the function parser
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function parseFunction(str: string): Function {
  const fn_body_idx = str.indexOf("{");
  const fn_body = str.substring(fn_body_idx + 1, str.lastIndexOf("}"));
  const fn_declare = str.substring(0, fn_body_idx);
  const fn_params = fn_declare.substring(
    fn_declare.indexOf("(") + 1,
    fn_declare.lastIndexOf(")"),
  );
  const args = fn_params.split(",");

  args.push(fn_body);
  const f = new Function(...args);
  return f;
}

export function parseVectorFunction(str: string): VectorFunction {
  const fnBodyIdx = str.indexOf("{");
  const fnBody = str.substring(fnBodyIdx + 1, str.lastIndexOf("}"));
  return new Function("x", "y", "t", fnBody) as VectorFunction;
}
