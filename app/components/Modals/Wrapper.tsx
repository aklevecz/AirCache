type Props = {
  children: JSX.Element | JSX.Element[];
};
export default function Wrapper({ children }: Props) {
  return <div className="bg-black p-10 w-58">{children}</div>;
}
