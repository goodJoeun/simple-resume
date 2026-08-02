import React from "react";

import Divider from "./Divider";

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="reveal">
      <h2>{children}.</h2>
      <Divider />
    </div>
  );
};

export default SectionTitle;
