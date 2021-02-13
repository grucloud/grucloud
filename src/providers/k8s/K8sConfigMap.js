const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sConfigMap" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");

const { resourceKey, displayName, getNamespace } = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#configmap-v1-core

exports.K8sConfigMap = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "ConfigMap",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/configmaps/${name}`;
  const pathList = () => `/api/v1/configmaps`;
  const pathCreate = ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/configmaps`;

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
    resourceKey,
    displayName,
  });
};
