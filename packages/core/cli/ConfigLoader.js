const { map, pipe, tap, tryCatch } = require("rubico");
const assert = require("assert");
const npath = require("path");
const fs = require("fs");
const util = require("node:util");
const logger = require("../logger")({ prefix: "ConfigLoader" });

const checkFileExist = (fileName) => {
  assert(fileName);
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    throw { code: 400, message };
  }
};

const configFromDefault = ({ configDir }) =>
  pipe([
    () => npath.join(configDir, "config.js"),
    tryCatch(pipe([tap(checkFileExist), require]), (error) => {
      logger.info(
        `configFromDefault error loading config: configDir: ${configDir}, error: ${util.inspect(
          error
        )}`
      );
    }),
  ])();

exports.ConfigLoader = ({
  baseDir = process.cwd(),
  path = "",
  stage = process.env.STAGE || "dev",
}) => {
  //console.log(`ConfigLoader ${baseDir} ${stage}`);
  logger.info(`ConfigLoader ${baseDir}, ${stage}`);
  const configDir = npath.join(baseDir, path);
  process.env.CONFIG_DIR = configDir;

  return configFromDefault({ configDir });
};
