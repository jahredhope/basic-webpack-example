import React, { memo } from "react";
import { Helmet } from "react-helmet";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Text from "src/components/Text";
import Card from "src/components/Card";
import theme from "src/theme";
import UpdateNameForm from "src/components/UpdateNameForm";
import ToolingImages from "src/components/ToolingImages";

import content from "../content.md";
import styled from "@emotion/styled";

const MarkdownContent = styled("section")`
  font-size: ${theme.type.size.body};
  font-weight: ${theme.type.weight.light};
  & h1 {
    font-size: ${theme.type.size.heading};
    font-weight: ${theme.type.weight.heavy};
  }
  & h2 {
    font-size: ${theme.type.size.heading};
    font-weight: ${theme.type.weight.heavy};
  }
`;

const Root = styled(Card)`
  max-width: 100%;
  overflow: hidden;
`;

export default memo(function PageA() {
  useLogMount("PageA");
  useTrackPageView("PageA");

  return (
    <Root>
      <Helmet>
        <title>Page A - Static content</title>
      </Helmet>
      <div>
        <Text heading as={"h3"} primary>
          Page A - Static content
        </Text>
        <MarkdownContent dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div>
        <Text heading>Example form</Text>
        <UpdateNameForm />
      </div>
      <ToolingImages />
    </Root>
  );
});
