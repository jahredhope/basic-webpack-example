import React from "react";

const values = "abcdefghijklmnopqrstuvwxyz";

import { useLogMount } from "src/common-hooks";
export default function PageA() {
  useLogMount("Page A");
  return (
    <div>
      <h3>Page A</h3>
      <ul>
        {values.split("").map((val, index) => (
          <li key={index}>
            {index} - {val}
          </li>
        ))}
      </ul>
    </div>
  );
}
