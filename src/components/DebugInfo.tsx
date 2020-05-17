import React, { useState, useEffect } from "react";

import Text from "src/components/Text";
import { useSelector } from "src/store/index";
import { useIncrementer, useIncrementalTimer } from "src/common-hooks";
import Card from "./Card";
import { useDisplayName } from "src/store/user";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";

const Root = styled(Card)`
  grid-area: meta;
`;

const usePaintTiming = () => {
  const [state, setState] = useState({
    firstPaint: null,
    firstContentfulPaint: null,
  });
  useEffect(() => {
    setTimeout(() => {
      const entries = performance.getEntriesByType("paint");
      const firstPaint = entries.find((v) => v.name === "first-paint");
      const firstContentfulPaint = entries.find(
        (v) => v.name === "first-contentful-paint"
      );
      setState({
        firstPaint: firstPaint?.startTime,
        firstContentfulPaint: firstContentfulPaint?.startTime,
      });
    }, 1000);
  }, []);
  return state;
};

export default function DebugInfo() {
  const location = useLocation();
  const displayName = useDisplayName();
  const version = useSelector((state) => state.version);
  const initialRoute = useSelector((state) => state.initialRoute);
  const requestId = useSelector((state) => state.requestId);
  const visitorId = useSelector((state) => state.visitorId);
  const requestCounter = useSelector((state) => state.requestCounter);
  const [count, incrementCount] = useIncrementer(1);
  useIncrementalTimer(incrementCount, 3000);
  const isServerRender = Boolean(requestId || requestCounter);
  const paintTiming = usePaintTiming();
  return (
    <Root>
      <Text heading primary>
        Debug info
      </Text>
      <Text
        title={
          isServerRender
            ? `This application was served by a server render on request. \nRequest Id: ${requestId}. \nRequest Count: ${requestCounter}.`
            : "This application was served by a statically rendered document at build time."
        }
      >
        Render type: {isServerRender ? "Live Server" : "Static"}
      </Text>
      <Text title="This value is updated client side.">
        Dynamic value: {count}
      </Text>
      <Text>Initial route: {initialRoute}</Text>
      <Text>Current route: {location.pathname}</Text>
      <Text>Version: {version}</Text>
      <Text>
        First paint:{" "}
        {paintTiming.firstPaint
          ? `${Math.floor(paintTiming.firstPaint)}ms`
          : ""}
      </Text>
      <Text>
        FCP:{" "}
        {paintTiming.firstContentfulPaint
          ? `${Math.floor(paintTiming.firstContentfulPaint)}ms`
          : ""}
      </Text>
      {requestId ? <Text>Request id: {requestId}</Text> : null}
      {typeof requestCounter === "number" ? (
        <Text>Request counter: {requestCounter}</Text>
      ) : null}
      <Text>User: {displayName}</Text>
      <Text>Visitor id: {(visitorId || "").substr(0, 8)}</Text>
    </Root>
  );
}
