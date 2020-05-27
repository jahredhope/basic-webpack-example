import React, { memo } from "react";
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
import Loader from "src/components/Loader";
import Text from "src/components/Text";
import Page from "src/components/page";
import Stack from "src/components/Stack";

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
    <>
      <Helmet>
        <title>Page C - Client-side content</title>
      </Helmet>
      <Page>
        <Stack space="medium" inset>
          <Text size="hero" tone="brand" center>
            Client-side content
          </Text>
          <Text center>
            This page contains mostly client-side content with minimal static
            rendering.
          </Text>
        </Stack>
        {hasMounted ? (
          <Stack space="small" inset>
            <Text>
              {battery.level
                ? `Battery: ${battery.level * 100}%${
                    battery.charging ? " Charging" : ""
                  }`
                : "\u00a0"}
            </Text>
            <Text>
              {geolocation.latitude
                ? `Geolocation: ${geolocation.longitude.toFixed(
                    6
                  )} ${geolocation.latitude.toFixed(6)}`
                : "\u00a0"}
            </Text>
            <Text>Idle: {JSON.stringify(idle)}</Text>
            <Text>
              {location.href ? `Location: ${location.href}` : "\u00a0"}
            </Text>
            <Text>
              {network.effectiveType
                ? `Network: ${network.online ? "Online" : "Offline"} (Latency ${
                    network.rtt
                  }ms)`
                : "\u00a0"}
            </Text>
            <Text>
              Window scroll {windowScroll.x} x {windowScroll.y}
            </Text>
            <Text>
              {windowSize.height > 10 && windowSize.height < 100000
                ? `Window Size ${windowSize.height} x ${windowSize.width}`
                : "\u00a0"}
            </Text>
            <Text>
              {orientation.type
                ? `Orientation: ${
                    orientation.type.match(/landscape/i)
                      ? "Landscape"
                      : "Portrait"
                  }`
                : "\u00a0"}
            </Text>
          </Stack>
        ) : (
          <Loader />
        )}
      </Page>
    </>
  );
});
