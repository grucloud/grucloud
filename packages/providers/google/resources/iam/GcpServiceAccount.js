const assert = require("assert");
const { pipe, tap, map, get, eq, assign, not } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "GcpServiceAccount",
});
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");
const { retryCallOnError } = require("@grucloud/core/Retry");

const findName = pipe([
  get("email"), //
  (email) => email.split("@"),
  first,
]);

const isOurMinionServiceAccount = ({ name, config, resource }) =>
  pipe([
    tap(() => {
      assert(config.managedByDescription, config);
      assert(resource, "resource");
    }),
    eq(get("description"), config.managedByDescription),
    tap((isOur) => {
      logger.info(`isOurMinionServiceAccount: name: ${name} ${isOur}`);
    }),
  ])(resource);

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

  const cannotBeDeleted = not(isOurMinionServiceAccount);

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
