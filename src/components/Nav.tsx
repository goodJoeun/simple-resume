import { useEffect, useRef, useState } from "react";

import DarkModeToggle from "./DarkModeToggle";

const NAV_ITEMS = [
  { id: "strength", label: "Strengths" },
  { id: "experience", label: "Experience" },
  { id: "activities", label: "Activities" },
  { id: "education", label: "Education" },
];

const Nav = () => {
  const [activeId, setActiveId] = useState("");
  const visibleIds = useRef(new Set<string>());

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleIds.current.add(entry.target.id);
          else visibleIds.current.delete(entry.target.id);
        });

        // 여러 섹션이 동시에 걸쳐 있으면 문서 순서상 가장 위의 것을 활성으로 봅니다.
        const current = NAV_ITEMS.find(({ id }) => visibleIds.current.has(id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-2 md:top-0 z-40 border-b-[1px] border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid bg-white/90 dark:bg-BLACK/90 backdrop-blur">
      <div className="max-w-4xl mx-auto flex items-center gap-4 px-4 md:px-8 py-2">
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`px-3 py-2 rounded-md text-sm whitespace-nowrap hover:text-PRIMARY_HEAVY dark:hover:text-PRIMARY ${
                activeId === id ? "text-PRIMARY font-semibold" : "text-GRAY_HEAVY"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Nav;
