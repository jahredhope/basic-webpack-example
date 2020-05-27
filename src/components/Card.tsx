import React, { SFC } from "react";

import Box, { BoxProps } from "./Box";

const Card: SFC<BoxProps> = (props) => <Box padding="medium" {...props} />;

export default Card;
