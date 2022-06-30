import { useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const toggleModal = (data?: any) => {
    setOpen(!open);
    setData(data);
  };
  return { open, toggleModal, data };
}
