import Image from "next/image";

import ContactItem from "../ContactItem";
import Introduce from "./Introduce";

import { DataProps } from "@/types";

const Information = ({ information }: Pick<DataProps, "information">) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center gap-12">
        {information.imgSrc && (
          <Image
            src={information.imgSrc}
            width="200"
            height="200"
            priority
            alt={information.name}
            className="object-cover rounded-full w-32 h-32 md:w-40 md:h-40 shrink-0 border-[1px] border-GRAY_LIGHT dark:border-white border-solid"
          />
        )}
        <div className="flex flex-col gap-2">
          <h1 className="leading-[1.15] text-4xl lg:text-[45px]">
            안녕하세요,
            <br /> 프론트엔드 개발자{" "}
            <span className="text-PRIMARY font-semibold">{information.name}</span>
            입니다.
          </h1>
          <div className="flex gap-1">
            {information.contact.map((contact) => (
              <ContactItem
                key={contact.id}
                className="text-BLACK dark:text-white hover:text-PRIMARY_HEAVY dark:hover:text-PRIMARY_HEAVY"
                {...contact}
              >
                {contact.name}
              </ContactItem>
            ))}
          </div>
        </div>
      </div>
      <Introduce markdown={information.markdown} />
    </div>
  );
};

export default Information;
