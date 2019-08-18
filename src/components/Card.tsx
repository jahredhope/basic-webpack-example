import classNames from "classnames";
import React from "react";
import { background, card } from "./Card.treat";

interface Props {
  children?: React.ReactNode;
  tone?: "primary" | "secondary" | "standard";
}

export default function Card({ tone = "standard", children }: Props) {
  return <div className={classNames(card, background[tone])}>{children}</div>;
}
