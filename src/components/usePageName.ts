import { pathToRegexp } from "path-to-regexp";
import { useLocation } from "react-router-dom";

const getIsPageA = pathToRegexp("/a/");
const getIsPageB = pathToRegexp("/b/");
const getIsPageC = pathToRegexp("/c/");

export function getPageNameFromPath(pathname: string) {
  if (pathname.match(getIsPageA)) return "Page A";
  if (pathname.match(getIsPageB)) return "Page B";
  if (pathname.match(getIsPageC)) return "Page C";
  return "Page A";
}

export function usePageName() {
  const location = useLocation();
  return getPageNameFromPath(location.pathname);
}
