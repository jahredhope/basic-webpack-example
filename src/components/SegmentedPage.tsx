import styled from "@emotion/styled";
import theme from "src/theme";

export const SegmentedPage = styled("div")`
  display: grid;
  align-items: center;
  & > * {
    padding: 20px;
  }
  & > *:nth-child(odd) {
    background-color: ${theme.colors.fill.secondary};
  }
  & > *:nth-child(even) {
    background-color: ${theme.colors.fill.standard};
  }
`;
