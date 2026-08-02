import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Accordion from "../Accordion";
import markdownComponents from "../markdownComponents";

import { WorkExperienceProps } from "@/types";

/**
 * @description 문단 앞뒤에 붙은 구분선(---)을 제거합니다. 아코디언이 구분 역할을 대신합니다.
 */
const stripEdgeRules = (text: string) =>
  text
    .trim()
    .replace(/^-{3,}\s*/, "")
    .replace(/\s*-{3,}$/, "")
    .trim();

interface Section {
  title: string;
  body: string;
}

/**
 * @description 마크다운을 주어진 heading 레벨(`level`개의 #) 기준으로 나눠,
 * 첫 제목 이전은 intro로, 이후는 각 제목 단위의 section으로 분리합니다.
 * 다음 레벨(예: #### 안의 #####)까지 같은 heading으로 잘못 잘리지 않도록,
 * 정확히 그 레벨의 #만 매칭합니다.
 */
const splitByHeadingLevel = (markdown: string, level: number) => {
  const pattern = new RegExp(`^#{${level}}\\s+(.*)$`);
  const intro: string[] = [];
  const sections: { title: string; body: string[] }[] = [];

  markdown.split("\n").forEach((line) => {
    const heading = pattern.exec(line);

    if (heading) {
      sections.push({ title: heading[1].trim(), body: [] });
      return;
    }

    const current = sections[sections.length - 1];
    (current ? current.body : intro).push(line);
  });

  return {
    intro: stripEdgeRules(intro.join("\n")),
    sections: sections.map(({ title, body }) => ({
      title,
      body: stripEdgeRules(body.join("\n")),
    })),
  };
};

/**
 * @description `### 제목`을 프로젝트(회사에서 맡은 제품/이니셔티브) 단위로,
 * 그 안의 `#### 제목`을 각 프로젝트 안의 기능 단위로 2단 분리합니다.
 * `###`가 하나도 없는(기존) 마크다운은 1단(`####`)만 있는 것으로 취급해
 * 이전과 동일하게 렌더링됩니다.
 */
const splitWorkExperienceMarkdown = (markdown: string) => {
  const { intro, sections: projects } = splitByHeadingLevel(markdown, 3);

  if (projects.length === 0) {
    const flat = splitByHeadingLevel(intro, 4);
    return { intro: flat.intro, projects: [] as (Section & { features: Section[] })[], flat };
  }

  return {
    intro,
    projects: projects.map((project) => {
      const { intro: projectIntro, sections: features } = splitByHeadingLevel(project.body, 4);
      return { title: project.title, body: projectIntro, features };
    }),
    flat: null,
  };
};

const MarkdownBody = ({ markdown }: { markdown: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
    {markdown}
  </ReactMarkdown>
);

const WorkExperienceItem = ({ name, position, period, markdown, imgSrc }: WorkExperienceProps) => {
  const { intro, projects, flat } = splitWorkExperienceMarkdown(markdown ?? "");

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-0">
      <div className="flex md:flex-col items-center md:items-start mr-4 gap-3 md:sticky md:top-16 md:self-start">
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
      <div className="md:border-GRAY_LIGHT md:dark:border-GRAY_EXTRAHEAVY md:border-solid md:border-l-[1px] md:pl-4 markdown w-full">
        {intro && <MarkdownBody markdown={intro} />}

        {/* `###` 프로젝트 단위가 있는 경우: 프로젝트 제목·소개는 항상 보이고, 그 안의 `####` 기능만 각각 접힙니다. */}
        {projects.length > 0 && (
          <div className={intro ? "mt-6" : ""}>
            {projects.map((project, index) => (
              <div
                key={`${index}-${project.title}`}
                className={`reveal ${
                  index > 0
                    ? "mt-10 pt-10 border-t-[1px] border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid"
                    : ""
                }`}
              >
                <MarkdownBody markdown={`### ${project.title}\n\n${project.body}`} />
                {project.features.length > 0 && (
                  <div className="mt-4">
                    {project.features.map((feature, featureIndex) => (
                      <Accordion key={`${featureIndex}-${feature.title}`} title={feature.title}>
                        <MarkdownBody markdown={feature.body} />
                      </Accordion>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* `###` 없이 `####`만 있는 경우: 기존처럼 1단 아코디언 목록으로 표시합니다. */}
        {flat && flat.sections.length > 0 && (
          <div className={`reveal ${intro ? "mt-6" : ""}`}>
            {flat.sections.map((section, index) => (
              <Accordion key={`${index}-${section.title}`} title={section.title}>
                <MarkdownBody markdown={section.body} />
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceItem;
