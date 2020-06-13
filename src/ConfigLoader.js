const { defaultsDeep } = require("lodash");
const path = require("path");
const fs = require("fs");

const checkFileExist = (fileName) => {
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    throw { code: 422, message };
  }
};

exports.ConfigLoader = ({ baseDir = process.cwd(), stage = "dev" }) => {
  //console.log(`ConfigLoader ${baseDir} ${stage}`);
  const configDir = path.join(baseDir, "config");

  const defaultConfigFile = path.join(configDir, "default.json");
  checkFileExist(defaultConfigFile);
  const defaultConfig = require(defaultConfigFile);

  const stageConfigFile = path.join(configDir, `${stage}.json`);
  checkFileExist(stageConfigFile);
  const stageConfig = require(stageConfigFile);

  const merged = defaultsDeep(stageConfig, defaultConfig);
  //console.log(merged);
  return merged;
};
