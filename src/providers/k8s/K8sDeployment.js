const { eq, tap, pipe, get, fork, and, filter, not } = require("rubico");
const { first, defaultsDeep, isEmpty, find } = require("rubico/x");
const urljoin = require("url-join");

const logger = require("../../logger")({ prefix: "K8sDeployment" });
const { tos } = require("../../tos");
const { retryCallOnError } = require("../Retry");

const { getServerUrl, createAxiosMakerK8s } = require("./K8sCommon");

const { createResourceNamespace } = require("./K8sDumpster");

exports.K8sDeployment = ({ spec, config }) => {
  const { kubeConfig } = config;

  const axios = () => createAxiosMakerK8s({ config });

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

  const getPods = ({ namespace, labels }) =>
    pipe([
      () =>
        `/api/v1/namespaces/${namespace}/pods?labelSelector=app%3D${labels.app}`,
      (path) => urljoin(getServerUrl(kubeConfig()), path),
      (fullPath) =>
        retryCallOnError({
          name: `get pods path: ${fullPath}`,
          fn: () => axios().get(fullPath),
          config,
        }),
      get("data.items"),
      tap((data) => {
        logger.debug(`#pods ${data.length}`);
      }),
    ])();

  const isUpByIdFactory = () => isUpById;

  // is up if the first pod is in the RUNNING phase
  const isUpById = ({ live: { metadata } }) =>
    pipe([
      tap(() => {
        logger.debug(`deployment isUpById: ${tos(metadata)}`);
      }),
      () => metadata,
      getPods,
      first,

      tap((pod) => {
        logger.debug(`deployment pod  ${tos(pod)}`);
      }),
      get("status.phase"),
      tap((phase) => {
        logger.debug(`deployment pod phase  ${phase}`);
      }),
      (phase) => eq(phase, "Running")(),
      tap((isUp) => {
        logger.debug(`deployment isUpById  ${isUp}`);
      }),
    ])();

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

  return createResourceNamespace({
    baseUrl: ({ namespace }) =>
      `/apis/apps/v1/namespaces/${namespace}/deployments`,
    pathList: () => `/apis/apps/v1/deployments`,
    configKey: "deployment",
    apiVersion: "apps/v1",
    kind: "Deployment",
    cannotBeDeleted: ({ name }) => name.startsWith("default"),
    isUpByIdFactory,
    isDownByIdFactory,
  })({ spec, config });
};
