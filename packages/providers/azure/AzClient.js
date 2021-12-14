const assert = require("assert");
const path = require("path");
const { tap, get, eq, reduce, pipe, switchCase, map } = require("rubico");
const { callProp, identity, last, append, values, find } = require("rubico/x");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

const { isInstanceUp: isInstanceUpDefault } = require("./AzureCommon");

const BASE_URL = "https://management.azure.com";

const queryParameters = (apiVersion) => `?api-version=${apiVersion}`;

module.exports = AzClient = ({
  spec,
  pathBase = () => `/subscriptions/${process.env.SUBSCRIPTION_ID}`,
  pathSuffixList,
  apiVersion,
  isInstanceUp = isInstanceUpDefault,
  config,
  configDefault,
  isDefault,
  cannotBeDeleted,
  findDependencies,
  findTargetId,
  getList = () => undefined,
  getByName = () => undefined,
  onResponseList = () => get("value", []),
  decorate,
  verbCreate = "PUT",
  verbUpdate = "PATCH",
  pathUpdate = ({ id }) => `${id}${queryParameters(apiVersion)}`,
  methods,
}) => {
  assert(spec);
  assert(spec.type);
  assert(apiVersion);
  assert(config);
  assert(config.bearerToken);

  const pathGet = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const substituteDependency =
    ({ dependencies }) =>
    (paramName) =>
      pipe([
        tap(() => {
          assert(dependencies);
        }),
        () => dependencies,
        map.entries(([varName, resource]) => [varName, { varName, resource }]),
        values,
        find(eq(pipe([({ varName }) => `{${varName}Name}`]), paramName)),
        tap((resource) => {
          assert(resource);
        }),
        get("resource.name"),
      ])();

  const isSubstituable = callProp("startsWith", "{");

  const pathCreate = ({ dependencies, name }) =>
    pipe([
      () => methods,
      get("get.path"),
      tap((path) => {
        assert(name);
        assert(path);
      }),
      callProp("split", "/"),
      tap(
        pipe([last, isSubstituable], (isParam) => {
          assert(isParam, "last part of the path must be a substituable");
        })
      ),
      callProp("slice", 0, -1),
      reduce(
        (acc, key) =>
          pipe([
            () => key,
            switchCase([
              eq(key, "{subscriptionId}"),
              () => process.env.SUBSCRIPTION_ID,
              isSubstituable,
              substituteDependency({ dependencies }),
              identity,
            ]),
            (value) => [...acc, value],
          ])(),
        []
      ),
      callProp("join", "/"),
      append(`/${name}`),
      append(queryParameters(apiVersion)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const pathDelete = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const pathList = () =>
    `${path.join(
      pathBase(),
      pathSuffixList ? pathSuffixList() : ""
    )}${queryParameters(apiVersion)}`;

  const axios = AxiosMaker({
    baseURL: BASE_URL,
    onHeaders: () => ({
      Authorization: `Bearer ${config.bearerToken()}`,
    }),
  });

  return CoreClient({
    type: "azure",
    spec,
    config,
    findDependencies,
    onResponseList,
    decorate,
    configDefault,
    pathGet,
    pathCreate,
    pathUpdate,
    pathDelete,
    pathList,
    findTargetId,
    verbCreate,
    verbUpdate,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
    getList: getList({ axios }),
    getByName: getByName({ axios }),
  });
};
