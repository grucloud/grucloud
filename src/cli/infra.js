const path = require("path");
const fs = require("fs");

const creatInfraFromFile = async ({ filename, config }) => {
  //console.log("creatInfraFromFile", filename);
  try {
    const InfraCode = require(filename);
    const infra = await InfraCode({ config });
    if (!infra.providers) {
      throw Error(`no providers provided`);
    }
    return infra;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getInfraFilename = ({ infra }) =>
  infra ? path.join(process.cwd(), infra) : path.join(process.cwd(), "iac.js");

const checkFileExist = ({ filename }) => {
  if (!fs.existsSync(filename)) {
    const msg = `Cannot open file ${filename}`;
    console.error(msg);
    throw Error(msg);
  }
};

exports.createInfra = ({ infra, config = {} }) => {
  const filename = getInfraFilename({ infra });
  //console.log(`Using ${filename}`);
  checkFileExist({ filename });
  return creatInfraFromFile({ filename, config });
};
