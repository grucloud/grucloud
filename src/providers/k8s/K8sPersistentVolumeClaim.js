const assert = require("assert");
const {
  pipe,
  get,
  tap,
  eq,
  switchCase,
  assign,
  or,
  pick,
  and,
  not,
} = require("rubico");
const { find, first, isEmpty } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sPersistentVolumeClaim" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");
const { getNamespace } = require("./K8sCommon");
const { isOurMinionObject } = require("../Common");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#persistentvolumeclaim-v1-core

exports.K8sPersistentVolumeClaim = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
      metadata: {
        name,
        namespace: getNamespace(dependencies.namespace?.resource),
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const pathGet = ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`;
  const pathUpdate = pathGet;
  const pathDelete = pathGet;
  const pathList = () => `/api/v1/persistentvolumeclaims`;
  const pathCreate = ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/persistentvolumeclaims`;

  return K8sClient({
    spec,
    config,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    configDefault,
  });
};

exports.isOurMinionPersistentVolumeClaim = ({ resource, lives, config }) =>
  or([
    () => isOurMinionObject({ tags: resource.metadata.annotations, config }),
    pipe([
      () => get("spec.volumeName")(resource),
      (volumeName) =>
        pipe([
          () => lives,
          find(eq(get("type"), "PersistentVolume")),
          get("resources"),
          find(eq(get("name"), volumeName)),
          get("managedByUs"),
          tap((managedByUs) => {
            logger.info(
              `isOurMinionPersistentVolumeClaim ${volumeName}: ${managedByUs}`
            );
          }),
        ])(),
    ]),
  ])();
