import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getPageNameFromPath } from "./usePageName";

const keyMap = {
  "Page A": {
    ArrowRight: "/b/",
  },
  "Page B": {
    ArrowLeft: "/",
    ArrowRight: "/c/",
  },
  "Page C": {
    ArrowLeft: "/b/",
  },
};
export const useKeyboardNavigation = () => {
  const history = useHistory();

  useEffect(() => {
    console.log("Adding keydown event listener");
    const callback = (event: KeyboardEvent) => {
      history.location.pathname;
      const pageName = getPageNameFromPath(history.location.pathname);
      if (keyMap[pageName][event.key]) {
        history.push(keyMap[pageName][event.key]);
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [history]);
};
