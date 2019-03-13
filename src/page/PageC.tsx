import styled from "@emotion/styled";
import React from "react";
import Text from "src/components/Text";

const Section = styled("div")`
  padding: 12px 3vw;
`;
const PrimarySection = styled(Section)`
  background-color: hsl(280, 15%, 80%);
  color: hsl(280, 98%, 24%);
  grid-column-end: span 2;
`;
const SecondarySection = styled(Section)`
  background-color: hsl(280, 98%, 24%);
  color: hsl(280, 15%, 80%);
`;
const PrimarySectionGreen = styled(Section)`
  background-color: hsl(192, 5%, 85%);
  color: hsl(192, 98%, 20%);
`;
const SecondarySectionGreen = styled(Section)`
  background-color: hsl(192, 98%, 20%);
  color: hsl(192, 5%, 85%);
`;

const Grid = styled("div")`
  display: grid;
  width: 100vw;
  max-width: 100vw;
  grid-template-columns: 1fr 1fr;
  @media screen and (min-width: 700px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Header = styled(PrimarySection)`
  grid-column-start: 1;
  grid-column-end: -1;
`;

import { useLogMount } from "src/common-hooks";

export default function PageC() {
  useLogMount("Page C");
  return (
    <Grid>
      <Header>
        <Text heading>Page C</Text>
      </Header>
      <PrimarySectionGreen>2</PrimarySectionGreen>
      <SecondarySectionGreen>3</SecondarySectionGreen>
      <SecondarySection>4</SecondarySection>
      <PrimarySection>5</PrimarySection>
      <SecondarySection>6</SecondarySection>
      <PrimarySection>7</PrimarySection>
      <SecondarySection>8</SecondarySection>
    </Grid>
  );
}
