import styled from "@emotion/styled";
import md5 from "md5";
import React, { memo } from "react";
import { Helmet } from "react-helmet";
import {
  useIncrementalTimer,
  useIncrementer,
  useLogMount,
  useToggler,
} from "src/common-hooks";
import Card from "src/components/Card";
import RedditPosts from "src/components/RedditPosts";
import Text from "src/components/Text";
import { useDisplayName } from "src/store/user";

const PixelContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Pixel = styled("div")`
  height: 100px;
  width: 100px;
  background-color: #${({ color }) => md5(color).substr(0, 6)};
`;

export default memo(function PageB() {
  const displayName = useDisplayName();
  const [indexStart, incrementIndex] = useIncrementer(1);
  const [showMore, toggleShowMore] = useToggler(false);

  useLogMount("PageB");
  useIncrementalTimer(incrementIndex, 5000);

  const pixels = [];
  for (let i = 0; i < 20; i++) {
    pixels.push(
      <Pixel key={i} color={`${i * indexStart}`}>
        {" "}
      </Pixel>
    );
  }
  return (
    <div>
      <Helmet>
        <title>Page B</title>
      </Helmet>
      <Card>
        <Text heading>Page B - {displayName}</Text>
      </Card>
      <Card>
        <a
          href="#"
          onClick={event => {
            event.preventDefault();
            toggleShowMore();
          }}
        >
          <Text link>Show more</Text>
        </a>
        {showMore && <Text secondary>More</Text>}
      </Card>
      <Card>
        <PixelContainer>{pixels}</PixelContainer>
      </Card>
      <RedditPosts />
    </div>
  );
});
