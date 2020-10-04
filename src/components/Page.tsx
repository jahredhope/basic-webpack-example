import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import Box from "./Box";

const StyledBox = styled(Box)({
  gridArea: "content",
  paddingBottom: "var(--space-xlarge)",
  justifyContent: "stretch",
  alignItems: "center",
  maxWidth: "100%",
  overflowX: "hidden",
});

interface Props {
  extended?: boolean;
}

const Page: FunctionComponent<Props> = ({ extended, ...props }: Props) => (
  <StyledBox
    stack={extended ? "xxlarge" : "xlarge"}
    paddingY={extended ? "xlarge" : "large"}
    {...props}
  />
);

export default Page;
