import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SectionTitle from "../SectionTitle";

import { SkillsProps } from "@/types";

const Skills = ({ skills }: { skills: SkillsProps }) => {
  return (
    <div>
      <SectionTitle>Skills</SectionTitle>
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{skills.markdown ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Skills;
