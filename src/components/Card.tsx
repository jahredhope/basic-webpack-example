import React, { SFC } from "react";

import Box, { BoxProps } from "./Box";

const Card: SFC<BoxProps> = (props) => (
  <Box background="card" padding="medium" {...props} />
);

export default Card;
