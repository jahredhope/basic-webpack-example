import React, { SFC } from "react";

import Box, { CardProps } from "./Box";

const Card: SFC<CardProps> = (props) => (
  <Box background="card" padding="medium" {...props} />
);

export default Card;
