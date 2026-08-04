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

/** `**소제목** — 설명` 또는 `**소제목**` 한 줄. 뒤에 다른 말이 붙으면(`**A**도 ~`) 강조일 뿐이므로 제외합니다. */
const STEP_LEAD = /^\*\*(.+?)\*\*(?:\s+—\s*(.*))?$/;

/** `**2026.02 – 2026.03**` 같은 기간 표기는 단위 제목이 아니라 `####` 섹션의 머리말입니다. */
const isPeriod = (title: string) => /^\d{4}\.\d{2}/.test(title);

/**
 * @description 한 기능 안에서 `**소제목** — 설명` 으로 시작하는 문단을 한 단위의 머리로 보고,
 * 다음 머리가 나오기 전까지의 설명·코드 블록을 같은 단위로 묶습니다.
 * 문단 첫 줄에서만 판정하므로, 문단 중간이나 끝에 오는 강조는 단위를 자르지 않습니다.
 */
const splitByBoldLead = (markdown: string) => {
  const intro: string[] = [];
  const steps: { title: string; body: string[] }[] = [];
  let inFence = false;
  let afterBlank = true;

  markdown.split("\n").forEach((line) => {
    if (/^```/.test(line)) inFence = !inFence;

    const lead = !inFence && afterBlank ? STEP_LEAD.exec(line.trim()) : null;
    afterBlank = line.trim() === "";

    if (lead && !isPeriod(lead[1])) {
      steps.push({ title: lead[1], body: lead[2] ? [lead[2]] : [] });
      return;
    }

    const current = steps[steps.length - 1];
    (current ? current.body : intro).push(line);
  });

  return {
    intro: intro.join("\n").trim(),
    steps: steps.map(({ title, body }) => ({ title, body: body.join("\n").trim() })),
  };
};

/**
 * @description 설명과 그에 딸린 코드가 한 덩어리로 읽히도록, 단위마다 구분선을 두고 제목을 세웁니다.
 * 나눌 머리가 없는 마크다운은 그대로 렌더링합니다.
 */
const StepBody = ({ markdown }: { markdown: string }) => {
  const { intro, steps } = splitByBoldLead(markdown);

  if (steps.length === 0) return <MarkdownBody markdown={markdown} />;

  return (
    <>
      {intro && <MarkdownBody markdown={intro} />}
      {steps.map((step, index) => (
        <div
          key={`${index}-${step.title}`}
          className={
            index === 0 && !intro
              ? ""
              : "mt-8 pt-8 border-t-[1px] border-GRAY_LIGHT dark:border-GRAY_EXTRAHEAVY border-solid"
          }
        >
          {/* 제목에도 인라인 코드가 들어가므로 마크다운으로 렌더하고, 굵기·크기는 상속시킵니다. */}
          <div className="mb-2 text-base font-semibold">
            <MarkdownBody markdown={step.title} />
          </div>
          <MarkdownBody markdown={step.body} />
        </div>
      ))}
    </>
  );
};

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
                  <div className="mt-4 flex flex-col gap-3">
                    {project.features.map((feature, featureIndex) => (
                      <Accordion key={`${featureIndex}-${feature.title}`} title={feature.title}>
                        <StepBody markdown={feature.body} />
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
          <div className={`reveal flex flex-col gap-3 ${intro ? "mt-6" : ""}`}>
            {flat.sections.map((section, index) => (
              <Accordion key={`${index}-${section.title}`} title={section.title}>
                <StepBody markdown={section.body} />
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceItem;
