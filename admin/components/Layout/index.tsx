type Props = {
  children: JSX.Element | JSX.Element[];
};
export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-center text-3xl p-4 font-bold tracking-widest">
        Blackbeard Admin
      </div>
      <div>{children}</div>
    </div>
  );
}
