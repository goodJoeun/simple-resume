import SectionTitle from "../SectionTitle";

import { DataProps } from "@/types";

const Strength = ({ strength }: Pick<DataProps, "strength">) => {
  if (strength.length === 0) return null;

  return (
    <div id="strength" className="scroll-mt-24">
      <SectionTitle>Core Competency</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
        {strength.map((item, index) => (
          <div
            key={item.id}
            className="reveal flex flex-col gap-3 p-6 rounded-lg border-[1px] border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid"
          >
            <span className="font-mono text-xs text-PRIMARY">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="text-lg leading-snug">{item.title}</h4>
            <div className="flex flex-col gap-2">
              {item.description.map((sentence) => (
                <p
                  key={sentence}
                  className="text-sm leading-relaxed text-GRAY_EXTRAHEAVY dark:text-GRAY"
                >
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strength;
