import React from "react";
import Link from "./Link";
import Text from "./Text";

interface IProps {
  name?: string;
  href: string;
  className?: string;
  [propName: string]: any;
}

export default function TextLink({ href, name, className, ...rest }: IProps) {
  return (
    <Link href={href} className={className} name={name}>
      <Text tone="link" {...rest} />
    </Link>
  );
}
