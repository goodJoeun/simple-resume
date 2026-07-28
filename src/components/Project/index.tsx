import SectionTitle from "../SectionTitle";
import ProjectItem from "./ProjectItem";

import { DataProps } from "@/types";

const Project = ({ project }: Pick<DataProps, "project">) => {
  const teamProject = [...project].reverse().filter((project) => project.isTeam);
  const personalProject = [...project].reverse().filter((project) => !project.isTeam);

  return (
    <>
      {teamProject.length > 0 && (
        <div>
          <SectionTitle>Team Project</SectionTitle>
          <div className="flex flex-col gap-24">
            {teamProject.map((project) => (
              <ProjectItem key={project.id} {...project} />
            ))}
          </div>
        </div>
      )}
      {personalProject.length > 0 && (
        <div>
          <SectionTitle>Personal Project</SectionTitle>
          <div className="flex flex-col gap-24">
            {personalProject.map((project) => (
              <ProjectItem key={project.id} {...project} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Project;
