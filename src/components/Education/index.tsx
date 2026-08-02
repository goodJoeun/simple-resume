import SectionTitle from "../SectionTitle";
import EducationItem from "./EducationItem";

import { DataProps } from "@/types";

const Education = ({ education }: Pick<DataProps, "education">) => {
  return (
    <div id="education" className="scroll-mt-24">
      <SectionTitle>Education</SectionTitle>
      <div className="flex flex-col gap-24">
        {[...education].reverse().map((education) => (
          <div key={education.id} className="reveal">
            <EducationItem {...education} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
