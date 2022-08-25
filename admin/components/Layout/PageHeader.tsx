import { LayoutProps } from "./types";

export default function PageHeader(props: LayoutProps) {
  return <div className="text-2xl text-center">{props.children}</div>;
}
