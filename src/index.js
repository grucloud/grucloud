const { program } = require("commander");
const GruCloud = require("./GruCloudApp");
const pkg = require("../package.json");
const path = require("path");
const fs = require("fs");

const setupProgram = ({ version }) => {
  program
    .version(pkg.version)
    .option("-i, --infra <file>", "the infrastrucure file")
    .option("-l, --list", "list live resources")
    .option("-d, --debug", "output extra debugging");
};

setupProgram({ version: pkg.version });

program.parse(process.argv);

console.log(program.opts());

const creatInfraFromFile = ({ filename, config }) => {
  console.log("creatInfraFromFile", filename);
  try {
    const InfraCode = require(filename);
    const infra = InfraCode({ config });
    console.log("infra");
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
  //TODO check file
  checkFileExist(filename);
  const config = {};
  return creatInfraFromFile({ filename, config });
};

const infra = createInfra({ program });

const main = async ({ program }) => {
  if (program.list) {
    console.log("list live resources");
    const plan = await infra.provider.plan();
    console.log("plan", plan);
  }
};

main({ program })
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    console.log("Error ", JSON.stringify(error, null, 4));
  });
