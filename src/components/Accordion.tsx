import { useState } from "react";

const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-[1px] border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left group"
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
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
};

export default Accordion;
