import React, { SFC } from "react";

import Box, { CardProps, Space } from "./Box";

interface StackProps extends CardProps {
  space: Space;
}

const Stack: SFC<StackProps> = ({ space, ...props }: StackProps) => (
  <Box stack={space} {...props} />
);

export default Stack;
