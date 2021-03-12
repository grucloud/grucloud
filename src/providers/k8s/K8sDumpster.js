const { get, not } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");
const K8sClient = require("./K8sClient");
const { buildTagsObject } = require("../Common");
const {
  displayNameDefault,
  displayNameResourceDefault,
  resourceKeyDefault,
  getNamespace,
} = require("./K8sCommon");

exports.createResourceNamespaceless = ({
  baseUrl,
  configKey,
  apiVersion: apiVersionDefault,
  kind,
  cannotBeDeleted,
  isUpByIdFactory,
}) => ({ spec, config }) => {
  //TODOs
  //const getApiVersion = () =>
  //  get(`${configKey}.apiVersion`, apiVersion)(config);
  const apiVersion = get(`${configKey}.apiVersion`, apiVersionDefault)(config);

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion,
      kind,
      metadata: {
        name,
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
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
    cannotBeDeleted,
    isUpByIdFactory,
  });
};
exports.createResourceNamespace = ({
  baseUrl,
  pathList,
  configKey,
  apiVersion,
  kind,
  cannotBeDeleted,
  isUpByIdFactory,
  isDownByIdFactory,
}) => ({ spec, config }) => {
  const getApiVersion = () =>
    get(`${configKey}.apiVersion`, apiVersion)(config);
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: getApiVersion(),
      kind,
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
        namespace: getNamespace(dependencies.namespace?.resource),
      },
    })(properties);

  const pathGet = ({ name, namespace, apiVersion = getApiVersion() }) =>
    `${baseUrl({ namespace, apiVersion })}/${name}`;

  const pathCreate = ({ namespace, apiVersion = getApiVersion() }) =>
    baseUrl({ namespace, apiVersion });

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
    isUpByIdFactory,
    isDownByIdFactory,
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
  });
};
