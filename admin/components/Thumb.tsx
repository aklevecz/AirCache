import { useEffect, useState } from "react";

export default function Thumb({ file }: any) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState<any>(null);

  useEffect(() => {
    if (file) {
      console.log(file);
    }
  });

  return <div>wtf</div>;
}
