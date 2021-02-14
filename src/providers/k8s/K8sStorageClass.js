const { defaultsDeep } = require("rubico/x");

const logger = require("../../logger")({ prefix: "K8sStorageClass" });
const { tos } = require("../../tos");
const { buildTagsObject } = require("../Common");
const K8sClient = require("./K8sClient");

// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#storageclass-v1-storage-k8s-io

exports.K8sStorageClass = ({ spec, config }) => {
  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      apiVersion: "storage.k8s.io/v1",
      kind: "StorageClass",
      metadata: {
        name,
        annotations: buildTagsObject({ name, config }),
      },
    })(properties);

  const baseUrl = "/apis/storage.k8s.io/v1/storageclasses";

  const pathGet = ({ name }) => `${baseUrl}/${name}`;
  const pathUpdate = pathGet;
  const pathDelete = pathGet;

  const pathList = () => baseUrl;
  const pathCreate = pathList;

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
