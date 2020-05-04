import debug from "debug";
import { useEffect, useLayoutEffect, useState } from "react";

export const useIncrementer = (
  initialState: number = 0
): [number, () => void] => {
  const [state, setState] = useState(initialState);
  return [state, () => setState((oldState) => oldState + 1)];
};
export const useToggler = (
  initialState: boolean = false
): [boolean, () => void] => {
  const [state, setState] = useState(initialState);
  return [state, () => setState((oldState) => !oldState)];
};

export const useLogMount = (pageName: string) => {
  const log = debug(`app:react:${pageName}`);
  log("RENDER");
  useEffect(() => {
    log("MOUNT");
    return () => {
      log("UNMOUNT");
    };
  }, []);
};

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  if (typeof window !== "undefined") {
    useLayoutEffect(() => setHasMounted(true), []);
  }
  return hasMounted;
};

type Callback = () => void;
export const useIncrementalTimer = (callback: Callback, interval: number) => {
  useEffect(() => {
    let timer: NodeJS.Timeout = null;
    const setTimer = () => {
      timer = setTimeout(increment, interval);
    };
    const clearTimer = () => {
      clearTimeout(timer);
    };
    const increment = () => {
      clearTimer();
      callback();
      setTimer();
    };
    setTimer();
    return clearTimer;
  }, []);
};
