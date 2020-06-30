const { defaultsDeep, isEmpty } = require("lodash/fp");
const assert = require("assert");
const path = require("path");
const fs = require("fs");
const logger = require("./logger")({ prefix: "ConfigLoader" });
const { map, pipe, tap, filter, switchCase } = require("rubico");

const checkFileExist = (fileName) => {
  assert(fileName);
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    throw { code: 422, message };
  }
};

const envFromFile = ({ envFile }) => {
  assert(envFile);
  logger.info(`envFromFile: ${envFile}`);
  return pipe([
    tap(() => {
      checkFileExist(envFile);
    }),
    () => fs.readFileSync(envFile, "utf8"),
    (content) => content.split(/\r?\n/),
    filter((line) => !line.match(/^\s*#/)),
    map((line) => line.split("=")),
    filter(([key, value]) => !isEmpty(key) && !isEmpty(value)),
    map(([key, value]) => [
      // Remove surrounding spaces from key and value
      key.trim(),
      value.trim(),
    ]),
    map(([key, value]) => [
      key,
      // Remove single, double quotes from value
      value.replace(/^['"](.+)['"]$/g, "$1"),
    ]),
    //tap(console.log),
    map(([key, value]) => {
      logger.debug(`envFromFile: key: ${key}`);
      process.env[key] = value;
      return [key, value];
    }),
  ])();
};

exports.envFromFile = envFromFile;

const envFromDefault = ({ configDir }) => {
  assert(configDir);
  logger.info(`envFromDefault: ${configDir}`);
  pipe([
    () => path.join(configDir, `default.env`),
    switchCase([
      (envFile) => fs.existsSync(envFile),
      (envFile) => envFromFile({ envFile }),
      () => {
        console.log(
          `default environment file ${configDir}/default.env  does not exist`
        );
      },
    ]),
  ])();
};

const envFromStage = ({ configDir, stage }) => {
  assert(configDir);
  assert(stage);
  logger.info(`envFromStage: ${(configDir, stage)}`);
  pipe([
    () => path.join(configDir, `${stage}.env`),
    switchCase([
      (envFile) => fs.existsSync(envFile),
      (envFile) => envFromFile({ envFile }),
      () => {},
    ]),
  ])();
};

const envLoader = ({ configDir, stage }) => {
  envFromDefault({ configDir });
  envFromStage({ configDir, stage });
};

const configFromDefault = ({ configDir }) => {
  const defaultConfigFile = path.join(configDir, "default.js");
  checkFileExist(defaultConfigFile);
  return require(defaultConfigFile);
};

const configFromStage = ({ configDir, stage }) => {
  const stageConfigFile = path.join(configDir, `${stage}.js`);
  if (!fs.existsSync(stageConfigFile)) {
    return;
  }
  return require(stageConfigFile);
};

exports.ConfigLoader = ({ baseDir = process.cwd(), stage = "dev" }) => {
  //console.log(`ConfigLoader ${baseDir} ${stage}`);
  logger.info(`${(baseDir, stage)}`);
  const configDir = path.join(baseDir, "config");

  envLoader({ configDir, stage });

  const defaultConfig = configFromDefault({ configDir });
  const stageConfig = configFromStage({ configDir, stage });
  const merged = defaultsDeep(defaultConfig, stageConfig);
  //console.log(merged);

  return merged;
};
