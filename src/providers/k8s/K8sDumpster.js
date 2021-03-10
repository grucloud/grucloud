const { get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
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
        namespace: getNamespace(dependencies.namespace?.resource),
      },
    })(properties);

  const pathGet = ({ name, namespace }) => `${baseUrl({ namespace })}/${name}`;
  const pathCreate = ({ namespace }) => baseUrl({ namespace });

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    cannotBeDeleted,
    displayName: displayNameDefault,
    displayNameResource: displayNameResourceDefault,
    resourceKey: resourceKeyDefault,
  });
};
