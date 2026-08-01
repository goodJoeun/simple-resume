import { useEffect } from "react";

const Modal = ({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-BLACK/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] overflow-auto rounded-lg bg-white dark:bg-BLACK shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY bg-white dark:bg-BLACK px-4 py-3">
          {title && <span className="font-mono text-xs text-GRAY_HEAVY">{title}</span>}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="ml-auto text-GRAY_HEAVY hover:text-BLACK dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
