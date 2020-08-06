const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");

const logger = require("../../../../logger")({ prefix: "GcpServiceAccount" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");

const findName = (item) => {
  const name = item.email.split("@")[0];
  return name;
};

const isOurMinionServiceAccount = ({ resource, resourceNames }) => {
  assert(resource, "resource");
  assert(resourceNames, "resourceNames");
  const isOur = resourceNames.includes(findName(resource));
  logger.info(`isOurMinionServiceAccount: ${isOur}`);
  return isOur;
};
exports.isOurMinionServiceAccount = isOurMinionServiceAccount;
// https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts
// https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating
exports.GcpServiceAccount = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      accountId: name,
      serviceAccount: {
        description: managedByDescription,
      },
    })(properties);

  const findId = (item) => item.uniqueId;
  const findTargetId = (item) => item.uniqueId;

  const onResponseList = ({ accounts = [] }) => {
    return { total: accounts.length, items: accounts };
  };

  const cannotBeDeleted = ({ resource, resourceNames }) =>
    !isOurMinionServiceAccount({ resource, resourceNames });

  return GoogleClient({
    spec,
    baseURL: `https://iam.googleapis.com/v1`,
    url: `/projects/${project}/serviceAccounts`,
    config: { ...config, repeatCount: 4 },
    findName,
    findId,
    findTargetId,
    onResponseList,
    configDefault,
    cannotBeDeleted,
  });
};
