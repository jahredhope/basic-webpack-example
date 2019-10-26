import styled from "@emotion/styled";
import md5 from "md5";
import React from "react";

import { useIncrementalTimer, useIncrementer } from "src/common-hooks";

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

export default function Pixels() {
  const [indexStart, incrementIndex] = useIncrementer(1);
  useIncrementalTimer(incrementIndex, 5000);

  const pixels = [];
  for (let i = 0; i < 20; i++) {
    pixels.push(
      <Pixel key={i} color={`${i * indexStart}`}>
        {" "}
      </Pixel>
    );
  }
  return <PixelContainer>{pixels}</PixelContainer>;
}
