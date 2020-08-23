import React, { FunctionComponent } from "react";

import Box, { BoxProps } from "./Box";

const Card: FunctionComponent<BoxProps> = (props) => (
  <Box padding="medium" {...props} />
);

export default Card;
