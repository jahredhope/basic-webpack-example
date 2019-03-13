import { Link } from "@reach/router";
import React from "react";
import Text from "./Text";

interface IProps {
  href: string;
  className?: string;
}

export default function TextLink({ href, className, ...rest }: IProps) {
  return (
    <Link to={href} className={className}>
      <Text link {...rest} />
    </Link>
  );
}
