import { X } from "lucide-react";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

interface ModalContextValue {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal compound components must be used inside Modal");
  }

  return context;
};

interface ModalProps {
  children: ReactNode;
}

interface ModalOpenProps {
  opens: string;
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;
}

interface ModalWindowProps {
  name: string;
  children: ReactElement<{
    onClose?: () => void;
  }>;
}

const ModalRoot = ({ children }: ModalProps) => {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
};

const Open = ({ opens, children }: ModalOpenProps) => {
  const { open } = useModalContext();

  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children, {
    onClick: (event: MouseEvent<HTMLElement>) => {
      children.props.onClick?.(event);
      open(opens);
    },
  });
};

const Window = ({ name, children }: ModalWindowProps) => {
  const { openName, close } = useModalContext();

  if (name !== openName || !isValidElement(children)) {
    return null;
  }

  return (
    <div
      className="inset-0 fixed z-50 flex items-center justify-center bg-black/50 px-3 backdrop-blur-2xl animate-in fade-in duration-200 sm:px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md movie-card p-5 shadow-2xl glow-effect transform animate-in zoom-in-95 duration-300 sm:p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 rounded-full p-1.5 transition-colors hover:bg-slate-700/50 group sm:top-4 sm:right-4 sm:p-2"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white sm:h-6 sm:w-6" />
        </button>
        {cloneElement(children, { onClose: close })}
      </div>
    </div>
  );
};

export const Modal = Object.assign(ModalRoot, { Open, Window });

export default Modal;
