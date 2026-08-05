import { useState } from "react";

const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    /**
     * 다크 모드에서는 테두리(#495057)만으로 배경(#212529)과 구분이 약해,
     * 카드 면에 옅은 배경을 깔아 경계를 만듭니다.
     */
    <div
      className={`w-full min-w-0 rounded-lg border-[1px] border-solid bg-white dark:bg-GRAY_EXTRAHEAVY/20 transition-colors ${
        open
          ? "border-GRAY_HEAVY"
          : "border-GRAY dark:border-GRAY_EXTRAHEAVY hover:border-GRAY_HEAVY"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left group border-solid ${
          open ? "border-b-[1px] border-GRAY dark:border-GRAY_EXTRAHEAVY" : "border-b-0"
        }`}
      >
        <span className="text-lg font-semibold group-hover:text-PRIMARY">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`w-4 h-4 shrink-0 text-GRAY_HEAVY transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {/* 펼친 내용이 카드보다 넓어도 카드를 밀어내지 않도록, 넘치는 만큼은 안에서 처리합니다. */}
      {open && <div className="min-w-0 overflow-hidden px-5 pb-6 pt-2">{children}</div>}
    </div>
  );
};

export default Accordion;
