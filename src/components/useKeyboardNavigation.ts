import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getPageNameFromPath } from "./usePageName";

interface PageArrows {
  ArrowRight?: string;
  ArrowLeft?: string;
}
const keyMap = {
  "Page A": {
    ArrowRight: "/b/",
  } as PageArrows,
  "Page B": {
    ArrowLeft: "/",
    ArrowRight: "/c/",
  } as PageArrows,
  "Page C": {
    ArrowLeft: "/b/",
  } as PageArrows,
};
export const useKeyboardNavigation = () => {
  const history = useHistory();
  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      const pageName = getPageNameFromPath(document.location.pathname);
      if (event.key in keyMap[pageName]) {
        history.push(keyMap[pageName][event.key as keyof PageArrows]);
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [history]);
};
