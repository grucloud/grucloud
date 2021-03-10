const { eq, tap, pipe, get, fork, and, filter, not } = require("rubico");
const { first, defaultsDeep, isEmpty, find } = require("rubico/x");
const assert = require("assert");
const urljoin = require("url-join");

const logger = require("../../logger")({ prefix: "K8sUtils" });
const { tos } = require("../../tos");
const { retryCallOnError } = require("../Retry");

const { getServerUrl, createAxiosMakerK8s } = require("./K8sCommon");

exports.K8sUtils = ({ config }) => {
  const { kubeConfig } = config;

  const axios = () => createAxiosMakerK8s({ config });

  const getPods = ({ namespace, labels }) =>
    pipe([
      tap(() => {
        assert(namespace);
        assert(labels);
        assert(labels.app);
      }),
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

  // is up if the first pod is in the Running phase
  const isUpByPod = () => ({ live: { metadata } }) =>
    pipe([
      tap(() => {
        logger.debug(`isUpById`);
        assert(metadata);
      }),
      () => metadata,
      getPods,
      first,
      tap((pod) => {
        logger.debug(`pod ${tos(pod?.status)}`);
      }),
      get("status.phase"),
      tap((phase) => {
        logger.debug(`deployment pod phase ${phase}`);
      }),
      (phase) => eq(phase, "Running")(),
      tap((isUp) => {
        logger.debug(`isUpById ${isUp}`);
      }),
    ])();

  return { isUpByPod };
};
