const assert = require("assert");
const { pipe, eq, get, tap, filter, map, not, omit } = require("rubico");

const CoreProvider = require("@grucloud/core/CoreProvider");
const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { mergeConfig } = require("@grucloud/core/ProviderCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { checkEnv } = require("@grucloud/core/Utils");
const { tos } = require("@grucloud/core/tos");
const { generateCode } = require("./Az2gc");

const { fnSpecs } = require("./AzureSpec");

exports.AzureProvider = ({
  name = "azure",
  config,
  configs = [],
  ...other
}) => {
  const mandatoryEnvs = ["TENANT_ID", "SUBSCRIPTION_ID", "APP_ID", "PASSWORD"];

  let bearerToken;
  const start = async () => {
    checkEnv(mandatoryEnvs);
    const result = await AzAuthorize({
      tenantId: process.env.TENANT_ID,
      appId: process.env.APP_ID,
      password: process.env.PASSWORD,
    });
    bearerToken = result.bearerToken;
  };

  const configProviderDefault = {
    bearerToken: () => bearerToken,
    retryCount: 60,
    retryDelay: 10e3,
  };

  const makeConfig = () =>
    mergeConfig({ configDefault: configProviderDefault, config, configs });

  const info = () => ({
    subscriptionId: process.env.SUBSCRIPTION_ID,
    tenantId: process.env.TENANT_ID,
    appId: process.env.APP_ID,
    config: makeConfig(),
  });

  const core = CoreProvider({
    ...other,
    type: "azure",
    name,
    mandatoryConfigKeys: ["location"],
    makeConfig,
    fnSpecs,
    start,
    info,
    generateCode: ({ commandOptions, programOptions }) =>
      generateCode({
        providerConfig: makeConfig(),
        specs: fnSpecs(makeConfig()),
        commandOptions,
        programOptions,
      }),
  });

  return core;
};
