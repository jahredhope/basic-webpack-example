import { Link as RouterLink } from "@reach/router";
import React, { MouseEvent } from "react";

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
    const params = new URLSearchParams();
    params.set("type", "link");
    params.set("href", href);
    params.set("name", name || href);
    params.set("currentHref", window.document.location.href);
    navigator.sendBeacon("/events/", params.toString());
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
