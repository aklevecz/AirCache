import { LayoutProps } from "./types";

export default function SectionHeading({ children }: LayoutProps) {
  return <div className="uppercase text-2xl font-bold">{children}</div>;
}
