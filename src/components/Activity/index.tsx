import SectionTitle from "../SectionTitle";
import ActivityItem from "./ActivityItem";

import { DataProps } from "@/types";

const Activity = ({ activity }: Pick<DataProps, "activity">) => {
  return (
    <div id="activities" className="scroll-mt-24">
      <SectionTitle>Activities</SectionTitle>
      <div className="flex flex-col gap-24">
        {[...activity].reverse().map((activity) => (
          <div key={activity.id} className="reveal">
            <ActivityItem {...activity} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
