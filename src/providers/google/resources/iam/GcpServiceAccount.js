const assert = require("assert");
const { pipe, tap, map, get } = require("rubico");

const { defaultsDeep } = require("rubico/x");
const logger = require("../../../../logger")({ prefix: "GcpServiceAccount" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");
const AxiosMaker = require("../../../AxiosMaker");

const findName = (item) => {
  const name = item.email.split("@")[0];
  return name;
};

const isOurMinionServiceAccount = ({
  name,
  config,
  resource,
  resourceNames,
}) => {
  assert(config, "config");
  assert(resource, "resource");
  assert(resourceNames, "resourceNames");
  const isOur = resource.description === config.managedByDescription;
  logger.debug(`isOurMinionServiceAccount: name: ${name} ${isOur}`);
  return isOur;
};

exports.isOurMinionServiceAccount = isOurMinionServiceAccount;
// https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts
// https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating
exports.GcpServiceAccount = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { project, managedByDescription, accessToken } = config;

  const baseURL = `https://iam.googleapis.com/v1`;
  const url = `/projects/${project}/serviceAccounts`;

  const axios = AxiosMaker({
    baseURL,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  const fetchIamPolicy = pipe([
    ({ id }) => axios.post(`${id}:getIamPolicy`),
    get("data"),
  ]);

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      accountId: name,
      serviceAccount: {
        description: managedByDescription,
      },
    })(properties);

  const findId = (item) => item.uniqueId;
  const findTargetId = (item) => item.uniqueId;

  const onResponseGet = pipe([
    tap((xxx) => {
      //logger.debug("onResponseGet");
    }),
    async ({ data, id }) => ({
      ...data,
      iamPolicy: await fetchIamPolicy({ id }),
    }),
    tap((xxx) => {
      //logger.debug("onResponseGet");
    }),
  ]);

  const onResponseList = ({ accounts = [] }) =>
    pipe([
      map(async (account) => ({
        ...account,
        iamPolicy: await fetchIamPolicy({ id: account.name }),
      })),
      tap((xxx) => {
        //logger.debug("onResponseList");
      }),
      (accounts) => ({ total: accounts.length, items: accounts }),
    ])(accounts);

  const cannotBeDeleted = ({ name, config, resource, resourceNames }) =>
    !isOurMinionServiceAccount({ name, config, resource, resourceNames });

  return GoogleClient({
    spec,
    baseURL,
    url,
    config: { ...config, repeatCount: 6 },
    findName,
    findId,
    findTargetId,
    onResponseGet,
    onResponseList,
    configDefault,
    cannotBeDeleted,
  });
};
