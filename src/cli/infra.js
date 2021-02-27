const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { ConfigLoader } = require("../ConfigLoader");
const { switchCase, pipe, tap } = require("rubico");
const { forEach } = require("rubico/x");

const { combineProviders } = require("../providers/Common");
const creatInfraFromFile = async ({ infraFileName, config, stage }) => {
  const InfraCode = require(infraFileName);
  if (!InfraCode.createStack) {
    throw { code: 400, message: `no createStack provided` };
  }

  const infra = await InfraCode.createStack({ config: { ...config, stage } });
  if (!infra) {
    throw { code: 400, message: `no infra provided` };
  }

  const { resources, provider } = infra;

  //assert(resources, "createStack must export resources");
  return pipe([
    tap.if(
      () => provider && resources,
      () => provider.register({ resources })
    ),
    combineProviders,
  ])(infra);
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

exports.createInfra = async ({
  infraFileName,
  configFileName,
  stage = "dev",
}) => {
  const infraFileNameFull = resolveFilename({
    fileName: infraFileName,
    defaultName: "iac.js",
  });
  //console.log(`Using ${infraFileNameFull}`);
  checkFileExist({ fileName: infraFileNameFull });

  const config = requireConfig({ fileName: configFileName, stage });
  return {
    config,
    stage,
    infra: await creatInfraFromFile({
      infraFileName: infraFileNameFull,
      config,
      stage,
    }),
  };
};
