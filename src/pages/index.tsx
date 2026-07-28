import fsPromises, * as fs from "fs/promises";
import path from "path";

import { NextPage } from "next";

import Activity from "@/components/Activity";
import Certificate from "@/components/Certificate";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import Information from "@/components/Information";
import Layout from "@/components/Layout";
import ResumeTitle from "@/components/ResumeTitle";
// import ScrollProgress from "@/components/ScrollProgress";
import Skills from "@/components/Skills";
import WorkExperience from "@/components/WorkExperience";
import { DataProps, InformationProps, SkillsProps, WorkExperienceProps } from "@/types";
import Award from "@/components/Award";

const Home: NextPage<DataProps> = ({
  resumeTitle,
  information,
  skills,
  workExperience,
  activity,
  education,
  certificate,
  award,
}) => {
  return (
    <>
      {/* <ScrollProgress /> */}
      <ResumeTitle resumeTitle={resumeTitle} />
      <Layout>
        <Information information={information} />
        <WorkExperience workExperience={workExperience} />
        <Skills skills={skills} />
        <Activity activity={activity} />
        <Education education={education} />
        <Certificate certificate={certificate} />
        <Award award={award} />
      </Layout>
      <Footer contact={information.contact} name={information.name} />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = await fsPromises.readFile(filePath, "utf8");
  const objectData = JSON.parse(jsonData);

  const informationWithData = getImgSrc({
    section: "information",
    item: await getMd({ section: "information", item: { ...objectData.information } }),
  });

  const skillsWithData = await getMd({ section: "skills", item: { ...objectData.skills } });

  const workExperienceWithData = objectData.workExperience.map(
    async (item: WorkExperienceProps) => {
      return getImgSrc({
        section: "workExperience",
        item: await getMd({ section: "workExperience", item }),
      });
    },
  );

  return {
    props: {
      ...objectData,
      information: await informationWithData,
      skills: skillsWithData,
      workExperience: await Promise.all(workExperienceWithData),
    },
  };
};

const getMd = async <T extends InformationProps | WorkExperienceProps | SkillsProps>({
  section,
  item,
}: {
  section: string;
  item: T;
}) => {
  try {
    const markdownModule = await import(
      `../../public/markdown/${section}/${"id" in item ? item.id : "introduce"}.md`
    );
    return { ...item, markdown: markdownModule.default as string };
  } catch {
    console.log("no markdown");
    return item;
  }
};

const getImgSrc = async ({
  section,
  item,
}: {
  section: string;
  item: InformationProps | WorkExperienceProps;
}) => {
  const imgSrc = `/images/${section}/${"id" in item ? item.id : "profile"}.png`;
  const filePath = path.join(process.cwd(), "public", imgSrc);
  try {
    await fs.stat(filePath);
    return { ...item, imgSrc: imgSrc };
  } catch {
    console.log("no img");
    return item;
  }
};
