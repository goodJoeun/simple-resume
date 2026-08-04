import { useTheme } from "next-themes";
import { useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import Modal from "./Modal";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-3 rounded-md border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-mono text-GRAY_LIGHT hover:bg-white/20"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
};

/**
 * @description 코드 펜스의 언어 id를 그대로 노출하면 `diff 코드 보기`처럼 어색하게 읽히므로,
 * 사람이 읽는 이름으로 옮깁니다. 목록에 없는 언어는 id를 그대로 씁니다.
 */
const LABEL_BY_LANGUAGE: Record<string, string> = {
  diff: "코드",
  js: "JavaScript 코드",
  jsx: "JavaScript 코드",
  ts: "TypeScript 코드",
  tsx: "TypeScript 코드",
};

const getLabel = (language?: string) => {
  if (!language) return "코드";
  return LABEL_BY_LANGUAGE[language] ?? `${language} 코드`;
};

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const CodeBlockPopup = ({ code, language }: { code: string; language?: string }) => {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const label = getLabel(language);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group my-2 flex w-fit items-center gap-2 rounded-md border border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid bg-white dark:bg-GRAY_EXTRAHEAVY/40 px-3 py-2 text-xs text-GRAY_HEAVY dark:text-GRAY transition-colors hover:border-GRAY hover:bg-GRAY_LIGHT hover:text-PRIMARY dark:hover:border-GRAY_HEAVY dark:hover:bg-GRAY_EXTRAHEAVY dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-PRIMARY_LIGHT"
      >
        <svg {...iconProps} className="w-3.5 h-3.5 shrink-0">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span className="font-medium">{label} 보기</span>
        <svg
          {...iconProps}
          className="w-3.5 h-3.5 shrink-0 text-GRAY transition-transform group-hover:translate-x-0.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && (
        <Modal title={label} onClose={() => setOpen(false)}>
          <div className="relative -m-4 overflow-hidden rounded-b-lg">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers
              wrapLongLines={false}
              customStyle={{
                margin: 0,
                padding: "1.5rem 1rem",
                fontSize: "0.75rem",
                lineHeight: 1.6,
                borderRadius: 0,
                ...(resolvedTheme === "dark" && { background: "transparent" }),
              }}
              codeTagProps={{ style: { background: "transparent" } }}
              lineNumberStyle={{ opacity: 0.35, minWidth: "2.25em" }}
            >
              {code}
            </SyntaxHighlighter>
            <CopyButton code={code} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default CodeBlockPopup;
