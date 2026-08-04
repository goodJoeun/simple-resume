declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare interface RequireContext {
  (key: string): { default: string };
  keys(): string[];
}

declare interface NodeRequire {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): RequireContext;
}
