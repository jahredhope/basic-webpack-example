import React, { memo } from "react";
import { Helmet } from "react-helmet";

import { useLogMount } from "src/common-hooks";
import Card from "src/components/Card";
import Text from "src/components/Text";
import UpdateNameForm from "src/components/UpdateNameForm";
import { useDisplayName } from "src/store/user";

export default memo(function PageA() {
  useLogMount("PageA");
  const displayName = useDisplayName();

  return (
    <Card>
      <Helmet>
        <title>Page A</title>
      </Helmet>
      <Text heading as={"h3"}>
        Page A
      </Text>
      <Text>Update your name</Text>
      <UpdateNameForm />
      <Text heading>{displayName}</Text>
    </Card>
  );
});
