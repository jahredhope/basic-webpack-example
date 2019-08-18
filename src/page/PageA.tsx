import React from "react";
import Card from "src/components/Card";
import Text from "src/components/Text";

const values = "abcdefg";

import * as styles from "../components/Button.treat";

import { useLogMount } from "src/common-hooks";
export default function PageA() {
  useLogMount("Page A");
  return (
    <Card>
      <button className={styles.button}>A Styled Button</button>
      <Text heading as={"h3"}>
        Page A (eyeyyyyy)
      </Text>
      <ul>
        {values.split("").map((val, index) => (
          <li key={index}>
            <Text secondary>
              {index} - {val}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
