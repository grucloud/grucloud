const assert = require("assert");
const { defaultsDeep } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_DNS_BASE_URL } = require("./GcpDnsCommon");

const logger = require("../../../../logger")({ prefix: "GcpDnsManagedZone" });
const { tos } = require("../../../../tos");

const onResponseList = ({ managedZones = [] }) => {
  return { total: managedZones.length, items: managedZones };
};

const findTargetId = (item) => item.id;

// https://cloud.google.com/dns/docs/reference/v1/managedZones
exports.GcpDnsManagedZone = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
    })(properties);

  return GoogleClient({
    spec,
    baseURL: GCP_DNS_BASE_URL,
    url: `/projects/${project}/managedZones`,
    config,
    configDefault,
    onResponseList,
    findTargetId,
  });
};
