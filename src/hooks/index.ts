import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (draw: FrameRequestCallback) => {
  const animationRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      draw(time);
      animationRef.current = requestAnimationFrame(animate);
    },
    [draw],
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);
};
