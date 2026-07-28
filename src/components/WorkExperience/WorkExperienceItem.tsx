import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { WorkExperienceProps } from "@/types";

const WorkExperienceItem = ({ name, position, period, markdown, imgSrc }: WorkExperienceProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-0">
      <div className="flex md:flex-col items-center md:items-start mr-4 gap-3 md:sticky md:top-8 md:self-start">
        {imgSrc && (
          <Image
            src={imgSrc}
            width="200"
            height="200"
            alt={name}
            className="object-cover rounded-lg border-[1px] border-GRAY_LIGHT dark:border-white border-solid w-24 h-24"
          />
        )}
        <div className="w-48 gap-3 flex flex-col">
          <h4>{name}</h4>
          <div className="flex flex-col">
            <span className="m-0">{position}</span>
            <span>{`${period[0]} - ${period[1]}`}</span>
          </div>
        </div>
      </div>
      <div className="md:border-GRAY_LIGHT md:border-solid md:border-l-[1px] md:pl-4 markdown w-full [&_h4:nth-of-type(n+2)]:mt-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
};

export default WorkExperienceItem;
