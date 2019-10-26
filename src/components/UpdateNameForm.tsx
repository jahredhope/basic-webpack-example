import styled from "@emotion/styled";
import React, { ChangeEvent, useState } from "react";
import Button from "src/components/Button";
import { State, useSelector } from "src/store";
import { useSetFirstName } from "src/store/user";
import theme from "src/theme";

const selectUser = (state: State) => state.user;

const useFormField = (
  initialState: string
): [string, (event: ChangeEvent) => void] => {
  const [value, setter] = useState(initialState);
  return [
    value,
    (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value),
  ];
};

const TextField = styled("input")`
  font-size: ${theme.type.size.body};
  line-height: 1.1em;
  padding: ${theme.grid.height.medium} ${theme.grid.width.small};
`;

const UpdateNameForm = () => {
  const setFirstName = useSetFirstName();

  const user = useSelector(selectUser);
  const [formFirstName, onChangeFirstName] = useFormField(user.firstName);
  const onSubmit = () => setFirstName(formFirstName);
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
        return false;
      }}
    >
      <TextField
        type="text"
        onChange={onChangeFirstName}
        value={formFirstName}
      />
      <Button onClick={onSubmit}>Update First Name</Button>
    </form>
  );
};

export default UpdateNameForm;
