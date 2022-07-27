import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import ClientOnlyPortal from "./ClientOnlyPortal";
// import "./styles.css";

type ModalRef = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<ModalRef, any>((props, ref) => {
  const { children, fade = false, defaultOpened = false } = props;
  const [isOpen, setIsOpen] = useState(defaultOpened);

  const close = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close,
    }),
    [close]
  );

  const handleEscape = useCallback(
    (event: any) => {
      if (event.keyCode === 27) close();
    },
    [close]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [handleEscape, isOpen]);

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal-root">
          <div className={`modal ${fade ? "modal-fade" : ""}`}>
            <div className="modal-overlay" onClick={close} />
            <span
              role="button"
              className="modal-close"
              aria-label="close"
              onClick={close}
            >
              x
            </span>
            <div className="modal-body">{children}</div>
            <style jsx>{`
              .modal {
                position: fixed;
                overflow: hidden;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.65);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5em 1em;
                z-index: 999999;
                box-sizing: border-box;
              }

              .modal.modal-fade {
                animation: fade-in 1s 1 linear;
                animation-fill-mode: forwards;
                opacity: 0;
              }

              .modal > .modal-overlay {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
              }

              .modal > .modal-close {
                position: absolute;
                right: 15px;
                top: 10px;
                color: #5e5e5e;
                cursor: pointer;
                font-size: 1.25em;
                padding: 7px;
                background: rgba(255, 255, 255, 0.749);
                border: 1px solid #c3c0c0;
                border-radius: 50%;
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                box-sizing: border-box;
                display: inline-block;
                text-align: center;
              }

              .modal > .modal-close:hover {
                background: rgba(255, 255, 255, 0.989);
              }

              .modal > .modal-body {
                z-index: 2;
                position: relative;
                margin: 0 auto;
                background-color: #303030;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 3px;
                overflow-x: hidden;
                overflow-y: auto;
                max-height: 100%;
                padding: 15px 20px;
                color: #c3c0c0;
              }

              @keyframes fade-in {
                0% {
                  animation-timing-function: cubic-bezier(
                    0.2242,
                    0.7499,
                    0.3142,
                    0.8148
                  );
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
});

export default Modal;
