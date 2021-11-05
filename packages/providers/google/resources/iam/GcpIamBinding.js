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
  switchCase,
  not,
  assign,
  omit,
} = require("rubico");

const {
  find,
  defaultsDeep,
  isDeepEqual,
  uniq,
  identity,
  callProp,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const { retryCallOnError } = require("@grucloud/core/Retry");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isDownByIdCore } = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "GcpIamBinding" });
const { tos } = require("@grucloud/core/tos");
const { axiosErrorToJSON, logError } = require("@grucloud/core/Common");
const {
  createAxiosMakerGoogle,
  shouldRetryOnException,
} = require("../../GoogleCommon");

const findName = get("live.role");
const findId = findName;

const isOurMinionIamBinding = ({ live, resources }) =>
  pipe([
    tap(() => {
      assert(live, "live");
      assert(Array.isArray(resources), "resources");
    }),
    () => resources,
    any(pipe([get("name"), (name) => isDeepEqual(name, findName({ live }))])),
    tap((isOur) => {
      logger.debug(`isOurMinionIamBinding: ${findName({ live })}: ${isOur}`);
    }),
  ])();

const cannotBeDeleted = not(isOurMinionIamBinding);

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
          fn: () =>
            axios.request(":setIamPolicy", {
              method: "POST",
              data: { policy },
            }),
          config,
        }),
      get("data"),
    ])();

  const updateBinding = ({ currentBindings, newBinding }) =>
    pipe([
      () => currentBindings,
      map(
        switchCase([
          eq(get("role"), newBinding.role),
          ({ role, members }) => ({
            role,
            members: uniq([...members, ...newBinding.members]),
          }),
          identity,
        ])
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
          fn: () =>
            axios.request(":setIamPolicy", {
              method: "POST",
              data: { policy },
            }),
          config,
        }),
      get("data"),
      tap((xx) => {
        logger.info(`new binding updated ${tos(payload)}`);
      }),
    ])();

  const destroy = ({ id }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy iam binding ${id}`);
      }),
      getIamPolicy,
      assign({
        bindings: pipe([get("bindings"), filter(not(eq(get("role"), id)))]),
      }),
      (policy) =>
        retryCallOnError({
          name: `destroy iam binding ${id}`,
          fn: () =>
            axios.request(":setIamPolicy", {
              method: "POST",
              data: { policy },
            }),
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
    shouldRetryOnException,
    findDependencies,
  };
};

const filterTarget = ({ config, target }) => pipe([() => target])();
const filterLive = ({ config, live }) => pipe([() => live])();

exports.compareIamBinding = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareIamBinding ${tos(diff)}`);
  }),
]);
