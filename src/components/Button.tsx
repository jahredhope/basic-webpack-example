import styled from "@emotion/styled";

import React, { SFC } from "react";

import theme from "src/theme";
import Box, { CardProps } from "./Box";

const StyledButton = styled(Box)`
  cursor: pointer;
  border: none;
  min-width: 100px;
  line-height: 1.1rem;
  font-size: ${theme.type.size.body};
`;

const Button: SFC<CardProps> = (props) => (
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
