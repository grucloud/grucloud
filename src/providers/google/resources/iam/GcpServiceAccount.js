const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const logger = require("../../../../logger")({ prefix: "GcpServiceAccount" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");

const { isUpByIdCore } = require("../../../Common");

// https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating

module.exports = GcpServiceAccount = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep(
      {
        accountId: name,
        serviceAccount: {
          description: managedByDescription,
        },
      },
      properties
    );

  const isUpByIdFactory = (getById) => isUpByIdCore({ getById });
  const findName = (item) => {
    const name = item.email.split("@")[0];
    return name;
  };

  const findId = (item) => item.uniqueId;
  const findTargetId = (item) => item.uniqueId;

  const onResponseList = ({ accounts = [] }) => {
    return { total: accounts.length, items: accounts };
  };

  return GoogleClient({
    spec,
    baseURL: `https://iam.googleapis.com/v1`,
    url: `/projects/${project}/serviceAccounts`,
    config,
    findName,
    findId,
    findTargetId,
    onResponseList,
    isUpByIdFactory,
    configDefault,
  });
};
