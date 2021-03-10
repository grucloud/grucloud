const { eq, tap, pipe, get, fork, and, filter, switchCase } = require("rubico");
const { first, defaultsDeep, isEmpty, find } = require("rubico/x");
const urljoin = require("url-join");

const logger = require("../../logger")({ prefix: "K8sDeployment" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { retryCallOnError } = require("../Retry");

const {
  getNamespace,
  getServerUrl,
  createAxiosMakerK8s,
} = require("./K8sCommon");

exports.K8sDeployment = ({ spec, config }) => {
  const { kubeConfig } = config;

  const axios = () => createAxiosMakerK8s({ config });

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
        //logger.debug(`isInstanceUp item: ${tos(item)}`);
      }),
      get("status"),
      tap((status) => {
        logger.debug(`isInstanceUp status: ${tos(status)}`);
      }),
      and([pipe([get("unavailableReplicas"), isEmpty]), get("replicas")]),
      tap((isUp) => {
        logger.debug(`isInstanceUp isUp: ${isUp}`);
      }),
    ])(item);

  const getReplicationSet = ({ namespace, uid, name }) =>
    pipe([
      (namespace) => `/apis/apps/v1/namespaces/${namespace}/replicasets/`,
      (path) => urljoin(getServerUrl(kubeConfig()), path),
      (fullPath) =>
        retryCallOnError({
          name: `get replicasets path: ${fullPath}`,
          fn: () => axios().get(fullPath),
          config,
        }),
      get("data.items"),
      tap((data) => {
        //logger.debug(`replicasets all ${tos(data)}`);
      }),
      filter(
        pipe([get("metadata.ownerReferences"), find(eq(get("uid"), uid))])
      ),
      tap((data) => {
        //logger.debug(`replicasets for deployment ${name}: ${tos(data)}`);
      }),
    ])(namespace);

  const isUpByIdFactory = () => isUpById;
  const isUpById = ({ live: { metadata } }) =>
    pipe([
      tap(() => {
        logger.debug(`deployment isUpById: ${tos(metadata)}`);
      }),
      getReplicationSet,
      tap((rsets) => {
        logger.debug(`isUpById replicasets:${rsets.length}`);
      }),
      first, //TODO find the latest
      switchCase([isEmpty, () => false, isInstanceUp]),
      tap((isUp) => {
        logger.debug(`deployment isUpById  ${isUp}`);
      }),
    ])(metadata);

  const isDownByIdFactory = () => isDownById;

  const isDownById = ({ live: { metadata } }) =>
    pipe([
      tap(() => {
        logger.debug(`deployment isDownById: ${tos(metadata)}`);
      }),
      getReplicationSet,
      tap((rsets) => {
        logger.debug(`isDownById replicasets:${rsets.length}`);
      }),
      isEmpty,
      tap((isDown) => {
        logger.debug(`deployment isDownById ${isDown}`);
      }),
    ])(metadata);

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
    isUpByIdFactory,
    isDownByIdFactory,
  });
};
