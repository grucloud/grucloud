const { get, not } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");
const K8sClient = require("./K8sClient");
const { buildTagsObject, isUpByIdCore } = require("../Common");
const {
  displayNameDefault,
  displayNameResourceDefault,
  resourceKeyDefault,
  getNamespace,
} = require("./K8sCommon");

exports.createResourceNamespaceless = ({
  baseUrl,
  configKey,
  apiVersion,
  kind,
  cannotBeDeleted,
}) => ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: get(`${configKey}.apiVersion`, apiVersion)(config),
      kind,
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name }) => `${baseUrl}/${name}`;
  const pathList = () => baseUrl;
  const pathCreate = () => baseUrl;
  const pathUpdate = ({ name }) => `${baseUrl}/${name}`;
  const pathDelete = ({ name }) => `${baseUrl}/${name}`;

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
  });
};
exports.createResourceNamespace = ({
  baseUrl,
  pathList,
  configKey,
  apiVersion: apiVersionDefault,
  kind,
  cannotBeDeleted,
  isInstanceUp = not(isEmpty),
}) => ({ spec, config }) => {
  const apiVersion = get(`${configKey}.apiVersion`, apiVersionDefault)(config);
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion,
      kind,
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
        namespace: getNamespace(dependencies.namespace?.resource),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `${baseUrl({ namespace, apiVersion })}/${name}`;
  const pathCreate = ({ namespace }) => baseUrl({ namespace, apiVersion });

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList: () => pathList({ apiVersion }),
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    cannotBeDeleted,
    isUpByIdFactory,
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
  });
};
