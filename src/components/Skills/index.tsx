import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SectionTitle from "../SectionTitle";
import markdownComponents from "../markdownComponents";

import { SkillsProps } from "@/types";

const Skills = ({ skills }: { skills: SkillsProps }) => {
  return (
    <div id="skills" className="scroll-mt-24">
      <SectionTitle>Skills</SectionTitle>
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {skills.markdown ?? ""}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Skills;
