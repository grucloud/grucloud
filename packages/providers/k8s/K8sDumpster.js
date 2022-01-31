const { get, not } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");
const K8sClient = require("./K8sClient");
const { buildTagsObject } = require("@grucloud/core/Common");
const {
  displayNameDefault,
  displayNameNamespace,
  displayNameResourceDefault,
  displayNameResourceNamespace,
  getNamespace,
} = require("./K8sCommon");

exports.createResourceNamespaceless =
  ({
    baseUrl,
    configKey,
    apiVersion: apiVersionDefault,
    kind,
    cannotBeDeleted,
    isInstanceUp,
    findDependencies,
  }) =>
  ({ spec, config }) => {
    //TODOs
    //const getApiVersion = () =>
    //  get(`${configKey}.apiVersion`, apiVersion)(config);
    const apiVersion = get(
      `${configKey}.apiVersion`,
      apiVersionDefault
    )(config);

    const configDefault = async ({ name, properties, dependencies }) =>
      defaultsDeep({
        apiVersion,
        kind,
        metadata: {
          annotations: buildTagsObject({ name, config }),
        },
      })(properties);

    const pathGet = ({ name, apiVersion = apiVersionDefault }) =>
      `${baseUrl({ apiVersion })}/${name}`;
    const pathList = ({ apiVersion = apiVersionDefault }) =>
      baseUrl({ apiVersion });
    const pathCreate = ({ apiVersion = apiVersionDefault }) =>
      baseUrl({ apiVersion });
    const pathUpdate = ({ name, apiVersion = apiVersionDefault }) =>
      `${baseUrl({ apiVersion })}/${name}`;
    const pathDelete = ({ name, apiVersion = apiVersionDefault }) =>
      `${baseUrl({ apiVersion })}/${name}`;

    return K8sClient({
      spec,
      config,
      pathGet,
      pathList,
      pathCreate,
      pathUpdate,
      pathDelete,
      configDefault,
      getNamespace,
      displayName: displayNameDefault,
      displayNameResource: displayNameResourceDefault,
      cannotBeDeleted,
      isInstanceUp,
      findDependencies,
    });
  };
exports.createResourceNamespace =
  ({
    baseUrl,
    pathList,
    configKey,
    apiVersion,
    kind,
    cannotBeDeleted,
    isInstanceUp,
    findDependencies,
  }) =>
  ({ spec, config }) => {
    const getApiVersion = () =>
      get(`${configKey}.apiVersion`, apiVersion)(config);
    const configDefault = async ({ name, properties, dependencies }) =>
      defaultsDeep({
        apiVersion: getApiVersion(),
        kind,
        metadata: {
          annotations: buildTagsObject({ name, config }),
        },
      })(properties);

    const pathGet = ({
      name,
      namespace = "default",
      apiVersion = getApiVersion(),
    }) => `${baseUrl({ namespace, apiVersion })}/${name}`;

    const pathCreate = ({
      namespace = "default",
      apiVersion = getApiVersion(),
    }) => baseUrl({ namespace, apiVersion });

    const pathUpdate = pathGet;
    const pathDelete = pathGet;

    return K8sClient({
      spec,
      config,
      pathGet,
      pathList: () => pathList({ apiVersion: getApiVersion() }),
      pathCreate,
      pathUpdate,
      pathDelete,
      configDefault,
      cannotBeDeleted,
      isInstanceUp,
      displayName: displayNameNamespace,
      displayNameResource: displayNameResourceNamespace,
      findDependencies,
    });
  };
