const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "GoogleInstance" });
const toString = (x) => JSON.stringify(x, null, 4);
const { toTagName } = require("./GoogleTag");
const { NotAvailable } = require("../ProviderCommon");

module.exports = GoogleInstance = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { project, region, zone, managedByKey, tag, managedByValue } = config;

  const getStateName = (instance) => {
    const state = instance.status;
    logger.debug(`stateName ${state}`);
    return state;
  };

  const isUp = async ({ name }) => {
    logger.debug(`isUp ${name}`);
    assert(name);
    let up = false;
    const instance = await client.getByName({ name });
    if (instance) {
      up = ["RUNNING"].includes(getStateName(instance));
    }
    logger.info(`isUp ${name} ${up ? "UP" : "NOT UP"}`);
    return up;
  };

  //TODO set environment from config
  const buildLabel = (name) => ({
    [managedByKey]: managedByValue,
    environment: "development",
  });

  const configDefault = ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ properties, dependenciesLive })}`);
    const { ip } = dependenciesLive;
    const config = {
      kind: "compute#instance",
      name,
      zone: `projects/${project}/zones/${zone}`,
      machineType: `projects/${project}/zones/${zone}/machineTypes/${properties.machineType}`,
      labels: buildLabel(name),
      metadata: _.merge(properties.metadata, {
        kind: "compute#metadata",
      }),
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
              ...(ip && { natIP: _.get(ip, "address", NotAvailable) }),
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

  return {
    ...client,
    isUp,
  };
};
