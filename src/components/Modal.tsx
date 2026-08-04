import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;

  /**
   * body로 포털해서 띄웁니다.
   * 스크롤 등장 애니메이션(.reveal)이 끝난 뒤에도 transform 이 none 이 아닌 항등 행렬로 남는데,
   * none 이 아닌 transform 은 position: fixed 의 containing block 을 만듭니다.
   * 제자리에 렌더하면 모달이 뷰포트가 아니라 그 요소 기준으로 잡혀 화면 밖으로 밀립니다.
   */
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-BLACK/60 p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[85vh] overflow-auto rounded-lg bg-white dark:bg-BLACK shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY bg-white dark:bg-BLACK px-4 py-3">
          {title && <span className="text-xs font-medium text-GRAY_HEAVY">{title}</span>}
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
    </div>,
    document.body,
  );
};

export default Modal;
