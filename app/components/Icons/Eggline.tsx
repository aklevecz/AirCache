export default function EgglineIcon({ color = "white" }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="12 8 50 50"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <path
        fill="none"
        stroke={color}
        strokeWidth={7}
        d="M52.4,40.4c0,8.4-6.8,15.2-15.2,15.2c-8.4,0-15.2-6.8-15.2-15.2c0,0,0,0,0,0c0-8.4,6.8-26.8,15.2-26.8
						S52.4,32,52.4,40.4z"
      />
    </svg>
  );
}
