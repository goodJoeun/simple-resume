import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { InformationProps } from "@/types";

const Introduce = ({ markdown }: Pick<InformationProps, "markdown">) => {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown ?? ""}</ReactMarkdown>
    </div>
  );
};

export default Introduce;
