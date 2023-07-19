import { App } from "./src/appDoc/App.js";

export default ({ rootDir }) => {
  return {
    docApp: App,
    site: {
      rootDir,
      favicon: "/grucloud.svg",
      base: "/docs/",
      outDir: "dist/docs",
      srcDir: "docs",
      title: "GruCloud",
      description: "Infrastructure as Code",
      keywords: ["iac"],
      lang: "en",
    },
  };
};
