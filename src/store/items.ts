import { createSelector } from "reselect";
import { State, useSelector } from ".";

export interface Item {
  id: string;
  name: string;
}

export interface Items {
  [id: string]: Item;
}

export interface ItemsState {
  items: Items;
}

const selectItemsObj = (state: State) => state.items;
const selectItems = createSelector(selectItemsObj, (items) =>
  Object.values(items)
);

export const useSelectItems = () => useSelector(selectItems);
