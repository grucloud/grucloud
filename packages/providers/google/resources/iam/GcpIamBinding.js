const assert = require("assert");
const {
  pipe,
  tap,
  map,
  get,
  eq,
  any,
  filter,
  tryCatch,
  not,
  assign,
} = require("rubico");

const { find, defaultsDeep, isDeepEqual, uniq, callProp } = require("rubico/x");

const { retryCallOnError } = require("@grucloud/core/Retry");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isDownByIdCore } = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "GcpIamBinding" });
const { tos } = require("@grucloud/core/tos");
const { axiosErrorToJSON, logError } = require("@grucloud/core/Common");
const { createAxiosMakerGoogle } = require("../../GoogleCommon");

const findName = () => get("role");
const findId = findName;

const isOurMinionIamBinding =
  ({ resources }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live, "live");
        assert(Array.isArray(resources), "resources");
      }),
      () => resources,
      any(pipe([get("name"), (name) => isDeepEqual(name, findName({})(live))])),
      tap((isOur) => {
        logger.debug(`isOurMinionIamBinding: ${findName({})(live)}: ${isOur}`);
      }),
    ])();

const cannotBeDeleted = ({ resources }) =>
  not(isOurMinionIamBinding({ resources }));

exports.isOurMinionIamBinding = isOurMinionIamBinding;

// https://cloud.google.com/iam/docs/granting-changing-revoking-access#iam-modify-policy-role-rests
exports.GcpIamBinding = ({ spec, config }) => {
  const { projectId } = config;

  const axios = createAxiosMakerGoogle({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1`,
    url: `/projects/${projectId}`,
    config,
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "ServiceAccount",
      group: "iam",
      ids: pipe([
        () => live,
        get("members"),
        filter(callProp("startsWith", "serviceAccount:")),
        map(
          pipe([
            callProp("replace", "serviceAccount:", ""),
            (email) =>
              pipe([
                () =>
                  lives.getByType({
                    providerName: config.providerName,
                    type: "ServiceAccount",
                    group: "iam",
                  }),
                find(eq(get("live.email"), email)),
                get("id"),
              ])(),
          ])
        ),
      ])(),
    },
  ];

  const configDefault = ({ name, properties, dependencies }) =>
    pipe([
      () => properties,
      defaultsDeep({
        role: name,
        members: map((sa) => `serviceAccount:${getField(sa, "email")}`)(
          dependencies.serviceAccounts
        ),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getIamPolicy = tryCatch(
    pipe([
      () =>
        retryCallOnError({
          name: `getIamPolicy`,
          fn: () => axios.post(":getIamPolicy"),
          config,
        }),
      get("data"),
      tap((result) => {
        logger.debug(`getIamPolicy ${tos(result)}`);
      }),
    ]),
    (error) => {
      logError(`getIamPolicy`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getList = tryCatch(pipe([getIamPolicy, get("bindings")]), (error) => {
    logError(`getList`, error);
    throw axiosErrorToJSON(error);
  });

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.debug(`getByName ${name}`);
      }),
      getList,
      find(eq(get("role"), name)),
      tap((binding) => {
        logger.debug(`getByName result: ${tos(binding)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isDownById = isDownByIdCore({ getById, getList, findId });

  const create = ({ payload }) =>
    pipe([
      getIamPolicy,
      (policy) => ({ ...policy, bindings: [...policy.bindings, payload] }),
      tap((policy) => {
        logger.debug(`create policy: ${tos(policy)}`);
      }),
      (policy) =>
        retryCallOnError({
          name: `create iam binding`,
          fn: () => axios.post(":setIamPolicy", { policy }),
          config,
        }),
      get("data"),
    ])();

  const updateBinding = ({ currentBindings, newBinding }) =>
    pipe([
      () => currentBindings,
      map(
        when(eq(get("role"), newBinding.role), ({ role, members }) => ({
          role,
          members: uniq([...members, ...newBinding.members]),
        }))
      ),
    ])();

  const update = ({ payload }) =>
    pipe([
      tap(() => {
        logger.info(`update new binding ${tos(payload)}`);
      }),
      getIamPolicy,
      assign({
        bindings: ({ bindings }) =>
          updateBinding({
            currentBindings: bindings,
            newBinding: payload,
          }),
      }),
      tap((policy) => {
        logger.debug(`update policy: ${tos(policy)}`);
      }),
      (policy) =>
        retryCallOnError({
          name: `update iam binding`,
          fn: () => axios.post(":setIamPolicy", { policy }),
          config,
        }),
      get("data"),
      tap((xx) => {
        logger.info(`new binding updated ${tos(payload)}`);
      }),
    ])();

  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.role);
        logger.debug(`destroy iam binding ${live.role}`);
      }),
      getIamPolicy,
      assign({
        bindings: pipe([
          get("bindings"),
          filter(not(eq(get("role"), live.role))),
        ]),
      }),
      (policy) =>
        retryCallOnError({
          name: `destroy iam binding ${live.role}`,
          fn: () => axios.post(":setIamPolicy", { policy }),
          config,
        }),
      get("data"),
    ])();

  return {
    spec,
    config,
    findName,
    findId,
    getList,
    isDownById,
    create,
    update,
    destroy,
    getByName,
    configDefault,
    cannotBeDeleted,
    findDependencies,
  };
};
