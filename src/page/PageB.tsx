import styled from "@emotion/styled";
import md5 from "md5";
import React from "react";

import {
  useIncrementalTimer,
  useIncrementer,
  useLogMount,
  useToggler,
} from "src/common-hooks";
import Text from "src/Text";

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

export default function PageB() {
  const [indexStart, incrementIndex] = useIncrementer(1);
  const [showMore, toggleShowMore] = useToggler(false);

  useLogMount("Page B");
  useIncrementalTimer(incrementIndex, 5000);

  const pixels = [];
  for (let i = 0; i < 200; i++) {
    pixels.push(
      <Pixel key={i} color={`${i * indexStart}`}>
        {" "}
      </Pixel>
    );
  }
  return (
    <div>
      <h3 onClick={toggleShowMore}>Page B & more 1</h3>
      <Text>Things and stuffs</Text>
      {showMore && <Text>More</Text>}
      <PixelContainer>{pixels}</PixelContainer>
    </div>
  );
}
