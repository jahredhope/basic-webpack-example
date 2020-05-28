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
    const callback = (event: KeyboardEvent) => {
      const pageName = getPageNameFromPath(document.location.pathname);
      if (keyMap[pageName][event.key]) {
        history.push(keyMap[pageName][event.key]);
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [history]);
};
