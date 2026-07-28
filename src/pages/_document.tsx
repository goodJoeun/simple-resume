import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </Head>
      <body className="font-normal break-keep bg-white dark:bg-BLACK selection:bg-PRIMARY_LIGHT selection:dark:text-BLACK text-BLACK dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
