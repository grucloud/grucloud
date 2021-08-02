const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { pipe, tap, filter, not, tryCatch, get } = require("rubico");
const { isEmpty, isFunction } = require("rubico/x");
const { ConfigLoader } = require("../ConfigLoader");
const logger = require("../logger")({ prefix: "Infra" });

const createProviderMaker =
  ({ programOptions, stage, config }) =>
  (provider, { config: configUser, configs = [] } = {}) =>
    pipe([
      tap(() => {
        assert(isFunction(provider), "provider must be a function");
      }),
      () =>
        provider({
          configs: [configUser, ...configs, config],
          programOptions,
          stage,
        }),
    ])();

exports.createProviderMaker = createProviderMaker;

const createStackFromFile = ({ infraFileName }) => {
  const InfraCode = require(infraFileName);
  if (!InfraCode.createStack) {
    throw { code: 400, message: `no createStack provided` };
  }
  return InfraCode.createStack;
};

const resolveFilename = ({ fileName, defaultName }) =>
  path.resolve(process.cwd(), fileName ? fileName : defaultName);

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

exports.createInfra =
  ({ commandOptions, programOptions }) =>
  async ({ infraFileName, configFileName, stage = "dev" }) => {
    const infraFileNameFull = resolveFilename({
      fileName: infraFileName,
      defaultName: "iac.js",
    });
    checkFileExist({ fileName: infraFileNameFull });

    const config = requireConfig({ fileName: configFileName, stage });
    //assert(isFunction(config));
    return {
      config,
      stage,
      createStack: createStackFromFile({ infraFileName: infraFileNameFull }),
    };
  };
