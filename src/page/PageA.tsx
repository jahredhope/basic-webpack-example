import React, { memo } from "react";
import { Helmet } from "react-helmet";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Text from "src/components/Text";
import UpdateNameForm from "src/components/UpdateNameForm";
import { useDisplayName } from "src/store/user";
import { SegmentedPage } from "src/components/SegmentedPage";

export default memo(function PageA() {
  useLogMount("PageA");
  useTrackPageView("PageA");
  const displayName = useDisplayName();

  return (
    <SegmentedPage>
      <Helmet>
        <title>Page A</title>
      </Helmet>
      <div>
        <Text heading as={"h3"}>
          Page A
        </Text>
        <Text>
          This application is a demo ground for testing web application
          behaviours. In order to be a good testing ground it contains example
          functionality that needs to be supported. Some behaviours include:
          Multiple pages, async loading application, static and server
          rendering, and client side JavaScript.
        </Text>
        <Text>
          This page presents static content to the user that can be statically
          rendered. It also includes a dynamic form.
        </Text>
      </div>
      <div>
        <Text heading>Example form</Text>
        <UpdateNameForm />
        <Text heading>{displayName}</Text>
      </div>
    </SegmentedPage>
  );
});
