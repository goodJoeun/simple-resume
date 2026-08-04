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

  // 동적 import()로 읽으면 .md가 별도 async 청크로 빠져 pages/index.js가 그대로라,
  // dev에서 .md를 수정해도 브라우저에 리로드 신호가 가지 않는다.
  // require.context는 페이지 청크에 인라인되므로 저장 즉시 자동 새로고침된다.
  const markdownContext = require.context("../../public/markdown", true, /\.md$/);

  const informationWithData = getImgSrc({
    section: "information",
    item: getMd({ markdownContext, section: "information", item: { ...objectData.information } }),
  });

  const workExperienceWithData = objectData.workExperience.map((item: WorkExperienceProps) => {
    return getImgSrc({
      section: "workExperience",
      item: getMd({ markdownContext, section: "workExperience", item }),
    });
  });

  return {
    props: {
      ...objectData,
      information: await informationWithData,
      workExperience: await Promise.all(workExperienceWithData),
    },
  };
};

const getMd = <T extends InformationProps | WorkExperienceProps>({
  markdownContext,
  section,
  item,
}: {
  markdownContext: RequireContext;
  section: string;
  item: T;
}) => {
  const key = `./${section}/${"id" in item ? item.id : "introduce"}.md`;
  if (!markdownContext.keys().includes(key)) {
    console.log("no markdown");
    return item;
  }
  return { ...item, markdown: markdownContext(key).default };
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
