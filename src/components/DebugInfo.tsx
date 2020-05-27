import React, { useState, useEffect } from "react";

import Text from "src/components/Text";
import { useSelector } from "src/store/index";
import { useIncrementer, useIncrementalTimer } from "src/common-hooks";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";

const Root = styled("div")`
  grid-area: meta;
  align-items: flex-start;
  justify-content: flex-start;
  justify-self: center;
  width: 100%;
  max-width: calc(100vw - (2 * var(--space-medium)));
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
      <Text size="heading" tone="brand">
        Debug info
      </Text>
      <Text
        size="small"
        title={
          isServerRender
            ? `This application was served by a server render on request. \nRequest Id: ${requestId}. \nRequest Count: ${requestCounter}.`
            : "This application was served by a statically rendered document at build time."
        }
      >
        Render type: {isServerRender ? "Live Server" : "Static"}
      </Text>
      <Text size="small" title="This value is updated client side.">
        Dynamic value: {count}
      </Text>
      <Text size="small">Initial route: {initialRoute}</Text>
      <Text size="small">Current route: {location.pathname}</Text>
      <Text size="small">Version: {version}</Text>
      <Text size="small">
        First paint:{" "}
        {paintTiming.firstPaint
          ? `${Math.floor(paintTiming.firstPaint)}ms`
          : ""}
      </Text>
      <Text size="small">
        FCP:{" "}
        {paintTiming.firstContentfulPaint
          ? `${Math.floor(paintTiming.firstContentfulPaint)}ms`
          : ""}
      </Text>
      {requestId ? (
        <Text size="small" title={requestId}>
          Request id: {(requestId || "").substr(0, 8)}
        </Text>
      ) : null}
      {typeof requestCounter === "number" ? (
        <Text size="small">Request counter: {requestCounter}</Text>
      ) : null}
      <Text size="small" title={visitorId}>
        Visitor id: {(visitorId || "").substr(0, 8)}
      </Text>
    </Root>
  );
}
