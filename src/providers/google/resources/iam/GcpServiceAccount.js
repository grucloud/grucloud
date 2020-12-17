const assert = require("assert");
const { pipe, tap, map, get, eq, assign } = require("rubico");

const { defaultsDeep } = require("rubico/x");
const logger = require("../../../../logger")({ prefix: "GcpServiceAccount" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");
const { retryCallOnError } = require("../../../Retry");

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
  const { projectId, managedByDescription } = config;

  const baseURL = `https://iam.googleapis.com/v1`;
  const url = `/projects/${projectId(config)}/serviceAccounts`;

  const axios = createAxiosMakerGoogle({
    baseURL: baseURL,
    config,
  });

  const fetchIamPolicy = pipe([
    ({ name }) =>
      retryCallOnError({
        name: `fetchIamPolicy ${name}`,
        fn: pipe([() => axios.post(`${name}:getIamPolicy`)]),
        isExpectedException: eq(get("response.status"), 404),
        config: { retryCount: 20, retryDelay: 5e3 },
      }),
    get("data"),
  ]);

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      accountId: name,
      serviceAccount: {
        description: managedByDescription,
      },
    })(properties);

  const findId = get("uniqueId");
  const findTargetId = findId;

  const onResponseGet = ({ data }) =>
    pipe([
      assign({
        iamPolicy: () => fetchIamPolicy({ name: data.name }),
      }),
      tap((xxx) => {
        logger.debug("onResponseGet");
      }),
    ])(data);

  const onResponseList = ({ accounts = [] }) =>
    pipe([
      tap((accounts) => {
        logger.debug("onResponseList");
      }),
      map(
        assign({
          iamPolicy: (account) => fetchIamPolicy({ name: account.name }),
        })
      ),
      tap((xxx) => {
        logger.debug("onResponseList");
      }),
      (accounts) => ({ total: accounts.length, items: accounts }),
    ])(accounts);

  const cannotBeDeleted = ({ name, config, resource, resourceNames }) =>
    !isOurMinionServiceAccount({ name, config, resource, resourceNames });

  return GoogleClient({
    spec,
    baseURL,
    url,
    config: { ...config, repeatCount: 2 },
    findName,
    findId,
    findTargetId,
    onResponseGet,
    onResponseList,
    configDefault,
    cannotBeDeleted,
  });
};
