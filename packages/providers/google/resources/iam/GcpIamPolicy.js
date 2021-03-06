const assert = require("assert");
const { pipe, tap, map, get, filter, tryCatch } = require("rubico");
const {
  find,
  first,
  pluck,
  defaultsDeep,
  isEmpty,
  differenceWith,
  isDeepEqual,
  flatten,
} = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({ prefix: "GcpIamPolicy" });
const { tos } = require("@grucloud/core/tos");
const { axiosErrorToJSON, logError } = require("@grucloud/core/Common");
const {
  createAxiosMakerGoogle,
  shouldRetryOnException,
} = require("../../GoogleCommon");

// https://cloud.google.com/iam/docs/granting-changing-revoking-access#iam-modify-policy-role-rests
exports.GcpIamPolicy = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { projectId } = config;

  const findName = () => "policy";
  const findId = () => "policy";

  const axios = createAxiosMakerGoogle({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1`,
    url: `/projects/${projectId}`,
    config,
  });

  const prevervedRolesName = [
    "roles/owner",
    "roles/resourcemanager.projectIamAdmin",
  ];

  const configDefault = ({ properties, live }) =>
    pipe([
      tap(() => {
        assert(live);
      }),
      () => live.bindings,
      filter((binding) => prevervedRolesName.includes(binding.role)),
      tap((bindings) => {
        logger.debug(`configDefault ${tos(bindings)}`);
      }),
      //TODO merge members bindings and properties.policy.bindings
      (preservedBindings) => ({
        policy: {
          etag: live.etag,
          bindings: [...properties.policy.bindings, ...preservedBindings],
        },
      }),
      tap((policy) => {
        logger.debug(`configDefault ${policy}`);
      }),
    ])();

  const getList = tryCatch(
    pipe([
      () =>
        retryCallOnError({
          name: `getList getIamPolicy`,
          fn: () =>
            axios.request(":getIamPolicy", {
              method: "POST",
            }),
          config,
        }),
      get("data"),
      (data) => ({ total: 1, items: [data] }),
    ]),
    (error) => {
      logError(`getList`, error);
      throw axiosErrorToJSON(error);
    }
  );

  const getByName = pipe([
    tap(() => {
      logger.debug(`getByName`);
    }),
    getList,
    get("items"),
    first,
    tap((xxx) => {
      logger.debug(`getByName`);
    }),
  ]);
  const update = pipe([
    tap((xx) => {
      console.log("update");
    }),
    ({ payload }) =>
      retryCallOnError({
        name: `setIamPolicy`,
        fn: () =>
          axios.request(":setIamPolicy", {
            method: "POST",
            data: payload,
          }),
        config,
      }),
    tap((xx) => {
      console.log("updated");
    }),
  ]);

  return {
    spec,
    config,
    findName,
    findId,
    getList,
    update,
    getByName,
    configDefault,
    cannotBeDeleted: () => true,
    shouldRetryOnException,
  };
};

exports.compareIamPolicy = pipe([
  ({ target, live }) => ({
    added: differenceWith(isDeepEqual, target.policy.bindings)(live.bindings),
    deleted: differenceWith(isDeepEqual, live.bindings)(target.policy.bindings),
  }),
  tap((diff) => {
    logger.debug(`compareIamPolicy ${tos(diff)}`);
  }),
]);
