import styled from "@emotion/styled";

import React, { FunctionComponent } from "react";

import Box, { BoxProps } from "./Box";

const StyledButton = styled(Box)`
  cursor: pointer;
  border: none;
  min-width: 100px;
  line-height: 1.1rem;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  box-shadow: 0 4px 4px rgba(50, 50, 93, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 2px 4px 0 hsla(240, 10%, 97%, 0.15);
  outline: none;
  &:active {
    box-shadow: none;
  }
  &:focus {
    outline: none;
  }
`;

const Button: FunctionComponent<BoxProps> = (props) => (
  <StyledButton
    as="button"
    padding="small"
    margin="xsmall"
    background="brand"
    color="white"
    {...props}
  />
);

export default Button;
