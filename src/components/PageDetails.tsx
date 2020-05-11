import React from "react";

import Text from "src/components/Text";
import { useSelector } from "src/store/index";
import { useIncrementer, useIncrementalTimer } from "src/common-hooks";
import Card from "./Card";
import { useDisplayName } from "src/store/user";
import styled from "@emotion/styled";
import { useLocation } from "@reach/router";
// import ToolingImages from "./ToolingImages";

const Root = styled(Card)`
  grid-area: meta;
`;

export default function PageDetails() {
  const location = useLocation();
  const displayName = useDisplayName();
  const initialRoute = useSelector((state) => state.initialRoute);
  const requestId = useSelector((state) => state.requestId);
  const requestCounter = useSelector((state) => state.requestCounter);
  const [count, incrementCount] = useIncrementer(1);
  useIncrementalTimer(incrementCount, 3000);
  const isServerRender = Boolean(requestId || requestCounter);
  return (
    <Root>
      <Text heading primary>
        App info
      </Text>
      <Text
        title={
          isServerRender
            ? `This application was served by a server render on request. \nRequest Id: ${requestId}. \nRequest Count: ${requestCounter}.`
            : "This application was served by a statically rendered document at build time."
        }
      >
        Type: {isServerRender ? "Live Server" : "Static"}
      </Text>
      <Text title="This value is updated client side.">
        Dynamic Value: {count}
      </Text>
      <Text>Initial Route: {initialRoute}</Text>
      <Text>Current Route: {location.pathname}</Text>
      {requestId ? <Text>Request Id: {requestId}</Text> : null}
      {typeof requestCounter === "number" ? (
        <Text>Request Counter: {requestCounter}</Text>
      ) : null}
      <Text>User: {displayName}</Text>
    </Root>
  );
}
