export default function Close({ fill = "#000" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
      <path
        fill={fill}
        fill-rule="evenodd"
        d="M11.649 2.049A1.2 1.2 0 1 0 9.95.35L6 4.303 2.049.35A1.2 1.2 0 0 0 .35 2.05L4.303 6 .35 9.951a1.2 1.2 0 1 0 1.698 1.697L6 7.699l3.951 3.95a1.2 1.2 0 1 0 1.697-1.697L7.699 6l3.95-3.951Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
