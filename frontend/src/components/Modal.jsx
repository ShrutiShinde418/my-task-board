import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const Modal = ({ children, open, onClose }) => {
  const dialogRef = useRef(null);
  const { closeOffCanvasHandler } = useTaskSlice();

  useEffect(() => {
    const modal = dialogRef.current;
    if (open) {
      modal.showModal();
    }

    return () => modal.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          dialogRef.current.close();
          closeOffCanvasHandler();
        }
      }}
      className="lg:w-1/2 md:w-2/3 w-full m-0 right-0 ml-auto min-h-screen my-4 mr-4 rounded-xl"
    >
      {open ? children : null}
    </dialog>,
    document.getElementById("offcanvas"),
  );
};

export default Modal;
