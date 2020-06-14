const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "GoogleInstance" });
const toString = (x) => JSON.stringify(x, null, 4);
const { toTagName } = require("./GoogleTag");
const { getField } = require("../ProviderCommon");
const { isUpByIdCore } = require("../Common");

module.exports = GoogleInstance = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const {
    project,
    region,
    zone,
    managedByKey,
    tag,
    managedByValue,
    stageTagKey,
    stage,
  } = config;

  const buildLabel = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  const configDefault = ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ properties, dependenciesLive })}`);
    const { ip } = dependenciesLive;
    const config = {
      kind: "compute#instance",
      name,
      zone: `projects/${project}/zones/${zone}`,
      machineType: `projects/${project}/zones/${zone}/machineTypes/${properties.machineType}`,
      labels: buildLabel(),
      metadata: _.defaultsDeep(
        {
          kind: "compute#metadata",
        },
        properties.metadata
      ),
      //TODO
      //serviceAccounts: properties.serviceAccounts,
      disks: [
        {
          kind: "compute#attachedDisk",
          type: "PERSISTENT",
          boot: true,
          mode: "READ_WRITE",
          autoDelete: true,
          deviceName: toTagName(name, tag),
          initializeParams: {
            sourceImage: `projects/debian-cloud/global/images/${properties.sourceImage}`,
            diskType: `projects/${project}/zones/${zone}/diskTypes/pd-standard`,
            diskSizeGb: properties.diskSizeGb,
          },
          diskEncryptionKey: {},
        },
      ],
      networkInterfaces: [
        {
          kind: "compute#networkInterface",
          subnetwork: `projects/${project}/regions/${region}/subnetworks/default`,
          accessConfigs: [
            {
              ...(ip && { natIP: getField(ip, "address") }),
              kind: "compute#accessConfig",
              name: "External NAT",
              type: "ONE_TO_ONE_NAT",
              networkTier: "PREMIUM",
            },
          ],
          aliasIpRanges: [],
        },
      ],
    };
    logger.debug(`configDefault ${name} result: ${toString(config)}`);
    return config;
  };

  const client = GoogleClient({
    spec,
    url: `/projects/${project}/zones/${zone}/instances/`,
    config,
    configDefault,
  });

  const getStateName = (instance) => {
    const state = instance.status;
    logger.debug(`stateName ${state}`);
    return state;
  };

  const isUpById = isUpByIdCore({
    states: ["RUNNING"],
    getStateName,
    getById: client.getById,
  });

  return {
    ...client,
    isUpById,
  };
};
