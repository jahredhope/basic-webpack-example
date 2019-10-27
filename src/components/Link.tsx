import { Link as RouterLink } from "@reach/router";
import React, { MouseEvent } from "react";
import { sendLinkEvent } from "src/analytics";

interface IProps {
  href: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  [propName: string]: any;
}

export default function Link({
  href,
  name,
  children,
  onClick,
  ...rest
}: IProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    sendLinkEvent({ href, name });
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <RouterLink {...rest} to={href} onClick={handleClick}>
      {children}
    </RouterLink>
  );
}
