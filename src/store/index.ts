import {
  Provider,
  TypedUseAction,
  TypedUseSelector,
  useAction as _useAction,
  useSelector as _useSelector,
} from "react-unistore";
import createStore from "unistore";
import { ItemsState } from "./items";
import { UserState } from "./user";

type Environment = "production" | "staging" | "development";

export type State = UserState &
  ItemsState & {
    environment: Environment;
  };
export const useSelector: TypedUseSelector<State> = _useSelector;
export const useAction: TypedUseAction<State> = _useAction;

export { createStore, Provider };
