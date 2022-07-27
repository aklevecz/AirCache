import { forwardRef } from "react";

type Props = {};

export const Map = forwardRef<HTMLDivElement, Props>(({}, ref) => {
  return <div ref={ref} style={{ height: "100%", width: "100%" }}></div>;
});
