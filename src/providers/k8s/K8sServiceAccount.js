const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sServiceAccount" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#serviceaccount-v1-core

exports.K8sServiceAccount = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "ServiceAccount",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/serviceaccounts/${name}`;
  const pathList = () => `/api/v1/serviceaccounts`;
  const pathCreate = ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/serviceaccounts`;

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const cannotBeDeleted = eq(get("name"), "default");

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
