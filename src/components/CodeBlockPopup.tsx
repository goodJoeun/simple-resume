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

const CodeBlockPopup = ({ code, language }: { code: string; language?: string }) => {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="my-2 flex items-center gap-2 rounded-md border border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY bg-GRAY_LIGHT dark:bg-GRAY_EXTRAHEAVY px-3 py-2 text-xs font-mono text-GRAY_HEAVY hover:bg-GRAY hover:text-BLACK dark:hover:text-white"
      >
        <span aria-hidden>{"</>"}</span>
        <span>{language ? `${language} 코드 보기` : "코드 보기"}</span>
      </button>
      {open && (
        <Modal title={language} onClose={() => setOpen(false)}>
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
