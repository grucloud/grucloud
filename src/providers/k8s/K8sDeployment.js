const { eq, tap, pipe, get, fork, and } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sDeployment" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");

const { resourceKey, displayName, getNamespace } = require("./K8sCommon");

exports.K8sDeployment = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments/${name}`;
  const pathGetStatus = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments/${name}/status`;
  const pathList = () => `/apis/apps/v1/deployments`;
  //https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#create-deployment-v1-apps
  const pathCreate = ({ namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/deployments`;

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const isInstanceUp = (item) =>
    pipe([
      tap(() => {
        logger.debug(`isInstanceUp item: ${tos(item)}`);
      }),
      get("status"),
      tap((status) => {
        logger.debug(`isInstanceUp status: ${tos(status)}`);
      }),
      and([pipe([get("unavailableReplicas"), isEmpty]), get("readyReplicas")]),
      tap((isUp) => {
        logger.debug(`isInstanceUp isUp: ${isUp}`);
      }),
    ])(item);

  return K8sClient({
    spec,
    config,
    pathGet,
    pathGetStatus,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    resourceKey,
    displayName,
    isInstanceUp,
  });
};
