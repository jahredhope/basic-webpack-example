import { createSelector } from "reselect";
import { State, useAction, useSelector } from "./";

export interface User {
  firstName: string;
  lastName: string;
  age: number;
}

export interface UserState {
  user: User;
}

export const useSetFirstName = () =>
  useAction(
    (state, firstName: string): Partial<State> => ({
      user: {
        ...state.user,
        firstName,
      },
    })
  );

export const useSetLastName = () =>
  useAction(
    (state, lastName: string): Partial<State> => ({
      user: {
        ...state.user,
        lastName,
      },
    })
  );

const selectFirstName = (state: State) => state.user.firstName;
const selectLastName = (state: State) => state.user.lastName;
const selectDisplayName = createSelector(
  selectFirstName,
  selectLastName,
  (firstName, lastName) => `${firstName} ${lastName}`
);

export const useDisplayName = () => useSelector(selectDisplayName);
