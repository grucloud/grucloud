const {
  map,
  eq,
  tap,
  pipe,
  get,
  fork,
  and,
  filter,
  not,
  tryCatch,
} = require("rubico");
const { first, defaultsDeep, isEmpty, find, last } = require("rubico/x");
const assert = require("assert");
const urljoin = require("url-join");

const logger = require("../../logger")({ prefix: "K8sUtils" });
const { tos } = require("../../tos");
const { retryCallOnError } = require("../Retry");

const { getServerUrl, createAxiosMakerK8s } = require("./K8sCommon");

const toApiVersion = ({ group, versions }) =>
  `${group}/${pipe([() => versions, last, get("name")])()}`;

exports.toApiVersion = toApiVersion;

exports.K8sUtils = ({ config }) => {
  const { kubeConfig } = config;

  const axios = () => createAxiosMakerK8s({ config });

  const getPods = ({ namespace, labels }) =>
    pipe([
      tap(() => {
        assert(namespace);
        assert(labels);
      }),
      () => labels,
      map.entries(([key, value]) => [`labelSelector=${key}%3D${value}`]),
      (queries) => Object.keys(queries).join("&"),
      (query) => `/api/v1/namespaces/${namespace}/pods?${query}`,
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
  //TODO relace with isInstanceUp
  // is up if the first pod is in the Running phase
  const isUpByPod = () => ({ live: { metadata } }) =>
    pipe([
      tap(() => {
        logger.debug(`isUpByPod`);
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
        logger.debug(`isUpByPod pod phase ${phase}`);
      }),
      (phase) => eq(phase, "Running")(),
      tap((isUp) => {
        logger.debug(`isUpByPod ${isUp}`);
      }),
    ])();

  const isUpByCrd = () => ({ live: { metadata, spec } }) =>
    pipe([
      tap(() => {
        logger.debug(`isUpByCrd ${spec.names.plural}`);
        assert(metadata);
        assert(spec);
      }),
      () => `/apis/${toApiVersion(spec)}/${spec.names.plural}`,
      (path) => urljoin(getServerUrl(kubeConfig()), path),
      tryCatch(
        pipe([
          (path) => axios().get(path),
          eq(get("statusText"), "OK"),
          tap((status) => {
            logger.error(`isUpByCrd ${spec.names.plural} status ${status}`);
          }),
        ]),
        (error, path) =>
          pipe([
            tap(() => {
              logger.error(`isUpByCrd ${path}, ${error}`);
            }),
            () => false,
          ])()
      ),
    ])();

  return { isUpByPod, isUpByCrd };
};
