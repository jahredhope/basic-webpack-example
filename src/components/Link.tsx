import { Link as RouterLink } from "react-router-dom";
import React, { MouseEvent } from "react";
import { sendLinkEvent } from "src/analytics";

interface IProps {
  href: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  [propName: string]: any;
}

function isExternal(href: string) {
  return Boolean(href.match(/^http/));
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
  if (isExternal(href)) {
    return (
      <a {...rest} href={href} onClick={handleClick}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink {...rest} to={href} onClick={handleClick}>
      {children}
    </RouterLink>
  );
}
