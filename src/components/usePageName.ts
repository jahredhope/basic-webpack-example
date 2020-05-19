import { pathToRegexp } from "path-to-regexp";
import { useLocation } from "react-router-dom";

const getIsPageA = pathToRegexp("/a/");
const getIsPageB = pathToRegexp("/b/");
const getIsPageC = pathToRegexp("/c/");

export function usePageName() {
  const location = useLocation();
  if (location.pathname.match(getIsPageA)) return "Page A";
  if (location.pathname.match(getIsPageB)) return "Page B";
  if (location.pathname.match(getIsPageC)) return "Page C";
  return "Page A";
}
