const { map, pipe, tap, filter, switchCase, get } = require("rubico");
const { isEmpty, forEach, when, callProp } = require("rubico/x");
const assert = require("assert");
const npath = require("path");
const fs = require("fs");
const logger = require("../logger")({ prefix: "EnvLoader" });

const checkFileExist = (fileName) => {
  assert(fileName);
  if (!fs.existsSync(fileName)) {
    const message = `Cannot open file ${fileName}`;
    throw Error(message);
  }
};

const envFromFile = (envFile) =>
  pipe([
    tap(() => {
      assert(envFile);
      logger.info(`envFromFile: ${envFile}`);
      checkFileExist(envFile);
    }),
    () => fs.readFileSync(envFile, "utf8"),
    callProp("split", /\r?\n/),
    filter((line) => !line.match(/^\s*#/)),
    map(
      pipe([
        callProp("match", /^(?<key>[^=]+)=(?<value>.+)/),
        get("groups", {}),
        ({ key, value }) => [key, value],
      ])
    ),
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

    map(([key, value]) =>
      pipe([
        tap((params) => {
          logger.debug(`envFromFile: key: ${key}`);
        }),
        () => process.env[key],
        switchCase([
          isEmpty,
          () => {
            process.env[key] = value;
          },
          () => {
            logger.debug(`envFromFile: key: ${key} already set`);
          },
        ]),
        () => [key, value],
      ])()
    ),
  ])();

exports.envFromFile = envFromFile;

exports.envLoader = ({ configDir = process.cwd(), stage = "dev" }) =>
  pipe([
    () => [`default.env`, `auth.env`, `${stage}.env`],
    forEach(
      pipe([
        (filename) => npath.join(configDir, filename),
        when(fs.existsSync, envFromFile),
      ])
    ),
  ])();
