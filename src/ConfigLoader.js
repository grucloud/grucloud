const { map, pipe, tap, filter, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isEmpty } = require("rubico/x");
const assert = require("assert");
const npath = require("path");
const fs = require("fs");
const logger = require("./logger")({ prefix: "ConfigLoader" });
const { tos } = require("./tos");

const checkFileExist = (fileName) => {
  assert(fileName);
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    throw { code: 400, message };
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
    () => npath.join(configDir, `default.env`),
    switchCase([
      (envFile) => fs.existsSync(envFile),
      (envFile) => envFromFile({ envFile }),
      () => {
        logger.info(
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
    () => npath.join(configDir, `${stage}.env`),
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
  const defaultConfigFile = npath.join(configDir, "config.js");
  checkFileExist(defaultConfigFile);
  return require(defaultConfigFile);
};

exports.ConfigLoader = ({
  baseDir = process.cwd(),
  path = "",
  stage = process.env.STAGE || "dev",
}) => {
  //console.log(`ConfigLoader ${baseDir} ${stage}`);
  logger.info(`ConfigLoader ${baseDir}, ${stage}`);
  const configDir = npath.join(baseDir, path);
  process.env.CONFIG_DIR = configDir;
  envLoader({ configDir, stage });

  return configFromDefault({ configDir });
};
