import fsPromises, * as fs from "fs/promises";
import path from "path";

import { NextPage } from "next";

import Activity from "@/components/Activity";
import Certificate from "@/components/Certificate";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import Information from "@/components/Information";
import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import ResumeTitle from "@/components/ResumeTitle";
// import ScrollProgress from "@/components/ScrollProgress";
import Strength from "@/components/Strength";
import WorkExperience from "@/components/WorkExperience";
import { DataProps, InformationProps, WorkExperienceProps } from "@/types";
import Award from "@/components/Award";

const Home: NextPage<DataProps> = ({
  resumeTitle,
  information,
  strength,
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
      <Nav />
      <Layout>
        <Information information={information} />
        <Strength strength={strength} />
        <WorkExperience workExperience={workExperience} />
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
      workExperience: await Promise.all(workExperienceWithData),
    },
  };
};

const getMd = async <T extends InformationProps | WorkExperienceProps>({
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
