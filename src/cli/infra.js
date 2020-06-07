const path = require("path");
const fs = require("fs");

const creatInfraFromFile = async ({ infraFileName, config }) => {
  //console.log("creatInfraFromFile", infraFileName, config);
  try {
    const InfraCode = require(infraFileName);
    const infra = await InfraCode({ config });
    if (!infra.providers) {
      throw Error(`no providers provided`);
    }
    return infra;
  } catch (err) {
    //TODO
    console.error(err);
    throw err;
  }
};

const resolveFilename = ({ fileName, defaultName }) =>
  fileName
    ? path.join(process.cwd(), fileName)
    : path.join(process.cwd(), defaultName);

const checkFileExist = ({ filename }) => {
  if (!fs.existsSync(filename)) {
    const message = `Cannot open file ${filename}`;
    throw { code: 422, message };
  }
};

const requireConfig = (fileName) => {
  const configFileNameFull = resolveFilename({
    fileName,
    defaultName: "config.js",
  });
  checkFileExist({ filename: configFileNameFull });
  const config = require(configFileNameFull);
  return config;
};

exports.createInfra = ({ infraFileName, configFileName }) => {
  const infraFileNameFull = resolveFilename({
    fileName: infraFileName,
    defaultName: "iac.js",
  });
  //console.log(`Using ${infraFileNameFull}`);
  checkFileExist({ filename: infraFileNameFull });

  const config = requireConfig(configFileName);
  return creatInfraFromFile({
    infraFileName: infraFileNameFull,
    config,
  });
};
