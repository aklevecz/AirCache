import clsx from "clsx";
import Button from ".";

export default function Big({ children, className, ...rest }: any) {
  return (
    <Button
      {...rest}
      className={clsx("font-bold text-1xl px-7 py-3", className)}
    >
      {children}
    </Button>
  );
}
