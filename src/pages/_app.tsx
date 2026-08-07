import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

/**
 * @description SEO를 위해 본인의 정보로 수정해주세요.
 */
const DEFAULT_SEO = {
  title: "조은 | Front-End Dev",
  description: "안녕하세요, 프론트엔드 개발자 조은입니다. 함께 유지할 수 있는 코드를 고민합니다.",
  canonical: "https://goodjoeun.vercel.app/",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://goodjoeun.vercel.app/",
    title: "조은 | Front-End Dev",
    site_name: "조은 | Front-End Dev",
    images: [
      {
        url: "/share.png",
        width: 285,
        height: 167,
        alt: "조은 | Front-End Dev",
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
  additionalMetaTags: [
    {
      name: "application-name",
      content: "조은 | Front-End Dev",
    },
    {
      name: "msapplication-tooltip",
      content: "조은 | Front-End Dev",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
};

const App = ({ Component, pageProps }: AppProps) => {
  // OS 설정을 따르지 않고 다크 모드로 시작합니다. 토글로 바꾼 선택은 localStorage에 남아 그대로 유지됩니다.
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <DefaultSeo {...DEFAULT_SEO} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
