#!/usr/bin/env node
const { program } = require("commander");
const pkg = require("../../package.json");
const path = require("path");
const fs = require("fs");
const { runAsyncCommand } = require("./cliUtils");
const { planDisplay } = require("./displayPlan");

const setupProgram = ({ version }) => {
  program
    .version(version)
    .option("-i, --infra <file>", "the infrastrucure file")
    .option("-l, --list", "list live resources");
};

const creatInfraFromFile = ({ filename, config }) => {
  //console.log("creatInfraFromFile", filename);
  try {
    const InfraCode = require(filename);
    const infra = InfraCode({ config });
    return infra;
  } catch (err) {
    console.error(err);
  }
};

const getInfraFilename = ({ program }) =>
  program.infra
    ? path.join(process.cwd(), program.infra)
    : path.join(process.cwd(), "iac.js");

const checkFileExist = ({ filename }) => {
  if (fs.existsSync(filename)) {
    throw Error(`Cannot open file ${filename}`);
  }
};

const createInfra = ({ program }) => {
  const filename = getInfraFilename({ program });
  checkFileExist(filename);
  const config = {};
  return creatInfraFromFile({ filename, config });
};

// Live Resources
const liveResourceDisplay = (live) => {
  //console.log(JSON.stringify(live, null, 4));
  console.log(`${live.type} - ${live.data.items.length} `);
};
const liveResourcesDisplay = async (provider) => {
  const lives = await runAsyncCommand(
    () => provider.listLives(),
    "Live Resources"
  );
  console.log(`${lives.length} Type of Resources:`);
  lives.map((live) => liveResourceDisplay(live));
};

const main = async ({ program, version, argv }) => {
  console.log(`GruCloud ${version}`);

  setupProgram({ version });
  program.parse(argv);

  const infra = createInfra({ program });
  //console.log(program.opts());
  if (!infra.providers) {
    throw Error(`no providers provided`);
  }
  try {
    if (program.deploy) {
      console.log("deploy");
    } else {
      await planDisplay(infra.providers[0]);
      await liveResourcesDisplay(infra.providers[0]);
    }
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

main({ program, argv: process.argv, version: pkg.version })
  .then(() => {
    //console.log("Done");
  })
  .catch((error) => {
    console.log("Error ", JSON.stringify(error, null, 4));
  });
