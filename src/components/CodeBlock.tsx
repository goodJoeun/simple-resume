import { useTheme } from "next-themes";
import { useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import Modal from "./Modal";

/**
 * @description 코드 펜스의 언어 id를 그대로 노출하면 `diff 코드`처럼 어색하게 읽히므로,
 * 사람이 읽는 이름으로 옮깁니다. 목록에 없는 언어는 id를 그대로 씁니다.
 */
const LABEL_BY_LANGUAGE: Record<string, string> = {
  diff: "변경 전후 비교",
  js: "JavaScript",
  jsx: "JavaScript",
  ts: "TypeScript",
  tsx: "TypeScript",
};

const getLabel = (language?: string) => {
  if (!language) return "코드";
  return LABEL_BY_LANGUAGE[language] ?? language;
};

/** 접힌 상태에서 미리 보여줄 줄 수입니다. */
const PEEK_LINES = 3;

/** vscDarkPlus 테마의 배경색. 접힘 그라데이션을 코드 배경과 정확히 맞추기 위해 씁니다. */
const CODE_BG = "#1e1e1e";

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

const Highlighter = ({
  code,
  language,
  showLineNumbers,
  background,
}: {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  background?: string;
}) => (
  <SyntaxHighlighter
    language={language}
    style={vscDarkPlus}
    showLineNumbers={showLineNumbers}
    wrapLongLines={false}
    customStyle={{
      margin: 0,
      padding: "1rem",
      fontSize: "0.75rem",
      lineHeight: 1.6,
      borderRadius: 0,
      ...(background && { background }),
    }}
    codeTagProps={{ style: { background: "transparent" } }}
    lineNumberStyle={{ opacity: 0.35, minWidth: "2.25em" }}
  >
    {code}
  </SyntaxHighlighter>
);

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
 * @description 설명 문단 바로 아래에 붙는 코드 패널입니다.
 * 접힌 상태에서도 첫 몇 줄이 그대로 보여, 문장에서 코드로 시선이 끊기지 않고 이어집니다.
 * 가로로 넓거나 긴 코드는 본문 폭(약 79칸)을 넘으므로 모달로 크게 볼 수 있게 열어둡니다.
 */
const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { resolvedTheme } = useTheme();

  const label = getLabel(language);
  const lines = code.split("\n");
  const peek = lines.slice(0, PEEK_LINES).join("\n");
  const hasMore = lines.length > PEEK_LINES;

  return (
    <>
      {/* 위 문단과 한 덩어리로 읽히도록 위 여백은 좁게, 아래 여백은 넓게 둡니다. */}
      <div className="mt-2 mb-5 overflow-hidden rounded-md border-[1px] border-solid border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY">
        <div className="flex items-center gap-2 border-b-[1px] border-solid border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY bg-GRAY_LIGHT dark:bg-GRAY_EXTRAHEAVY/40 px-3 py-2 text-xs text-GRAY_HEAVY dark:text-GRAY">
          <svg {...iconProps} className="w-3.5 h-3.5 shrink-0">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="font-medium">{label}</span>
          <span className="font-mono text-GRAY">{lines.length}줄</span>

          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`${label} 크게 보기`}
            title="크게 보기"
            className="ml-auto rounded p-1 transition-colors hover:text-BLACK dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-PRIMARY_LIGHT"
          >
            <svg {...iconProps} className="w-3.5 h-3.5">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>

          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-label={expanded ? "코드 접기" : "코드 펼치기"}
              className="rounded p-1 transition-colors hover:text-BLACK dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-PRIMARY_LIGHT"
            >
              <svg
                {...iconProps}
                className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>

        {expanded || !hasMore ? (
          <div className="max-h-[70vh] overflow-auto" style={{ background: CODE_BG }}>
            <Highlighter code={code} language={language} showLineNumbers background={CODE_BG} />
          </div>
        ) : (
          /* 접힘: 앞부분을 그대로 보여주고 아래를 배경색으로 흐려, 이어진다는 것만 알립니다. */
          <div className="relative overflow-hidden" style={{ background: CODE_BG }}>
            {/* 펼칠 때 줄 번호 폭만큼 코드가 밀리지 않도록 미리보기에도 번호를 켜둡니다. */}
            <Highlighter code={peek} language={language} showLineNumbers background={CODE_BG} />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{ backgroundImage: `linear-gradient(to top, ${CODE_BG}, transparent)` }}
            />
            {/* 코드 위에 투명하게 덮어, 미리보기 아무 곳이나 눌러도 펼쳐집니다. */}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-expanded={false}
              className="absolute inset-0 flex items-end justify-center pb-2 text-xs text-GRAY transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-PRIMARY_LIGHT"
            >
              {lines.length - PEEK_LINES}줄 더 보기
            </button>
          </div>
        )}
      </div>

      {zoomed && (
        <Modal title={label} onClose={() => setZoomed(false)}>
          <div className="relative -m-4 overflow-hidden rounded-b-lg">
            <Highlighter
              code={code}
              language={language}
              showLineNumbers
              background={resolvedTheme === "dark" ? "transparent" : undefined}
            />
            <CopyButton code={code} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default CodeBlock;
