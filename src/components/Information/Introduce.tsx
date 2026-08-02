import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import markdownComponents from "../markdownComponents";

import { InformationProps } from "@/types";

const Introduce = ({ markdown }: Pick<InformationProps, "markdown">) => {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown ?? ""}
      </ReactMarkdown>
    </div>
  );
};

export default Introduce;
