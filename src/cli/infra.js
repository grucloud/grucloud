const path = require("path");
const fs = require("fs");
const { ConfigLoader } = require("../ConfigLoader");

const creatInfraFromFile = async ({ infraFileName, config, stage }) => {
  //console.log("creatInfraFromFile", infraFileName, config);
  const InfraCode = require(infraFileName);
  //TODO use createStack
  const infra = await InfraCode({ config: { ...config, stage } });
  if (!infra.providers) {
    throw Error(`no providers provided`);
  }
  return infra;
};

const resolveFilename = ({ fileName, defaultName }) =>
  fileName
    ? path.join(process.cwd(), fileName)
    : path.join(process.cwd(), defaultName);

const checkFileExist = ({ fileName }) => {
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    console.log(message);
    throw { code: 422, message };
  }
};

const requireConfig = ({ fileName, stage }) => {
  if (!fileName) {
    return ConfigLoader({ stage });
  }
  checkFileExist({ fileName });

  const configFileNameFull = path.resolve(process.cwd(), fileName);
  checkFileExist({ fileName: configFileNameFull });
  const config = require(configFileNameFull);
  return config;
};

exports.createInfra = ({ infraFileName, configFileName, stage = "dev" }) => {
  const infraFileNameFull = resolveFilename({
    fileName: infraFileName,
    defaultName: "iac.js",
  });
  //console.log(`Using ${infraFileNameFull}`);
  checkFileExist({ fileName: infraFileNameFull });

  const config = requireConfig({ fileName: configFileName, stage });
  return creatInfraFromFile({
    infraFileName: infraFileNameFull,
    config,
    stage,
  });
};
