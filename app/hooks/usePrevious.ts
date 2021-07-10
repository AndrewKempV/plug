import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  // @ts-ignore
  return ref.current;
}
