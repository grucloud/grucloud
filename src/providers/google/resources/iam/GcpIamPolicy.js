const assert = require("assert");
const urljoin = require("url-join");
const { pipe, tap, map, get, filter } = require("rubico");

const { first, find } = require("rubico/x");
const AxiosMaker = require("../../../AxiosMaker");
const { retryCallOnError } = require("../../../Retry");

const logger = require("../../../../logger")({ prefix: "GcpIamPolicy" });
const { tos } = require("../../../../tos");
const { axiosErrorToJSON, logError } = require("../../../Common");

// https://cloud.google.com/iam/docs/granting-changing-revoking-access#iam-modify-policy-role-rests
exports.GcpIamPolicy = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { project } = config;

  const baseURL = `https://cloudresourcemanager.googleapis.com/v1`;
  const url = `/projects/${project}`;

  const findName = () => "policy";
  const findId = () => "policy";

  const axios = AxiosMaker({
    baseURL: urljoin(baseURL, url),
    onHeaders: () => ({
      Authorization: `Bearer ${config.accessToken}`,
    }),
  });

  const prevervedRolesName = [
    "roles/owner",
    "roles/resourcemanager.projectIamAdmin",
  ];

  const configDefault = ({ properties, live }) =>
    pipe([
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
    ])(live.bindings);

  const getList = async () => {
    try {
      const result = await retryCallOnError({
        name: `getList type: ${spec.type}`,
        fn: async () =>
          await axios.request(":getIamPolicy", {
            method: "POST",
          }),
        config,
      });

      return { total: 1, items: [result.data] };
    } catch (error) {
      logError(`getList`, error);
      throw axiosErrorToJSON(error);
    }
  };

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
        name: `update type: ${spec.type}`,
        fn: async () =>
          await axios.request(":setIamPolicy", {
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
  };
};
