const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sSecret" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#secret-v1-core

exports.K8sSecret = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/secrets/${name}`;
  const pathList = () => `/api/v1/secrets`;
  const pathCreate = ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/secrets`;

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const cannotBeDeleted = ({ name }) => name.startsWith("default");

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
  });
};
