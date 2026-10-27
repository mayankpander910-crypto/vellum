"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Debounced snapshot history for the whole resume document. */
export function useHistory<T>(current: T, apply: (snapshot: T) => void, delay = 500, limit = 60) {
  const stack = useRef<T[]>([]);
  const index = useRef(-1);
  const skip = useRef(false);
  const lastKey = useRef("");
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (skip.current) { skip.current = false; return; }
    const key = JSON.stringify(current);
    if (key === lastKey.current) return;
    const timer = setTimeout(() => {
      const snapshot = JSON.parse(key) as T;
      if (index.current < stack.current.length - 1) stack.current = stack.current.slice(0, index.current + 1);
      stack.current.push(snapshot);
      if (stack.current.length > limit) stack.current.shift();
      index.current = stack.current.length - 1;
      lastKey.current = key;
      setPosition(index.current);
    }, delay);
    return () => clearTimeout(timer);
  }, [current, delay, limit]);

  const jump = useCallback((nextIndex: number) => {
    const snapshot = stack.current[nextIndex];
    if (!snapshot) return;
    index.current = nextIndex;
    lastKey.current = JSON.stringify(snapshot);
    skip.current = true;
    apply(JSON.parse(lastKey.current) as T);
    setPosition(nextIndex);
  }, [apply]);

  const undo = useCallback(() => { if (index.current > 0) jump(index.current - 1); }, [jump]);
  const redo = useCallback(() => { if (index.current < stack.current.length - 1) jump(index.current + 1); }, [jump]);
  const reset = useCallback((value: T) => {
    const key = JSON.stringify(value);
    stack.current = [JSON.parse(key) as T];
    index.current = 0;
    lastKey.current = key;
    skip.current = true;
    apply(value);
    setPosition(0);
  }, [apply]);

  return {
    undo, redo, reset,
    canUndo: position > 0,
    canRedo: position < stack.current.length - 1,
  };
}
