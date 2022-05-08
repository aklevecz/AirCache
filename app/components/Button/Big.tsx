import Button from ".";

export default function Big({ children, ...rest }: any) {
  return (
    <Button {...rest} className="font-bold text-1xl px-7 py-3">
      {children}
    </Button>
  );
}
