import styled from "@emotion/styled";

import React, { SFC } from "react";

import Box, { BoxProps } from "./Box";

const StyledButton = styled(Box)`
  cursor: pointer;
  border: none;
  min-width: 100px;
  line-height: 1.1rem;
  font-size: var(--font-size-medium);
`;

const Button: SFC<BoxProps> = (props) => (
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
