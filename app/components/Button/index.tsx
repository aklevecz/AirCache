import clsx from "clsx";

export default function Button({ children, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx("bg-white text-black rounded-full px-3 py-2", className)}
    >
      {children}
    </button>
  );
}
