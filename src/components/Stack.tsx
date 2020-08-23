import React, { FunctionComponent } from "react";

import Box, { BoxProps, Space } from "./Box";

interface StackProps extends BoxProps {
  space: Space;
}

const Stack: FunctionComponent<StackProps> = ({
  space,
  ...props
}: StackProps) => <Box stack={space} {...props} />;

export default Stack;
