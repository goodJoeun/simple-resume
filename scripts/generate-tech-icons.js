/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * 마크다운의 기술 스택 뱃지에 쓰이는 아이콘만 simple-icons에서 추려
 * src/constants/techIcons.ts 로 생성합니다. (npm run generate:tech-icons)
 *
 * simple-icons 전체(3,000개 이상)를 런타임에 들고 가지 않기 위한 빌드 타임 스크립트입니다.
 * 새 기술 스택을 추가하려면 아래 TOKEN_TO_ICON 에 한 줄 넣고 스크립트를 다시 실행하세요.
 */
const fs = require("fs");
const path = require("path");

const simpleIcons = require("simple-icons");

/**
 * 마크다운에 쓰는 표기(정규화된 형태) → simple-icons export 이름.
 * 같은 아이콘을 여러 표기로 쓸 수 있도록 별칭을 함께 둡니다. (Next / Next.js 등)
 */
const TOKEN_TO_ICON = {
  javascript: "siJavascript",
  typescript: "siTypescript",
  html5: "siHtml5",
  css3: "siCss",
  css: "siCss",
  react: "siReact",
  next: "siNextdotjs",
  nextjs: "siNextdotjs",
  reactquery: "siReactquery",
  tanstackquery: "siReactquery",
  graphql: "siGraphql",
  storybook: "siStorybook",
  styledcomponents: "siStyledcomponents",
  tailwindcss: "siTailwindcss",
  firebase: "siFirebase",
  fastify: "siFastify",
  i18next: "siI18next",
  msw: "siMockserviceworker",
  nx: "siNx",
  yarn: "siYarn",
  yarnworkspaces: "siYarn",
  rollup: "siRollupdotjs",
  rollupjs: "siRollupdotjs",
  docker: "siDocker",
  gitlab: "siGitlab",
  gitlabrunner: "siGitlab",
};

/** 다크 모드 배경색(tailwind.config.js 의 BLACK) */
const DARK_BACKGROUND = "212529";
/** WCAG 비텍스트 요소 최소 대비 */
const MIN_CONTRAST = 3;

/** WCAG 상대 휘도 (감마 보정 포함) */
const relativeLuminance = (hex) => {
  const [r, g, b] = [0, 2, 4]
    .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a, b) => {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * 브랜드 컬러가 다크 배경에서 충분히 보이지 않으면(Next.js·Fastify 같은 검정 계열)
 * 다크 모드용으로 흰색을 씁니다. 대비만 충분하면 브랜드 컬러를 그대로 유지합니다.
 */
const toDarkModeHex = (hex) =>
  contrastRatio(hex, DARK_BACKGROUND) < MIN_CONTRAST ? "FFFFFF" : hex;

const entries = Object.entries(TOKEN_TO_ICON)
  .map(([token, iconName]) => {
    const icon = simpleIcons[iconName];
    if (!icon) {
      console.warn(`[generate-tech-icons] simple-icons에 ${iconName} 가 없습니다. (${token})`);
      return null;
    }
    return `  ${token}: {
    title: ${JSON.stringify(icon.title)},
    hex: "${icon.hex}",
    darkHex: "${toDarkModeHex(icon.hex)}",
    path: ${JSON.stringify(icon.path)},
  },`;
  })
  .filter(Boolean);

const output = `/**
 * 이 파일은 \`npm run generate:tech-icons\` 로 생성됩니다. 직접 수정하지 마세요.
 * 아이콘을 추가하려면 scripts/generate-tech-icons.js 의 TOKEN_TO_ICON 을 수정하세요.
 *
 * 아이콘 출처: simple-icons (CC0-1.0)
 */
export interface TechIcon {
  title: string;
  hex: string;
  darkHex: string;
  path: string;
}

/**
 * @description 정규화된 기술 이름(소문자 + 영숫자만) → 아이콘. 없는 스택은 텍스트 뱃지로 표시됩니다.
 */
export const TECH_ICONS: Record<string, TechIcon> = {
${entries.join("\n")}
};

/**
 * @description \`Next.js\`, \`react-dnd\` 처럼 표기가 달라도 같은 키로 찾을 수 있게 정규화합니다.
 */
export const normalizeTechName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getTechIcon = (name: string): TechIcon | undefined =>
  TECH_ICONS[normalizeTechName(name)];
`;

const target = path.join(__dirname, "..", "src", "constants", "techIcons.ts");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, output, "utf8");

console.log(`[generate-tech-icons] ${entries.length}개 아이콘을 ${target} 에 생성했습니다.`);
