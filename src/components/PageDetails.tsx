import React from "react";

import Text from "src/components/Text";
import { useSelector } from "src/store/index";
import { useIncrementer, useIncrementalTimer } from "src/common-hooks";
import Card from "./Card";

export default function PageDetails() {
  const initialRoute = useSelector((state) => state.initialRoute);
  const requestId = useSelector((state) => state.requestId);
  const requestCounter = useSelector((state) => state.requestCounter);
  const [count, incrementCount] = useIncrementer(1);
  useIncrementalTimer(incrementCount, 3000);
  const isServerRender = Boolean(requestId || requestCounter);
  return (
    <Card>
      <Text heading primary>
        Page Details
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
      {requestId ? <Text>Request Id: {requestId}</Text> : null}
      {typeof requestCounter === "number" ? (
        <Text>Request Counter: {requestCounter}</Text>
      ) : null}
    </Card>
  );
}
