export default function BouncyEgg({ size, className }: any) {
  return (
    <img
      src="/egg.png"
      className={className}
      style={{
        width: size ? size : "var(--egg-width)",
        height: size ? size * 1.4 : "var(--egg-height)",
        animation: "bouncy-egg 1s ease-in infinite",
      }}
    />
  );
}
