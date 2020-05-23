import React, { SFC } from "react";

import Box, { BoxProps, Space } from "./Box";

interface StackProps extends BoxProps {
  space: Space;
}

const Stack: SFC<StackProps> = ({ space, ...props }: StackProps) => (
  <Box stack={space} {...props} />
);

export default Stack;
