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

const logger = require("@grucloud/core/logger")({ prefix: "K8sUtils" });
const { tos } = require("@grucloud/core/tos");
const { retryCallOnError } = require("@grucloud/core/Retry");

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
  // is up if the first pod is in the Running phase
  const isUpByPod = ({ metadata }) =>
    pipe([
      tap(() => {
        logger.debug(`isUpByPod ${metadata.name}`);
        assert(metadata);
      }),
      () => metadata,
      getPods,
      first,
      tap((pod) => {
        logger.debug(`pod ${tos(pod?.status)}`);
      }),
      get("status.containerStatuses"),
      find(get("state.running")),
      tap((isUp) => {
        logger.debug(`isUpByPod ${metadata.name}: ${isUp}`);
      }),
    ])();

  const isUpByCrd = ({ metadata, spec }) =>
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
