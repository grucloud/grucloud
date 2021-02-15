const { eq, tap, pipe, get, fork, and, or } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sIngress" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#ingress-v1-networking-k8s-io

exports.K8sIngress = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`;
  const pathList = () => `/apis/networking.k8s.io/v1/ingresses`;
  const pathCreate = ({ namespace }) =>
    `/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`;

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const isUpByIdFactory = ({ getById }) => ({ live }) =>
    pipe([
      tap(() => {
        logger.debug(`ingress isUpById: ${tos(live)}`);
      }),
      () => getById({ live }),
      tap((newLive) => {
        logger.debug(`ingress newLive: ${tos(newLive)}`);
      }),
      get("status.loadBalancer.ingress"),
      first,
      get("ip"),
      tap((isUp) => {
        logger.debug(`ingress isUp: ${isUp}`);
      }),
    ])(live);

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
    isUpByIdFactory,
  });
};
