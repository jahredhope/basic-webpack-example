import React, { ChangeEvent, memo, useState } from "react";
import Button from "src/components/Button";
import Card from "src/components/Card";
import Text from "src/components/Text";

import styled from "@emotion/styled";
import { useLogMount } from "src/common-hooks";
import { State, useSelector } from "src/store";
import { useDisplayName, useSetFirstName } from "src/store/user";
import theme from "../theme";

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

export default memo(function PageA() {
  useLogMount("Page A");
  const setFirstName = useSetFirstName();

  const user = useSelector(selectUser);
  const displayName = useDisplayName();

  const [formFirstName, onChangeFirstName] = useFormField(user.firstName);
  const onSubmit = () => setFirstName(formFirstName);

  return (
    <Card>
      <Text heading as={"h3"}>
        Page A
      </Text>
      <Text>Update your name</Text>
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
      <Text heading>{displayName}</Text>
    </Card>
  );
});
