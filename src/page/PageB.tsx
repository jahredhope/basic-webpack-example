import md5 from "md5";
import React from "react";

import * as styles from "./Pixel.treat";

import {
  useIncrementalTimer,
  useIncrementer,
  useLogMount,
  useToggler,
} from "src/common-hooks";
import Card from "src/components/Card";
import Text from "src/components/Text";

export default function PageB() {
  const [indexStart, incrementIndex] = useIncrementer(1);
  const [showMore, toggleShowMore] = useToggler(false);

  useLogMount("Page B");
  useIncrementalTimer(incrementIndex, 5000);

  const pixels = [];
  for (let i = 0; i < 20; i++) {
    pixels.push(
      <div
        className={styles.pixel}
        key={i}
        style={{ backgroundColor: `#${md5(`${i * indexStart}`).substr(0, 6)}` }}
      >
        {" "}
      </div>
    );
  }
  return (
    <div>
      <Card>
        <Text heading>Page B</Text>
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
        <div className={styles.pixelContainer}>{pixels}</div>
      </Card>
    </div>
  );
}
