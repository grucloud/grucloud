const assert = require("assert");
const CoreProvider = require("../CoreProvider");
const AwsClient = require("./AwsClient");
const logger = require("../../logger")({ prefix: "AwsProvider" });
const compare = require("../../Utils").compare;

const AwsClientEc2 = require("./AwsClientEC2");

const fnSpecs = ({ project, region, zone, tag }) => [
  {
    type: "Instance",
    Client: AwsClientEc2,
    propertiesDefault: ({ name, options }) => ({
      ...options,
    }),
    compare: ({ target, live }) => {
      logger.debug(`compare server`);
      const diff = compare({
        target,
        targetKeys: [], //TODO
        live,
      });
      logger.debug(`compare ${toString(diff)}`);
      return diff;
    },
  },
];

const configCheck = (config) => {
  assert(config, "Please provide a config");
  const { region } = config;
  assert(region, "region is missing");
};

module.exports = AwsProvider = async ({ name, config }) => {
  configCheck(config);
  return CoreProvider({
    type: "aws",
    name,
    config,
    fnSpecs,
    //Client: AwsClient,
  });
};
