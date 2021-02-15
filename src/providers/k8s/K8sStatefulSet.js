const assert = require("assert");
const { eq, tap, pipe, get, fork, and, filter, switchCase } = require("rubico");
const { first, defaultsDeep, isEmpty, find } = require("rubico/x");
const urljoin = require("url-join");

const logger = require("../../logger")({ prefix: "K8sStatefulSet" });
const { tos } = require("../../tos");
const { buildTagsObject, isUpByIdCore } = require("../Common");
const K8sClient = require("./K8sClient");
const { retryCallOnError } = require("../Retry");

const {
  getNamespace,
  getServerUrl,
  createAxiosMakerK8s,
} = require("./K8sCommon");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#statefulset-v1-apps

exports.K8sStatefulSet = ({ spec, config }) => {
  const { kubeConfig } = config;

  const axios = () => createAxiosMakerK8s({ config });

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "apps/v1",
      kind: "StatefulSet",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`;
  const pathGetStatus = ({ name, namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}/status`;
  const pathList = () => `/apis/apps/v1/statefulsets`;
  //https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#create-statefulset-v1-apps
  const pathCreate = ({ namespace }) =>
    `/apis/apps/v1/namespaces/${namespace}/statefulsets`;

  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const isInstanceUp = pipe([
    get("status"),
    and([pipe([get("unavailableReplicas"), isEmpty]), get("replicas")]),
  ]);

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

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
  });
};
