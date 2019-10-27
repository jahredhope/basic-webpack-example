import { useEffect } from "react";

interface Event {
  type: string;
  [key: string]: string;
}

const sendEvent = (event: Event) => {
  const params = new URLSearchParams();

  params.set("localTime", `${Date.now()}`);

  Object.entries(event).map(([key, value]) => {
    params.set(key, value);
  });

  navigator.sendBeacon("/events/", params.toString());
};

export const sendLinkEvent = ({
  href,
  name,
}: {
  href: string;
  name: string;
}) => {
  sendEvent({
    currentHref: window.document.location.href,
    href,
    name: name || href,
    type: "link",
  });
};

export const sendPageViewedEvent = ({ pageName }: { pageName: string }) => {
  sendEvent({
    currentHref: window.document.location.href,
    name: pageName,
    type: "pageview",
  });
};

export const useTrackPageView = (pageName: string) => {
  useEffect(() => sendPageViewedEvent({ pageName }), []);
};
