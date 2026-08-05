import { getTechIcon } from "@/constants/techIcons";

const TechBadge = ({ name }: { name: string }) => {
  const icon = getTechIcon(name);

  return (
    /**
     * 뱃지는 밝은 칩으로 그립니다. 라이트 모드에서는 어두운 인용구 위에서 또렷하게 떠 보이고,
     * 흰 페이지 배경 위에서는 테두리가 윤곽을 잡아 줍니다.
     */
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border-[1px] border-solid border-GRAY dark:border-GRAY_HEAVY bg-white dark:bg-BLACK text-xs font-medium text-GRAY_EXTRAHEAVY dark:text-GRAY_LIGHT">
      {icon && (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className="tech-icon w-3.5 h-3.5 shrink-0"
          style={
            {
              "--tech-icon": `#${icon.hex}`,
              "--tech-icon-dark": `#${icon.darkHex}`,
            } as React.CSSProperties
          }
        >
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </span>
  );
};

/**
 * @description 기술 스택만 나열된 줄을 아이콘 뱃지로 표시합니다.
 * 아이콘이 없는 스택은 텍스트만 있는 같은 모양의 뱃지가 됩니다.
 */
const TechStack = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5 py-2">
    {items.map((item) => (
      <TechBadge key={item} name={item} />
    ))}
  </div>
);

export default TechStack;
