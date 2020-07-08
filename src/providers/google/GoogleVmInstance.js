const { defaultsDeep } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "GoogleVmInstance" });
const { tos } = require("../../tos");
const GoogleClient = require("./GoogleClient");
const { toTagName } = require("../TagName");
const { getField } = require("../ProviderCommon");
const { isUpByIdCore } = require("../Common");

module.exports = GoogleVmInstance = ({ spec, config }) => {
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

  const configDefault = ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ properties, dependencies })}`);
    const { ip } = dependencies;
    const {
      machineType,
      diskTypes,
      sourceImage,
      diskSizeGb,
      metadata,
      ...otherProperties
    } = properties;

    const config = defaultsDeep(
      {
        kind: "compute#instance",
        name,
        zone: `projects/${project}/zones/${zone}`,
        machineType: `projects/${project}/zones/${zone}/machineTypes/${machineType}`,
        labels: buildLabel(),
        metadata: defaultsDeep(
          {
            kind: "compute#metadata",
          },
          metadata
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
              sourceImage,
              diskType: `projects/${project}/zones/${zone}/diskTypes/${diskTypes}`,
              diskSizeGb,
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
      },
      otherProperties
    );
    logger.debug(`configDefault ${name} result: ${tos(config)}`);
    return config;
  };

  const getStateName = (instance) => {
    const { status } = instance;
    assert(status);
    logger.debug(`stateName ${status}`);
    return status;
  };

  const isUpByIdFactory = (getById) =>
    isUpByIdCore({
      states: ["RUNNING"],
      getStateName,
      getById,
    });

  const client = GoogleClient({
    spec,
    url: `/projects/${project}/zones/${zone}/instances/`,
    config,
    isUpByIdFactory,
    configDefault,
  });

  return client;
};
