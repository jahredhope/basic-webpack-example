import styled from "@emotion/styled";
import React, { Fragment, memo } from "react";
import { Helmet } from "react-helmet";
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
import { useTrackPageView } from "src/analytics";
import { useHasMounted, useLogMount } from "src/common-hooks";
import Card from "src/components/Card";
import Text from "src/components/Text";

const Section = styled("div")`
  background-color: hsl(280, 15%, 80%);
  color: hsl(280, 98%, 24%);
  padding: 12px 3vw;
`;

export default memo(function PageC() {
  useLogMount("PageC");
  useTrackPageView("PageC");

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
    <Fragment>
      <Helmet>
        <title>Page C</title>
      </Helmet>
      <Card>
        <Text heading>Currently on Page C</Text>
      </Card>
      {hasMounted ? (
        <Fragment>
          <Section>
            {battery.level
              ? `Battery: ${battery.level * 100}%${
                  battery.charging ? " Charging" : ""
                }`
              : "\u00a0"}
          </Section>
          <Section>
            {geolocation.latitude
              ? `Geolocation: ${geolocation.longitude.toFixed(
                  6
                )} ${geolocation.latitude.toFixed(6)}`
              : "\u00a0"}
          </Section>
          <Section>Idle: {JSON.stringify(idle)}</Section>
          <Section>
            {location.href ? `Location: ${location.href}` : "\u00a0"}
          </Section>
          <Section>
            {network.effectiveType
              ? `Network: ${network.online ? "Online" : "Offline"} (Latency ${
                  network.rtt
                }ms)`
              : "\u00a0"}
          </Section>
          <Section>
            Window scroll {windowScroll.x} x {windowScroll.y}
          </Section>
          <Section>
            {windowSize.height > 10 && windowSize.height < 100000
              ? `Window Size ${windowSize.height} x ${windowSize.width}`
              : "\u00a0"}
          </Section>
          <Section>
            {orientation.type
              ? `Orientation: ${
                  orientation.type.match(/landscape/i)
                    ? "Landscape"
                    : "Portrait"
                }`
              : "\u00a0"}
          </Section>
        </Fragment>
      ) : (
        <Text>loading...</Text>
      )}
    </Fragment>
  );
});
