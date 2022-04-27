export default function MapIcon({ color = "white" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
    >
      <path
        fill={color}
        d="M6.57 13.41c-.373 0-.741-.066-1.093-.195l.407-1.105c.221.081.451.122.686.122.26 0 .514-.05.754-.148l.447 1.09c-.382.157-.786.236-1.201.236zm8.67-.783l-1.659-.945.583-1.024 1.66.945-.584 1.024zm-6.455-.02l-.605-1.011 1.639-.981.605 1.011-1.639.981zm3.918-1.408c-.243-.101-.5-.153-.764-.153-.23 0-.457.04-.674.119l-.401-1.108c.346-.125.708-.188 1.075-.189.42 0 .83.082 1.217.244l-.453 1.087zm-8.734-.163c-.535 0-.969.433-.969.968 0 .535.434.968.969.968.535 0 .969-.434.969-.968-.001-.535-.434-.968-.969-.968zm13.576-7.036l-5.545-4-5.545 4-6.455-4v20l6.455 4 5.545-4 5.545 4 6.455-4v-20l-6.455 4zm4.455 14.887l-4 2.479v-4.366h-1v4.141l-4-2.885v-4.256h-2v4.255l-4 2.885v-5.14h-1v5.365l-4-2.479v-15.294l4 2.479v2.929h1v-2.927l4-2.886v3.813h2v-3.813l4 2.886v1.927h1v-1.929l4-2.479v15.295zm-1.328-4.871l-1.296-1.274 1.273-1.293-.708-.702-1.272 1.295-1.294-1.272-.703.702 1.296 1.276-1.273 1.296.703.703 1.277-1.298 1.295 1.275.702-.708z"
      />
    </svg>
  );
}
