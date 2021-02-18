const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sService" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#service-v1-core

exports.K8sService = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/services/${name}`;
  const pathList = () => `/api/v1/services`;
  const pathCreate = ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/services`;

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
  });
};
