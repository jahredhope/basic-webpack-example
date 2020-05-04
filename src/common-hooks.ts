import { useEffect, useState } from "react";

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
  useEffect(() => {
    console.log("MOUNT:", pageName);
    return () => {
      console.log("UNMOUNT:", pageName);
    };
  }, []);
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
