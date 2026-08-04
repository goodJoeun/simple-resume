import CodeBlock from "./CodeBlock";
import TechStack from "./TechStack";

interface MarkdownNode {
  type?: string;
  tagName?: string;
  value?: string;
  children?: MarkdownNode[];
}

const asNode = (value: unknown): MarkdownNode | undefined =>
  typeof value === "object" && value !== null ? (value as MarkdownNode) : undefined;

/**
 * @description 인라인 코드만 나열된 줄(`TypeScript` `React` ...)이면 그 이름들을 돌려줍니다.
 * 문장 중간에 섞인 코드(`Promise.all`을 써서 ...)는 대상이 아니므로 null 을 돌려줍니다.
 */
const getTechStackItems = (value: unknown): string[] | null => {
  const node = asNode(value);
  const children = node?.children;
  if (!children?.length) return null;

  const elements = children.filter((child) => child.type === "element");

  // 느슨한 목록(loose list)에서는 <li><p>...</p></li> 형태가 되므로 한 겹 벗겨 다시 검사합니다.
  if (elements.length === 1 && elements[0].tagName === "p") {
    return getTechStackItems(elements[0]);
  }

  const items: string[] = [];

  for (const child of children) {
    if (child.type === "text") {
      if (child.value?.trim()) return null;
      continue;
    }

    if (child.type === "element" && child.tagName === "code") {
      const text = child.children?.[0]?.value;
      if (typeof text !== "string") return null;
      items.push(text);
      continue;
    }

    return null;
  }

  return items.length > 0 ? items : null;
};

const markdownComponents = {
  // 코드 블록은 CodeBlock 이 자체 컨테이너를 그리므로 기본 <pre> 를 벗겨냅니다.
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,

  code: ({
    inline,
    className,
    children,
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    if (inline) return <code className={className}>{children}</code>;

    const language = /language-(\w+)/.exec(className ?? "")?.[1];
    return <CodeBlock code={String(children).replace(/\n$/, "")} language={language} />;
  },

  p: ({ node, children }: { node?: unknown; children?: React.ReactNode }) => {
    const items = getTechStackItems(node);
    return items ? <TechStack items={items} /> : <p>{children}</p>;
  },

  li: ({ node, children }: { node?: unknown; children?: React.ReactNode }) => {
    const items = getTechStackItems(node);
    // 뱃지 줄은 문장이 아니므로 목록 불릿을 숨깁니다.
    return items ? (
      <li className="list-none">
        <TechStack items={items} />
      </li>
    ) : (
      <li>{children}</li>
    );
  },
};

export default markdownComponents;
