import styled from "@emotion/styled";
import React, { Fragment, memo } from "react";
import { Helmet } from "react-helmet";
import { useAction } from "react-unistore";
import { State } from "src/store";

import { useHasMounted, useLogMount } from "src/common-hooks";
import Button from "src/components/Button";
import Text from "src/components/Text";
import { Item, useSelectItems } from "src/store/items";

import {
  useBattery,
  useGeolocation,
  useIdle,
  useLocation,
  useNetwork,
  useOrientation,
  usePageLeave,
  useWindowScroll,
  useWindowSize,
} from "react-use";

const Section = styled("div")`
  padding: 12px 3vw;
`;
const PrimarySection = styled(Section)`
  background-color: hsl(280, 15%, 80%);
  color: hsl(280, 98%, 24%);
  grid-column-end: span 2;
`;
// const SecondarySection = styled(Section)`
//   background-color: hsl(280, 98%, 24%);
//   color: hsl(280, 15%, 80%);
// `;
// const PrimarySectionGreen = styled(Section)`
//   background-color: hsl(192, 5%, 85%);
//   color: hsl(192, 98%, 20%);
// `;
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

export default memo(function PageC() {
  useLogMount("PageC");
  const items = useSelectItems();
  const addItem = useAction((state: State, item: Item) => ({
    items: {
      ...state.items,
      [item.id]: item,
    },
  }));

  const hasMounted = useHasMounted();

  const battery: any = useBattery();
  const geolocation = useGeolocation();
  const idle = useIdle();
  const location = useLocation();
  const network = useNetwork();
  const orientation = useOrientation();
  usePageLeave(() => console.log("usePageLeave"));
  const windowScroll = useWindowScroll();
  const windowSize = useWindowSize();

  return (
    <Grid>
      <Helmet>
        <title>Page C</title>
      </Helmet>
      <Header>
        <Text heading>Currently on Page C</Text>
      </Header>
      <Button onClick={() => addItem({ id: "3", name: "hi there" })}>
        Add
      </Button>
      {items.map(item => {
        return (
          <SecondarySectionGreen key={item.name}>
            {item.name}
          </SecondarySectionGreen>
        );
      })}
      {hasMounted ? (
        <Fragment>
          <PrimarySection>
            {battery.level
              ? `Battery: ${battery.level * 100}%${
                  battery.charging ? " Charging" : ""
                }`
              : "\u00a0"}
          </PrimarySection>
          <PrimarySection>
            {geolocation.latitude
              ? `Geolocation: ${geolocation.longitude.toFixed(
                  6
                )} ${geolocation.latitude.toFixed(6)}`
              : "\u00a0"}
          </PrimarySection>
          <PrimarySection>Idle: {JSON.stringify(idle)}</PrimarySection>
          <PrimarySection>
            {location.href ? `Location: ${location.href}` : "\u00a0"}
          </PrimarySection>
          <PrimarySection>
            {network.effectiveType
              ? `Network: ${network.online ? "Online" : "Offline"} (Latency ${
                  network.rtt
                }ms)`
              : "\u00a0"}
          </PrimarySection>
          <PrimarySection>
            Window scroll {windowScroll.x} x {windowScroll.y}
          </PrimarySection>
          <PrimarySection>
            {windowSize.height > 10 && windowSize.height < 100000
              ? `Window Size ${windowSize.height} x ${windowSize.width}`
              : "\u00a0"}
          </PrimarySection>
          <PrimarySection>
            {orientation.type
              ? `Orientation: ${
                  orientation.type.match(/landscape/i)
                    ? "Landscape"
                    : "Portrait"
                }`
              : "\u00a0"}
          </PrimarySection>
        </Fragment>
      ) : (
        <div>loading...</div>
      )}
    </Grid>
  );
});
